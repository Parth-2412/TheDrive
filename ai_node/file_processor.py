# file_processor.py

import os
import logging
from typing import List, Optional, Dict, Any
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import (
    PyPDFLoader,
    Docx2txtLoader,
    TextLoader,
    UnstructuredPowerPointLoader,
    CSVLoader,
    UnstructuredExcelLoader,
    UnstructuredImageLoader,
)
import hashlib
import pytesseract
from PIL import Image
from transformers import (
    BlipProcessor, 
    BlipForConditionalGeneration,
    TableTransformerForObjectDetection,
    DetrImageProcessor,
)
import torch
import fitz  # PyMuPDF
from io import BytesIO
import google.generativeai as genai
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class FileProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 100):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, 
            chunk_overlap=chunk_overlap,
            add_start_index=True
        )

        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        # BLIP for image captioning
        self.blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
        self.blip_model = BlipForConditionalGeneration.from_pretrained(
            "Salesforce/blip-image-captioning-base"
        ).to(self.device)

        # Table Detection Model
        self.table_detector = TableTransformerForObjectDetection.from_pretrained(
            "microsoft/table-transformer-detection"
        ).to(self.device)
        self.table_processor = DetrImageProcessor.from_pretrained(
            "microsoft/table-transformer-detection"
        )

        # Gemini for table descriptions
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.gemini = genai.GenerativeModel("models/gemini-2.5-flash-lite")
        else:
            self.gemini = None
        
        self.loader_map = {
            '.pdf': PyPDFLoader,
            '.docx': Docx2txtLoader,
            '.txt': TextLoader,
            '.pptx': UnstructuredPowerPointLoader,
            '.csv': CSVLoader,
            '.xlsx': UnstructuredExcelLoader,
        }

    def _generate_image_caption(self, image_path: str) -> str:
        """Generate image caption using BLIP"""
        image = Image.open(image_path).convert("RGB")
        inputs = self.blip_processor(image, return_tensors="pt").to(self.device)
        with torch.no_grad():
            out = self.blip_model.generate(**inputs, max_length=50)
        return self.blip_processor.decode(out[0], skip_special_tokens=True)

    def _extract_ocr_text(self, image_path: str) -> str:
        """Extract text from image using OCR"""
        return pytesseract.image_to_string(Image.open(image_path)).strip()

    def _detect_tables_with_model(self, image: Image.Image) -> List[Dict]:
        """Detect tables in image using Table Transformer model"""
        inputs = self.table_processor(images=image, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            outputs = self.table_detector(**inputs)
        
        target_sizes = torch.tensor([image.size[::-1]]).to(self.device)
        results = self.table_processor.post_process_object_detection(
            outputs, target_sizes=target_sizes, threshold=0.5
        )[0]
        
        detected_tables = []
        for score, box in zip(results["scores"], results["boxes"]):
            if score > 0.5:
                detected_tables.append({
                    "score": float(score),
                    "box": [int(x) for x in box.tolist()]
                })
        
        return detected_tables

    def _describe_table_with_model(self, table_text: str, file_name: str, context: str = "") -> str:
        """Generate table description using Gemini"""
        if not self.gemini:
            return f"Table from {file_name}: Contains structured data"
        
        lines = [line.strip() for line in table_text.split('\n') if line.strip()]
        clean_text = '\n'.join(lines[:15])
        
        if len(clean_text) < 10:
            return f"Table from {file_name}: Contains structured data"
        
        prompt = (
            "Analyze this table and provide a clear description. "
            "Identify what the table is about, summarize key columns and data patterns. "
            "Be concise but informative.\n\n"
            f"Table content from {file_name}:\n{clean_text}"
        )
        
        response = self.gemini.generate_content(prompt)
        description = response.text.strip()
        
        context_info = f" from {file_name}"
        if context:
            context_info += f" ({context})"
        
        return f"Table{context_info}: {description}"

    def _extract_pdf_tables(self, file_path: str) -> List[Document]:
        """Extract tables from PDF using model-based detection"""
        table_chunks = []
        
        with fitz.open(file_path) as pdf_doc:
            file_name = os.path.basename(file_path)
            
            for page_num in range(len(pdf_doc)):
                page = pdf_doc[page_num]
                
                # Convert page to image for table detection
                mat = fitz.Matrix(2.0, 2.0)
                pix = page.get_pixmap(matrix=mat)
                img_data = pix.tobytes("ppm")
                image = Image.open(BytesIO(img_data)).convert("RGB")
                
                # Detect tables using model
                detected_tables = self._detect_tables_with_model(image)
                
                for i, table_info in enumerate(detected_tables):
                    # Crop table region
                    box = table_info["box"]
                    box = [max(0, min(coord, dim)) for coord, dim in zip(box, [image.width, image.height, image.width, image.height])]
                    
                    table_image = image.crop((box[0], box[1], box[2], box[3]))
                    
                    # Extract text from table region using OCR
                    table_text = pytesseract.image_to_string(table_image).strip()
                    
                    if table_text and len(table_text) > 10:
                        # Generate description using model
                        description = self._describe_table_with_model(
                            table_text, file_name, f"page {page_num + 1}"
                        )
                        
                        table_chunks.append(Document(
                            page_content=description,
                            metadata={
                                "content_type": "table_description",
                                "file": file_name,
                                "page_number": page_num + 1,
                                "table_index": i,
                                "confidence": table_info["score"],
                                "method": "model_detection"
                            }
                        ))
        
        return table_chunks

    def _extract_image_tables(self, image_path: str) -> List[Document]:
        """Extract tables from images using model-based detection"""
        table_chunks = []
        
        image = Image.open(image_path).convert("RGB")
        file_name = os.path.basename(image_path)
        
        # Detect tables using model
        detected_tables = self._detect_tables_with_model(image)
        
        for i, table_info in enumerate(detected_tables):
            # Crop table region
            box = table_info["box"]
            box = [max(0, min(coord, dim)) for coord, dim in zip(box, [image.width, image.height, image.width, image.height])]
            
            table_image = image.crop((box[0], box[1], box[2], box[3]))
            
            # Extract text using OCR
            table_text = pytesseract.image_to_string(table_image).strip()
            
            if table_text and len(table_text) > 10:
                # Generate description using model
                description = self._describe_table_with_model(table_text, file_name)
                
                table_chunks.append(Document(
                    page_content=description,
                    metadata={
                        "content_type": "table_description",
                        "file": file_name,
                        "table_index": i,
                        "confidence": table_info["score"],
                        "method": "model_detection"
                    }
                ))
        
        return table_chunks

    def process(self, file_path: str, original_filename: Optional[str] = None,
                user_id: Optional[str] = None, scope: Optional[str] = None) -> Optional[List[Document]]:
        """Main processing method with AI-powered table detection"""
        ext = os.path.splitext(file_path)[1].lower()
        loader_class = self.loader_map.get(ext)

        if not loader_class and ext not in [".jpg", ".png", ".jpeg"]:
            logging.warning(f"Unsupported file type: {ext}")
            return None

        all_chunks = []
        file_name = original_filename or os.path.basename(file_path)

        # Handle images
        if ext in [".jpg", ".png", ".jpeg"]:
            # Generate image caption and OCR
            caption = self._generate_image_caption(file_path)
            ocr_text = self._extract_ocr_text(file_path)
            
            img_doc = Document(
                page_content=f"Image Caption: {caption}\nOCR Text: {ocr_text}",
                metadata={
                    'order_in_file': 0,
                    'chunk_start': 0,
                    'chunk_end': len(f"Image Caption: {caption}\nOCR Text: {ocr_text}"),
                    'chunk_type': 'image'
                }
            )
            all_chunks.append(img_doc)
            
            # Extract tables from images
            table_chunks = self._extract_image_tables(file_path)
            
        else:
            # Handle text documents
            if loader_class:
                loader = loader_class(file_path)
                raw_docs = loader.load()
                chunked_docs = self.text_splitter.split_documents(raw_docs)
                
                for idx, chunk in enumerate(chunked_docs):
                    # Get character positions from text splitter
                    char_start = getattr(chunk.metadata, 'start_index', idx * 1000)
                    char_end = char_start + len(chunk.page_content)
                    
                    chunk.metadata.update({
                        'order_in_file': idx,
                        'chunk_start': char_start,
                        'chunk_end': char_end,
                        'chunk_type': 'text'
                    })
                all_chunks.extend(chunked_docs)
            
            # Extract tables from PDFs
            table_chunks = []
            if ext == ".pdf":
                table_chunks = self._extract_pdf_tables(file_path)

        # Add table chunks with metadata
        for i, chunk in enumerate(table_chunks):
            chunk.metadata.update({
                'order_in_file': i,
                'chunk_start': 0, 
                'chunk_end': len(chunk.page_content),
                'chunk_type': 'table_description'
            })
        all_chunks.extend(table_chunks)

        table_count = len([c for c in all_chunks if c.metadata.get("content_type") == "table_description"])
        logging.info(f"Processed {file_name}: {len(all_chunks)} chunks total ({table_count} table descriptions)")
        return all_chunks

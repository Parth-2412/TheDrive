import fitz  # PyMuPDF
import json
import os

# --- CONFIG ---
# Path to the PDF file (update as needed)
PDF_PATH = "TheDrive.pdf"  # or use citation['file'] if absolute path
# Path to the output highlighted PDF
OUTPUT_PATH = "TheDrive_highlighted.pdf"
# Path to a JSON file containing citations (as returned by your API)
CITATIONS_JSON = "citations.json"  # Save your citations list here


def highlight_pdf_by_citations(pdf_path, citations, output_path):
    doc = fitz.open(pdf_path)
    for citation in citations:
        page_number = citation.get("page_number") or citation.get("page")
        char_start = citation.get("char_start")
        char_end = citation.get("char_end")
        if page_number is None or char_start is None or char_end is None:
            print(f"Skipping citation (missing info): {citation}")
            continue
        page = doc[page_number]
        text = page.get_text("text")
        # Defensive: Clamp indices to text length
        char_start = max(0, min(char_start, len(text)-1))
        char_end = max(char_start+1, min(char_end, len(text)))
        highlight_text = text[char_start:char_end]
        if not highlight_text.strip():
            print(f"Empty highlight for citation: {citation}")
            continue
        # Highlight all occurrences of the substring on the page
        found = False
        for inst in page.search_for(highlight_text):
            page.add_highlight_annot(inst)
            found = True
        if not found:
            print(f"Could not find text to highlight for citation: {citation}")
    doc.save(output_path, garbage=4, deflate=True)
    doc.close()
    print(f"Saved highlighted PDF to {output_path}")


def main():
    if not os.path.exists(CITATIONS_JSON):
        print(f"Citations file not found: {CITATIONS_JSON}")
        return
    with open(CITATIONS_JSON, "r", encoding="utf-8") as f:
        citations = json.load(f)
    highlight_pdf_by_citations(PDF_PATH, citations, OUTPUT_PATH)


if __name__ == "__main__":
    main()

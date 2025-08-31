import React, { useMemo, useState, useEffect, useRef } from "react";
import { getFileExtension } from "../../../utils/getFileExtension";
import Loader from "../../../components/Loader/Loader";
import { useSelection } from "../../../contexts/SelectionContext";
import Button from "../../../components/Button/Button";
import { getDataSize } from "../../../utils/getDataSize";
import { MdOutlineFileDownload } from "react-icons/md";
import { useFileIcons } from "../../../hooks/useFileIcons";
import { FaRegFileAlt } from "react-icons/fa";
import { useTranslation } from "../../../contexts/TranslationProvider";
import * as XLSX from 'xlsx';
import { renderAsync } from 'docx-preview';
import "./PreviewFile.action.scss";


const imageExtensions = ["jpg", "jpeg", "png"];
const videoExtensions = ["mp4", "mov", "avi"];
const audioExtensions = ["mp3", "wav", "m4a"];
const iFrameExtensions = ["txt"];
const pdfExtensions = ["pdf"];
const textExtensions = ["md", "json", "js", "css", "html", "xml"];
const csvExtensions = ["csv"];
const excelExtensions = ["xlsx", "xls"];
const wordExtensions = ["docx"];
const officeExtensions = ["pptx"];

const PreviewFileAction = ({ filePreviewPath, filePreviewComponent, onDownload, onDecryption }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [decryptedBlobUrl, setDecryptedBlobUrl] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [excelSheets, setExcelSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const wordPreviewRef = useRef(null);
  const { selectedFiles } = useSelection();
  const fileIcons = useFileIcons(73);
  const extension = getFileExtension(selectedFiles[0].name)?.toLowerCase();
  const filePath = `${filePreviewPath}${selectedFiles[0].path}`;
  const t = useTranslation();

  // Custom file preview component
  const customPreview = useMemo(
    () => filePreviewComponent?.(selectedFiles[0]),
    [filePreviewComponent]
  );

  // Decrypt file data for preview
  useEffect(() => {
    const decryptFile = async () => {
      if (onDecryption && selectedFiles[0] && !selectedFiles[0].isDirectory) {
        try {
          setIsLoading(true);
          const decryptedData = await onDecryption(selectedFiles[0]);
          const blob = new Blob([decryptedData]);
          const blobUrl = URL.createObjectURL(blob);
          setDecryptedBlobUrl(blobUrl);
          
          // For text files, also read the content as text
          if (textExtensions.includes(extension)) {
            const text = await blob.text();
            setTextContent(text);
          }
          
          // For CSV files, parse the content
          if (csvExtensions.includes(extension)) {
            const text = await blob.text();
            const rows = text.split('\n').filter(row => row.trim());
            const parsedData = rows.map(row => {
              // Simple CSV parser - handles basic cases
              const cells = [];
              let current = '';
              let inQuotes = false;
              
              for (let i = 0; i < row.length; i++) {
                const char = row[i];
                if (char === '"') {
                  inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                  cells.push(current.trim());
                  current = '';
                } else {
                  current += char;
                }
              }
              cells.push(current.trim());
              return cells;
            });
            setCsvData(parsedData);
          }

          // For Excel files, parse with SheetJS
          if (excelExtensions.includes(extension)) {
            const arrayBuffer = await blob.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetNames = workbook.SheetNames;
            setExcelSheets(sheetNames);
            
            // Parse all sheets with proper empty cell handling
            const sheetsData = sheetNames.map(sheetName => {
              const worksheet = workbook.Sheets[sheetName];
              
              // Get the range of the worksheet
              const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
              const rows = [];
              
              // Iterate through each row
              for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
                const row = [];
                
                // Iterate through each column in the row
                for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
                  const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
                  const cell = worksheet[cellAddress];
                  
                  // Add cell value or empty string for empty cells
                  row.push(cell ? (cell.v !== undefined ? cell.v : '') : '');
                }
                
                rows.push(row);
              }
              
              return rows;
            });
            
            setExcelData(sheetsData);
            setActiveSheet(0);
          }

          // For Word documents, render with docx-preview
          if (wordExtensions.includes(extension) && wordPreviewRef.current) {
            const arrayBuffer = await blob.arrayBuffer();
            await renderAsync(arrayBuffer, wordPreviewRef.current, undefined, {
              className: "docx-wrapper",
              inWrapper: true,
              ignoreWidth: false,
              ignoreHeight: false,
              renderHeaders: true,
              renderFooters: true,
              renderFootnotes: true,
              renderEndnotes: true,
              ignoreFonts: false,
              breakPages: true,
              ignoreLastRenderedPageBreak: true,
              experimental: false,
              trimXmlDeclaration: true,
              useBase64URL: false,
              renderChanges: false,
              renderComments: false,
              debug: false
            });
          }
          
          setHasError(false);
        } catch (error) {
          console.error('Error decrypting file for preview:', error);
          setHasError(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    decryptFile();

    // Cleanup blob URL on unmount
    return () => {
      if (decryptedBlobUrl) {
        URL.revokeObjectURL(decryptedBlobUrl);
      }
    };
  }, [selectedFiles[0], onDecryption, extension]);

  const displayPath = decryptedBlobUrl || filePath;

  const handleImageLoad = () => {
    setIsLoading(false); // Loading is complete
    setHasError(false); // No error
  };

  const handleImageError = () => {
    setIsLoading(false); // Loading is complete
    setHasError(true); // Error occurred
  };

  const handleDownload = () => {
    onDownload(selectedFiles);
  };

  if (React.isValidElement(customPreview)) {
    return customPreview;
  }

  return (
    <section className={`file-previewer ${extension === "pdf" ? "pdf-previewer" : ""} ${excelExtensions.includes(extension) ? "xlsx-previewer" : ""} ${wordExtensions.includes(extension) ? "docx-previewer" : ""} ${officeExtensions.includes(extension) ? `${extension}-previewer` : ""}`}>
      {hasError ||
        (![
          ...imageExtensions,
          ...videoExtensions,
          ...audioExtensions,
          ...iFrameExtensions,
          ...pdfExtensions,
          ...textExtensions,
          ...csvExtensions,
          ...excelExtensions,
          ...wordExtensions,
          ...officeExtensions,
        ].includes(extension) && (
          <div className="preview-error">
            <span className="error-icon">{fileIcons[extension] ?? <FaRegFileAlt size={73} />}</span>
            <span className="error-msg">{t("previewUnavailable")}</span>
            <div className="file-info">
              <span className="file-name">{selectedFiles[0].name}</span>
              {selectedFiles[0].size && <span>-</span>}
              <span className="file-size">{getDataSize(selectedFiles[0].size)}</span>
            </div>
            <Button onClick={handleDownload} padding="0.45rem .9rem">
              <div className="download-btn">
                <MdOutlineFileDownload size={18} />
                <span>{t("download")}</span>
              </div>
            </Button>
          </div>
        ))}
      {imageExtensions.includes(extension) && (
        <>
          <Loader isLoading={isLoading} />
          <div className="image-preview-container">
            <div className="image-preview-header">
              <div className="image-info">
                <span className="file-name">{selectedFiles[0].name}</span>
                <span className="file-size">{getDataSize(selectedFiles[0].size)}</span>
              </div>
              <div className="image-controls">
                <Button onClick={handleDownload} padding="0.4rem 0.8rem">
                  <div className="download-btn">
                    <MdOutlineFileDownload size={16} />
                    <span>{t("download")}</span>
                  </div>
                </Button>
              </div>
            </div>
            <div className="image-preview-content">
              <img
                src={displayPath}
                alt="Preview Unavailable"
                className={`image-display ${isLoading ? "img-loading" : ""}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            </div>
          </div>
        </>
      )}
      {videoExtensions.includes(extension) && (
        <video src={displayPath} className="video-preview" controls autoPlay />
      )}
      {audioExtensions.includes(extension) && (
        <audio src={displayPath} controls autoPlay className="audio-preview" />
      )}
      {iFrameExtensions.includes(extension) && (
        <>
          <iframe
            src={displayPath}
            onLoad={handleImageLoad}
            onError={handleImageError}
            frameBorder="0"
            className={`photo-popup-iframe ${isLoading ? "img-loading" : ""}`}
          ></iframe>
        </>
      )}
      {pdfExtensions.includes(extension) && (
        <>
          <Loader isLoading={isLoading} />
          <div className="pdf-preview-container">
            <div className="pdf-preview-header">
              <div className="pdf-info">
                <span className="file-name">{selectedFiles[0].name}</span>
                <span className="file-size">{getDataSize(selectedFiles[0].size)}</span>
              </div>
              <div className="pdf-controls">
                <Button onClick={handleDownload} padding="0.4rem 0.8rem">
                  <div className="download-btn">
                    <MdOutlineFileDownload size={16} />
                    <span>{t("download")}</span>
                  </div>
                </Button>
              </div>
            </div>
            <div className="pdf-preview-content">
              <iframe
                src={`${displayPath}#toolbar=1&navpanes=1&scrollbar=1`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                frameBorder="0"
                className={`pdf-iframe ${isLoading ? "pdf-loading" : ""}`}
                title={`PDF Preview - ${selectedFiles[0].name}`}
              ></iframe>
            </div>
          </div>
        </>
      )}
      {csvExtensions.includes(extension) && !hasError && (
        <>
          <Loader isLoading={isLoading} />
          <div className="csv-preview-container">
            <div className="csv-preview-header">
              <div className="csv-info">
                <span className="file-name">{selectedFiles[0].name}</span>
                <span className="file-size">{getDataSize(selectedFiles[0].size)}</span>
                {csvData.length > 0 && <span className="row-count">{csvData.length} rows</span>}
              </div>
              <div className="csv-controls">
                <Button onClick={handleDownload} padding="0.4rem 0.8rem">
                  <div className="download-btn">
                    <MdOutlineFileDownload size={16} />
                    <span>{t("download")}</span>
                  </div>
                </Button>
              </div>
            </div>
            <div className="csv-preview-content">
              {csvData.length > 0 ? (
                <div className="csv-table-wrapper">
                  <table className="csv-table">
                    <thead>
                      <tr>
                        {csvData[0]?.map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="csv-empty">No data to display</div>
              )}
            </div>
          </div>
        </>
      )}
      {excelExtensions.includes(extension) && !hasError && (
        <>
          <Loader isLoading={isLoading} />
          <div className="excel-preview-container">
            <div className="excel-preview-header">
              <div className="excel-info">
                <span className="file-name">{selectedFiles[0].name}</span>
                <span className="file-size">{getDataSize(selectedFiles[0].size)}</span>
                {excelSheets.length > 0 && <span className="sheet-count">{excelSheets.length} sheets</span>}
              </div>
              <div className="excel-controls">
                <Button onClick={handleDownload} padding="0.4rem 0.8rem">
                  <div className="download-btn">
                    <MdOutlineFileDownload size={16} />
                    <span>{t("download")}</span>
                  </div>
                </Button>
              </div>
            </div>
            {excelSheets.length > 1 && (
              <div className="excel-sheet-tabs">
                {excelSheets.map((sheetName, index) => (
                  <button
                    key={index}
                    className={`sheet-tab ${activeSheet === index ? 'active' : ''}`}
                    onClick={() => setActiveSheet(index)}
                  >
                    {sheetName}
                  </button>
                ))}
              </div>
            )}
            <div className="excel-preview-content">
              {excelData[activeSheet] && excelData[activeSheet].length > 0 ? (
                <div className="excel-table-wrapper">
                  <table className="excel-table">
                    <thead>
                      <tr>
                        <th className="row-header">#</th>
                        {excelData[activeSheet][0]?.map((_, index) => (
                          <th key={index} className="col-header">
                            {String.fromCharCode(65 + (index % 26))}
                            {index >= 26 ? Math.floor(index / 26) : ''}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {excelData[activeSheet].map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td className="row-number">{rowIndex + 1}</td>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="excel-cell">
                              {cell !== undefined && cell !== null ? String(cell) : ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="excel-empty">No data to display</div>
              )}
            </div>
          </div>
        </>
      )}
      {wordExtensions.includes(extension) && !hasError && (
        <>
          <Loader isLoading={isLoading} />
          <div className="word-preview-container">
            <div className="word-preview-header">
              <div className="word-info">
                <span className="file-name">{selectedFiles[0].name}</span>
                <span className="file-size">{getDataSize(selectedFiles[0].size)}</span>
              </div>
              <div className="word-controls">
                <Button onClick={handleDownload} padding="0.4rem 0.8rem">
                  <div className="download-btn">
                    <MdOutlineFileDownload size={16} />
                    <span>{t("download")}</span>
                  </div>
                </Button>
              </div>
            </div>
            <div className="word-preview-content">
              <div ref={wordPreviewRef} className="docx-preview"></div>
            </div>
          </div>
        </>
      )}
      {officeExtensions.includes(extension) && (
        <>
          <Loader isLoading={isLoading} />
          <div className="office-preview-container">
            <div className="office-preview-header">
              <div className="office-info">
                <span className="file-name">{selectedFiles[0].name}</span>
                <span className="file-size">{getDataSize(selectedFiles[0].size)}</span>
              </div>
              <div className="office-controls">
                <Button onClick={handleDownload} padding="0.4rem 0.8rem">
                  <div className="download-btn">
                    <MdOutlineFileDownload size={16} />
                    <span>{t("download")}</span>
                  </div>
                </Button>
              </div>
            </div>
            <div className="office-preview-content">
              <div className="office-placeholder">
                <div className="office-icon">
                  {fileIcons[extension] ?? <FaRegFileAlt size={80} />}
                </div>
                <div className="office-info-text">
                  <h3>Office Document Preview</h3>
                  <p>This {extension?.toUpperCase()} document cannot be previewed directly.</p>
                  <div className="office-features">
                    <h4>Document Information:</h4>
                    <ul>
                      <li><strong>File:</strong> {selectedFiles[0].name}</li>
                      <li><strong>Size:</strong> {getDataSize(selectedFiles[0].size)}</li>
                      <li><strong>Type:</strong> {extension === 'xlsx' ? 'Excel Spreadsheet' : 
                                                   extension === 'docx' ? 'Word Document' : 
                                                   extension === 'pptx' ? 'PowerPoint Presentation' : 
                                                   'Office Document'}</li>
                    </ul>
                  </div>
                  <div className="office-actions">
                    <p>Download the file to view it in your preferred Office application.</p>
                    <Button onClick={handleDownload} padding="0.6rem 1.2rem">
                      <div className="download-btn-large">
                        <MdOutlineFileDownload size={20} />
                        <span>Download & Open</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}      {textExtensions.includes(extension) && !hasError && (
        <>
          <Loader isLoading={isLoading} />
          <div className="text-preview-container">
            <div className="text-preview-header">
              <span className="file-name">{selectedFiles[0].name}</span>
              <span className="file-size">{getDataSize(selectedFiles[0].size)}</span>
            </div>
            <div className="text-preview-content">
              <pre className="text-content">{textContent}</pre>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default PreviewFileAction;

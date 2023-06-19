import React, { useState, useEffect, useRef } from 'react';
import { BsDownload, BsZoomIn, BsZoomOut } from 'react-icons/bs';
import { pdfjs, Document, Page } from 'react-pdf';
import { Button } from 'react-bootstrap';

import { getProfilePdf } from '../../api';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = (student_id, path) => {
  const [pdfData, setPdfData] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const containerRef = useRef(null);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPdfData = async () => {
      const pdf = await getProfilePdf(student_id, path); // Call the function to retrieve the PDF data
      setPdfData(pdf.data); // Set the PDF data in the state
    };

    fetchPdfData();
  }, []);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageWidth(containerRef.current.offsetWidth - 30);
  };

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel + 0.2);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.2) {
      setZoomLevel(zoomLevel - 0.2);
    }
  };

  const handleDownload = () => {
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(pdfData);
    downloadLink.download = path;
    downloadLink.click();
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const pageHeight = container.scrollHeight / numPages;
    const newPage = Math.floor(scrollPosition / pageHeight) + 1;
    setCurrentPage(newPage);
  };

  return (
    <div>
      {pdfData ? (
        <>
          <div
            ref={containerRef}
            style={{ width: '100%', height: '600px', overflow: 'auto' }}
            onScroll={handleScroll}
          >
            <Document
              file={pdfData}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={console.error}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  scale={zoomLevel}
                  width={pageWidth} // Adjust the width of the Page component to fit the container
                />
              ))}
            </Document>
          </div>
          <p>
            Current Page: {currentPage} of {numPages}
          </p>
          <div>
            <Button size="sm" onClick={handleZoomIn}>
              <BsZoomIn />
            </Button>
            <Button size="sm" onClick={handleZoomOut}>
              <BsZoomOut />
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <BsDownload /> Download
            </Button>
          </div>
        </>
      ) : (
        <div>Loading PDF...</div>
      )}
    </div>
  );
};
export default PDFViewer;

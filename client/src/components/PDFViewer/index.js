import React, { useState, useEffect, useRef } from 'react';
import { BsDownload, BsZoomIn, BsZoomOut } from 'react-icons/bs';

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// import { Document } from 'react-pdf/dist/entry.noworker';
import { getProfilePdf } from '../../api';
// import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

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
      const blob = new Blob([pdf.data], { type: 'application/pdf' });
      const data = URL.createObjectURL(blob);
      setPdfData(pdf.data); // Set the PDF data in the state
    };

    fetchPdfData();
  }, []);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageWidth(containerRef.current.offsetWidth);
  };

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
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
    const newPage = Math.ceil(scrollPosition / pageHeight) + 1;
    setCurrentPage(newPage);
  };

  console.log(pdfData);
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
                  width={pageWidth - 30} // Adjust the width of the Page component to fit the container
                />
              ))}
            </Document>
          </div>
          <p>
            Current Page: {currentPage} of {numPages}
          </p>
          <div>
            <div>
              <button onClick={handleZoomIn}>
                <BsZoomIn />
              </button>
              <button onClick={handleZoomOut}>
                <BsZoomOut />
              </button>
            </div>
            <button onClick={goToPreviousPage} disabled={pageNumber === 1}>
              Previous Page
            </button>
            <button onClick={goToNextPage} disabled={pageNumber === numPages}>
              Next Page
            </button>
            <button onClick={handleDownload}>
              <BsDownload /> Download
            </button>
          </div>
        </>
      ) : (
        <div>Loading PDF...</div>
      )}
    </div>
  );
};
export default PDFViewer;

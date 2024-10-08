import React, { useState, useEffect, useRef } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { Box, Button, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

import { getPdf } from '../../api';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = (apiFilePath, path) => {
  const [pdfData, setPdfData] = useState(null);
  const [pageWidth, setPageWidth] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const containerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPdfData = async () => {
      const pdf = await getPdf(apiFilePath);
      setPdfData(pdf.data); // Set the PDF data in the state
    };

    fetchPdfData();
  }, []);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageWidth(containerRef.current.offsetWidth - 30);
  };

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel * 1.414);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.2) {
      setZoomLevel(zoomLevel / 1.414);
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
    <Box>
      {pdfData ? (
        <>
          <Box
            ref={containerRef}
            style={{ height: '60vh', overflow: 'auto' }}
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
          </Box>
          <Box sx={{ mx: 2 }}>
            <Typography>
              {currentPage} of {numPages}
            </Typography>
            <Box>
              <Button
                size="small"
                variant="outlined"
                onClick={handleZoomIn}
                startIcon={<ZoomInIcon />}
              ></Button>
              <Button
                size="small"
                variant="outlined"
                onClick={handleZoomOut}
                startIcon={<ZoomOutIcon />}
              ></Button>
              <Button
                size="small"
                variant="outlined"
                onClick={handleDownload}
                startIcon={<DownloadIcon />}
              ></Button>
            </Box>
          </Box>
        </>
      ) : (
        <Box>Loading PDF...</Box>
      )}
    </Box>
  );
};
export default PDFViewer;

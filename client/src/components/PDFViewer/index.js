import React, { useState, useRef } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { Box, Button, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { getPDFQuery } from '../../api/query';
import { useQuery } from '@tanstack/react-query';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = (apiFilePath, path) => {
    const { data, isLoading } = useQuery(getPDFQuery(apiFilePath));
    const pdfData = data;
    const [pageWidth, setPageWidth] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const containerRef = useRef(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

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
        const fileName = path.split('/').pop();
        downloadLink.download = fileName;
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
            {isLoading ? (
                <Box>Loading PDF...</Box>
            ) : (
                <>
                    <Box
                        onScroll={handleScroll}
                        ref={containerRef}
                        style={{ height: '60vh', overflow: 'auto' }}
                    >
                        <Document
                            file={pdfData}
                            onLoadError={console.error}
                            onLoadSuccess={onDocumentLoadSuccess}
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
                                onClick={handleZoomIn}
                                size="small"
                                startIcon={<ZoomInIcon />}
                                variant="outlined"
                            />
                            <Button
                                onClick={handleZoomOut}
                                size="small"
                                startIcon={<ZoomOutIcon />}
                                variant="outlined"
                            />
                            <Button
                                onClick={handleDownload}
                                size="small"
                                startIcon={<DownloadIcon />}
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};
export default PDFViewer;

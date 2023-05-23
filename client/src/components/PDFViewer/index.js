import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { getProfilePdf } from '../../api';
// import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';

const PDFViewer = (student_id, path) => {
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    const fetchPdfData = async () => {
      const pdf = await getProfilePdf(student_id, path); // Call the function to retrieve the PDF data
      const blob = new Blob([pdf.data], { type: 'application/pdf' });
      const data = URL.createObjectURL(blob);
      setPdfData(data); // Set the PDF data in the state
    };

    fetchPdfData();
  }, []);
  const onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  };
  console.log(pdfData);
  return (
    <div>
      {pdfData ? (
        <Document file={pdfData} onLoadSuccess={onDocumentLoad}>
          <Page pageNumber={1} />
        </Document>
      ) : (
        <div>Loading PDF...</div>
      )}
    </div>
  );
};
export default PDFViewer;

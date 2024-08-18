import React from 'react';
// import request from '../../api/request';
// import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
// import FileViewer from 'react-pdf';
import { BASE_URL } from '../../api/request';
import PDFViewer from '../../components/PDFViewer/index';
// TODO: under constrution. prevent PDF download, prevent browser default setting.
const FilePreview = ({ path, student_id }) => {
  return (
    <>
      {path.split('.')[1] === 'pdf' || path.split('.')[1] === 'PDF' ? (
        <>{PDFViewer(student_id, path)}</>
      ) : (
        // <embed
        //   src={`${BASE_URL}/api/students/${student_id}/files/${path}`}
        //   type="application/pdf"
        //   height={600}
        //   width="100%"
        // ></embed>
        <div
          className="center"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center'
          }}
        >
          <img
            src={`${BASE_URL}/api/students/${student_id}/files/${path}`}
            width="90%"
            height="60%"
          />
        </div>
      )}
    </>
  );
};

export default FilePreview;

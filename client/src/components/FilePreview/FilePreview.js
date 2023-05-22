import React, { useEffect, useState } from 'react';
// import request from '../../api/request';
// import FileViewer from 'react-file-viewer';
// import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
// import FileViewer from 'react-pdf';
import { BASE_URL } from '../../api/request';

const FilePreview = ({ path, student_id }) => {
  return (
    <div>
      {path.split('.')[1] === 'pdf' ? (
        <object
          data={`${BASE_URL}/api/students/${student_id}/files/${path}`}
          type="application/pdf"
          height={600}
          width="100%"
        ></object>
      ) : (
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
            width="30%"
            height="30%"
          />
        </div>
      )}
    </div>
  );
};

export default FilePreview;

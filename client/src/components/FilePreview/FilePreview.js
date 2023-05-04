import React, { useEffect, useState } from 'react';
import request from '../../api/request';
import FileViewer from 'react-file-viewer';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
// import FileViewer from 'react-pdf';
import { BASE_URL } from '../../api/request';

const FilePreview = ({ path, student_id }) => {
  return (
    <div>
      {path.split('.')[1] === 'pdf' ? (
        <embed
          src={`${BASE_URL}/api/students/${student_id}/files/${path}`}
          type="application/pdf"
          height={700}
          width="100%"
        />
      ) : (
        <img
          src={`${BASE_URL}/api/students/${student_id}/files/${path}`}
          width="100%"
          height="100%"
        />
      )}
    </div>
  );
};

export default FilePreview;

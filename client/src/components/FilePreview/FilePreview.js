import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { BASE_URL } from '../../api/request';
import PDFViewer from '../../components/PDFViewer/index';

const FilePreview = ({ path, apiFilePath }) => {
  const { t } = useTranslation();
  const fileExtension = path.split('.')[1]?.toLowerCase();
  return (
    <>
      {fileExtension === 'pdf' ? (
        <>{PDFViewer(apiFilePath, path)}</>
      ) : (
        <div>
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
            <img src={`${BASE_URL}${apiFilePath}`} width="90%" height="60%" />
          </div>
          <div>
            <a
              href={`${BASE_URL}${apiFilePath}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="contained"
                size="small"
                color="secondary"
                startIcon={<DownloadIcon />}
              >
                {t('Download', { ns: 'common' })}
              </Button>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default FilePreview;

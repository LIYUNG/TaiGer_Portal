import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '@mui/material';
import i18next from 'i18next';

import { BASE_URL } from '../../api/request';
import PDFViewer from '../../components/PDFViewer/index';

const FilePreview = ({ path, apiFilePath }) => {
    const fileExtension = path.split('.')[1]?.toLowerCase();
    return fileExtension === 'pdf' ? (
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
                <img
                    height="60%"
                    src={`${BASE_URL}${apiFilePath}`}
                    width="90%"
                />
            </div>
            <div>
                <a
                    href={`${BASE_URL}${apiFilePath}`}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <Button
                        color="secondary"
                        size="small"
                        startIcon={<DownloadIcon />}
                        variant="contained"
                    >
                        {i18next.t('Download', { ns: 'common' })}
                    </Button>
                </a>
            </div>
        </div>
    );
};

export default FilePreview;

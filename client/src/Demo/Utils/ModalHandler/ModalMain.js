import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { appConfig } from '../../../config';
import ModalNew from '../../../components/Modal';

function ModalMain(props) {
  const { t } = useTranslation();
  const modalMainState = {
    res_modal_status: props.res_modal_status,
    res_modal_message: props.res_modal_message
  };

  const { res_modal_status, res_modal_message } = modalMainState;
  return (
    <>
      <ModalNew
        open={[400, 401, 409, 423, 429, 500].includes(res_modal_status)}
        onClose={props.ConfirmError}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Box>
          <Typography>{t('Error')}</Typography>
          <Typography>{res_modal_message}</Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={props.ConfirmError}
          >
            {t('Ok')}
          </Button>
        </Box>
      </ModalNew>
      <ModalNew
        open={
          res_modal_status === 403 ||
          res_modal_status === 404 ||
          res_modal_status === 413 ||
          res_modal_status === 415
        }
        onClose={props.ConfirmError}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Box>
          <Typography variant="h6">{t('Error')}</Typography>
          <Box>
            {res_modal_status === 403 && (
              <Typography>
                Operation forbidden. Please contact {appConfig.companyName} for
                more detail.
              </Typography>
            )}
            {res_modal_status === 404 && <>404: {res_modal_message}</>}
            {res_modal_status === 413 && (
              <>
                <Typography>{res_modal_message}</Typography>
                Please use third party WebApp like{' '}
                <a
                  href="https://www.ilovepdf.com/compress_pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>PDF Compressor</b>
                </a>{' '}
                or{' '}
                <a
                  href="https://www.adobe.com/de/acrobat/online/compress-pdf.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>Adobe WebApp</b>
                </a>
                to compress your file!
              </>
            )}
            {res_modal_status === 415 && (
              <>
                <Typography>{res_modal_message}</Typography>
                <Typography>
                  請確認您的檔案格式。壓縮過後的檔案仍然需要是上述格式。
                </Typography>
              </>
            )}
          </Box>
          <Button
            color="primary"
            variant="contained"
            onClick={props.ConfirmError}
          >
            {t('Ok')}
          </Button>
        </Box>
      </ModalNew>
    </>
  );
}

export default ModalMain;

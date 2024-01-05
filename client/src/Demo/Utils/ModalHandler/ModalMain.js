import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { appConfig } from '../../../config';

function ModalMain(props) {
  const { t, i18n } = useTranslation();
  const [modalMainState, setModalMainState] = useState({
    res_modal_status: props.res_modal_status,
    res_modal_message: props.res_modal_message
  });

  const { res_modal_status, res_modal_message } = modalMainState;
  return (
    <>
      <Modal
        show={[400, 401, 409, 423, 429, 500].includes(res_modal_status)}
        onHide={props.ConfirmError}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {t('Error')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{res_modal_message}</Modal.Body>
        <Modal.Footer>
          <Button onClick={props.ConfirmError}>Ok</Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={
          res_modal_status === 403 ||
          res_modal_status === 404 ||
          res_modal_status === 413 ||
          res_modal_status === 415
        }
        onHide={props.ConfirmError}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {t('Error')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {res_modal_status === 403 && (
            <>
              Operation forbidden. Please contact {appConfig.companyName} for
              more detail.
            </>
          )}
          {res_modal_status === 404 && <>404: {res_modal_message}</>}
          {res_modal_status === 413 && (
            <>
              <p>{res_modal_message}</p>
              Please use third party WebApp like{' '}
              <a href="https://www.ilovepdf.com/compress_pdf" target="_blank">
                <b>PDF Compressor</b>
              </a>{' '}
              or{' '}
              <a
                href="https://www.adobe.com/de/acrobat/online/compress-pdf.html"
                target="_blank"
              >
                <b>Adobe WebApp</b>
              </a>
              to compress your file!
            </>
          )}
          {res_modal_status === 415 && (
            <>
              <p>{res_modal_message}</p>
              <p>請確認您的檔案格式。壓縮過後的檔案仍然需要是上述格式。</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.ConfirmError}>Ok</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalMain;

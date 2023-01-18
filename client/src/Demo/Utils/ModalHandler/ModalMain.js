import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class ModalMain extends React.Component {
  state = {
    res_modal_status: this.props.res_modal_status,
    res_modal_message: this.props.res_modal_message
  };

  render() {
    const { res_modal_status, res_modal_message } = this.state;
    return (
      <>
        <Modal
          show={res_modal_status === 401}
          onHide={this.props.ConfirmError}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{res_modal_message}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.ConfirmError}>Ok</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={res_modal_status === 403}
          onHide={this.props.ConfirmError}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Operation forbidden. Please contact TaiGer for more detail.
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.ConfirmError}>Ok</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={res_modal_status === 404}
          onHide={this.props.ConfirmError}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>404: {res_modal_message}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.ConfirmError}>Ok</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={res_modal_status === 409}
          onHide={this.props.ConfirmError}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{res_modal_message}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.ConfirmError}>Ok</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={res_modal_status === 413}
          onHide={this.props.ConfirmError}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.ConfirmError}>Ok</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={res_modal_status === 415}
          onHide={this.props.ConfirmError}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{res_modal_message}</p>
            <p>請確認您的檔案格式。壓縮過後的檔案仍然需要是上述格式。</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.ConfirmError}>Ok</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={res_modal_status === 423}
          onHide={this.props.ConfirmError}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{res_modal_message}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.ConfirmError}>Ok</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={res_modal_status === 429}
          onHide={this.props.ConfirmError}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{res_modal_message}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.ConfirmError}>Ok</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={res_modal_status === 500}
          onHide={this.props.ConfirmError}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{res_modal_message}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.ConfirmError}>Ok</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ModalMain;

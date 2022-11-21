import React from 'react';
import { Col, Form, Button, Modal, Spinner, Offcanvas } from 'react-bootstrap';
import { IoMdCloudUpload } from 'react-icons/io';
import {
  AiFillQuestionCircle,
} from 'react-icons/ai';
import { FiExternalLink } from 'react-icons/fi';

class ButtonSetMissing extends React.Component {
  state = {
    student: this.props.student,
    student_id: '',
    category: '',
    docName: '',
    comments: '',
    file: '',
    isLoaded: this.props.isLoaded,
    deleteFileWarningModel: false,
    CommentModel: false,
    setMissingWindow: false,
    acceptProfileFileModel: false,
    baseDocsflagOffcanvas: false
  };

  closeOffcanvasWindow = () => {
    this.setState((state) => ({ ...state, baseDocsflagOffcanvas: false }));
  };
  openOffcanvasWindow = () => {
    this.setState((state) => ({ ...state, baseDocsflagOffcanvas: true }));
  };

  closeSetMissingWindow = () => {
    this.setState((state) => ({ ...state, setMissingWindow: false }));
  };

  handleGeneralDocSubmit = (e, k, student_id) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    this.props.handleGeneralDocSubmit(e, k, student_id);
  };

  onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      student_id,
      category,
      status,
      setMissingWindow: true
    }));
  };

  onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    this.props.onUpdateProfileFilefromstudent(
      this.state.category,
      this.state.student_id,
      this.state.status,
      this.state.feedback
    );
  };

  render() {
    const deleteStyle = 'danger';
    const graoutStyle = 'light';
    var ButttonRow_Rejected;
    ButttonRow_Rejected = (
      <tr>
        <th>
          <AiFillQuestionCircle
            size={24}
            color="lightgray"
            title="No Document uploaded"
          />
        </th>
        <td>
          {this.props.docName}
          <FiExternalLink
            className="mx-1 mb-1"
            style={{ cursor: 'pointer' }}
            onClick={this.openOffcanvasWindow}
          />
        </td>
        {this.props.role === 'Editor' ? (
          <>
            <td></td>
            <td></td>
          </>
        ) : (
          <>
            <td>
              {!this.state.isLoaded ? (
                <div>
                  <Spinner animation="border" role="status" variant="light">
                    <span className="visually-hidden"></span>
                  </Spinner>
                </div>
              ) : (
                <Form.Group controlId="formFile">
                  <Form.Label>
                    <IoMdCloudUpload color={'white'} size={32} />
                  </Form.Label>
                  <Form.Control
                    hidden
                    type="file"
                    onChange={(e) =>
                      this.handleGeneralDocSubmit(
                        e,
                        this.props.k,
                        this.props.student_id
                      )
                    }
                  />
                </Form.Group>
              )}
            </td>
            {this.props.role === 'Student' ? (
              <td></td>
            ) : (
              <td>
                <Col md>
                  <Form
                    onSubmit={(e) =>
                      this.onUpdateProfileDocStatus(
                        e,
                        this.props.k,
                        this.props.student_id,
                        'notneeded'
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button variant={'secondary'} size="sm" type="submit">
                        Set notneeded
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
            )}
          </>
        )}
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );

    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    return (
      <>
        {ButttonRow_Rejected}
        <Modal
          show={this.state.setMissingWindow}
          onHide={this.closeSetMissingWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to set {this.state.category} unnecessary document?
            {!this.state.isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!this.state.isLoaded}
              onClick={(e) => this.onUpdateProfileFilefromstudent(e)}
            >
              Yes
            </Button>
            <Button onClick={this.closeSetMissingWindow}>No</Button>
          </Modal.Footer>
        </Modal>
        <Offcanvas
          show={this.state.baseDocsflagOffcanvas}
          onHide={this.closeOffcanvasWindow}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Information</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            Here is the documentation or editing link.
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }
}

export default ButtonSetMissing;

import React from 'react';
import { Col, Form, Button, Modal, Spinner, Offcanvas } from 'react-bootstrap';
import { IoMdCloudUpload } from 'react-icons/io';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { FiExternalLink } from 'react-icons/fi';

class ButtonSetMissing extends React.Component {
  state = {
    student: this.props.student,
    link: this.props.link,
    student_id: '',
    category: '',
    comments: '',
    file: '',
    isLoaded: this.props.isLoaded,
    deleteFileWarningModel: false,
    CommentModel: false,
    setMissingWindow: false,
    acceptProfileFileModel: false,
    baseDocsflagOffcanvas: false,
    baseDocsflagOffcanvasButtonDisable: false
  };

  componentDidUpdate(prevProps) {
    if (prevProps.isLoaded !== this.props.isLoaded) {
      this.setState((state) => ({ ...state, isLoaded: this.props.isLoaded }));
    }
  }
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

  updateDocLink = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      baseDocsflagOffcanvasButtonDisable: true
    }));
    this.props.updateDocLink(this.state.link, this.props.k);
    this.setState((state) => ({
      ...state,
      baseDocsflagOffcanvasButtonDisable: false,
      baseDocsflagOffcanvas: false
    }));
  };

  onChangeURL = (e) => {
    e.preventDefault();
    const url_temp = e.target.value;
    this.setState((state) => ({
      ...state,
      link: url_temp
    }));
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
          <a
            href={
              this.state.link && this.state.link != '' ? this.state.link : '/'
            }
            target="_blank"
            className="text-info"
          >
            <FiExternalLink
              className="mx-1 mb-1"
              style={{ cursor: 'pointer' }}
            />
          </a>
          {this.props.role === 'Admin' && (
            <a onClick={this.openOffcanvasWindow} style={{ cursor: 'pointer' }}>
              [Edit]
            </a>
          )}
        </td>
        {this.props.role === 'Student' ||
        this.props.role === 'Admin' ||
        this.props.role === 'Agent' ? (
          <td>
            {!this.state.isLoaded ? (
              <div>
                <Spinner animation="border" role="status" variant="light">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            ) : (
              <Form.Group controlId={`${this.props.k}`}>
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
        ) : (
          <td></td>
        )}
        <td></td>
        {this.props.role === 'Admin' || this.props.role === 'Agent' ? (
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
                <Form.Group controlId={`${this.props.k}`}>
                  <Button variant={'secondary'} size="sm" type="submit">
                    Set notneeded
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </td>
        ) : (
          <td></td>
        )}

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
            <Offcanvas.Title>Edit</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                Documentation Link for <b>{this.props.docName}</b>
              </Form.Label>
              <Form.Control
                placeholder="https://taigerconsultancy-portal.com/docs/search/12345678"
                defaultValue={this.state.link}
                onChange={(e) => this.onChangeURL(e)}
              />
            </Form.Group>
            <Button
              onClick={(e) => this.updateDocLink(e)}
              disabled={this.state.baseDocsflagOffcanvasButtonDisable}
            >
              Save
            </Button>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }
}

export default ButtonSetMissing;

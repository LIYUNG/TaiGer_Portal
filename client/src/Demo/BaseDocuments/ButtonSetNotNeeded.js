import React from 'react';
import { Col, Form, Button, Modal, Spinner, Offcanvas } from 'react-bootstrap';
import { IoMdCloudUpload } from 'react-icons/io';
import { BsDash } from 'react-icons/bs';
import { FiExternalLink } from 'react-icons/fi';
import { convertDate } from '../Utils/contants';

import OffcanvasBaseDocument from '../../components/Offcanvas/OffcanvasBaseDocument';
import {
  is_TaiGer_Admin,
  is_TaiGer_Editor,
  showButtonIfMyStudent
} from '../Utils/checking-functions';

class ButtonSetNotNeeded extends React.Component {
  state = {
    student: this.props.student,
    link: this.props.link,
    student_id: this.props.student._id.toString(),
    category: '',
    docName: '',
    file: '',
    isLoaded: this.props.isLoaded,
    SetNeededWindow: false,
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

  closeSetNeededWindow = () => {
    this.setState((state) => ({ ...state, SetNeededWindow: false }));
  };

  onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      student_id,
      category,
      status,
      SetNeededWindow: true
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

  handleGeneralDocSubmit = (e, k, student_id) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    this.props.handleGeneralDocSubmit(e, k, student_id);
  };
  render() {
    var ButttonRow_NotNeeded;
    ButttonRow_NotNeeded = (
      <tr>
        <td>
          <BsDash size={24} color="lightgray" title="Not needed" />
        </td>
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
          {is_TaiGer_Admin(this.props.user) && (
            <a onClick={this.openOffcanvasWindow} style={{ cursor: 'pointer' }}>
              [Edit]
            </a>
          )}
        </td>
        <td>{convertDate(this.props.time)}</td>
        {is_TaiGer_Editor(this.props.user) ? (
          <>
            <td></td>
            <td></td>
          </>
        ) : (
          <>
            <td>
              {!this.state.isLoaded ? (
                <div style={style}>
                  <Spinner animation="border" role="status" variant="light">
                    <span className="visually-hidden"></span>
                  </Spinner>
                </div>
              ) : (
                showButtonIfMyStudent(this.props.user, this.state.student) && (
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
                          this.state.student_id
                        )
                      }
                    />
                  </Form.Group>
                )
              )}
            </td>
            <td></td>
          </>
        )}
        <td>
          <Col>
            {showButtonIfMyStudent(this.props.user, this.state.student) && (
              <Form
                onSubmit={(e) =>
                  this.onUpdateProfileDocStatus(
                    e,
                    this.props.k,
                    this.state.student_id,
                    'missing'
                  )
                }
              >
                <Form.Group controlId={`${this.props.k}`}>
                  <Button size="sm" type="submit">
                    Set Needed
                  </Button>
                </Form.Group>
              </Form>
            )}
          </Col>
        </td>
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
        {ButttonRow_NotNeeded}
        <Modal
          show={this.state.SetNeededWindow}
          onHide={this.closeSetNeededWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Comments
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to set {this.state.category} as mandatory document?
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
            <Button onClick={this.closeSetNeededWindow}>No</Button>
          </Modal.Footer>
        </Modal>
        <OffcanvasBaseDocument
          show={this.state.baseDocsflagOffcanvas}
          onHide={this.closeOffcanvasWindow}
          link={this.state.link}
          docName={this.props.docName}
          onChangeURL={this.onChangeURL}
          updateDocLink={this.updateDocLink}
          baseDocsflagOffcanvasButtonDisable={
            this.state.baseDocsflagOffcanvasButtonDisable
          }
        />
      </>
    );
  }
}

export default ButtonSetNotNeeded;

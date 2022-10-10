import React from 'react';
import { Col, Form, Button, Modal, Spinner } from 'react-bootstrap';
import { IoMdCloudUpload } from 'react-icons/io';
import { BsDash } from 'react-icons/bs';

class ButtonSetNotNeeded extends React.Component {
  state = {
    student: this.props.student,
    student_id: '',
    category: '',
    docName: '',
    comments: '',
    file: '',
    isLoaded: this.props.isLoaded,
    SetNeededWindow: false
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
  render() {
    const deleteStyle = 'danger';
    const graoutStyle = 'light';
    var ButttonRow_NotNeeded;
    ButttonRow_NotNeeded = (
      <tr>
        <td>
          <BsDash size={24} color="lightgray" title="Not needed" />
        </td>
        <td>
          {this.props.docName}
          {' - '}
          {this.props.date}
          {' - '}
          {this.props.time}
        </td>
        {this.props.role === 'Editor' ? (
          <>
            <td></td>
            <td></td>
          </>
        ) : (
          <>
            {this.props.role === 'Student' ? (
              <td></td>
            ) : (
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.onUpdateProfileDocStatus(
                        e,
                        this.props.k,
                        this.props.student_id,
                        'missing'
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit">
                        Set Needed
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
            )}
            <td>
              <Form>
                <Form.File.Label
                  onChange={(e) =>
                    this.handleGeneralDocSubmit(
                      e,
                      this.props.k,
                      this.props.student_id
                    )
                  }
                  onClick={(e) => (e.target.value = null)}
                >
                  <Form.File.Input hidden />
                  <IoMdCloudUpload size={32} />
                </Form.File.Label>
              </Form>
            </td>
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
              Ok
            </Button>
            <Button onClick={this.closeSetNeededWindow}>Ok</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ButtonSetNotNeeded;

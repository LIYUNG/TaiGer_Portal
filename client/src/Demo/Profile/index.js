import React from 'react';
import { Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsExclamationTriangle } from 'react-icons/bs';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { updatePersonalData, updateCredentials, logout } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { is_personal_data_filled } from '../Utils/checking-functions';
class Profile extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    user: {},
    changed_personaldata: false,
    personaldata: {
      firstname: this.props.user.firstname,
      firstname_chinese: this.props.user.firstname_chinese,
      lastname: this.props.user.lastname,
      lastname_chinese: this.props.user.lastname_chinese,
      birthday: this.props.user.birthday
    },
    credentials: {
      current_password: '',
      new_password: '',
      new_password_again: ''
    },
    updateconfirmed: false,
    updatecredentialconfirmed: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    this.setState((state) => ({
      ...state,
      isLoaded: true,
      success: true
    }));
  }

  handleChange_PersonalData = (e) => {
    var personaldata_temp = { ...this.state.personaldata };
    personaldata_temp[e.target.id] = e.target.value;
    this.setState((state) => ({
      ...state,
      changed_personaldata: true,
      personaldata: personaldata_temp
    }));
  };

  handleSubmit_PersonalData = (e, personaldata) => {
    updatePersonalData(personaldata).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            personaldata: data,
            success: success,
            changed_personaldata: false,
            updateconfirmed: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  handleChange_Credentials = (e) => {
    var credentials_temp = { ...this.state.credentials };
    credentials_temp[e.target.id] = e.target.value;
    this.setState((state) => ({
      ...state,
      credentials: credentials_temp
    }));
  };

  handleSubmit_Credentials = (e, credentials, email) => {
    if (credentials.new_password !== credentials.new_password_again) {
      alert('New password not matched');
      return;
    }
    if (credentials.new_password.length < 8) {
      alert('New password should have at least 8 characters.');
      return;
    }
    updateCredentials(credentials, email, credentials.current_password).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            success: success,
            updatecredentialconfirmed: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  onHide = () => {
    this.setState({
      updateconfirmed: false
    });
  };

  onHideCredential = () => {
    this.setState({
      updateconfirmed: false
    });
  };

  setmodalhide = () => {
    window.location.reload(true);
  };

  setmodalhideUpdateCredentials = () => {
    logout().then(
      (resp) => {
        window.location.reload(true);
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    const { res_status, isLoaded, res_modal_status, res_modal_message } =
      this.state;
    TabTitle('Settings');
    if (!isLoaded) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <Row>
          <Col>
            <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Personal Data
                </Card.Title>
              </Card.Header>
              <Card.Body>
                {!is_personal_data_filled(this.props.user) && (
                  <Row>
                    <Col>
                      <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                        <p
                          className="text-light my-3 mx-3"
                          style={{ textAlign: 'left' }}
                        >
                          <BsExclamationTriangle size={18} />
                          <b className="mx-2">Reminder:</b> Please fill your
                          birthday / first name / last name
                        </p>
                      </Card>
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col>
                    <Form.Group controlId="firstname">
                      <Form.Label className="my-0 mx-0 text-light">
                        Firstname (English)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="First name"
                        autoComplete="nope"
                        value={this.state.personaldata.firstname}
                        onChange={(e) => this.handleChange_PersonalData(e)}
                      />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="firstname_chinese">
                      <Form.Label className="my-0 mx-0 text-light">
                        名 (中文)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="小明"
                        autoComplete="nope"
                        defaultValue={this.state.personaldata.firstname_chinese}
                        onChange={(e) => this.handleChange_PersonalData(e)}
                      />
                    </Form.Group>
                    <br />
                    <Form.Group className="mb-2">
                      <Form.Label className="my-0 mx-0 text-light">
                        Email
                      </Form.Label>
                      <p className="text-primary">{this.props.user.email}</p>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form autoComplete="nope">
                      <Form.Group controlId="lastname">
                        <Form.Label className="my-0 mx-0 text-light">
                          Lastname (English)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="nope"
                          placeholder="Last name"
                          defaultValue={this.state.personaldata.lastname}
                          onChange={(e) => this.handleChange_PersonalData(e)}
                        />
                      </Form.Group>
                    </Form>
                    <br />
                    <Form autoComplete="nope">
                      <Form.Group controlId="lastname_chinese">
                        <Form.Label className="my-0 mx-0 text-light">
                          姓 (中文)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="王"
                          autoComplete="nope"
                          defaultValue={
                            this.state.personaldata.lastname_chinese
                          }
                          onChange={(e) => this.handleChange_PersonalData(e)}
                        />
                      </Form.Group>
                    </Form>
                    <Form.Group className="my-2" controlId="birthday">
                      <Form.Label className="my-0 mx-0 text-light">
                        Birthday
                      </Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="1999/01/01"
                        defaultValue={this.state.personaldata.birthday}
                        onChange={(e) => this.handleChange_PersonalData(e)}
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      disabled={
                        this.state.personaldata.firstname === '' ||
                        this.state.personaldata.firstname_chinese === '' ||
                        this.state.personaldata.lastname === '' ||
                        this.state.personaldata.lastname_chinese === '' ||
                        !this.state.changed_personaldata
                      }
                      onClick={(e) =>
                        this.handleSubmit_PersonalData(
                          e,
                          this.state.personaldata
                        )
                      }
                    >
                      Update
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {!isLoaded && (
              <div style={spinner_style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Col>
        </Row>
        <Modal
          show={this.state.updateconfirmed}
          onHide={this.onHide}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Update Success
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>Personal Data is updated successfully!</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.setmodalhide}>Close</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.updatecredentialconfirmed}
          onHide={this.onHideCredential}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Update Credentials Successfully
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Credentials are updated successfully! Please login again.
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={(e) => this.setmodalhideUpdateCredentials(e)}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      </Aux>
    );
  }
}

export default Profile;
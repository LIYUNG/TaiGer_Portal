import React from 'react';
import { Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsExclamationTriangle, BsX } from 'react-icons/bs';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { updatePersonalData, updateCredentials, logout } from '../../api';
class Settings extends React.Component {
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
      lastname: this.props.user.lastname,
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
    // this.setState({
    //   updateconfirmed: false,
    // });
  };

  setmodalhideUpdateCredentials = () => {
    logout().then(
      (resp) => {
        // TODO: resp success? error handling
        // this.setState((state) => ({
        //   ...state,
        //   data: null
        // }));
        window.location.reload(true);
        // const { success } = resp.data;
        // this.setState({ success: success });
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
    // window.location.reload(true);
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    const { res_status, isLoaded, res_modal_status, res_modal_message } =
      this.state;

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
                {this.state.personaldata.birthday === '' && (
                  <Row>
                    <Col>
                      <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                        <p
                          className="text-light my-3 mx-3"
                          style={{ textAlign: 'left' }}
                        >
                          <BsExclamationTriangle size={18} />
                          <b className="mx-2">Reminder:</b> Please fill your
                          birthday:{' '}
                          <Link
                            to={'/settings'}
                            style={{ textDecoration: 'none' }}
                            className="text-info"
                          >
                            Survey
                          </Link>{' '}
                        </p>
                      </Card>
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col>
                    <Form.Group controlId="firstname">
                      <Form.Label className="my-0 mx-0 text-light">
                        Firstname
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="First name"
                        autoComplete="nope"
                        defaultValue={this.state.personaldata.firstname}
                        onChange={(e) => this.handleChange_PersonalData(e)}
                      />
                    </Form.Group>
                    <br />
                    <Form.Group className="mb-2">
                      <Form.Label className="my-0 mx-0 text-light">
                        Email
                      </Form.Label>
                      {/* <Form.Control
                        plaintext
                        readOnly
                        defaultValue={this.props.user.email}
                      /> */}
                      <p className="text-primary">{this.props.user.email}</p>
                    </Form.Group>

                    {/* <p>{this.props.user.email}</p> */}
                    {/* <Form.Group controlId="birthday">
                      <Form.Label className="my-0 mx-0 text-light">Birthday Date</Form.Label>
                      <Form.Control type="date" placeholder="Date of Birth" />
                    </Form.Group> */}
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="lastname">
                      <Form.Label className="my-0 mx-0 text-light">
                        Lastname
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Last name"
                        defaultValue={this.state.personaldata.lastname}
                        onChange={(e) => this.handleChange_PersonalData(e)}
                      />
                    </Form.Group>
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
                        this.state.personaldata.lastname === '' ||
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
        <Row>
          <Col md={6}>
            <Card className="my-4 mx-0" bg={'dark'} text={'white'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Reset Login Password
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row className="my-0 mx-0">
                  <Col>
                    {/* <Form> */}
                    <Form.Group controlId="current_password">
                      <Form.Label className="my-0 mx-0 text-light">
                        Current Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        onChange={(e) => this.handleChange_Credentials(e)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="my-4 mx-0">
                  <Col>
                    <Form.Group controlId="new_password">
                      <Form.Label className="my-0 mx-0 text-light">
                        New Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        onChange={(e) => this.handleChange_Credentials(e)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="my-0 mx-0">
                  <Col>
                    <Form.Group controlId="new_password_again">
                      <Form.Label className="my-0 mx-0 text-light">
                        Enter New Password Again
                      </Form.Label>
                      <Form.Control
                        type="password"
                        // placeholder="Text"
                        // readOnly={true}
                        // value={this.props.user.lastname}
                        onChange={(e) => this.handleChange_Credentials(e)}
                      />
                    </Form.Group>
                    <br />
                    <Button
                      disabled={
                        this.state.credentials.current_password === '' ||
                        this.state.credentials.new_password === '' ||
                        this.state.credentials.new_password_again === ''
                      }
                      variant="primary"
                      onClick={(e) =>
                        this.handleSubmit_Credentials(
                          e,
                          this.state.credentials,
                          this.props.user.email
                        )
                      }
                    >
                      Reset Password
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

export default Settings;

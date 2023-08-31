import React from 'react';
import { Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { updateCredentials, logout } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
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

  onHideCredential = () => {
    this.setState({
      updatecredentialconfirmed: false
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
                    <Form>
                      <Form.Group controlId="current_password">
                        <Form.Label className="my-0 mx-0 text-light">
                          Current Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          onChange={(e) => this.handleChange_Credentials(e)}
                        />
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
                <Row className="my-4 mx-0">
                  <Col>
                    <Form>
                      <Form.Group controlId="new_password">
                        <Form.Label className="my-0 mx-0 text-light">
                          New Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          onChange={(e) => this.handleChange_Credentials(e)}
                        />
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
                <Row className="my-0 mx-0">
                  <Col>
                    <Form>
                      <Form.Group controlId="new_password_again">
                        <Form.Label className="my-0 mx-0 text-light">
                          Enter New Password Again
                        </Form.Label>
                        <Form.Control
                          type="password"
                          onChange={(e) => this.handleChange_Credentials(e)}
                        />
                      </Form.Group>
                    </Form>
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
          </Col>
          <Col md={6}>
            <Card className="my-4 mx-0" bg={'dark'} text={'white'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Notification
                </Card.Title>
              </Card.Header>
              <Card.Body>Comming soon</Card.Body>
            </Card>
          </Col>
        </Row>
        <Modal
          show={this.state.updatecredentialconfirmed}
          onHide={this.setmodalhideUpdateCredentials}
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

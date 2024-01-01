import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { updateCredentials, logout } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
function Settings(props) {
  const { t, i18n } = useTranslation();
  const [settingsState, setSettingsState] = useState({
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    user: {},
    changed_personaldata: false,
    personaldata: {
      firstname: props.user.firstname,
      firstname_chinese: props.user.firstname_chinese,
      lastname: props.user.lastname,
      lastname_chinese: props.user.lastname_chinese,
      birthday: props.user.birthday
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
  });

  useEffect(() => {
    setSettingsState({
      ...settingsState,
      isLoaded: true,
      success: true
    });
  }, []);

  const handleChange_Credentials = (e) => {
    var credentials_temp = { ...settingsState.credentials };
    credentials_temp[e.target.id] = e.target.value;
    setSettingsState({
      ...settingsState,
      credentials: credentials_temp
    });
  };

  const handleSubmit_Credentials = (e, credentials, email) => {
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
          setSettingsState({
            ...settingsState,
            isLoaded: true,
            success: success,
            updatecredentialconfirmed: true,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          setSettingsState({
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        const { statusText } = resp;
        setSettingsState({
          ...settingsState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        });
      }
    );
  };

  const onHideCredential = () => {
    setSettingsState({
      updatecredentialconfirmed: false
    });
  };

  const setmodalhide = () => {
    window.location.reload(true);
  };

  const setmodalhideUpdateCredentials = () => {
    logout().then(
      (resp) => {
        window.location.reload(true);
      },
      (error) => {
        setSettingsState({
          ...settingsState,
          isLoaded: true,
          error,
          res_status: 500
        });
      }
    );
  };

  const ConfirmError = () => {
    setSettingsState({
      ...settingsState,
      res_modal_status: 0,
      res_modal_message: ''
    });
  };

  const { res_status, isLoaded, res_modal_status, res_modal_message } =
    settingsState;
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
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <Row>
        <Col md={6}>
          <Card className="my-4 mx-0" bg={'dark'} text={'white'}>
            <Card.Header>
              <Card.Title className="my-0 mx-0 text-light">
                {t('Reset Login Password')}
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
                        onChange={(e) => handleChange_Credentials(e)}
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
                        {t('Enter New Password')}
                      </Form.Label>
                      <Form.Control
                        type="password"
                        onChange={(e) => handleChange_Credentials(e)}
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
                        {t('Enter New Password Again')}
                      </Form.Label>
                      <Form.Control
                        type="password"
                        onChange={(e) => handleChange_Credentials(e)}
                      />
                    </Form.Group>
                  </Form>
                  <br />
                  <Button
                    disabled={
                      settingsState.credentials.current_password === '' ||
                      settingsState.credentials.new_password === '' ||
                      settingsState.credentials.new_password_again === ''
                    }
                    variant="primary"
                    onClick={(e) =>
                      handleSubmit_Credentials(
                        e,
                        settingsState.credentials,
                        props.user.email
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
        show={settingsState.updatecredentialconfirmed}
        onHide={setmodalhideUpdateCredentials}
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
          <Button onClick={(e) => setmodalhideUpdateCredentials(e)}>Ok</Button>
        </Modal.Footer>
      </Modal>
    </Aux>
  );
}

export default Settings;

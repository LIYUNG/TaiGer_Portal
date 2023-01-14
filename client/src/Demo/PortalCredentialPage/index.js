import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Button, Card, Modal, Form } from 'react-bootstrap';
import 'react-datasheet-grid/dist/style.css';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { showButtonIfMyStudentB } from '../Utils/checking-functions';

import { getPortalCredentials, postPortalCredentials } from '../../api';

export default function PortalCredentialPage(props) {
  let [statedata, setStatedata] = useState({
    error: '',
    isLoaded: false,
    isUpdateLoaded: {},
    applications: [],
    analysis: {},
    confirmModalWindowOpen: false,
    success: false,
    student: null,
    credentials: {},
    isUpdating: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  useEffect(() => {
    const student_id = props.match.params.student_id
      ? props.match.params.student_id
      : props.user._id.toString();
    getPortalCredentials(student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let credentials_temp = {};
          let isUpdateLoaded_temp = {};
          if (data.applications) {
            for (let i = 0; i < data.applications.length; i += 1) {
              isUpdateLoaded_temp[
                data.applications[i].programId._id.toString()
              ] = true;
              credentials_temp[data.applications[i].programId._id.toString()] =
                {
                  account_portal_a: data.applications[i].portal_credentials
                    ? data.applications[i].portal_credentials
                        .application_portal_a.account
                    : '',
                  account_portal_b: data.applications[i].portal_credentials
                    ? data.applications[i].portal_credentials
                        .application_portal_b.account
                    : '',
                  password_portal_a: data.applications[i].portal_credentials
                    ? data.applications[i].portal_credentials
                        .application_portal_a.password
                    : '',
                  password_portal_b: data.applications[i].portal_credentials
                    ? data.applications[i].portal_credentials
                        .application_portal_b.password
                    : ''
                };
            }
          }

          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            applications: data.applications, // populated
            student: data.student, // populated
            credentials: credentials_temp,
            isUpdateLoaded: isUpdateLoaded_temp,
            success: success,
            res_status: status
          }));
        } else {
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          error: true
        }));
      }
    );
  }, []);

  const onChange = (e) => {
    e.persist();
    const event_id = e.target.id;
    const program_id = event_id.split('_')[0];
    if (event_id.includes('account')) {
      if (event_id.includes('application_portal_a')) {
        setStatedata((state) => ({
          ...state,
          credentials: {
            ...state.credentials,
            [program_id]: {
              ...state.credentials[program_id],
              account_portal_a: e.target.value
            }
          }
        }));
      }
      if (event_id.includes('application_portal_b')) {
        setStatedata((state) => ({
          ...state,
          credentials: {
            ...state.credentials,
            [program_id]: {
              ...state.credentials[program_id],
              account_portal_b: e.target.value
            }
          }
        }));
      }
    }
    if (event_id.includes('password')) {
      if (event_id.includes('application_portal_a')) {
        setStatedata((state) => ({
          ...state,
          credentials: {
            ...state.credentials,
            [program_id]: {
              ...state.credentials[program_id],
              password_portal_a: e.target.value
            }
          }
        }));
      }
      if (event_id.includes('application_portal_b')) {
        setStatedata((state) => ({
          ...state,
          credentials: {
            ...state.credentials,
            [program_id]: {
              ...state.credentials[program_id],
              password_portal_b: e.target.value
            }
          }
        }));
      }
    }
  };

  const onSubmit = (student_id, program_id, credentials) => {
    setStatedata((state) => ({
      ...state,
      isUpdateLoaded: { ...state.isUpdateLoaded, [program_id]: false }
    }));
    postPortalCredentials(student_id, program_id, credentials).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            confirmModalWindowOpen: true,
            isUpdateLoaded: { ...state.isUpdateLoaded, [program_id]: true },
            success: success,
            isUpdating: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            isUpdating: false,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          isUpdating: false
        }));
        alert('Course Update failed. Please try later.');
      }
    );
  };

  const ConfirmError = () => {
    setStatedata((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const closeModal = () => {
    setStatedata((state) => ({
      ...state,
      confirmModalWindowOpen: false
    }));
  };

  if (!statedata.isLoaded) {
    return (
      <div style={spinner_style}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      </div>
    );
  }

  if (statedata.res_status >= 400) {
    return <ErrorPage res_status={statedata.res_status} />;
  }

  return (
    <Aux>
      {statedata.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={statedata.res_modal_status}
          res_modal_message={statedata.res_modal_message}
        />
      )}
      <Row className="sticky-top ">
        <Col>
          <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
            <Card.Header text={'dark'}>
              <Card.Title>
                <Row>
                  <Col className="my-0 mx-0 text-light">
                    {statedata.student.firstname} {statedata.student.lastname}{' '}
                    Portal Credentials
                  </Col>
                </Row>
              </Card.Title>
            </Card.Header>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Card className="mb-2 mx-0">
            <Card.Body>
              <Row>
                <Col>
                  <p>
                    Please share your universities' application portals
                    credentials here if you want your agent(s) helping you
                    review your applications in universities' application
                    portals.
                  </p>
                  <p>
                    <b>If you don't want to share, </b>left it blank.
                  </p>
                </Col>
              </Row>
              {statedata.applications.map((application, i) => (
                <>
                  <hr></hr>
                  <div>
                    <a
                      href={`/programs/${application.programId._id.toString()}`}
                      target="_blank"
                    >
                      <b>
                        {application.programId.school}
                        {' - '}
                        {application.programId.program_name}
                      </b>
                    </a>{' '}
                    {showButtonIfMyStudentB(props.user, statedata.student) &&
                      (application.programId.application_portal_a ||
                        application.programId.application_portal_b) && (
                        <Button
                          size="sm"
                          onClick={(e) =>
                            onSubmit(
                              statedata.student._id.toString(),
                              application.programId._id.toString(),
                              statedata.credentials[
                                application.programId._id.toString()
                              ]
                            )
                          }
                          disabled={
                            !statedata.isUpdateLoaded[
                              application.programId._id.toString()
                            ]
                          }
                        >
                          {!statedata.isUpdateLoaded[
                            application.programId._id.toString()
                          ]
                            ? 'Updating'
                            : 'Update'}
                        </Button>
                      )}
                  </div>
                  {(application.programId.application_portal_a ||
                    application.programId.application_portal_b) && (
                    <>
                      <Row>
                        <Col md={4}>
                          <b>Account</b>
                        </Col>
                        <Col md={3}>
                          <b>Password</b>
                        </Col>
                        <Col md={5}>
                          <b>Link</b>
                        </Col>
                      </Row>
                      {application.programId.application_portal_a && (
                        <Row>
                          <Col md={4}>
                            <Form.Group
                              controlId={`${application.programId._id.toString()}_application_portal_a_account`}
                              className="my-0 mx-0"
                            >
                              <Form.Control
                                type="text"
                                placeholder="account"
                                onChange={(e) => onChange(e)}
                                defaultValue={
                                  statedata.credentials[
                                    application.programId._id.toString()
                                  ].account_portal_a
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group
                              controlId={`${application.programId._id.toString()}_application_portal_a_password`}
                              className="my-0 mx-0"
                            >
                              <Form.Control
                                type="text"
                                placeholder="password"
                                onChange={(e) => onChange(e)}
                                defaultValue={
                                  statedata.credentials[
                                    application.programId._id.toString()
                                  ].password_portal_a
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={5}>
                            <a
                              href={`${application.programId.application_portal_a}`}
                              target="_blank"
                            >
                              {application.programId.application_portal_a}
                            </a>
                          </Col>
                        </Row>
                      )}
                      {application.programId.application_portal_b && (
                        <Row>
                          <Col md={4}>
                            <Form.Group
                              controlId={`${application.programId._id.toString()}_application_portal_b_account`}
                              className="my-1 mx-0"
                            >
                              <Form.Control
                                type="text"
                                placeholder="account"
                                onChange={(e) => onChange(e)}
                                defaultValue={
                                  statedata.credentials[
                                    application.programId._id.toString()
                                  ].account_portal_b
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group
                              controlId={`${application.programId._id.toString()}_application_portal_b_password`}
                              className="my-1 mx-0"
                            >
                              <Form.Control
                                type="text"
                                placeholder="password"
                                onChange={(e) => onChange(e)}
                                defaultValue={
                                  statedata.credentials[
                                    application.programId._id.toString()
                                  ].password_portal_b
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={5}>
                            <a
                              href={`${application.programId.application_portal_b}`}
                              target="_blank"
                            >
                              {application.programId.application_portal_b}
                            </a>
                          </Col>
                        </Row>
                      )}
                    </>
                  )}
                </>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal
        show={statedata.confirmModalWindowOpen}
        onHide={closeModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Update portal credentials successfully</Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Aux>
  );
}

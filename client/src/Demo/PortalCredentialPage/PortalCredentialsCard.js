import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Button, Card, Modal, Form } from 'react-bootstrap';
import 'react-datasheet-grid/dist/style.css';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { getPortalCredentials, postPortalCredentials } from '../../api';
import Banner from '../../components/Banner/Banner';
import { TabTitle } from '../Utils/TabTitle';
import { Link, Redirect } from 'react-router-dom';
import { BsMessenger } from 'react-icons/bs';
import DEMO from '../../store/constant';

export default function PortalCredentialsCard(props) {
  let [statedata, setStatedata] = useState({
    error: '',
    isLoaded: false,
    isUpdateLoaded: {},
    isChanged: {},
    applications: [],
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
    getPortalCredentials(props.student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let credentials_temp = {};
          let isUpdateLoaded_temp = {};
          let isChanged_temp = {};
          if (data.applications) {
            for (const application of data.applications) {
              const programId = application.programId._id.toString();
              isUpdateLoaded_temp[programId] = true;
              isChanged_temp[programId] = false;
              const portalCredentials = application.portal_credentials;
              credentials_temp[programId] = {
                account_portal_a: portalCredentials
                  ? portalCredentials.application_portal_a.account
                  : '',
                account_portal_b: portalCredentials
                  ? portalCredentials.application_portal_b.account
                  : '',
                password_portal_a: portalCredentials
                  ? portalCredentials.application_portal_a.password
                  : '',
                password_portal_b: portalCredentials
                  ? portalCredentials.application_portal_b.password
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
          error,
          res_status: 500
        }));
      }
    );
  }, [props.student_id]);

  const onChange = (e) => {
    e.persist();
    const event_id = e.target.id;
    const program_id = event_id.split('_')[0];
    if (event_id.includes('account')) {
      if (event_id.includes('application_portal_a')) {
        setStatedata((state) => ({
          ...state,
          isChanged: { ...state.isChanged, [program_id]: true },
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
          isChanged: { ...state.isChanged, [program_id]: true },
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
          isChanged: { ...state.isChanged, [program_id]: true },
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
          isChanged: { ...state.isChanged, [program_id]: true },
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
            isChanged: { ...state.isChanged, [program_id]: false },
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
        const { statusText } = resp;
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          isUpdating: false,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
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

  TabTitle(
    `Student ${statedata.student?.firstname} ${statedata.student?.lastname} || Portal Credentials`
  );

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
      {!props.showTitle && (
        <Row className="sticky-top ">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0 text-light">
                      <Link
                        className="text-warning"
                        to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                          statedata.student._id.toString(),
                          DEMO.PROFILE
                        )}`}
                      >
                        {statedata.student.firstname}{' '}
                        {statedata.student.lastname}{' '}
                      </Link>
                      Portal Credentials
                      <Link
                        to={`${DEMO.COMMUNICATIONS_LINK(
                          statedata.student._id.toString()
                        )}`}
                        className="ms-3 my-0"
                      >
                        <Button size="sm" className="my-0">
                          <BsMessenger color="white" size={16} /> <b>Message</b>
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Col sm={12}>
          <Card className="mb-2 mx-0">
            <Card.Body>
              <Row>
                <Col>
                  <p>
                    請到下列各學校網站 [<b>Link</b>]{' '}
                    申請該校的申請平台帳號密碼，並在此頁面提供帳號密碼，方便日後Agent為您登入檢查上傳文件正確性。若有
                    [<b>Instructions</b>]{' '}
                    連結，請點入連結，依照裡面教學完成。填完帳號密碼，請務必點擊{' '}
                    <Button size="sm">Update</Button>儲存。
                  </p>
                  <p>
                    Please share your universities' application portals
                    credentials here. Your agent(s) can help you review your
                    applications in universities' application portals, when you
                    are blocked.
                  </p>
                </Col>
              </Row>
              {statedata.applications.map((application, i) => (
                <>
                  {application.decided === 'O' && (
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
                        {(application.programId.application_portal_a ||
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
                              ] ||
                              !statedata.isChanged[
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
                          {((application.programId.application_portal_a &&
                            (!statedata.credentials[
                              application.programId._id.toString()
                            ].account_portal_a ||
                              !statedata.credentials[
                                application.programId._id.toString()
                              ].password_portal_a)) ||
                            (application.programId.application_portal_b &&
                              (!statedata.credentials[
                                application.programId._id.toString()
                              ].account_portal_b ||
                                !statedata.credentials[
                                  application.programId._id.toString()
                                ].password_portal_b))) && (
                            <div>
                              <Banner
                                ReadOnlyMode={true}
                                bg={'danger'}
                                title={'Warning:'}
                                path={'/'}
                                text={
                                  'Please register and provide credentials here:'
                                }
                                link_name={''}
                                // removeBanner={this.removeBanner}
                                notification_key={'x'}
                              ></Banner>
                            </div>
                          )}

                          <Row>
                            <Col md={3}>
                              <b>Account</b>
                            </Col>
                            <Col md={3}>
                              <b>Password</b>
                            </Col>
                            <Col md={3}>
                              <b>Link</b>
                            </Col>
                            <Col md={3}>
                              <b>Instructions</b>
                            </Col>
                          </Row>
                          {application.programId.application_portal_a && (
                            <Row>
                              <Col md={3}>
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
                              <Col md={3}>
                                <a
                                  href={`${application.programId.application_portal_a}`}
                                  target="_blank"
                                >
                                  {application.programId.application_portal_a}
                                </a>
                              </Col>
                              <Col md={3}>
                                <a
                                  href={`${application.programId.application_portal_a_instructions}`}
                                  target="_blank"
                                >
                                  {
                                    application.programId
                                      .application_portal_a_instructions
                                  }
                                </a>
                              </Col>
                            </Row>
                          )}
                          {application.programId.application_portal_b && (
                            <Row>
                              <Col md={3}>
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
                              <Col md={3}>
                                <a
                                  href={`${application.programId.application_portal_b}`}
                                  target="_blank"
                                >
                                  {application.programId.application_portal_b}
                                </a>
                              </Col>
                              <Col md={3}>
                                <a
                                  href={`${application.programId.application_portal_b_instructions}`}
                                  target="_blank"
                                >
                                  {
                                    application.programId
                                      .application_portal_b_instructions
                                  }
                                </a>
                              </Col>
                            </Row>
                          )}
                        </>
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

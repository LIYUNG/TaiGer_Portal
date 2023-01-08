import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Button, Card, Modal, Form } from 'react-bootstrap';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';

import Aux from '../../hoc/_Aux';
import { convertDate, spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { showButtonIfMyStudentB } from '../Utils/checking-functions';
import 'react-datasheet-grid/dist/style.css';

import { getPortalCredentials, postMycourses } from '../../api';

export default function PortalCredentialPage(props) {
  let [statedata, setStatedata] = useState({
    error: null,
    isLoaded: false,
    coursesdata: {},
    applications: [],
    analysis: {},
    confirmModalWindowOpen: false,
    analysisSuccessModalWindowOpen: false,
    success: false,
    student: null,
    isUpdating: false,
    isDownloading: false,
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
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            applications: data.applications, // populated
            student: data.student, // populated
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

  const onChange = (new_data) => {
    setStatedata((state) => ({
      ...state,
      coursesdata: new_data
    }));
  };

  const onSubmit = () => {
    const coursesdata_string = JSON.stringify(statedata.coursesdata);
    setStatedata((state) => ({
      ...state,
      isUpdating: true
    }));
    postMycourses(statedata.student._id.toString(), {
      student_id: statedata.student._id.toString(),
      name: statedata.student.firstname,
      table_data_string: coursesdata_string
    }).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const course_from_database = JSON.parse(data.table_data_string);
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            updatedAt: data.updatedAt,
            coursesdata: course_from_database,
            confirmModalWindowOpen: true,
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

  const closeanalysisSuccessModal = () => {
    setStatedata((state) => ({
      ...state,
      analysisSuccessModalWindowOpen: false
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
                    Please share your portal credentials here if you want your
                    agents helping you to review your application in
                    universities' application portals.
                  </p>
                  <p>
                    <b>If you don't want to share, </b>left it blank.
                  </p>
                </Col>
              </Row>
              <br />
              {statedata.applications.map((application, i) => (
                <>
                  <h5>
                    <b>
                      {application.programId.school}
                      {'-'}
                      {application.programId.program_name}
                    </b>
                  </h5>
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
                          <Col md={4}>account_a</Col>
                          <Col md={3}>password_a</Col>
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
                          <Col md={4}>account_b</Col>
                          <Col md={3}>password_b</Col>
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
              <Row className="my-2">
                <Col>Last update at: {convertDate(statedata.updatedAt)}</Col>
              </Row>
              <Row className="mx-1">
                {showButtonIfMyStudentB(props.user, statedata.student) && (
                  <Button onClick={onSubmit} disabled={statedata.isUpdating}>
                    {statedata.isUpdating ? 'Updating' : 'Update'}
                  </Button>
                )}
              </Row>
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
        <Modal.Body>Update transcript successfully</Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={statedata.analysisSuccessModalWindowOpen}
        onHide={closeanalysisSuccessModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Transcript analysed successfully!</Modal.Body>
        <Modal.Footer>
          <Button onClick={closeanalysisSuccessModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Aux>
  );
}

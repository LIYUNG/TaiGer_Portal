import React from 'react';
import {
  Row,
  Col,
  Spinner,
  Table,
  Card,
  Modal,
  Button,
  Tab,
  Tabs
} from 'react-bootstrap';

import CVMLRLProgress from '../Dashboard/MainViewTab/CVMLRLProgress/CVMLRLProgress';
import CVMLRLProgressClosed from '../Dashboard/MainViewTab/CVMLRLProgress/CVMLRLProgressClosed';
import { spinner_style } from '../Utils/contants';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { getCVMLRLOverview, SetFileAsFinal, getStudents } from '../../api';

class CVMLRLOverview extends React.Component {
  state = {
    error: '',
    isLoaded: this.props.isLoaded,
    data: null,
    success: this.props.success,
    students: this.props.students,
    doc_thread_id: '',
    student_id: '',
    program_id: '',
    SetAsFinalFileModel: false,
    isFinalVersion: false,
    status: '', //reject, accept... etc
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  closeSetAsFinalFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      SetAsFinalFileModel: false
    }));
  };
  ConfirmSetAsFinalFileHandler = () => {
    this.setState((state) => ({
      ...state,
      isLoaded: false // false to reload everything
    }));
    SetFileAsFinal(
      this.state.doc_thread_id,
      this.state.student_id,
      this.state.program_id
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let temp_students = [...this.state.students];
          let student_temp_idx = temp_students.findIndex(
            (student) => student._id.toString() === this.state.student_id
          );
          if (this.state.program_id) {
            let application_idx = temp_students[
              student_temp_idx
            ].applications.findIndex(
              (application) =>
                application.programId._id.toString() === this.state.program_id
            );

            let thread_idx = temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread.findIndex(
              (thread) =>
                thread.doc_thread_id._id.toString() === this.state.doc_thread_id
            );

            temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread[thread_idx].isFinalVersion =
              data.isFinalVersion;

            temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread[thread_idx].updatedAt = data.updatedAt;
            temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread[thread_idx].doc_thread_id.updatedAt =
              data.updatedAt;
          } else {
            let general_doc_idx = temp_students[
              student_temp_idx
            ].generaldocs_threads.findIndex(
              (thread) =>
                thread.doc_thread_id._id.toString() === this.state.doc_thread_id
            );
            temp_students[student_temp_idx].generaldocs_threads[
              general_doc_idx
            ].isFinalVersion = data.isFinalVersion;

            temp_students[student_temp_idx].generaldocs_threads[
              general_doc_idx
            ].updatedAt = data.updatedAt;

            temp_students[student_temp_idx].generaldocs_threads[
              general_doc_idx
            ].doc_thread_id.updatedAt = data.updatedAt;
          }

          this.setState((state) => ({
            ...state,
            docName: '',
            isLoaded: true,
            students: temp_students,
            success: success,
            SetAsFinalFileModel: false,
            isFinalVersion: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        this.setState({ error });
      }
    );
  };

  handleAsFinalFile = (
    doc_thread_id,
    student_id,
    program_id,
    docName,
    isFinalVersion
  ) => {
    this.setState((state) => ({
      ...state,
      doc_thread_id,
      student_id,
      program_id,
      docName,
      SetAsFinalFileModel: true,
      isFinalVersion
    }));
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    const { res_modal_status, res_modal_message, isLoaded } = this.state;

    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };

    if (!isLoaded && !this.state.students) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    const cvmlrl_progress = this.state.students.map((student, i) => (
      <CVMLRLProgress
        key={i}
        role={this.props.user.role}
        user={this.props.user}
        student={student}
        isDashboard={true}
        handleAsFinalFile={this.handleAsFinalFile}
      />
    ));
    const cvmlrl_progress_closed = this.state.students.map((student, i) => (
      <CVMLRLProgressClosed
        key={i}
        role={this.props.user.role}
        user={this.props.user}
        student={student}
        isDashboard={true}
        handleAsFinalFile={this.handleAsFinalFile}
      />
    ));
    return (
      <>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <Row>
          <Col>
            <Tabs defaultActiveKey="open" fill={true} justify={true}>
              <Tab eventKey="open" title="Open">
                <Table
                  responsive
                  bordered
                  hover
                  className="my-0 mx-0"
                  variant="dark"
                  text="light"
                  size="sm"
                >
                  <thead>
                    <tr>
                      <>
                        <th></th>
                        <th>First-, Last Name</th>
                        {(this.props.user.role === 'Admin' ||
                          this.props.user.role === 'Editor' ||
                          this.props.user.role === 'Agent') && <th>Action</th>}
                      </>
                      {window.cvmlrllist.map((doc, index) => (
                        <th key={index}>{doc.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{cvmlrl_progress}</tbody>
                </Table>
              </Tab>
              <Tab eventKey="closed" title="Closed">
                <Table
                  responsive
                  bordered
                  hover
                  className="my-0 mx-0"
                  variant="dark"
                  text="light"
                  size="sm"
                >
                  <thead>
                    <tr>
                      <th></th>
                      <th>First-, Last Name</th>
                      {(this.props.user.role === 'Admin' ||
                        this.props.user.role === 'Editor' ||
                        this.props.user.role === 'Agent') && <th>Action</th>}

                      {window.cvmlrlclosedlist.map((doc, index) => (
                        <th key={index}>{doc.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{cvmlrl_progress_closed}</tbody>
                </Table>
                <Row className="mt-4">
                  <p>
                    Note: if the documents are not closed but locate here, it is
                    becaue the applications are already submitted. The documents
                    can safely closed eventually.
                  </p>
                </Row>
              </Tab>
            </Tabs>
          </Col>
        </Row>
        <Modal
          show={this.state.SetAsFinalFileModel}
          onHide={this.closeSetAsFinalFileModelWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to set {this.state.docName} as{' '}
            {this.state.isFinalVersion ? 'open' : 'final'} for student?
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!isLoaded}
              onClick={this.ConfirmSetAsFinalFileHandler}
            >
              Yes
            </Button>

            <Button onClick={this.closeSetAsFinalFileModelWindow}>No</Button>
            {!isLoaded && (
              <div style={spinner_style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default CVMLRLOverview;

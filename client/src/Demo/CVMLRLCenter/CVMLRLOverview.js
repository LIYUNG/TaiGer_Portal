import React from 'react';
import { Row, Col, Spinner, Modal, Button, Tab, Tabs } from 'react-bootstrap';

import {
  spinner_style,
  is_new_message_status,
  is_pending_status,
  cvmlrl_overview_header,
  cvmlrl_overview_closed_header
} from '../Utils/contants';
import { open_tasks } from '../Utils/checking-functions';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { SetFileAsFinal } from '../../api';
import Banner from '../../components/Banner/Banner';
import SortTable from '../../components/SortTable/SortTable';

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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.students !== this.props.students) {
      this.setState((state) => ({
        ...state,
        students: this.props.students
      }));
    }
  }

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

    const open_tasks_arr = open_tasks(this.state.students);
    const cvmlrl_new_message_v2 = open_tasks_arr.filter(
      (open_task) =>
        open_task.show &&
        !open_task.isFinalVersion &&
        is_new_message_status(this.props.user, open_task)
    );
    const cvmlrl_followup_v2 = open_tasks_arr.filter(
      (open_task) =>
        open_task.show &&
        !open_task.isFinalVersion &&
        is_pending_status(this.props.user, open_task) &&
        open_task.latest_message_left_by_id !== ''
    );
    const cvmlrl_pending_progress_v2 = open_tasks_arr.filter(
      (open_task) =>
        open_task.show &&
        !open_task.isFinalVersion &&
        is_pending_status(this.props.user, open_task) &&
        open_task.latest_message_left_by_id === ''
    );
    const cvmlrl_closed_v2 = open_tasks_arr.filter(
      (open_task) => open_task.show && open_task.isFinalVersion
    );
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
                <Banner
                  ReadOnlyMode={true}
                  bg={'danger'}
                  title={'Warning:'}
                  path={'/'}
                  text={'Please reply:'}
                  link_name={''}
                  removeBanner={this.removeBanner}
                  notification_key={'x'}
                />
                <SortTable
                  columns={cvmlrl_overview_header}
                  data={cvmlrl_new_message_v2}
                  user={this.props.user}
                  handleAsFinalFile={this.handleAsFinalFile}
                />
                <Banner
                  ReadOnlyMode={true}
                  bg={'primary'}
                  title={'Attention:'}
                  path={'/'}
                  text={'Follow up'}
                  link_name={''}
                  removeBanner={this.removeBanner}
                  notification_key={'x'}
                />
                <SortTable
                  columns={cvmlrl_overview_header}
                  data={cvmlrl_followup_v2}
                  user={this.props.user}
                  handleAsFinalFile={this.handleAsFinalFile}
                />
                <Banner
                  ReadOnlyMode={true}
                  bg={'info'}
                  title={'Info:'}
                  path={'/'}
                  text={'Waiting inputs. No action needed'}
                  link_name={''}
                  removeBanner={this.removeBanner}
                  notification_key={'x'}
                />
                <SortTable
                  columns={cvmlrl_overview_header}
                  data={cvmlrl_pending_progress_v2}
                  user={this.props.user}
                  handleAsFinalFile={this.handleAsFinalFile}
                />
              </Tab>
              <Tab eventKey="closed" title="Closed">
                <Banner
                  ReadOnlyMode={true}
                  bg={'success'}
                  title={'Closed'}
                  path={'/'}
                  text={''}
                  link_name={''}
                  removeBanner={this.removeBanner}
                  notification_key={'x'}
                />
                <SortTable
                  columns={cvmlrl_overview_closed_header}
                  data={cvmlrl_closed_v2}
                  user={this.props.user}
                  handleAsFinalFile={this.handleAsFinalFile}
                />
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

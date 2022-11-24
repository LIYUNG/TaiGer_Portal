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
import Aux from '../../hoc/_Aux';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import CVMLRLProgress from '../Dashboard/MainViewTab/CVMLRLProgress/CVMLRLProgress';
import CVMLRLProgressClosed from '../Dashboard/MainViewTab/CVMLRLProgress/CVMLRLProgressClosed';

import { updateArchivStudents, SetFileAsFinal, getStudents } from '../../api';

class CVMLRLOverview extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    doc_thread_id: '',
    student_id: '',
    program_id: '',
    SetAsFinalFileModel: false,
    status: '' //reject, accept... etc
  };

  componentDidMount() {
    getStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
            success: success
          });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
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
        let temp_students = [...this.state.students];
        let student_idx = this.state.students.findIndex(
          (student) => student._id.toString() === data._id.toString()
        );
        temp_students[student_idx] = data;
        if (success) {
          this.setState((state) => ({
            ...state,
            docName: '',
            isLoaded: true,
            students: temp_students,
            success: success,
            SetAsFinalFileModel: false
          }));
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
        }
      },
      (error) => {
        this.setState({ error });
      }
    );
  };

  handleAsFinalFile = (doc_thread_id, student_id, program_id, docName) => {
    this.setState((state) => ({
      ...state,
      doc_thread_id,
      student_id,
      program_id,
      docName,
      SetAsFinalFileModel: true
    }));
  };
  render() {
    const { unauthorizederror, timeouterror, isLoaded } = this.state;

    if (timeouterror) {
      return (
        <div>
          <TimeOutErrors />
        </div>
      );
    }
    if (unauthorizederror) {
      return (
        <div>
          <UnauthorizedError />
        </div>
      );
    }

    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };

    if (!isLoaded && !this.state.students) {
      return (
        <div style={style}>
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
      <Aux>
        <Row className="sticky-top">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  CV ML RL Overview
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
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
            Do you want to set {this.state.docName} as final for student?
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
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Footer>
        </Modal>
      </Aux>
    );
  }
}

export default CVMLRLOverview;

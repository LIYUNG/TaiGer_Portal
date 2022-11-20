import React from 'react';
import { Row, Col, Spinner, Table, Card, Tabs, Tab } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import ApplicationProgress from '../Dashboard/MainViewTab/ApplicationProgress/ApplicationProgress';
import ApplicationFilesProgress from '../Dashboard/MainViewTab/ApplicationProgress/ApplicationFilesProgress';
import { Redirect } from 'react-router-dom';

import { updateArchivStudents, getStudents } from '../../api';
import { isProgramNotSelectedEnough } from '../Utils/checking-functions';
class ApplicantSOverview extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    file: '',
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

  updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            students: data,
            success: success
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
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  };
  render() {
    if (
      this.props.user.role !== 'Admin' &&
      this.props.user.role !== 'Editor' &&
      this.props.user.role !== 'Agent' &&
      this.props.user.role !== 'Student'
    ) {
      return <Redirect to="/dashboard/default" />;
    }
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

    const listStudentProgramNotSelected = this.state.students.map(
      (student, i) => (
        <div key={i}>
          {student.applications &&
            student.applications.length < student.applying_program_count && (
              <li className="text-light">
                {student.firstname} {student.lastname}
              </li>
            )}
        </div>
      )
    );

    const application_progress = this.state.students.map((student, i) => (
      <ApplicationProgress
        key={i}
        role={this.props.user.role}
        student={student}
        updateStudentArchivStatus={this.updateStudentArchivStatus}
        isDashboard={true}
      />
    ));

    const application_documents_overview = this.state.students.map(
      (student, i) => (
        <ApplicationFilesProgress
          key={i}
          role={this.props.user.role}
          student={student}
          updateStudentArchivStatus={this.updateStudentArchivStatus}
          isDashboard={true}
        />
      )
    );

    return (
      <Aux>
        <Row className="sticky-top">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Students Applications Overview
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Tabs>
          <Tab
            eventKey="application_status"
            title="Application Progress Overview"
          >
            {' '}
            {isProgramNotSelectedEnough(this.state.students) && (
              <Row>
                <Col>
                  <Card className="mb-2 mx-0" bg={'danger'} text={'light'}>
                    <Card.Body>
                      <p className="text-light">
                        The following students did not choose enough programs:
                      </p>
                      {listStudentProgramNotSelected}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <Table
                  responsive
                  bordered
                  hover
                  className="my-0 mx-0"
                  variant="dark"
                  text="light"
                >
                  <thead>
                    <tr>
                      <th></th>
                      {this.props.user.role === 'Student' ||
                      this.props.user.role === 'Guest' ? (
                        <></>
                      ) : (
                        <>
                          <th>First-, Last Name</th>
                          <th
                            title={
                              'Number of applications student should submit'
                            }
                          >
                            #
                          </th>
                        </>
                      )}
                      {window.programstatuslist.map((doc, index) => (
                        <th key={index}>{doc.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{application_progress}</tbody>
                </Table>
              </Col>
            </Row>
          </Tab>
          <Tab
            eventKey="application_documents_overview"
            title="Application Document Overview"
          >
            {' '}
            <Row>
              <Col>
                <Table
                  responsive
                  bordered
                  hover
                  className="my-0 mx-0"
                  variant="dark"
                  text="light"
                >
                  <thead>
                    <tr>
                      {this.props.user.role === 'Student' ||
                      this.props.user.role === 'Guest' ? (
                        <></>
                      ) : (
                        <th>First-, Last Name</th>
                      )}

                      <th>University</th>
                      <th>Programs</th>
                      <th>Deadline</th>
                      {window.programs_files_checklist.map((doc, index) => (
                        <th key={index}>{doc.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{application_documents_overview}</tbody>
                </Table>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Aux>
    );
  }
}

export default ApplicantSOverview;

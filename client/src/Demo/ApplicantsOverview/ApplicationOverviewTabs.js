import React from 'react';
import { Row, Col, Spinner, Table, Card, Tabs, Tab } from 'react-bootstrap';

import ApplicationProgress from '../Dashboard/MainViewTab/ApplicationProgress/ApplicationProgress';
import ApplicationFilesProgress from '../Dashboard/MainViewTab/ApplicationProgress/ApplicationFilesProgress';
import {
  isProgramNotSelectedEnough,
  is_TaiGer_role
} from '../Utils/checking-functions';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { updateArchivStudents, getStudents } from '../../api';

class ApplicationOverviewTabs extends React.Component {
  state = {
    error: '',
    isLoaded: this.props.isLoaded,
    data: null,
    success: this.props.success,
    students: this.props.students,
    status: '', //reject, accept... etc
    res_status: 0
  };

  updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          }));
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
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
  render() {
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.students) {
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
        user={this.props.user}
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
      <>
        <Tabs fill={true} justify={true}>
          <Tab
            eventKey="application_status"
            title="Application Progress Overview"
          >
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
                  size="sm"
                >
                  <thead>
                    <tr>
                      <th></th>
                      {is_TaiGer_role(this.props.user) && (
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
            <Row>
              <Col>
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
                      {is_TaiGer_role(this.props.user) && (
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
      </>
    );
  }
}

export default ApplicationOverviewTabs;

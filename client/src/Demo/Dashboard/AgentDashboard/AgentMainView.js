import React from 'react';
import { Row, Col, Table, Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsExclamationTriangle, BsX } from 'react-icons/bs';

import TabStudBackgroundDashboard from '../MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import AgentReviewing from '../MainViewTab/AgentReview/AgentReviewing';
import AgentTasks from '../MainViewTab/AgentTasks/index';
import TabProgramConflict from '../MainViewTab/ProgramConflict/TabProgramConflict';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';

import { updateAgentBanner } from '../../../api';

class AgentMainView extends React.Component {
  state = {
    user: this.props.user
  };

  checkMissingBaseDocument = (students) => {
    for (let stud_idx = 0; stud_idx < students.length; stud_idx += 1) {
      let student = students[stud_idx];
      let keys = Object.keys(window.profile_list);
      let object_init = {};
      for (let i = 0; i < keys.length; i++) {
        object_init[keys[i]] = 'missing';
      }

      if (student.profile) {
        for (let i = 0; i < student.profile.length; i++) {
          if (student.profile[i].status === 'uploaded') {
            object_init[student.profile[i].name] = 'uploaded';
          } else if (student.profile[i].status === 'accepted') {
            object_init[student.profile[i].name] = 'accepted';
          } else if (student.profile[i].status === 'rejected') {
            object_init[student.profile[i].name] = 'rejected';
          } else if (student.profile[i].status === 'missing') {
            object_init[student.profile[i].name] = 'missing';
          } else if (student.profile[i].status === 'notneeded') {
            object_init[student.profile[i].name] = 'notneeded';
          }
        }
      } else {
      }
      for (let i = 0; i < keys.length; i += 1) {
        if (object_init[keys[i]] === 'uploaded') {
          return true;
        }
      }
    }
    return false;
  };

  removeAgentBanner = (e, notification_key, student_id) => {
    e.preventDefault();
    const temp_user = { ...this.state.user };
    console.log(temp_user);
    const idx = temp_user.agent_notification[`${notification_key}`].findIndex(
      (student_obj) => student_obj.student_id === student_id
    );
    temp_user.agent_notification[`${notification_key}`].splice(idx, 1);

    this.setState({
      user: temp_user
    });

    updateAgentBanner(notification_key, student_id).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            success: success,
            isLoaded: true,
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
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  };
  render() {
    const students_agent_editor = this.props.students.map((student, i) => (
      <StudentsAgentEditor
        key={i}
        role={this.props.role}
        student={student}
        documentslist={this.props.documentslist}
      />
    ));

    const agent_reviewing = this.props.students.map((student, i) => (
      <AgentReviewing key={i} role={this.props.role} student={student} />
    ));

    const agent_tasks = this.props.students.map((student, i) => (
      <AgentTasks key={i} role={this.props.role} student={student} />
    ));
    return (
      <>
        {this.state.user.agent_notification &&
          this.state.user.agent_notification.isRead_new_base_docs_uploaded.map(
            (student) => (
              <Row>
                <Col>
                  <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                    <p
                      className="text-light my-3 mx-3"
                      style={{ textAlign: 'left' }}
                    >
                      <BsExclamationTriangle size={18} />
                      <b className="mx-2">Reminder:</b> There are new base
                      documents uploaded by{' '}
                      <b>
                        {student.student_firstname} {student.student_lastname}
                      </b>{' '}
                      <Link
                        to={`/student-database/${student.student_id}/profile`}
                        style={{ textDecoration: 'none' }}
                        className="text-info"
                      >
                        Base Document
                      </Link>{' '}
                      <span style={{ float: 'right', cursor: 'pointer' }}>
                        <BsX
                          size={18}
                          onClick={(e) =>
                            this.removeAgentBanner(
                              e,
                              'isRead_new_base_docs_uploaded',
                              student.student_id
                            )
                          }
                        />
                      </span>
                    </p>
                  </Card>
                </Col>
              </Row>
            )
          )}
        <Row>
          <Col>
            <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  <BsExclamationTriangle size={18} /> To Do Tasks:
                </Card.Title>
              </Card.Header>
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
                    <th>Tasks</th>
                    <th>Description</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>{agent_tasks}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Agent Reviewing
                </Card.Title>
              </Card.Header>
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
                    <th>First-/Lastname</th>
                    <th>Survey</th>
                    <th>Language</th>
                    <th>Base Documents</th>
                    <th>CV</th>
                    <th>Uni-Assist</th>
                    <th>Program Selection</th>
                    <th>Applications</th>
                  </tr>
                </thead>
                <tbody>{agent_reviewing}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <TabProgramConflict students={this.props.students} />
        <Row>
          <Col sm={12}>
            <Tabs
              defaultActiveKey="w"
              id="uncontrolled-tab-example"
              fill={true}
              justify={true}
            >
              <Tab
                eventKey="w"
                title="Student Background Overview"
                className="my-0 mx-0"
              >
                <TabStudBackgroundDashboard
                  role={this.props.role}
                  students={this.props.students}
                  startEditingProgram={this.props.startEditingProgram}
                  SYMBOL_EXPLANATION={this.props.SYMBOL_EXPLANATION}
                  updateStudentArchivStatus={
                    this.props.updateStudentArchivStatus
                  }
                  isDashboard={this.props.isDashboard}
                />
              </Tab>
              <Tab eventKey="dz" title="Agents and Editors">
                <Table
                  responsive
                  className="my-0 mx-0"
                  variant="dark"
                  text="light"
                  size="sm"
                >
                  <thead>
                    <tr>
                      <th>First-, Last Name</th>
                      <th>Agents</th>
                      <th>Editors</th>
                    </tr>
                  </thead>
                  <tbody>{students_agent_editor}</tbody>
                </Table>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </>
    );
  }
}

export default AgentMainView;

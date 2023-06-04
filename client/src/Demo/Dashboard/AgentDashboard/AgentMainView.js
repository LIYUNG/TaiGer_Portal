import React from 'react';
import { Row, Col, Table, Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsExclamationTriangle, BsX } from 'react-icons/bs';

import TabStudBackgroundDashboard from '../MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import AgentReviewing from '../MainViewTab/AgentReview/AgentReviewing';
import AgentTasks from '../MainViewTab/AgentTasks/index';
import ReadyToSubmitTasks from '../MainViewTab/AgentTasks/ReadyToSubmitTasks';
import VPDToSubmitTasks from '../MainViewTab/AgentTasks/VPDToSubmitTasks';
import BaseDocumentCheckingTasks from '../MainViewTab/AgentTasks/BaseDocumentCheckingTasks';

import TabProgramConflict from '../MainViewTab/ProgramConflict/TabProgramConflict';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';

import { updateAgentBanner } from '../../../api';
import { profile_list } from '../../Utils/contants';
import {
  is_any_base_documents_uploaded,
  is_any_programs_ready_to_submit,
  is_any_vpd_missing
} from '../../Utils/checking-functions';

class AgentMainView extends React.Component {
  state = {
    error: '',
    user: this.props.user
  };

  checkMissingBaseDocument = (students) => {
    for (let stud_idx = 0; stud_idx < students.length; stud_idx += 1) {
      let student = students[stud_idx];
      let keys = Object.keys(profile_list);
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
            res_status: status
          }));
        } else {
          this.setState({
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          error,
          res_status: 500
        }));
      }
    );
  };
  render() {
    const students_agent_editor = this.props.students.map((student, i) => (
      <StudentsAgentEditor
        key={i}
        user={this.props.user}
        role={this.props.role}
        student={student}
        documentslist={this.props.documentslist}
        editAgent={this.props.editAgent}
        agent_list={this.props.agent_list}
        updateAgentList={this.props.updateAgentList}
        handleChangeAgentlist={this.props.handleChangeAgentlist}
        submitUpdateAgentlist={this.props.submitUpdateAgentlist}
      />
    ));

    const agent_reviewing = this.props.students
      .filter((student) =>
        student.agents.some(
          (agent) => agent._id === this.props.user._id.toString()
        )
      )
      .map((student, i) => (
        <AgentReviewing key={i} role={this.props.role} student={student} />
      ));

    const ready_to_submit_tasks = this.props.students
      .filter((student) =>
        student.agents.some(
          (agent) => agent._id === this.props.user._id.toString()
        )
      )
      .map((student, i) => (
        <ReadyToSubmitTasks key={i} role={this.props.role} student={student} />
      ));

    const vpd_to_submit_tasks = this.props.students
      .filter((student) =>
        student.agents.some(
          (agent) => agent._id === this.props.user._id.toString()
        )
      )
      .map((student, i) => (
        <VPDToSubmitTasks key={i} role={this.props.role} student={student} />
      ));
    const base_documents_checking_tasks = this.props.students
      .filter((student) =>
        student.agents.some(
          (agent) => agent._id === this.props.user._id.toString()
        )
      )
      .map((student, i) => (
        <BaseDocumentCheckingTasks
          key={i}
          role={this.props.role}
          student={student}
        />
      ));
    const agent_tasks = this.props.students
      .filter((student) =>
        student.agents.some(
          (agent) => agent._id === this.props.user._id.toString()
        )
      )
      .map((student, i) => (
        <AgentTasks key={i} role={this.props.role} student={student} />
      ));
    return (
      <>
        {this.state.user.agent_notification &&
          this.state.user.agent_notification.isRead_new_base_docs_uploaded.map(
            (student, i) => (
              <Row key={i}>
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
          {is_any_programs_ready_to_submit(
            this.props.students.filter((student) =>
              student.agents.some(
                (agent) => agent._id === this.props.user._id.toString()
              )
            )
          ) && (
            <Col md={6}>
              <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                <Card.Header>
                  <Card.Title className="my-0 mx-0 text-light">
                    <BsExclamationTriangle size={18} /> Ready To Submit Tasks (
                    ML/ RL/ Essay are finished. Please submit application
                    asap.):
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
                      <th>Student</th>
                      <th>Deadline</th>
                      <th>Semester - Degree - Program</th>
                    </tr>
                  </thead>
                  <tbody>{ready_to_submit_tasks}</tbody>
                </Table>
              </Card>
            </Col>
          )}
          {is_any_vpd_missing(
            this.props.students.filter((student) =>
              student.agents.some(
                (agent) => agent._id === this.props.user._id.toString()
              )
            )
          ) && (
            <Col md={6}>
              <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                <Card.Header>
                  <Card.Title className="my-0 mx-0 text-light">
                    <BsExclamationTriangle size={18} /> VPD missing:
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
                      <th>Student</th>
                      <th>Deadline</th>
                      <th>Program</th>
                    </tr>
                  </thead>
                  <tbody>{vpd_to_submit_tasks}</tbody>
                </Table>
              </Card>
            </Col>
          )}

          {is_any_base_documents_uploaded(
            this.props.students.filter((student) =>
              student.agents.some(
                (agent) => agent._id === this.props.user._id.toString()
              )
            )
          ) && (
            <Col md={6}>
              <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                <Card.Header>
                  <Card.Title className="my-0 mx-0 text-light">
                    <BsExclamationTriangle size={18} /> Check uploaded base
                    documents:
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
                      <th>Student</th>
                      <th>Base Document</th>
                      <th>Upload Time</th>
                    </tr>
                  </thead>
                  <tbody>{base_documents_checking_tasks}</tbody>
                </Table>
              </Card>
            </Col>
          )}
          <Col md={6}>
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
                className="px-0 my-0 mx-0"
                variant="dark"
                text="light"
                size="sm"
              >
                <thead>
                  <tr>
                    <th>First-/Lastname,Birthday,Target</th>
                    <th>Survey</th>
                    <th>Language</th>
                    <th>Base Documents</th>
                    <th>CV</th>
                    <th>Portals</th>
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
        <TabProgramConflict
          students={this.props.students.filter((student) =>
            student.agents.some(
              (agent) => agent._id === this.props.user._id.toString()
            )
          )}
        />
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
                  students={this.props.students}
                  user={this.props.user}
                  startEditingProgram={this.props.startEditingProgram}
                  updateStudentArchivStatus={
                    this.props.updateStudentArchivStatus
                  }
                  isDashboard={this.props.isDashboard}
                />
              </Tab>
              <Tab eventKey="dz" title="Agents and Editors">
                <Table
                  size="sm"
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

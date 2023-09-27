import React, { Fragment } from 'react';
import { Row, Col, Table, Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsExclamationTriangle, BsX } from 'react-icons/bs';

import AgentReviewing from '../MainViewTab/AgentReview/AgentReviewing';
// import AgentTasks from '../MainViewTab/AgentTasks/index';
import ReadyToSubmitTasks from '../MainViewTab/AgentTasks/ReadyToSubmitTasks';
import VPDToSubmitTasks from '../MainViewTab/AgentTasks/VPDToSubmitTasks';
import BaseDocumentCheckingTasks from '../MainViewTab/AgentTasks/BaseDocumentCheckingTasks';

import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';

import { updateAgentBanner } from '../../../api';
import { academic_background_header, profile_list } from '../../Utils/contants';
import {
  DocumentStatus,
  anyStudentWithoutApplicationSelection,
  isAnyCVNotAssigned,
  is_any_base_documents_uploaded,
  is_any_programs_ready_to_submit,
  is_any_vpd_missing,
  programs_refactor,
  progressBarCounter
} from '../../Utils/checking-functions';
import CVAssignTasks from '../MainViewTab/AgentTasks/CVAssignTasks';
import NoProgramStudentTasks from '../MainViewTab/AgentTasks/NoProgramStudentTasks';
import NoEnoughDecidedProgramsTasks from '../MainViewTab/AgentTasks/NoEnoughDecidedProgramsTasks';
import DEMO from '../../../store/constant';
import ApplicationProgressCardBody from '../../../components/ApplicationProgressCard/ApplicationProgressCardBody';

class AgentMainView extends React.Component {
  state = {
    error: '',
    user: this.props.user,
    notification: this.props.notification,
    collapsedRows: {}
  };

  checkMissingBaseDocument = (students) => {
    for (let stud_idx = 0; stud_idx < students.length; stud_idx += 1) {
      let student = students[stud_idx];
      let keys = Object.keys(profile_list);
      let object_init = {};
      for (let i = 0; i < keys.length; i++) {
        object_init[keys[i]] = DocumentStatus.Missing;
      }

      if (student.profile) {
        for (let i = 0; i < student.profile.length; i++) {
          if (student.profile[i].status === DocumentStatus.Uploaded) {
            object_init[student.profile[i].name] = DocumentStatus.Uploaded;
          } else if (student.profile[i].status === DocumentStatus.Accepted) {
            object_init[student.profile[i].name] = DocumentStatus.Accepted;
          } else if (student.profile[i].status === DocumentStatus.Rejected) {
            object_init[student.profile[i].name] = DocumentStatus.Rejected;
          } else if (student.profile[i].status === DocumentStatus.Missing) {
            object_init[student.profile[i].name] = DocumentStatus.Missing;
          } else if (student.profile[i].status === DocumentStatus.NotNeeded) {
            object_init[student.profile[i].name] = DocumentStatus.NotNeeded;
          }
        }
      } else {
      }
      for (let i = 0; i < keys.length; i += 1) {
        if (object_init[keys[i]] === DocumentStatus.Uploaded) {
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

  handleCollapse = (index) => {
    this.setState((state) => ({
      ...state,
      collapsedRows: {
        ...this.state.collapsedRows,
        [index]: !this.state.collapsedRows[index]
      }
    }));
  };
  render() {
    const students_agent_editor = this.props.students.map((student, i) => (
      <StudentsAgentEditor
        key={i}
        user={this.props.user}
        student={student}
        documentslist={this.props.documentslist}
        editAgent={this.props.editAgent}
        agent_list={this.props.agent_list}
        updateAgentList={this.props.updateAgentList}
        handleChangeAgentlist={this.props.handleChangeAgentlist}
        submitUpdateAgentlist={this.props.submitUpdateAgentlist}
        isDashboard={this.props.isDashboard}
        updateStudentArchivStatus={this.props.updateStudentArchivStatus}
      />
    ));

    const agent_reviewing = this.props.students
      .filter((student) =>
        student.agents.some(
          (agent) => agent._id === this.props.user._id.toString()
        )
      )
      .map((student, i) => (
        <AgentReviewing key={i} role={this.props.user.role} student={student} />
      ));

    const ready_to_submit_tasks = this.props.students
      .filter((student) =>
        student.agents.some(
          (agent) => agent._id === this.props.user._id.toString()
        )
      )
      .map((student, i) => (
        <ReadyToSubmitTasks
          key={i}
          role={this.props.user.role}
          student={student}
        />
      ));

    const vpd_to_submit_tasks = this.props.students
      .filter((student) =>
        student.agents.some(
          (agent) => agent._id === this.props.user._id.toString()
        )
      )
      .map((student, i) => (
        <VPDToSubmitTasks
          key={i}
          role={this.props.user.role}
          student={student}
        />
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
          role={this.props.user.role}
          student={student}
        />
      ));
    const cv_assign_tasks = this.props.students
      .filter((student) =>
        student.agents.some(
          (agent) => agent._id === this.props.user._id.toString()
        )
      )
      .map((student, i) => (
        <CVAssignTasks key={i} role={this.props.user.role} student={student} />
      ));
    const no_programs_student_tasks = this.props.students
      .filter((student) =>
        student.agents.some(
          (agent) => agent._id === this.props.user._id.toString()
        )
      )
      .map((student, i) => (
        <NoProgramStudentTasks
          key={i}
          role={this.props.user.role}
          student={student}
        />
      ));

    const no_enough_programs_decided_tasks = this.props.students
      .filter((student) =>
        student.agents.some(
          (agent) => agent._id === this.props.user._id.toString()
        )
      )
      .map((student, i) => (
        <NoEnoughDecidedProgramsTasks
          key={i}
          role={this.props.user.role}
          student={student}
        />
      ));
    const applications_arr = programs_refactor(this.props.students)
      .filter(
        (application) =>
          application.decided === 'O' &&
          application.closed === '-' &&
          application.program_name !== 'No Program'
      )
      .sort((a, b) =>
        a.application_deadline > b.application_deadline ? 1 : -1
      );

    // const agent_tasks = this.props.students
    //   .filter((student) =>
    //     student.agents.some(
    //       (agent) => agent._id === this.props.user._id.toString()
    //     )
    //   )
    //   .map((student, i) => (
    //     <AgentTasks key={i} role={this.props.user.role} student={student} />
    //   ));
    let header = Object.values(academic_background_header);

    return (
      <>
        {this.state.notification?.isRead_new_base_docs_uploaded.map(
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
          <Col md={12}>
            <Card className="my-2 mx-0 card-with-scroll">
              <Card.Header className="py-0 px-0">
                <Card.Title className="my-2 mx-2">
                  Upcoming Applications (Decided):
                </Card.Title>
              </Card.Header>
              <Card.Body className="card-scrollable-body">
                <Table size="sm">
                  <tbody>
                    {applications_arr.map((application, idx) => (
                      <Fragment>
                        <tr
                          key={idx}
                          className="text-black"
                          onClick={() => this.handleCollapse(idx)}
                        >
                          <td>
                            <b>
                              <Link
                                to={`${DEMO.STUDENT_DATABASE_LINK}/${application.student_id}/profile`}
                              >
                                {application.firstname_lastname}
                              </Link>
                            </b>
                          </td>
                          <td>{application.application_deadline}</td>
                          <td>{application.school}</td>
                          <td>
                            {progressBarCounter(
                              application.student,
                              application.application
                            )}
                            %
                          </td>
                          <td>{application.program_name}</td>
                        </tr>
                        {this.state.collapsedRows[idx] && (
                          <tr>
                            <td colSpan="12">
                              <ApplicationProgressCardBody
                                student={application.student}
                                application={application.application}
                              />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          {is_any_programs_ready_to_submit(
            this.props.students.filter((student) =>
              student.agents.some(
                (agent) => agent._id === this.props.user._id.toString()
              )
            )
          ) && (
            <Col md={6}>
              <Card
                className="my-2 mx-0 card-with-scroll"
                bg={'danger'}
                text={'light'}
              >
                <Card.Header className="py-0 px-0 " bg={'danger'}>
                  <Card.Title className="my-2 mx-2 text-light" as={'h5'}>
                    <BsExclamationTriangle size={18} /> Ready To Submit Tasks (
                    ML/ RL/ Essay are finished. Please submit application
                    asap.):
                  </Card.Title>
                </Card.Header>
                <Card.Body className="py-0 px-0 card-scrollable-body">
                  <Table
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
                </Card.Body>
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
                <Card.Header className="py-0 px-0 " bg={'danger'}>
                  <Card.Title className="my-2 mx-2 text-light" as={'h5'}>
                    <BsExclamationTriangle size={18} /> VPD missing:
                  </Card.Title>
                </Card.Header>
                <Card.Body className="py-0 px-0 card-scrollable-body">
                  <Table
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
                        <th>Status</th>
                        <th>Deadline</th>
                        <th>Program</th>
                      </tr>
                    </thead>
                    <tbody>{vpd_to_submit_tasks}</tbody>
                  </Table>
                </Card.Body>
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
                <Card.Header className="py-0 px-0">
                  <Card.Title className="my-2 mx-2 text-light" as={'h5'}>
                    <BsExclamationTriangle size={18} /> Check uploaded base
                    documents:
                  </Card.Title>
                </Card.Header>
                <Card.Body className="py-0 px-0 card-scrollable-body">
                  <Table
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
                </Card.Body>
              </Card>
            </Col>
          )}
          {isAnyCVNotAssigned(
            this.props.students.filter((student) =>
              student.agents.some(
                (agent) => agent._id === this.props.user._id.toString()
              )
            )
          ) && (
            <Col md={6}>
              <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                <Card.Header className="py-0 px-0">
                  <Card.Title className="my-2 mx-2 text-light" as={'h5'}>
                    <BsExclamationTriangle size={18} /> CV Not Assigned Yet:
                  </Card.Title>
                </Card.Header>
                <Card.Body className="py-0 px-0 card-scrollable-body">
                  <Table
                    bordered
                    hover
                    className="my-0 mx-0"
                    variant="dark"
                    text="light"
                    size="sm"
                  >
                    <thead>
                      <tr>
                        <th>Docs</th>
                        <th>Student Name</th>
                        <th>Year/Semester</th>
                      </tr>
                    </thead>
                    <tbody>{cv_assign_tasks}</tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          )}
          {anyStudentWithoutApplicationSelection(
            this.props.students.filter((student) =>
              student.agents.some(
                (agent) => agent._id === this.props.user._id.toString()
              )
            )
          ) && (
            <Col md={6}>
              <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                <Card.Header className="py-0 px-0">
                  <Card.Title className="my-2 mx-2 text-light" as={'h5'}>
                    <BsExclamationTriangle size={18} /> No Program Selected Yet:
                  </Card.Title>
                </Card.Header>
                <Card.Body className="py-0 px-0 card-scrollable-body">
                  <Table
                    bordered
                    hover
                    className="my-0 mx-0"
                    variant="dark"
                    text="light"
                    size="sm"
                  >
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Year/Semester</th>
                      </tr>
                    </thead>
                    <tbody>{no_programs_student_tasks}</tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          )}
          <Col md={6}>
            <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
              <Card.Header className="py-0 px-0">
                <Card.Title className="my-2 mx-2 text-light" as={'h5'}>
                  <BsExclamationTriangle size={18} /> No Enough Program Decided
                  Tasks:
                </Card.Title>
              </Card.Header>
              <Card.Body className="py-0 px-0 card-scrollable-body">
                <Table
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
                  <tbody>{no_enough_programs_decided_tasks}</tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
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
                <th>
                  First-, Last Name | 姓名 <br /> Email
                </th>
                <th>Agents</th>
                <th>Editors</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Degree</th>
                {header.map((name, index) => (
                  <th key={index}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>{students_agent_editor}</tbody>
          </Table>
        </Row>
      </>
    );
  }
}

export default AgentMainView;

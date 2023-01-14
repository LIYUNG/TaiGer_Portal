import React from 'react';
import { Row, Col, Table, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsExclamationTriangle, BsX } from 'react-icons/bs';
import { RiInformationLine } from 'react-icons/ri';

import StudentMyself from './StudentMyself';
import Banner from '../../../components/Banner/Banner';
import ApplicationProgress from '../MainViewTab/ApplicationProgress/ApplicationProgress';
import RespondedThreads from '../MainViewTab/RespondedThreads/RespondedThreads';
import StudentTasks from '../MainViewTab/StudentTasks/index';
import {
  check_academic_background_filled,
  check_applications_to_decided,
  is_all_uni_assist_vpd_uploaded,
  are_base_documents_missing,
  check_base_documents_rejected
} from '../../Utils/checking-functions';
import ErrorPage from '../../Utils/ErrorPage';

import { updateBanner } from '../../../api';

class StudentDashboard extends React.Component {
  state = {
    error: '',
    student: this.props.student,
    itemheight: 20,
    data: [],
    res_status: 0
  };

  removeBanner = (e, notification_key) => {
    e.preventDefault();
    const temp_student = this.state.student;
    temp_student.notification[`${notification_key}`] = true;
    this.setState({ student: temp_student });
    updateBanner(notification_key).then(
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

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    const stdlist = (
      <StudentMyself role={this.props.role} student={this.state.student} />
    );

    const application_progress = (
      <ApplicationProgress
        user={this.props.user}
        student={this.state.student}
      />
    );

    const your_editors = this.state.student.editors ? (
      this.state.student.editors.map((editor, i) => (
        <tr key={i}>
          <td>Editor</td>
          <td>
            {editor.firstname} - {editor.lastname}
          </td>
          <td>{editor.email}</td>
        </tr>
      ))
    ) : (
      <></>
    );
    const your_agents = this.state.student.agents ? (
      this.state.student.agents.map((agent, i) => (
        <tr key={i}>
          <td>Agent</td>
          <td>
            {agent.firstname} - {agent.lastname}
          </td>
          <td>{agent.email}</td>
        </tr>
      ))
    ) : (
      <></>
    );
    const read_thread = (
      <RespondedThreads
        user={this.props.user}
        role={this.props.role}
        student={this.state.student}
      />
    );

    const student_tasks = (
      <StudentTasks role={this.props.role} student={this.state.student} />
    );
    const student = this.state.student;

    return (
      <>
        {student.notification &&
          !student.notification.isRead_survey_not_complete &&
          !check_academic_background_filled(student.academic_background) && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              path={'/survey'}
              text={'It looks like you did not finish survey'}
              link_name={'Survey'}
              removeBanner={this.removeBanner}
              notification_key={'isRead_survey_not_complete'}
            />
          )}

        {student.notification &&
          !student.notification.isRead_uni_assist_task_assigned &&
          !is_all_uni_assist_vpd_uploaded(student) && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              path={'/uni-assist'}
              text={'Please go to Uni-Assist to apply or to get VPD'}
              link_name={'Uni-Assist'}
              removeBanner={this.removeBanner}
              notification_key={'isRead_uni_assist_task_assigned'}
            />
          )}
        {/* new agents assigned banner */}
        {student.notification &&
          !student.notification.isRead_new_agent_assigned && (
            <Row>
              <Col>
                <Card className="my-1 mx-0" bg={'primary'} text={'light'}>
                  <p
                    className="text-light my-3 mx-3"
                    style={{ textAlign: 'left' }}
                  >
                    <RiInformationLine size={18} />
                    <b className="mx-2">Info:</b> New agent are assigned to you.{' '}
                    <span style={{ float: 'right', cursor: 'pointer' }}>
                      {!this.props.ReadOnlyMode && (
                        <BsX
                          size={18}
                          onClick={(e) =>
                            this.removeBanner(e, 'isRead_new_agent_assigned')
                          }
                        />
                      )}
                    </span>
                  </p>
                </Card>
              </Col>
            </Row>
          )}
        {/* new editors assigned banner */}
        {student.notification &&
          !student.notification.isRead_new_editor_assigned && (
            <Row>
              <Col>
                <Card className="my-1 mx-0" bg={'primary'} text={'light'}>
                  <p
                    className="text-light my-3 mx-3"
                    style={{ textAlign: 'left' }}
                  >
                    <RiInformationLine size={18} />
                    <b className="mx-2">Info:</b> New editor are assigned to
                    you.{' '}
                    <span style={{ float: 'right', cursor: 'pointer' }}>
                      {!this.props.ReadOnlyMode && (
                        <BsX
                          size={18}
                          onClick={(e) =>
                            this.removeBanner(e, 'isRead_new_editor_assigned')
                          }
                        />
                      )}
                    </span>
                  </p>
                </Card>
              </Col>
            </Row>
          )}
        {/* new CV ML RL Essay message */}
        {student.notification &&
          !student.notification.isRead_new_cvmlrl_messsage && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              path={'/cv-ml-rl-center'}
              text={'New feedback from your Editor. See'}
              link_name={'CV/ML/RL Center'}
              removeBanner={this.removeBanner}
              notification_key={'isRead_new_cvmlrl_messsage'}
            />
          )}
        {/* TODO: check function : new cv ml rl tasks are asigned to you */}
        {student.notification &&
          !student.notification.isRead_new_cvmlrl_tasks_created && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              path={'/cv-ml-rl-center'}
              text={'New tasks are assigned to you'}
              link_name={'CV/ML/RL Center'}
              removeBanner={this.removeBanner}
              notification_key={'isRead_new_cvmlrl_tasks_created'}
            />
          )}
        {student.notification &&
          !student.notification.isRead_new_programs_assigned &&
          !check_applications_to_decided(student) && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              path={'/student-applications'}
              text={'It looks like you did not decide programs'}
              link_name={'Application Overview'}
              removeBanner={this.removeBanner}
              notification_key={'isRead_new_programs_assigned'}
            />
          )}
        {student.notification &&
          !student.notification.isRead_base_documents_missing &&
          are_base_documents_missing(student) && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              path={'/base-documents'}
              text={'Some of Base Documents are still missing'}
              link_name={'Base Documents'}
              removeBanner={this.removeBanner}
              notification_key={'isRead_base_documents_missing'}
            />
          )}
        {student.notification &&
          !student.notification.isRead_base_documents_rejected &&
          check_base_documents_rejected(student) && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              path={'/base-documents'}
              text={'Some of Base Documents are rejected'}
              link_name={'Base Documents'}
              removeBanner={this.removeBanner}
              notification_key={'isRead_base_documents_rejected'}
            />
          )}
        <Row>
          <Col>
            <Card className="my-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  My Application Progress
                </Card.Title>
              </Card.Header>
              <Table
                responsive
                className="my-0 mx-0"
                variant="dark"
                text="light"
                size="sm"
              >
                <thead>
                  <tr>
                    {this.props.role !== 'Student' ? (
                      <th>First-, Last Name</th>
                    ) : (
                      <th></th>
                    )}
                    {window.programstatuslist.map((doc, index) => (
                      <th key={index}>{doc.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{application_progress}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card className="my-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Your TaiGer Team
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
                    <th>Role</th>
                    <th>First-, Last Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {your_agents}
                  {your_editors}
                </tbody>
              </Table>
            </Card>
            <Card className="my-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  <Link
                    to={'/base-documents'}
                    style={{ textDecoration: 'none' }}
                    className="text-info"
                  >
                    My Uploaded Documents
                  </Link>
                </Card.Title>
              </Card.Header>
              <Table
                responsive
                className="my-0 mx-0"
                variant="dark"
                text="light"
                size="sm"
              >
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Documents</th>
                  </tr>
                </thead>
                <tbody>{stdlist}</tbody>
              </Table>
            </Card>
          </Col>
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
                <tbody>{student_tasks}</tbody>
              </Table>
            </Card>
            <Card className="my-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Pending
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
                    <th>Documents</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>{read_thread}</tbody>
              </Table>
            </Card>
            {/* <Card className="my-0 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Agent Reviewing:
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
                    <th>Uploaded files will be reviewed by your agent:</th>
                    <th>Please decide the programs:</th>
                  </tr>
                </thead>
                <tbody>{agent_reviewing}</tbody>
              </Table>
            </Card> */}
          </Col>
        </Row>
      </>
    );
  }
}

export default StudentDashboard;

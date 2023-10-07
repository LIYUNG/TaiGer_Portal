import React from 'react';
import { Row, Col, Table, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsCalendar, BsExclamationTriangle, BsX } from 'react-icons/bs';

import StudentMyself from './StudentMyself';
import Banner from '../../../components/Banner/Banner';
import ApplicationProgressStudent from '../MainViewTab/ApplicationProgress/ApplicationProgressStudent';
import RespondedThreads from '../MainViewTab/RespondedThreads/RespondedThreads';
import StudentTasksResponsive from '../MainViewTab/StudentTasks/StudentTasksResponsive';
import {
  check_academic_background_filled,
  check_applications_to_decided,
  is_all_uni_assist_vpd_uploaded,
  are_base_documents_missing,
  isBaseDocumentsRejected
} from '../../Utils/checking-functions';
import ErrorPage from '../../Utils/ErrorPage';

import { updateBanner } from '../../../api';
import DEMO from '../../../store/constant';
import { program_progress_list_student } from '../../Utils/contants';
import { FiExternalLink } from 'react-icons/fi';
import { AiOutlineCalendar } from 'react-icons/ai';
import ApplicationProgressCard from '../../../components/ApplicationProgressCard/ApplicationProgressCard';

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
    const { res_status } = this.state;

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    const stdlist = (
      <StudentMyself role={this.props.role} student={this.state.student} />
    );

    const application_progress = (
      <ApplicationProgressStudent
        user={this.props.user}
        student={this.state.student}
      />
    );
    const hasUpcomingAppointment = false;
    const read_thread = (
      <RespondedThreads
        user={this.props.user}
        role={this.props.role}
        student={this.state.student}
      />
    );

    const student_tasks = (
      <StudentTasksResponsive
        role={this.props.role}
        student={this.state.student}
        isCoursesFilled={this.props.isCoursesFilled}
      />
    );
    const student = this.state.student;

    return (
      <>
        {student.archiv && (
          <Row className="sticky-top">
            <Col>
              <Card className="mb-2 mx-0" bg={'success'} text={'white'}>
                <Card.Header>
                  <Card.Title as="h5" className="text-light">
                    Status: <b>Close</b> - Your TaiGer Portal Service is
                    terminated.
                  </Card.Title>
                </Card.Header>
              </Card>
            </Col>
          </Row>
        )}
        {student.notification &&
          !student.notification.isRead_survey_not_complete &&
          !check_academic_background_filled(student.academic_background) && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              bg={'danger'}
              title={'Reminder:'}
              path={`${DEMO.SURVEY_LINK}`}
              text={'It looks like you did not finish survey. See'}
              link_name={
                <>
                  Survey
                  <FiExternalLink
                    className="mx-1 mb-1"
                    style={{ cursor: 'pointer' }}
                  />
                </>
              }
              removeBanner={this.removeBanner}
              notification_key={'isRead_survey_not_complete'}
            />
          )}

        {student.notification &&
          !student.notification.isRead_uni_assist_task_assigned &&
          !is_all_uni_assist_vpd_uploaded(student) && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              bg={'danger'}
              title={'Reminder:'}
              path={`${DEMO.UNI_ASSIST_LINK}`}
              text={'Please go to Uni-Assist to apply or to get VPD'}
              link_name={
                <>
                  Uni-Assist
                  <FiExternalLink
                    className="mx-1 mb-1"
                    style={{ cursor: 'pointer' }}
                  />
                </>
              }
              removeBanner={this.removeBanner}
              notification_key={'isRead_uni_assist_task_assigned'}
            />
          )}
        {/* new agents assigned banner */}
        {student.notification &&
          !student.notification.isRead_new_agent_assigned && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              bg={'primary'}
              title={'Info:'}
              path={`${DEMO.UNI_ASSIST_LINK}`}
              text={'New agent is assigned to you.'}
              link_name={''}
              removeBanner={this.removeBanner}
              notification_key={'isRead_new_agent_assigned'}
            />
          )}
        {/* new editors assigned banner */}
        {student.notification &&
          !student.notification.isRead_new_editor_assigned && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              bg={'primary'}
              title={'Info:'}
              path={`${DEMO.UNI_ASSIST_LINK}`}
              text={'New editor is assigned to you.'}
              link_name={''}
              removeBanner={this.removeBanner}
              notification_key={'isRead_new_editor_assigned'}
            />
          )}
        {/* new CV ML RL Essay message */}
        {student.notification &&
          !student.notification.isRead_new_cvmlrl_messsage && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              bg={'danger'}
              title={'Reminder:'}
              path={`${DEMO.CV_ML_RL_CENTER_LINK}`}
              text={'New feedback from your Editor. See'}
              link_name={
                <>
                  CV/ML/RL Center
                  <FiExternalLink
                    className="mx-1 mb-1"
                    style={{ cursor: 'pointer' }}
                  />
                </>
              }
              removeBanner={this.removeBanner}
              notification_key={'isRead_new_cvmlrl_messsage'}
            />
          )}
        {/* TODO: check function : new cv ml rl tasks are asigned to you */}
        {student.notification &&
          !student.notification.isRead_new_cvmlrl_tasks_created && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              bg={'danger'}
              title={'Reminder:'}
              path={`${DEMO.CV_ML_RL_CENTER_LINK}`}
              text={'New tasks are assigned to you. See'}
              link_name={
                <>
                  CV/ML/RL Center
                  <FiExternalLink
                    className="mx-1 mb-1"
                    style={{ cursor: 'pointer' }}
                  />
                </>
              }
              removeBanner={this.removeBanner}
              notification_key={'isRead_new_cvmlrl_tasks_created'}
            />
          )}
        {student.notification &&
          !student.notification.isRead_new_programs_assigned &&
          !check_applications_to_decided(student) && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              bg={'danger'}
              title={'Reminder:'}
              path={`${DEMO.STUDENT_APPLICATIONS_LINK}`}
              text={'It looks like you did not decide programs'}
              link_name={
                <>
                  Application Overview
                  <FiExternalLink
                    className="mx-1 mb-1"
                    style={{ cursor: 'pointer' }}
                  />
                </>
              }
              removeBanner={this.removeBanner}
              notification_key={'isRead_new_programs_assigned'}
            />
          )}
        {student.notification &&
          !student.notification.isRead_base_documents_missing &&
          are_base_documents_missing(student) && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              bg={'danger'}
              title={'Reminder:'}
              path={`${DEMO.BASE_DOCUMENTS_LINK}`}
              text={'Some of Base Documents are still missing'}
              link_name={
                <>
                  Base Documents
                  <FiExternalLink
                    className="mx-1 mb-1"
                    style={{ cursor: 'pointer' }}
                  />
                </>
              }
              removeBanner={this.removeBanner}
              notification_key={'isRead_base_documents_missing'}
            />
          )}
        {student.notification &&
          !student.notification.isRead_base_documents_rejected &&
          isBaseDocumentsRejected(student) && (
            <Banner
              ReadOnlyMode={this.props.ReadOnlyMode}
              bg={'danger'}
              title={'Reminder:'}
              path={`${DEMO.BASE_DOCUMENTS_LINK}`}
              text={'Some of Base Documents are rejected'}
              link_name={
                <>
                  Base Documents
                  <FiExternalLink
                    className="mx-1 mb-1"
                    style={{ cursor: 'pointer' }}
                  />
                </>
              }
              removeBanner={this.removeBanner}
              notification_key={'isRead_base_documents_rejected'}
            />
          )}
        <Row>
          <Col md={8}>
            <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  <BsExclamationTriangle size={18} /> To Do Tasks:
                  請盡速完成以下任務
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
          </Col>
          <Col md={4}>
            <Card className="my-2 mx-0" bg={'secondary'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  <AiOutlineCalendar size={24} /> 時段預約
                </Card.Title>
              </Card.Header>
              <Card.Body style={{ background: 'black', color: 'white' }}>
                <Row>
                  <Col md={4}>
                    {student?.agents?.some((agent) =>
                      [
                        '639baebf8b84944b872cf648', //Leo
                        '6475a149635df78e3a5b937b', //Lily
                        '638b8f70be60d7999c6b649d', //Sydney
                        '63b9a43af7b3a4a141267cd3' // David
                      ].includes(agent._id.toString())
                    ) ? (
                      <Link to={`/events/students/${student._id.toString()}`}>
                        <Button size="sm">預約</Button>
                        {/* <Badge className="mt-3" bg={`${'primary'}`}>
                          Test
                        </Badge> */}
                      </Link>
                    ) : (
                      <span className="text-light">Coming soon</span>
                    )}
                  </Col>
                  <Col md={8} style={{ color: 'white' }}>
                    {hasUpcomingAppointment ? (
                      <></>
                    ) : (
                      <>
                        想要一次密集討論？ 可以預訂顧問 Office hour 時段討論。
                      </>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="my-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Pending: 等待 Editor 回復
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
          </Col>
        </Row>
        <Row>
          {student.applications
            ?.filter((app) => app.decided === 'O')
            .map((application, idx) => (
              <Col md={4} key={idx}>
                <ApplicationProgressCard
                  student={student}
                  application={application}
                />
              </Col>
            ))}
        </Row>
      </>
    );
  }
}

export default StudentDashboard;

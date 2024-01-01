import React, { Fragment, useState } from 'react';
import { Row, Col, Table, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsExclamationTriangle, BsX } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

import BaseDocumentCheckingTasks from '../MainViewTab/AgentTasks/BaseDocumentCheckingTasks';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import { updateAgentBanner } from '../../../api';
import { appConfig } from '../../../config';
import { academic_background_header } from '../../Utils/contants';
import {
  anyStudentWithoutApplicationSelection,
  isAnyCVNotAssigned,
  is_any_base_documents_uploaded,
  is_any_programs_ready_to_submit,
  is_any_vpd_missing,
  programs_refactor,
  progressBarCounter
} from '../../Utils/checking-functions';
import NoProgramStudentTasks from '../MainViewTab/AgentTasks/NoProgramStudentTasks';
import DEMO from '../../../store/constant';
import ApplicationProgressCardBody from '../../../components/ApplicationProgressCard/ApplicationProgressCardBody';
import ProgramReportCard from '../../Program/ProgramReportCard';
import CVAssignTasksCard from '../MainViewTab/AgentTasks/CVAssignTasksCard';
import ReadyToSubmitTasksCard from '../MainViewTab/AgentTasks/ReadyToSubmitTasksCard';
import NoEnoughDecidedProgramsTasksCard from '../MainViewTab/AgentTasks/NoEnoughDecidedProgramsTasksCard';
import VPDToSubmitTasksCard from '../MainViewTab/AgentTasks/VPDToSubmitTasksCard';

function AgentMainView(props) {
  const { t, i18n } = useTranslation();
  const [agentMainViewState, setAgentMainViewState] = useState({
    error: '',
    user: props.user,
    notification: props.notification,
    collapsedRows: {}
  });

  const removeAgentBanner = (e, notification_key, student_id) => {
    e.preventDefault();
    const temp_user = { ...agentMainViewState.user };
    const idx = temp_user.agent_notification[`${notification_key}`].findIndex(
      (student_obj) => student_obj.student_id === student_id
    );
    temp_user.agent_notification[`${notification_key}`].splice(idx, 1);

    setAgentMainViewState({ ...agentMainViewState, user: temp_user });

    updateAgentBanner(notification_key, student_id).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          setAgentMainViewState({
            ...agentMainViewState,
            success: success,
            res_status: status
          });
        } else {
          setAgentMainViewState({
            ...agentMainViewState,
            res_status: status
          });
        }
      },
      (error) => {
        setAgentMainViewState({
          ...agentMainViewState,
          error,
          res_status: 500
        });
      }
    );
  };

  const handleCollapse = (index) => {
    setAgentMainViewState({
      ...agentMainViewState,
      collapsedRows: {
        ...agentMainViewState.collapsedRows,
        [index]: !agentMainViewState.collapsedRows[index]
      }
    });
  };

  const students_agent_editor = props.students.map((student, i) => (
    <StudentsAgentEditor
      key={i}
      user={props.user}
      student={student}
      documentslist={props.documentslist}
      editEditor={props.editEditor}
      editAgent={props.editAgent}
      agent_list={props.agent_list}
      updateAgentList={props.updateAgentList}
      handleChangeAgentlist={props.handleChangeAgentlist}
      submitUpdateAgentlist={props.submitUpdateAgentlist}
      isDashboard={props.isDashboard}
      updateStudentArchivStatus={props.updateStudentArchivStatus}
    />
  ));

  const base_documents_checking_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === props.user._id.toString())
    )
    .map((student, i) => (
      <BaseDocumentCheckingTasks
        key={i}
        role={props.user.role}
        student={student}
      />
    ));

  const no_programs_student_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === props.user._id.toString())
    )
    .map((student, i) => (
      <NoProgramStudentTasks key={i} role={props.user.role} student={student} />
    ));

  const applications_arr = programs_refactor(props.students)
    .filter(
      (application) =>
        application.decided === 'O' &&
        application.closed === '-' &&
        application.program_name !== 'No Program'
    )
    .sort((a, b) => (a.application_deadline > b.application_deadline ? 1 : -1));

  let header = Object.values(academic_background_header);

  return (
    <>
      {agentMainViewState.notification?.isRead_new_base_docs_uploaded.map(
        (student, i) => (
          <Row key={i}>
            <Col>
              <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                <p
                  className="text-light my-3 mx-3"
                  style={{ textAlign: 'left' }}
                >
                  <BsExclamationTriangle size={18} />
                  <b className="mx-2">Reminder:</b> There are new base documents
                  uploaded by{' '}
                  <b>
                    {student.student_firstname} {student.student_lastname}
                  </b>{' '}
                  <Link
                    to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                      student.student_id,
                      DEMO.PROFILE
                    )}`}
                    style={{ textDecoration: 'none' }}
                    className="text-info"
                  >
                    Base Document
                  </Link>{' '}
                  <span style={{ float: 'right', cursor: 'pointer' }}>
                    <BsX
                      size={18}
                      onClick={(e) =>
                        removeAgentBanner(
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
                {t('Upcoming Applications')} (Decided):
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
                        onClick={() => handleCollapse(idx)}
                      >
                        <td>
                          <b>
                            <Link
                              to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                application.student_id,
                                DEMO.PROFILE
                              )}`}
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
                      {agentMainViewState.collapsedRows[idx] && (
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
        <ProgramReportCard />
        {is_any_programs_ready_to_submit(
          props.students.filter((student) =>
            student.agents.some(
              (agent) => agent._id === props.user._id.toString()
            )
          )
        ) && (
          <ReadyToSubmitTasksCard students={props.students} user={props.user} />
        )}
        {appConfig.vpdEnable &&
          is_any_vpd_missing(
            props.students.filter((student) =>
              student.agents.some(
                (agent) => agent._id === props.user._id.toString()
              )
            )
          ) && (
            <VPDToSubmitTasksCard students={props.students} user={props.user} />
          )}
        {is_any_base_documents_uploaded(
          props.students.filter((student) =>
            student.agents.some(
              (agent) => agent._id === props.user._id.toString()
            )
          )
        ) && (
          <Col md={6}>
            <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
              <Card.Header className="py-0 px-0">
                <Card.Title className="my-2 mx-2 text-light" as={'h5'}>
                  <BsExclamationTriangle size={18} />{' '}
                  {t('Check uploaded base documents')}:
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
                      <th>{t('Student')}</th>
                      <th>{t('Document Type')}</th>
                      <th>{t('Upload Time')}</th>
                    </tr>
                  </thead>
                  <tbody>{base_documents_checking_tasks}</tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        )}
        {isAnyCVNotAssigned(
          props.students.filter((student) =>
            student.agents.some(
              (agent) => agent._id === props.user._id.toString()
            )
          )
        ) && <CVAssignTasksCard students={props.students} user={props.user} />}
        {anyStudentWithoutApplicationSelection(
          props.students.filter((student) =>
            student.agents.some(
              (agent) => agent._id === props.user._id.toString()
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
        <NoEnoughDecidedProgramsTasksCard
          students={props.students}
          user={props.user}
        />
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
              <th>{t('Agents')}</th>
              <th>{t('Editors')}</th>
              <th>{t('Year')}</th>
              <th>{t('Semester')}</th>
              <th>{t('Degree')}</th>
              {header.map((name, index) => (
                <th key={index}>{t(`${name}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>{students_agent_editor}</tbody>
        </Table>
      </Row>
    </>
  );
}

export default AgentMainView;

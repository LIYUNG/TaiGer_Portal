import React, { Fragment, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import {
  Alert,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Link } from 'react-router-dom';
import { BsX } from 'react-icons/bs';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import BaseDocumentCheckingTasks from '../MainViewTab/AgentTasks/BaseDocumentCheckingTasks';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import { updateAgentBanner } from '../../../api';
import { academic_background_header } from '../../Utils/contants';
import {
  anyStudentWithoutApplicationSelection,
  isAnyCVNotAssigned,
  isProgramDecided,
  is_any_base_documents_uploaded,
  is_any_programs_ready_to_submit,
  is_any_vpd_missing,
  programs_refactor,
  progressBarCounter
} from '../../Utils/checking-functions';
import NoProgramStudentTask from '../MainViewTab/AgentTasks/NoProgramStudentTask';
import DEMO from '../../../store/constant';
import ApplicationProgressCardBody from '../../../components/ApplicationProgressCard/ApplicationProgressCardBody';
import ProgramReportCard from '../../Program/ProgramReportCard';
import CVAssignTasksCard from '../MainViewTab/AgentTasks/CVAssignTasksCard';
import ReadyToSubmitTasksCard from '../MainViewTab/AgentTasks/ReadyToSubmitTasksCard';
import NoEnoughDecidedProgramsTasksCard from '../MainViewTab/AgentTasks/NoEnoughDecidedProgramsTasksCard';
import VPDToSubmitTasksCard from '../MainViewTab/AgentTasks/VPDToSubmitTasksCard';
import { useAuth } from '../../../components/AuthProvider';
import { useTranslation } from 'react-i18next';

function ManagerMainView(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [managerMainViewState, setManagerMainViewState] = useState({
    error: '',
    user: user,
    notification: props.notification,
    collapsedRows: {}
  });

  const removeAgentBanner = (e, notification_key, student_id) => {
    e.preventDefault();
    const temp_user = { ...user };
    const idx = temp_user.agent_notification[`${notification_key}`].findIndex(
      (student_obj) => student_obj.student_id === student_id
    );
    temp_user.agent_notification[`${notification_key}`].splice(idx, 1);

    setManagerMainViewState((prevState) => ({
      ...prevState,
      user: temp_user
    }));

    updateAgentBanner(notification_key, student_id).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          setManagerMainViewState((prevState) => ({
            ...prevState,
            success: success,
            res_status: status
          }));
        } else {
          setManagerMainViewState((prevState) => ({
            ...prevState,
            res_status: status
          }));
        }
      },
      (error) => {
        setManagerMainViewState((prevState) => ({
          ...prevState,
          error,
          res_status: 500
        }));
      }
    );
  };

  const handleCollapse = (index) => {
    setManagerMainViewState((prevState) => ({
      ...prevState,
      collapsedRows: {
        ...prevState.collapsedRows,
        [index]: !prevState.collapsedRows[index]
      }
    }));
  };
  const students_agent_editor = props.students.map((student, i) => (
    <StudentsAgentEditor
      key={i}
      user={user}
      student={student}
      documentslist={props.documentslist}
      updateAgentList={props.updateAgentList}
      submitUpdateAgentlist={props.submitUpdateAgentlist}
      isDashboard={props.isDashboard}
      updateStudentArchivStatus={props.updateStudentArchivStatus}
    />
  ));

  const base_documents_checking_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === user._id.toString())
    )
    .map((student, i) => (
      <BaseDocumentCheckingTasks key={i} role={user.role} student={student} />
    ));

  const no_programs_student_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === user._id.toString())
    )
    .map((student, i) => (
      <NoProgramStudentTask key={i} role={user.role} student={student} />
    ));

  const applications_arr = programs_refactor(props.students)
    .filter(
      (application) =>
        isProgramDecided(application) &&
        application.closed === '-' &&
        application.program_name !== 'No Program'
    )
    .sort((a, b) => (a.application_deadline > b.application_deadline ? 1 : -1));

  let header = Object.values(academic_background_header);

  return (
    <>
      {managerMainViewState.notification?.isRead_new_base_docs_uploaded.map(
        (student, i) => (
          <Row key={i}>
            <Col>
              <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                <p
                  className="text-light my-3 mx-3"
                  style={{ textAlign: 'left' }}
                >
                  <ReportProblemIcon size={18} />
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
          <Card className="card-with-scroll">
            <Alert severity="error">
              {t('Upcoming Applications')} (Decided):
            </Alert>
            <div className="card-scrollable-body">
              <Table size="small">
                <TableBody>
                  {applications_arr.map((application, idx) => (
                    <Fragment key={idx}>
                      <TableRow
                        className="text-black"
                        onClick={() => handleCollapse(idx)}
                      >
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          {application.application_deadline}
                        </TableCell>
                        <TableCell>{application.school}</TableCell>
                        <TableCell>
                          {progressBarCounter(
                            application.student,
                            application.application
                          )}
                          %
                        </TableCell>
                        <TableCell>{application.program_name}</TableCell>
                      </TableRow>
                      {managerMainViewState.collapsedRows[idx] && (
                        <TableRow>
                          <td colSpan="12">
                            <ApplicationProgressCardBody
                              student={application.student}
                              application={application.application}
                            />
                          </td>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </Col>
      </Row>
      <Grid container spacing={2}>
        {/* TODO: add a program update request ticket card (independent component?) */}
        {/* <Col md={6}> */}
        <ProgramReportCard />
        {/* </Col> */}
        {is_any_programs_ready_to_submit(
          props.students.filter((student) =>
            student.agents.some((agent) => agent._id === user._id.toString())
          )
        ) && <ReadyToSubmitTasksCard students={props.students} user={user} />}
        {is_any_vpd_missing(
          props.students.filter((student) =>
            student.agents.some((agent) => agent._id === user._id.toString())
          )
        ) && <VPDToSubmitTasksCard students={props.students} user={user} />}
        {is_any_base_documents_uploaded(
          props.students.filter((student) =>
            student.agents.some((agent) => agent._id === user._id.toString())
          )
        ) && (
          <Col md={6}>
            <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
              <Card.Header className="py-0 px-0">
                <Card.Title className="my-2 mx-2 text-light" as={'h5'}>
                  <ReportProblemIcon size={18} /> Check uploaded base documents:
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
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Base Document</TableCell>
                      <TableCell>Upload Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{base_documents_checking_tasks}</TableBody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        )}
        {isAnyCVNotAssigned(
          props.students.filter((student) =>
            student.agents.some((agent) => agent._id === user._id.toString())
          )
        ) && <CVAssignTasksCard students={props.students} user={user} />}
        {anyStudentWithoutApplicationSelection(
          props.students.filter((student) =>
            student.agents.some((agent) => agent._id === user._id.toString())
          )
        ) && (
          <Grid item xs={6}>
            <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
              <Typography variant="h6">
                <ReportProblemIcon size={18} /> No Program Selected Yet:
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Year/Semester</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{no_programs_student_tasks}</TableBody>
              </Table>
            </Card>
          </Grid>
        )}
        <NoEnoughDecidedProgramsTasksCard
          students={props.students}
          user={user}
        />
      </Grid>
      <Row>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                First-, Last Name | 姓名 <br /> Email
              </TableCell>
              <TableCell>Agents</TableCell>
              <TableCell>Editors</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Degree</TableCell>
              {header.map((name, index) => (
                <TableCell key={index}>{name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{students_agent_editor}</TableBody>
        </Table>
      </Row>
    </>
  );
}

export default ManagerMainView;

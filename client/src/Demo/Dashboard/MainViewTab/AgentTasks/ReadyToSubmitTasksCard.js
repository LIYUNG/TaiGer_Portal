import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Table } from 'react-bootstrap';
import { BsExclamationTriangle } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

import {
  isCVFinished,
  is_program_ml_rl_essay_ready,
  is_the_uni_assist_vpd_uploaded,
  is_program_closed,
  application_deadline_calculator
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';

const ReadyToSubmitTasks = (props) => {
  return (
    <>
      {/* check program reday to be submitted */}
      {props.student.applications.map(
        (application, i) =>
          application.decided === 'O' &&
          isCVFinished(props.student) &&
          is_program_ml_rl_essay_ready(application) &&
          is_the_uni_assist_vpd_uploaded(application) &&
          !is_program_closed(application) && (
            <tr key={i}>
              <td>
                <Link
                  to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                    props.student._id.toString(),
                    '/CV_ML_RL'
                  )}`}
                  style={{ textDecoration: 'none' }}
                  className="text-info"
                >
                  <b>
                    {props.student.firstname} {props.student.lastname}
                  </b>
                </Link>
              </td>
              <td>
                {application_deadline_calculator(props.student, application)}
              </td>
              <td>
                <b className="text-warning">{application.programId.degree}</b>
                {' - '}
                <b className="text-warning">{application.programId.semester}</b>
                {' - '}
                <b className="text-warning">
                  {application.programId.school}{' '}
                  {application.programId.program_name}
                </b>
              </td>
            </tr>
          )
      )}
    </>
  );
};

function ReadyToSubmitTasksCard(props) {
  const { t, i18n } = useTranslation();

  const ready_to_submit_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === props.user._id.toString())
    )
    .map((student, i) => (
      <ReadyToSubmitTasks key={i} role={props.user.role} student={student} />
    ));

  return (
    <Col md={6}>
      <Card className="my-2 mx-0 card-with-scroll" bg={'danger'} text={'light'}>
        <Card.Header className="py-0 px-0 " bg={'danger'}>
          <Card.Title className="my-2 mx-2 text-light" as={'h5'}>
            <BsExclamationTriangle size={18} /> {t('Ready To Submit Tasks')} (
            ML/ RL/ Essay are finished. Please submit application asap.):
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
                <th>{t('Deadline')}</th>
                <th>
                  {t('Semester')} - {t('Degree')} - {t('Program')}
                </th>
              </tr>
            </thead>
            <tbody>{ready_to_submit_tasks}</tbody>
          </Table>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default ReadyToSubmitTasksCard;

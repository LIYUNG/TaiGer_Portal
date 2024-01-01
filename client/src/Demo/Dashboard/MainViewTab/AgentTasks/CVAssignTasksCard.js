import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Table } from 'react-bootstrap';
import { BsExclamationTriangle } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

import {
  isCVFinished,
  is_cv_assigned
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';

function CVAssignTasksCard(props) {
  const { t, i18n } = useTranslation();
  const CVAssignTasks = (props) => {
    return (
      <>
        {/* cv assign tasks */}
        {!isCVFinished(props.student) &&
          !is_cv_assigned(props.student) && (
            <tr>
              <td>
                <Link
                  to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                    props.student._id.toString(),
                    '/CV_ML_RL'
                  )}`}
                  style={{ textDecoration: 'none' }}
                  className="text-info"
                >
                  CV
                </Link>
              </td>
              <td>
                <b>
                  {props.student.firstname} {props.student.lastname}
                </b>
              </td>
              <td>
                {props.student.application_preference
                  ?.expected_application_date || (
                  <span className="text-danger">TBD</span>
                )}
                {'/'}
                {props.student.application_preference
                  ?.expected_application_semester || (
                  <span className="text-danger">TBD</span>
                )}
              </td>
            </tr>
          )}
      </>
    );
  };
  const cv_assign_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === props.user._id.toString())
    )
    .map((student, i) => (
      <CVAssignTasks key={i} role={props.user.role} student={student} />
    ));
  return (
    <>
      <Col md={6}>
        <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
          <Card.Header className="py-0 px-0">
            <Card.Title className="my-2 mx-2 text-light" as={'h5'}>
              <BsExclamationTriangle size={18} /> {t('CV Not Assigned Yet')}:
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
                  <th>{t('Student')}</th>
                  <th>
                    {t('Year')}/{t('Semester')}
                  </th>
                </tr>
              </thead>
              <tbody>{cv_assign_tasks}</tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default CVAssignTasksCard;

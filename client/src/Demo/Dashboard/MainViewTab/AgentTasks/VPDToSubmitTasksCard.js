import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Table } from 'react-bootstrap';
import { BsExclamationTriangle } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

import {
  is_uni_assist_vpd_needed,
  is_all_uni_assist_vpd_uploaded,
  application_deadline_calculator,
  is_uni_assist_paid_and_docs_uploaded
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';

function VPDToSubmitTasks(props) {
  return (
    <>
      {/* check uni-assist */}
      {!is_all_uni_assist_vpd_uploaded(props.student) &&
        props.student.applications.map(
          (application, i) =>
            is_uni_assist_vpd_needed(application) && (
              <tr key={i}>
                <td>
                  <Link
                    to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                      props.student._id.toString(),
                      DEMO.UNI_ASSIST_LINK
                    )}`}
                    style={{ textDecoration: 'none' }}
                    className="text-info"
                  >
                    {props.student.firstname} {props.student.lastname}
                  </Link>
                </td>
                {is_uni_assist_paid_and_docs_uploaded(application) ? (
                  <>
                    <td className="text-warning">Paid, Waiting VPD</td>
                  </>
                ) : (
                  <td className="text-danger">Not paid</td>
                )}
                <td>
                  <b>
                    {application_deadline_calculator(
                      props.student,
                      application
                    )}
                  </b>
                </td>
                <td>
                  {application.programId.school}{' '}
                  {application.programId.program_name}
                </td>
              </tr>
            )
        )}
    </>
  );
}

function VPDToSubmitTasksCard(props) {
  const { t, i18n } = useTranslation();
  const vpd_to_submit_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === props.user._id.toString())
    )
    .map((student, i) => (
      <VPDToSubmitTasks key={i} role={props.user.role} student={student} />
    ));
  return (
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
                <th>{t('Student')}</th>
                <th>{t('Status')}</th>
                <th>{t('Deadline')}</th>
                <th>{t('Program')}</th>
              </tr>
            </thead>
            <tbody>{vpd_to_submit_tasks}</tbody>
          </Table>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default VPDToSubmitTasksCard;

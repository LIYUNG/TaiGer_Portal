import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  areProgramsDecidedMoreThanContract,
  is_num_Program_Not_specified
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { Card, Col, Table } from 'react-bootstrap';
import { BsExclamationTriangle } from 'react-icons/bs';
const NoEnoughDecidedProgramsTasks = (props) => {
  const { t, i18n } = useTranslation();
  return (
    <>
      {is_num_Program_Not_specified(props.student) ? (
        <tr>
          <td>
            <Link
              to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(
                props.student._id.toString()
              )}`}
              style={{ textDecoration: 'none' }}
              className="text-info"
            >
              <b>
                {props.student.firstname} {props.student.lastname}{' '}
              </b>
              Applications
            </Link>
          </td>
          <td>
            Contact Sales or Admin for the number of program of
            <b>
              {props.student.firstname} {props.student.lastname}
            </b>
          </td>
          <td></td>
        </tr>
      ) : (
        <>
          {/* select enough program task */}
          {!areProgramsDecidedMoreThanContract(props.student) && (
            <>
              <tr>
                <td>
                  <Link
                    to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(
                      props.student._id.toString()
                    )}`}
                    style={{ textDecoration: 'none' }}
                    className="text-info"
                  >
                    <b>
                      {' '}
                      {props.student.firstname} {props.student.lastname}{' '}
                    </b>
                    Applications
                  </Link>
                </td>
                <td>
                  {t('Please select enough programs for')}{' '}
                  <b>
                    {props.student.firstname} {props.student.lastname}
                  </b>
                </td>
                <td></td>
              </tr>
            </>
          )}
        </>
      )}
      {/* TODO: add Portal register tasks */}
    </>
  );
};

function NoEnoughDecidedProgramsTasksCard(props) {
  const { t, i18n } = useTranslation();
  const no_enough_programs_decided_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === props.user._id.toString())
    )
    .map((student, i) => (
      <NoEnoughDecidedProgramsTasks
        key={i}
        role={props.user.role}
        student={student}
      />
    ));
  return (
    <Col md={6}>
      <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
        <Card.Header className="py-0 px-0">
          <Card.Title className="my-2 mx-2 text-light" as={'h5'}>
            <BsExclamationTriangle size={18} />{' '}
            {t('No Enough Program Decided Tasks')}:
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
  );
}

export default NoEnoughDecidedProgramsTasksCard;

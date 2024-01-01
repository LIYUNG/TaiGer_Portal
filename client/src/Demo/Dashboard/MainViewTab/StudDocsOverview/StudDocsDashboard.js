import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import DEMO from '../../../../store/constant';

function StudDocsDashboard(props) {
  const { t, i18n } = useTranslation();
  const updateStudentArchivStatus = (studentId, isArchived) => {
    props.updateStudentArchivStatus(studentId, isArchived);
  };

  let studentsAgent;
  let studentsEditor;
  if (props.student.agents === undefined || props.student.agents.length === 0) {
    studentsAgent = <p className="text-danger">{t('No Agent assigned')}</p>;
  } else {
    studentsAgent = props.student.agents.map((agent, i) => (
      <div key={agent._id}>
        <p className="mb-0 text-info">
          <Link
            to={`${DEMO.TEAM_AGENT_LINK(agent._id.toString())}`}
            className="mb-0 text-info"
          >
            {agent.firstname}
            {', '}
            {agent.lastname}
          </Link>
        </p>
        <p className="mb-0 text-secondary">{agent.email}</p>
      </div>
    ));
  }
  if (
    props.student.editors === undefined ||
    props.student.editors.length === 0
  ) {
    studentsEditor = <p className="text-danger">{t('No Editor assigned')}</p>;
  } else {
    studentsEditor = props.student.editors.map((editor, i) => (
      <div key={editor._id}>
        <p className="mb-0 text-info">
          <Link
            to={`${DEMO.TEAM_EDITOR_LINK(editor._id.toString())}`}
            className="mb-0 text-info"
          >
            {editor.firstname}
            {', '}
            {editor.lastname}
          </Link>
        </p>
        <p className="mb-0 text-secondary">{editor.email}</p>
      </div>
    ));
  }
  const target_application_field = props.student.application_preference
    ? props.student.application_preference.target_application_field || (
        <span className="text-danger">TBD</span>
      )
    : '';
  return (
    <>
      <tr
        style={{
          backgroundColor: props.student.archiv === true ? '#1de9b6' : ''
        }}
        title={props.student.archiv === true ? 'Closed' : 'Open'}
      >
        <td>
          {props.isDashboard && props.user.role !== 'Editor' && (
            <DropdownButton
              size="sm"
              className="mx-0"
              title="Option"
              variant="primary"
              id={`dropdown-variants-${props.student._id}`}
              key={props.student._id}
            >
              <Dropdown.Item
                eventKey="5"
                onClick={() =>
                  updateStudentArchivStatus(props.student._id, true)
                }
              >
                Move to Archiv
              </Dropdown.Item>
            </DropdownButton>
          )}
          {props.isArchivPage && props.user.role !== 'Editor' && (
            <DropdownButton
              size="sm"
              className="mx-0"
              title="Option"
              variant="primary"
              id={`dropdown-variants-${props.student._id}`}
              key={props.student._id}
            >
              <Dropdown.Item
                eventKey="6"
                onClick={() =>
                  updateStudentArchivStatus(props.student._id, false)
                }
              >
                Move to Active
              </Dropdown.Item>
            </DropdownButton>
          )}
        </td>
        <td>
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              props.student._id,
              '/background'
            )}`}
            className="text-info"
            style={{ textDecoration: 'none' }}
          >
            <b>
              {props.student.firstname}, {props.student.lastname}
              {' | '}
              {props.student.lastname_chinese}
              {props.student.firstname_chinese}
            </b>
          </Link>
          <br />
          {props.student.email}
        </td>
        <td>{studentsAgent}</td>
        <td>{studentsEditor}</td>
        <td>
          {props.student.application_preference.expected_application_date || (
            <p className="text-danger">TBD</p>
          )}
        </td>
        <td>
          {props.student.application_preference
            .expected_application_semester || (
            <span className="text-danger">TBD</span>
          )}
        </td>
        <td>
          {props.student.application_preference.target_degree || (
            <p className="text-danger">TBD</p>
          )}
        </td>
        <td>
          <b>
            {props.student.academic_background.university
              .attended_university || <span className="text-danger">TBD</span>}
          </b>
          <br />
          {props.student.academic_background.university
            .attended_university_program || (
            <span className="text-danger">TBD</span>
          )}
        </td>
        <td>{target_application_field}</td>
        <td>
          {props.student.academic_background.language.english_certificate || (
            <span className="text-danger">TBD</span>
          )}
          <br />
          {props.student.academic_background.language.german_certificate}
        </td>
        <td>
          {props.student.academic_background.language.english_score}
          <br />
          {props.student.academic_background.language.german_score}
        </td>
        <td>
          {props.student.academic_background.language.english_isPassed ===
            'X' && props.student.academic_background.language.english_test_date}
          <br />
          {props.student.academic_background.language.german_isPassed === 'X' &&
            props.student.academic_background.language.german_test_date}
        </td>
      </tr>
    </>
  );
}

export default StudDocsDashboard;

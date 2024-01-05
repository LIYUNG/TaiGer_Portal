import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import EditAgentsSubpage from '../StudDocsOverview/EditAgentsSubpage';
import EditEditorsSubpage from '../StudDocsOverview/EditEditorsSubpage';
import {
  is_TaiGer_Editor,
  is_TaiGer_role
} from '../../../Utils/checking-functions';
import { is_TaiGer_Student } from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';

function StudentsAgentEditor(props) {
  const { t, i18n } = useTranslation();
  const [studentsAgentEditor, setStudentsAgentEditor] = useState({
    showAgentPage: false,
    showEditorPage: false
  });

  const setAgentModalhide = () => {
    setStudentsAgentEditor((prevState) => ({
      ...prevState,
      showAgentPage: false
    }));
  };

  const startEditingAgent = (student) => {
    props.editAgent(student);
    setStudentsAgentEditor((prevState) => ({
      ...prevState,
      subpage: 1,
      showAgentPage: true
    }));
  };

  const setEditorModalhide = () => {
    setStudentsAgentEditor((prevState) => ({
      ...prevState,
      showEditorPage: false
    }));
  };

  const startEditingEditor = (student) => {
    props.editEditor(student);
    setStudentsAgentEditor((prevState) => ({
      ...prevState,
      subpage: 2,
      showEditorPage: true
    }));
  };

  const submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    setAgentModalhide();
    props.submitUpdateAgentlist(e, updateAgentList, student_id);
  };

  const submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    setEditorModalhide();
    props.submitUpdateEditorlist(e, updateEditorList, student_id);
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
        <span className="mb-0 text-secondary">{agent.email}</span>
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
        <span className="mb-0 text-secondary">{editor.email}</span>
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
      <tr>
        <td>
          {is_TaiGer_role(props.user) && !props.isArchivPage && (
            <DropdownButton
              size="sm"
              title="Option"
              variant="primary"
              id={`dropdown-variants-${props.student._id}`}
              key={props.student._id}
              drop="right"
            >
              <Dropdown.Item
                eventKey="1"
                onClick={() => startEditingAgent(props.student)}
              >
                Edit Agent
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="2"
                onClick={() => startEditingEditor(props.student)}
              >
                Edit Editor
              </Dropdown.Item>
              {props.isDashboard && !is_TaiGer_Editor(props.user) && (
                <Dropdown.Item
                  eventKey="5"
                  onClick={() =>
                    props.updateStudentArchivStatus(props.student._id, true)
                  }
                >
                  Move to Archiv
                </Dropdown.Item>
              )}
              {props.isArchivPage && !is_TaiGer_Editor(props.user) && (
                <Dropdown.Item
                  eventKey="6"
                  onClick={() =>
                    props.updateStudentArchivStatus(props.student._id, false)
                  }
                >
                  Move to Active
                </Dropdown.Item>
              )}
            </DropdownButton>
          )}
        </td>
        {!is_TaiGer_Student(props.user) ? (
          <td>
            <p className="mb-0">
              <Link
                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                  props.student._id,
                  '/background'
                )}`}
                className="text-info"
                style={{ textDecoration: 'none' }}
              >
                {props.student.firstname}, {props.student.lastname} {' | '}
                {props.student.lastname_chinese}
                {props.student.firstname_chinese}
              </Link>
            </p>
            <span className="mb-0 text-secondary">{props.student.email}</span>
          </td>
        ) : (
          <></>
        )}
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
            <p className="text-danger">TBD</p>
          )}
        </td>
        <td>
          {props.student.application_preference.target_degree || (
            <p className="text-danger">TBD</p>
          )}
        </td>
        <td>
          <b className="my-0 py-0">
            {props.student.academic_background.university
              .attended_university || <span className="text-danger">TBD</span>}
          </b>
          <br className="my-0 py-0" />
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
          {props.student.academic_background.language.german_certificate || (
            <span className="text-danger">TBD</span>
          )}
        </td>
        <td>
          {props.student.academic_background.language.english_score || (
            <span className="text-danger">TBD</span>
          )}
          <br />
          {props.student.academic_background.language.german_score || (
            <span className="text-danger">TBD</span>
          )}
        </td>
        <td>
          {(props.student.academic_background.language.english_isPassed ===
            'X' &&
            props.student.academic_background.language.english_test_date) || (
            <span className="text-danger">TBD</span>
          )}
          <br />
          {(props.student.academic_background.language.german_isPassed ===
            'X' &&
            props.student.academic_background.language.german_test_date) || (
            <span className="text-danger">TBD</span>
          )}
        </td>
      </tr>
      {is_TaiGer_role(props.user) && (
        <>
          <EditAgentsSubpage
            student={props.student}
            agent_list={props.agent_list}
            show={studentsAgentEditor.showAgentPage}
            onHide={setAgentModalhide}
            updateAgentList={props.updateAgentList}
            submitUpdateAgentlist={submitUpdateAgentlist}
          />
          <EditEditorsSubpage
            student={props.student}
            editor_list={props.editor_list}
            show={studentsAgentEditor.showEditorPage}
            onHide={setEditorModalhide}
            updateEditorList={props.updateEditorList}
            submitUpdateEditorlist={submitUpdateEditorlist}
          />
        </>
      )}
    </>
  );
}

export default StudentsAgentEditor;

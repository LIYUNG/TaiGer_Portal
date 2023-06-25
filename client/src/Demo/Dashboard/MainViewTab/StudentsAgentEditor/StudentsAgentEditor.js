import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import EditAgentsSubpage from '../StudDocsOverview/EditAgentsSubpage';
import EditEditorsSubpage from '../StudDocsOverview/EditEditorsSubpage';
import { is_TaiGer_role } from '../../../Utils/checking-functions';

class StudentsAgentEditor extends React.Component {
  state = {
    showAgentPage: false,
    showEditorPage: false
  };

  setAgentModalhide = () => {
    this.setState({
      showAgentPage: false
    });
  };

  startEditingAgent = (student) => {
    this.props.editAgent(student);
    this.setState({
      subpage: 1,
      showAgentPage: true
    });
  };

  setEditorModalhide = () => {
    this.setState({
      showEditorPage: false
    });
  };

  startEditingEditor = (student) => {
    this.props.editEditor(student);
    this.setState({
      subpage: 2,
      showEditorPage: true
    });
  };

  submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    this.setAgentModalhide();
    this.props.submitUpdateAgentlist(e, updateAgentList, student_id);
  };

  submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    this.setEditorModalhide();
    this.props.submitUpdateEditorlist(e, updateEditorList, student_id);
  };

  c;
  render() {
    let studentsAgent;
    let studentsEditor;
    if (
      this.props.student.agents === undefined ||
      this.props.student.agents.length === 0
    ) {
      studentsAgent = <p className="text-danger">No Agent assigned</p>;
    } else {
      studentsAgent = this.props.student.agents.map((agent, i) => (
        <div key={agent._id}>
          <p className="mb-0 text-info">
            <Link
              to={`/teams/agents/${agent._id.toString()}`}
              className="mb-0 text-info"
            >
              {agent.firstname}
              {', '}
              {agent.lastname}
            </Link>
          </p>
          <p className="mb-0 text-muted">{agent.email}</p>
        </div>
      ));
    }
    if (
      this.props.student.editors === undefined ||
      this.props.student.editors.length === 0
    ) {
      studentsEditor = <p className="text-danger">No Editor assigned</p>;
    } else {
      studentsEditor = this.props.student.editors.map((editor, i) => (
        <div key={editor._id}>
          <p className="mb-0 text-info">
            <Link
              to={`/teams/editors/${editor._id.toString()}`}
              className="mb-0 text-info"
            >
              {editor.firstname}
              {', '}
              {editor.lastname}
            </Link>
          </p>
          <p className="mb-0 text-muted">{editor.email}</p>
        </div>
      ));
    }
    const target_application_field = this.props.student.application_preference
      ? this.props.student.application_preference.target_application_field
      : '';
    return (
      <>
        <tr>
          <td>
            {is_TaiGer_role(this.props.user) && !this.props.isArchivPage && (
              <DropdownButton
                size="sm"
                title="Option"
                variant="primary"
                id={`dropdown-variants-${this.props.student._id}`}
                key={this.props.student._id}
              >
                <Dropdown.Item
                  eventKey="1"
                  onClick={() => this.startEditingAgent(this.props.student)}
                >
                  Edit Agent
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="2"
                  onClick={() => this.startEditingEditor(this.props.student)}
                >
                  Edit Editor
                </Dropdown.Item>
                {this.props.isDashboard &&
                  this.props.user.role !== 'Editor' && (
                    <Dropdown.Item
                      eventKey="5"
                      onClick={() =>
                        this.props.updateStudentArchivStatus(
                          this.props.student._id,
                          true
                        )
                      }
                    >
                      Move to Archiv
                    </Dropdown.Item>
                  )}
                {this.props.isArchivPage &&
                  this.props.user.role !== 'Editor' && (
                    <Dropdown.Item
                      eventKey="6"
                      onClick={() =>
                        this.props.updateStudentArchivStatus(
                          this.props.student._id,
                          false
                        )
                      }
                    >
                      Move to Active
                    </Dropdown.Item>
                  )}
              </DropdownButton>
            )}
          </td>
          {this.props.role !== 'Student' ? (
            <td>
              <p className="mb-1">
                <Link
                  to={
                    '/student-database/' +
                    this.props.student._id +
                    '/background'
                  }
                  className="text-info"
                  style={{ textDecoration: 'none' }}
                >
                  {this.props.student.firstname}, {this.props.student.lastname}{' '}
                  {' | '}
                  {this.props.student.lastname_chinese}
                  {this.props.student.firstname_chinese}
                </Link>
              </p>
              <p className="mb-0 text-muted">{this.props.student.email}</p>
            </td>
          ) : (
            <></>
          )}
          <td>{studentsAgent}</td>
          <td>{studentsEditor}</td>
          <td>
            <b>
              {
                this.props.student.academic_background.university
                  .attended_university
              }
            </b>
            <br />

            {
              this.props.student.academic_background.university
                .attended_university_program
            }
          </td>
          <td>{target_application_field}</td>
          <td>
            {
              this.props.student.academic_background.language
                .english_certificate
            }
            <br />
            {this.props.student.academic_background.language.german_certificate}
          </td>
          <td>
            {this.props.student.academic_background.language.english_score}
            <br />
            {this.props.student.academic_background.language.german_score}
          </td>
          <td>
            {this.props.student.academic_background.language
              .english_isPassed === 'X' &&
              this.props.student.academic_background.language.english_test_date}
            <br />
            {this.props.student.academic_background.language.german_isPassed ===
              'X' &&
              this.props.student.academic_background.language.german_test_date}
          </td>
        </tr>
        {is_TaiGer_role(this.props.user) && (
          <>
            <EditAgentsSubpage
              student={this.props.student}
              agent_list={this.props.agent_list}
              show={this.state.showAgentPage}
              onHide={this.setAgentModalhide}
              setmodalhide={this.setAgentModalhide}
              updateAgentList={this.props.updateAgentList}
              handleChangeAgentlist={this.props.handleChangeAgentlist}
              submitUpdateAgentlist={this.submitUpdateAgentlist}
            />
            <EditEditorsSubpage
              student={this.props.student}
              editor_list={this.props.editor_list}
              show={this.state.showEditorPage}
              onHide={this.setEditorModalhide}
              setmodalhide={this.setEditorModalhide}
              updateEditorList={this.props.updateEditorList}
              handleChangeEditorlist={this.props.handleChangeEditorlist}
              submitUpdateEditorlist={this.submitUpdateEditorlist}
            />
          </>
        )}
      </>
    );
  }
}

export default StudentsAgentEditor;

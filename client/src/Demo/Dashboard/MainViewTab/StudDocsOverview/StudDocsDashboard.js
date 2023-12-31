import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DEMO from '../../../../store/constant';

class StudDocsDashboard extends React.Component {
  state = {
    showAgentPage: false,
    showEditorPage: false,
    showProgramPage: false,
    showFilePage: false
  };

  setProgramModalhide = () => {
    this.setState({
      showProgramPage: false
    });
  };

  startEditingProgram = () => {
    this.setState({
      showProgramPage: true
    });
  };

  updateStudentArchivStatus = (studentId, isArchived) => {
    this.props.updateStudentArchivStatus(studentId, isArchived);
  };

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
      this.props.student.editors === undefined ||
      this.props.student.editors.length === 0
    ) {
      studentsEditor = <p className="text-danger">No Editor assigned</p>;
    } else {
      studentsEditor = this.props.student.editors.map((editor, i) => (
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
    const target_application_field = this.props.student.application_preference
      ? this.props.student.application_preference.target_application_field || (
          <span className="text-danger">TBD</span>
        )
      : '';
    return (
      <>
        <tr
          style={{
            backgroundColor: this.props.student.archiv === true ? '#1de9b6' : ''
          }}
          title={this.props.student.archiv === true ? 'Closed' : 'Open'}
        >
          <td>
            {this.props.isDashboard && this.props.user.role !== 'Editor' && (
              <DropdownButton
                size="sm"
                className="mx-0"
                title="Option"
                variant="primary"
                id={`dropdown-variants-${this.props.student._id}`}
                key={this.props.student._id}
              >
                <Dropdown.Item
                  eventKey="5"
                  onClick={() =>
                    this.updateStudentArchivStatus(this.props.student._id, true)
                  }
                >
                  Move to Archiv
                </Dropdown.Item>
              </DropdownButton>
            )}
            {this.props.isArchivPage && this.props.user.role !== 'Editor' && (
              <DropdownButton
                size="sm"
                className="mx-0"
                title="Option"
                variant="primary"
                id={`dropdown-variants-${this.props.student._id}`}
                key={this.props.student._id}
              >
                <Dropdown.Item
                  eventKey="6"
                  onClick={() =>
                    this.updateStudentArchivStatus(
                      this.props.student._id,
                      false
                    )
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
                this.props.student._id,
                '/background'
              )}`}
              className="text-info"
              style={{ textDecoration: 'none' }}
            >
              <b>
                {this.props.student.firstname}, {this.props.student.lastname}
                {' | '}
                {this.props.student.lastname_chinese}
                {this.props.student.firstname_chinese}
              </b>
            </Link>
            <br />
            {this.props.student.email}
          </td>
          <td>{studentsAgent}</td>
          <td>{studentsEditor}</td>
          <td>
            {this.props.student.application_preference
              .expected_application_date || <p className="text-danger">TBD</p>}
          </td>
          <td>
            {this.props.student.application_preference
              .expected_application_semester || (
              <span className="text-danger">TBD</span>
            )}
          </td>
          <td>
            {this.props.student.application_preference.target_degree || (
              <p className="text-danger">TBD</p>
            )}
          </td>
          <td>
            <b>
              {this.props.student.academic_background.university
                .attended_university || (
                <span className="text-danger">TBD</span>
              )}
            </b>
            <br />
            {this.props.student.academic_background.university
              .attended_university_program || (
              <span className="text-danger">TBD</span>
            )}
          </td>
          <td>{target_application_field}</td>
          <td>
            {this.props.student.academic_background.language
              .english_certificate || <span className="text-danger">TBD</span>}
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
      </>
    );
  }
}

export default StudDocsDashboard;

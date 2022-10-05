import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
    return (
      <>
        <tr>
          <td>
            <DropdownButton
              size="sm"
              title="Option"
              variant="primary"
              id={`dropdown-variants-${this.props.student._id}`}
              key={this.props.student._id}
            >
              {this.props.isDashboard ? (
                <Dropdown.Item
                  eventKey="5"
                  onSelect={() =>
                    this.updateStudentArchivStatus(this.props.student._id, true)
                  }
                >
                  Move to Archiv
                </Dropdown.Item>
              ) : (
                <></>
              )}
              {this.props.isArchivPage ? (
                <Dropdown.Item
                  eventKey="6"
                  onSelect={() =>
                    this.updateStudentArchivStatus(
                      this.props.student._id,
                      false
                    )
                  }
                >
                  Move to Active
                </Dropdown.Item>
              ) : (
                <></>
              )}
            </DropdownButton>
          </td>
          <td>
            <Link
              to={'/student-database/' + this.props.student._id + '/background'}
              className="text-info"
              style={{ textDecoration: 'none' }}
            >
              {this.props.student.firstname}, {this.props.student.lastname}
            </Link>
            <br />
            {this.props.student.email}
          </td>
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
            {this.props.student.academic_background.language.english_test_date}
            <br />
            {this.props.student.academic_background.language.german_test_date}
          </td>
        </tr>
      </>
    );
  }
}

export default StudDocsDashboard;

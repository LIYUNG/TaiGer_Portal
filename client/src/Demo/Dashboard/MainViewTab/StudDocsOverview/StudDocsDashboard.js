import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsDash } from "react-icons/bs";
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import EditAgentsSubpage from "./EditAgentsSubpage";
import EditEditorsSubpage from "./EditEditorsSubpage";
class StudDocsDashboard extends React.Component {
  state = {
    showAgentPage: false,
    showEditorPage: false,
    showProgramPage: false,
    showFilePage: false,
  };

  setProgramModalhide = () => {
    this.setState({
      showProgramPage: false,
    });
  };

  startEditingProgram = () => {
    this.setState({
      showProgramPage: true,
    });
  };

  updateStudentArchivStatus = (studentId, isArchived) => {
    this.props.updateStudentArchivStatus(studentId, isArchived);
  };

  render() {
    return (
      <>
        <tbody>
          <tr>
            <td>
              <DropdownButton
                size="sm"
                title="Option"
                variant="primary"
                id={`dropdown-variants-${this.props.student._id}`}
                key={this.props.student._id}
              >
                {this.props.role !== "Editor" && !this.props.isArchivPage ? (
                  <Dropdown.Item
                    eventKey="3"
                    onSelect={() => this.startEditingProgram()}
                  >
                    Edit Program
                  </Dropdown.Item>
                ) : (
                  <></>
                )}
                {this.props.isDashboard ? (
                  <Dropdown.Item
                    eventKey="5"
                    onSelect={() =>
                      this.updateStudentArchivStatus(
                        this.props.student._id,
                        true
                      )
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
                to={
                  "/student-database/" + this.props.student._id + "/background"
                }
              >
                {this.props.student.firstname}, {this.props.student.lastname}
              </Link>
              <br />
              {this.props.student.email}
            </td>
            <td>
              {
                this.props.student.academic_background.university
                  .attended_university
              }
            </td>{" "}
            <td>
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
              {
                this.props.student.academic_background.language
                  .german_certificate
              }
            </td>
            <td>
              {this.props.student.academic_background.language.english_score}
              <br />
              {this.props.student.academic_background.language.german_score}
            </td>
            <td>
              {
                this.props.student.academic_background.language
                  .english_test_date
              }
              <br />
              {this.props.student.academic_background.language.german_test_date}
            </td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default StudDocsDashboard;

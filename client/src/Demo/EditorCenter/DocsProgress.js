import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import EditProgramsFilesSubpage from "./EditProgramsFilesSubpage";

class DocsProgress extends React.Component {
  state = {
    showProgramFilesPage: false,
    student: this.props.student,
    file: "",
  };
  startEditingProgramFiles = () => {
    console.log("startEditingProgram");
    this.setState({
      showProgramFilesPage: true,
    });
  };

  setProgramFilesModalhide = () => {
    this.setState({
      showProgramFilesPage: false,
    });
  };
  render() {
    let applying_university;
    let applying_program;
    let application_deadline;
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university = <h5 className="mb-1"> No University</h5>;
      applying_program = <h5 className="mb-1"> No Program</h5>;
      application_deadline = <h5 className="mb-1"> No Date</h5>;
    } else {
      applying_university = this.props.student.applications.map(
        (application, i) => (
          <h5 className="mb-1" key={i}>
            {application.programId.school}
          </h5>
        )
      );
      applying_program = this.props.student.applications.map(
        (application, i) => (
          <h5 className="mb-1" key={i}>
            {application.programId.program}
          </h5>
        )
      );
      application_deadline = this.props.student.applications.map(
        (application, i) => (
          <h5 className="mb-1" key={i}>
            {application.programId.application_deadline}
          </h5>
        )
      );
    }

    return (
      <>
        <tbody>
          <tr>
            <td>
              <DropdownButton
                className="btn ml-2"
                size="sm"
                title="Option"
                variant="primary"
                id={`dropdown-variants-${this.props.student._id}`}
                key={this.props.student._id}
              >
                <Dropdown.Item
                  eventKey="4"
                  onSelect={() => this.startEditingProgramFiles()}
                >
                  Edit Files
                </Dropdown.Item>
              </DropdownButton>
            </td>
            {this.props.role !== "Student" ? (
              <td>
                <p>
                  {this.props.student.firstname}, {this.props.student.lastname}
                </p>
              </td>
            ) : (
              <></>
            )}
            <td>{applying_university}</td>
            <td>{applying_program}</td>
            <td>{application_deadline}</td>
          </tr>
        </tbody>
        <>
          <EditProgramsFilesSubpage
            role={this.props.role}
            student={this.state.student}
            show={this.state.showProgramFilesPage}
            onHide={this.setProgramFilesModalhide}
            setmodalhide={this.setProgramFilesModalhide}
          />
        </>
      </>
    );
  }
}

export default DocsProgress;

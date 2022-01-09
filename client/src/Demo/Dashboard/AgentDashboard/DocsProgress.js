import React from "react";
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { Card, Col, Row, Table } from "react-bootstrap";
import avatar1 from "../../../assets/images/user/avatar-1.jpg";
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
            {application.programId.University_}
          </h5>
        )
      );
      applying_program = this.props.student.applications.map(
        (application, i) => (
          <h5 className="mb-1" key={i}>
            {application.programId.Program_}
          </h5>
        )
      );
      application_deadline = this.props.student.applications.map(
        (application, i) => (
          <h5 className="mb-1" key={i}>
            {application.programId.Application_end_date_}
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
            <td>
              <h5>
                {this.props.student.firstname}, {this.props.student.lastname}
              </h5>
            </td>
            <td>{applying_university}</td>
            <td>{applying_program}</td>
            <td>{application_deadline}</td>
            {/* {this.props.studentDocOverview} */}
          </tr>
        </tbody>
        <>
          <EditProgramsFilesSubpage
            student={this.state.student}
            show={this.state.showProgramFilesPage}
            onHide={this.setProgramFilesModalhide}
            setmodalhide={this.setProgramFilesModalhide}
            onDeleteProgram={this.props.onDeleteProgram}
          />
        </>
      </>
    );
  }
}

export default DocsProgress;

import React from "react";
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { Card, Col, Row, Table } from "react-bootstrap";
import avatar1 from "../../../assets/images/user/avatar-1.jpg";

class ApplicationStatus extends React.Component {
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
              <h5>
                {this.props.student.firstname_}, {this.props.student.lastname_}
              </h5>
            </td>
            <td>{applying_university}</td>
            <td>{applying_program}</td>
            <td>{application_deadline}</td>
            {/* {this.props.studentDocOverview} */}
          </tr>
        </tbody>
      </>
    );
  }
}

export default ApplicationStatus;

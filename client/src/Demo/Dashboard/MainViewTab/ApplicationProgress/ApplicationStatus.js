import React from "react";
// import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
// import { Card, Col, Row, Table } from "react-bootstrap";
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";

class ApplicationStatus extends React.Component {
  render() {
    var applying_university;
    var applying_program;
    var application_deadline;
    var application_prepared;
    var application_closed;
    var application_admission;
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university = <h6 className="mb-1"> No University</h6>;
      applying_program = <h6 className="mb-1"> No Program</h6>;
      application_deadline = <h6 className="mb-1"> No Date</h6>;
      application_prepared = <h6 className="mb-1"></h6>;
      application_closed = <h6 className="mb-1"></h6>;
    } else {
      applying_university = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {application.programId.University_}
          </h6>
        )
      );
      applying_program = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {application.programId.Program_}
          </h6>
        )
      );
      application_deadline = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {application.programId.Application_end_date_}
          </h6>
        )
      );
      application_prepared = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {application.prepared ? <h6>True</h6> : <h6>False</h6>}
          </h6>
        )
      );
      application_closed = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {application.closed ? <h6>True</h6> : <h6>False</h6>}
          </h6>
        )
      );
      application_admission = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {application.admission ? <h6>True</h6> : <h6>False</h6>}
          </h6>
        )
      );
    }

    return (
      <>
        <tbody>
          <tr>
            {this.props.role !== "Student" ? (
              <td>
                <h6>
                  {this.props.student.firstname}, {this.props.student.lastname}
                </h6>
              </td>
            ) : (
              <></>
            )}
            <td>{applying_university}</td>
            <td>{applying_program}</td>
            <td>{application_deadline}</td>
            <td></td>
            <td>{application_prepared}</td>
            <td>{application_closed}</td>
            <td>{application_admission}</td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default ApplicationStatus;

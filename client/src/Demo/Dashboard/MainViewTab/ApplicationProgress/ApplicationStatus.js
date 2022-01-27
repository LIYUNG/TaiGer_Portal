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
      applying_university = <h5 className="mb-1"> No University</h5>;
      applying_program = <h5 className="mb-1"> No Program</h5>;
      application_deadline = <h5 className="mb-1"> No Date</h5>;
      application_prepared = <h5 className="mb-1"></h5>;
      application_closed = <h5 className="mb-1"></h5>;
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
      application_prepared = this.props.student.applications.map(
        (application, i) => (
          <h5 className="mb-1" key={i}>
            {application.prepared ? <h5>True</h5> : <h5>False</h5>}
          </h5>
        )
      );
      application_closed = this.props.student.applications.map(
        (application, i) => (
          <h5 className="mb-1" key={i}>
            {application.closed ? <h5>True</h5> : <h5>False</h5>}
          </h5>
        )
      );
      application_admission = this.props.student.applications.map(
        (application, i) => (
          <h5 className="mb-1" key={i}>
            {application.admission ? <h5>True</h5> : <h5>False</h5>}
          </h5>
        )
      );
    }

    return (
      <>
        <tbody>
          <tr>
            {this.props.role !== "Student" ? (
              <td>
                <h5>
                  {this.props.student.firstname}, {this.props.student.lastname}
                </h5>
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

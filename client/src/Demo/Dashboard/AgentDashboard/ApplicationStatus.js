import React from "react";
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { Card, Col, Row, Table } from "react-bootstrap";
import avatar1 from "../../../assets/images/user/avatar-1.jpg";

class ApplicationStatus extends React.Component {
  render() {
    let applying_universit;
    let applying_program;
    let application_deadline;
    let programId = this.props.student.applications[0].programId;
    console.log(typeof programId);
    if (this.props.student.applications) {
      applying_universit = this.props.student.applications.map(
        (application) => (
          <>
            <h5 className="mb-1">{application.programId.University_}</h5>
          </>
        )
      );
    } else {
      applying_universit = (
        <tr>
          <td>
            <h4 className="mb-1"> No Program</h4>
          </td>
        </tr>
      );
    }

    if (this.props.student.applications) {
      applying_program = this.props.student.applications.map((application) => (
        <>
          <h5 className="mb-1">{application.programId.Program_}</h5>
        </>
      ));
    } else {
      applying_program = (
        <tr>
          <td>
            <h4 className="mb-1"> No Program</h4>
          </td>
        </tr>
      );
    }

    if (this.props.student.applications) {
      application_deadline = this.props.student.applications.map(
        (application) => (
          <>
            <h5 className="mb-1">
              {application.programId.Application_end_date_}
            </h5>
          </>
        )
      );
    } else {
      application_deadline = (
        <tr>
          <td>
            <h4 className="mb-1"> No Program</h4>
          </td>
        </tr>
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
            <td>{applying_universit}</td>
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

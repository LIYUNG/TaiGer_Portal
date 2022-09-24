import React from 'react';
// import { Card, Col, Row } from "react-bootstrap";
import {
  Dropdown,
  DropdownButton,
  Modal,
  Button,
  Table
} from 'react-bootstrap';
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import { Link } from 'react-router-dom';

class ApplicationProgress extends React.Component {
  getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
  }

  render() {
    var applying_university;
    var applying_program;
    var application_deadline;
    var application_date_left;
    var application_decided;
    var application_closed;
    var application_admission;
    var today = new Date();
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university = <p className="mb-1"> No University</p>;
      applying_program = <p className="mb-1"> No Program</p>;
      application_deadline = <p className="mb-1"> No Date</p>;
      application_date_left = <p className="mb-1"></p>;
      application_decided = <p className="mb-1"></p>;
      application_closed = <p className="mb-1"></p>;
    } else {
      applying_university = this.props.student.applications.map(
        (application, i) => (
          <Link
            to={'/programs/' + application.programId._id}
            className="text-info"
            key={i}
          >
            <p className="mb-1">{application.programId.school}</p>
          </Link>
        )
      );
      applying_program = this.props.student.applications.map(
        (application, i) => (
          <Link
            to={'/programs/' + application.programId._id}
            className="text-info"
            key={i}
          >
            <p className="mb-1">{application.programId.program_name}</p>
          </Link>
        )
      );
      application_deadline = this.props.student.applications.map(
        (application, i) => (
          <p className="mb-1" key={i}>
            {application.programId.application_deadline
              ? this.props.student.academic_background.university
                  .expected_application_date
                ? this.props.student.academic_background.university
                    .expected_application_date + '-'
                : ''
              : '-'}
            {application.programId.application_deadline}
          </p>
        )
      );

      application_date_left = this.props.student.applications.map(
        (application, i) => (
          <p className="mb-1" key={i}>
            {application.closed
              ? '-'
              : application.programId.application_deadline
              ? this.props.student.academic_background.university
                  .expected_application_date &&
                this.getNumberOfDays(
                  today,
                  this.props.student.academic_background.university
                    .expected_application_date +
                    '-' +
                    application.programId.application_deadline
                )
              : '-'}
          </p>
        )
      );
      application_decided = this.props.student.applications.map(
        (application, i) =>
          application.decided !== undefined && application.decided === true ? (
            <p className="mb-1" key={i}>
              O
            </p>
          ) : (
            <p className="mb-1" key={application._id}>
              X
            </p>
          )
      );
      application_closed = this.props.student.applications.map(
        (application, i) =>
          application.closed !== undefined && application.closed === true ? (
            <p className="mb-1" key={i}>
              O
            </p>
          ) : (
            <p className="mb-1" key={application._id}>
              X
            </p>
          )
      );
      application_admission = this.props.student.applications.map(
        (application, i) =>
          application.admission !== undefined &&
          application.admission === true ? (
            <p className="mb-1" key={i}>
              O
            </p>
          ) : (
            <p className="mb-1" key={application._id}>
              X
            </p>
          )
      );
    }

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
                {this.props.role !== 'Editor' && !this.props.isArchivPage ? (
                  <Dropdown.Item eventKey="3">
                    <Link
                      to={'/student-applications/' + this.props.student._id}
                    >
                      Edit Program
                    </Link>
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
            {this.props.role !== 'Student' ? (
              <td>
                <Link
                  to={
                    '/student-database/' +
                    this.props.student._id +
                    '/background'
                  }
                  className="text-info"
                >
                  <p>
                    {this.props.student.firstname},{' '}
                    {this.props.student.lastname}
                  </p>
                </Link>
              </td>
            ) : (
              <></>
            )}
            <td>{applying_university}</td>
            <td>{applying_program}</td>
            <td>{application_deadline}</td>
            <td>{application_decided}</td>
            <td>{application_closed}</td>
            <td>{application_admission}</td>
            <td>{application_date_left}</td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default ApplicationProgress;

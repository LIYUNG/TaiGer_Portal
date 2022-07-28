import React from 'react';
// import { Card, Col, Row } from "react-bootstrap";
import { Dropdown, DropdownButton } from "react-bootstrap";
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
    console.log(today);
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university = <h6 className="mb-1"> No University</h6>;
      applying_program = <h6 className="mb-1"> No Program</h6>;
      application_deadline = <h6 className="mb-1"> No Date</h6>;
      application_date_left = <h6 className="mb-1"></h6>;
      application_decided = <h6 className="mb-1"></h6>;
      application_closed = <h6 className="mb-1"></h6>;
    } else {
      applying_university = this.props.student.applications.map(
        (application, i) => (
          <Link to={'/programs/' + application.programId._id}>
            <h6 className="mb-1" key={i}>
              {application.programId.school}
            </h6>
          </Link>
        )
      );
      applying_program = this.props.student.applications.map(
        (application, i) => (
          <Link to={'/programs/' + application.programId._id}>
            <h6 className="mb-1" key={i}>
              {application.programId.program_name}
            </h6>
          </Link>
        )
      );
      application_deadline = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {this.props.student.academic_background.university
              .expected_application_date
              ? this.props.student.academic_background.university
                  .expected_application_date + '-'
              : ''}
            {application.programId.application_deadline}
          </h6>
        )
      );

      application_date_left = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {application.closed
              ? '-'
              : this.props.student.academic_background.university
                  .expected_application_date &&
                this.getNumberOfDays(
                  today,
                  this.props.student.academic_background.university
                    .expected_application_date +
                    '-' +
                    application.programId.application_deadline
                )}
          </h6>
        )
      );
      application_decided = this.props.student.applications.map(
        (application, i) =>
          application.decided !== undefined && application.decided === true ? (
            <h6 className="mb-1" key={i}>
              O
            </h6>
          ) : (
            <h6 className="mb-1" key={i}>
              X
            </h6>
          )
      );
      application_closed = this.props.student.applications.map(
        (application, i) =>
          application.closed !== undefined && application.closed === true ? (
            <h6 className="mb-1" key={i}>
              O
            </h6>
          ) : (
            <h6 className="mb-1" key={i}>
              X
            </h6>
          )
      );
      application_admission = this.props.student.applications.map(
        (application, i) =>
          application.admission !== undefined &&
          application.admission === true ? (
            <h6 className="mb-1" key={i}>
              O
            </h6>
          ) : (
            <h6 className="mb-1" key={i}>
              X
            </h6>
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
            {this.props.role !== 'Student' ? (
              <td>
                <Link to={'/student-database/' + this.props.student._id}>
                  <h6>
                    {this.props.student.firstname},{' '}
                    {this.props.student.lastname}
                  </h6>
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

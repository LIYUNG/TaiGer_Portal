import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getNumberOfDays } from '../../../Utils/contants';
class ApplicationProgress extends React.Component {
  updateStudentArchivStatus = (studentId, isArchived) => {
    this.props.updateStudentArchivStatus(studentId, isArchived);
  };

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
      applying_university = <p className="mb-1  text-danger"> No University</p>;
      applying_program = <p className="mb-1  text-danger"> No Program</p>;
      application_deadline = <p className="mb-1  text-danger"> No Date</p>;
      application_date_left = <p className="mb-1  text-danger"></p>;
      application_decided = <p className="mb-1  text-danger"></p>;
      application_closed = <p className="mb-1  text-danger"></p>;
    } else {
      applying_university = this.props.student.applications.map(
        (application, i) => (
          <Link
            to={'/programs/' + application.programId._id}
            style={{ textDecoration: 'none' }}
            key={i}
          >
            <p className="mb-1 text-info">{application.programId.school}</p>
          </Link>
        )
      );
      applying_program = this.props.student.applications.map(
        (application, i) => (
          <Link
            to={'/programs/' + application.programId._id}
            style={{ textDecoration: 'none' }}
            key={i}
          >
            <p className="mb-1 text-info">
              {application.programId.program_name}
            </p>
          </Link>
        )
      );
      application_deadline = this.props.student.applications.map(
        (application, i) => (
          <p className="mb-1 text-info" key={i}>
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
          <p className="mb-1 text-info" key={i}>
            {application.closed === 'O'
              ? '-'
              : application.programId.application_deadline
              ? this.props.student.academic_background.university
                  .expected_application_date &&
                getNumberOfDays(
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
          application.decided !== undefined && application.decided === 'O' ? (
            <p className="mb-1 text-info" key={i}>
              O
            </p>
          ) : application.decided !== undefined &&
            application.decided === 'X' ? (
            <p className="mb-1 text-info" key={application._id}>
              X
            </p>
          ) : (
            <p className="mb-1 text-info" key={application._id}>
              -
            </p>
          )
      );
      application_closed = this.props.student.applications.map(
        (application, i) =>
          application.closed !== undefined && application.closed === 'O' ? (
            <p className="mb-1 text-info" key={i}>
              O
            </p>
          ) : application.closed !== undefined && application.closed === 'X' ? (
            <p className="mb-1 text-info" key={application._id}>
              X
            </p>
          ) : (
            <p className="mb-1 text-info" key={application._id}>
              -
            </p>
          )
      );
      application_admission = this.props.student.applications.map(
        (application, i) =>
          application.admission !== undefined &&
          application.admission === 'O' ? (
            <p className="mb-1 text-info" key={i}>
              O
            </p>
          ) : application.admission !== undefined &&
            application.admission === 'X' ? (
            <p className="mb-1 text-info" key={application._id}>
              X
            </p>
          ) : (
            <p className="mb-1 text-info" key={application._id}>
              -
            </p>
          )
      );
    }

    return (
      <>
        <tr>
          <td>
            <DropdownButton
              size="sm"
              // title="Option"
              title={
                <span>
                  <i className="fa fa-edit"></i>
                </span>
              }
              variant="primary"
              id={`dropdown-variants-${this.props.student._id}`}
              key={this.props.student._id}
            >
              {this.props.role !== 'Editor' && !this.props.isArchivPage ? (
                <Dropdown.Item eventKey="3">
                  <Link
                    to={'/student-applications/' + this.props.student._id}
                    style={{ textDecoration: 'none' }}
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
          {this.props.role !== 'Student' ? (
            <td>
              <Link
                to={
                  '/student-database/' + this.props.student._id + '/background'
                }
                style={{ textDecoration: 'none' }}
              >
                <p className="text-info">
                  <b>
                    {this.props.student.firstname},{' '}
                    {this.props.student.lastname}
                  </b>
                </p>
              </Link>
            </td>
          ) : (
            <></>
          )}
          {this.props.role !== 'Student' ? (
            <td>
              {this.props.student.applying_program_count ? (
                this.props.student.applications.length <
                this.props.student.applying_program_count ? (
                  <b className="text-danger">
                    {this.props.student.applying_program_count}
                  </b>
                ) : (
                  <p className="text-info">
                    {this.props.student.applying_program_count}
                  </p>
                )
              ) : (
                <b className="text-danger">
                  0
                </b>
              )}
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
      </>
    );
  }
}

export default ApplicationProgress;

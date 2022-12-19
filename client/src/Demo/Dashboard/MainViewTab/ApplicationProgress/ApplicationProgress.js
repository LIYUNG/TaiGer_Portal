import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getNumberOfDays } from '../../../Utils/contants';
import {
  shownButtonMyOwnStudent,
  application_deadline_calculator
} from '../../../Utils/checking-functions';

class ApplicationProgress extends React.Component {
  updateStudentArchivStatus = (studentId, isArchived) => {
    this.props.updateStudentArchivStatus(studentId, isArchived);
  };

  render() {
    var applying_university;
    var applying_program;
    var program_semester;
    var application_deadline;
    var application_decided;
    var application_closed;
    var application_admission;
    var application_date_left;
    var today = new Date();
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university = <p className="mb-1  text-danger"> No University</p>;
      applying_program = <p className="mb-1  text-danger"> No Program</p>;
      program_semester = <p className="mb-1  text-danger"> No Program</p>;
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
            {application.decided === 'O' ? (
              <p className="mb-1 text-info">{application.programId.school}</p>
            ) : (
              <p className="mb-1 text-secondary" title="Not decided yet">
                {application.programId.school}
              </p>
            )}
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
            {application.decided === 'O' ? (
              <p className="mb-1 text-info">
                {application.programId.program_name}
              </p>
            ) : (
              <p className="mb-1 text-secondary" title="Not decided yet">
                {application.programId.program_name}
              </p>
            )}
          </Link>
        )
      );
      program_semester = this.props.student.applications.map(
        (application, i) => (
          <Link
            to={'/programs/' + application.programId._id}
            style={{ textDecoration: 'none' }}
            key={i}
          >
            {application.decided === 'O' ? (
              <p className="mb-1 text-info">{application.programId.semester}</p>
            ) : (
              <p className="mb-1 text-secondary" title="Not decided yet">
                {application.programId.semester}
              </p>
            )}
          </Link>
        )
      );
      application_deadline = this.props.student.applications.map(
        (application, i) =>
          application.decided === 'O' ? (
            application.closed === 'O' ? (
              <p className="mb-1 text-warning" key={i}>
                Close
              </p>
            ) : (
              <p className="mb-1 text-info" key={i}>
                {application_deadline_calculator(
                  this.props.student,
                  application
                )}
              </p>
            )
          ) : (
            <p className="mb-1 text-secondary" key={i} title="Not decided yet">
              {application_deadline_calculator(this.props.student, application)}
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
            <p className="mb-1 text-danger" key={application._id}>
              ?
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
            <p className="mb-1 text-danger" key={application._id}>
              ?
            </p>
          ) : (
            <p className="mb-1 text-danger" key={application._id}>
              ?
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
            <p className="mb-1 text-danger" key={application._id}>
              ?
            </p>
          )
      );

      application_date_left = this.props.student.applications.map(
        (application, i) => (
          <p className="mb-1 text-info" key={i}>
            {application.closed === 'O'
              ? '-'
              : application.programId.application_deadline
              ? this.props.student.application_preference &&
                this.props.student.application_preference
                  .expected_application_date &&
                getNumberOfDays(
                  today,
                  this.props.student.application_preference
                    .expected_application_date +
                    '-' +
                    application.programId.application_deadline
                )
              : '-'}
          </p>
        )
      );
    }

    return (
      <>
        <tr>
          <td>
            {/* If my own student */}
            {shownButtonMyOwnStudent(
              this.props.user,
              this.props.student._id.toString()
            ) && (
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
                {this.props.user.role !== 'Editor' &&
                !this.props.isArchivPage ? (
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
                {this.props.isDashboard &&
                this.props.user.role !== 'Student' &&
                this.props.user.role !== 'Guest' ? (
                  <Dropdown.Item
                    eventKey="5"
                    onClick={() =>
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
                {this.props.isArchivPage &&
                this.props.user.role !== 'Student' &&
                this.props.user.role !== 'Guest' ? (
                  <Dropdown.Item
                    eventKey="6"
                    onClick={() =>
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
            )}
          </td>
          {this.props.user.role !== 'Student' ? (
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
          {this.props.user.role !== 'Student' ? (
            <td title="Selected / Should be selected">
              {this.props.student.applying_program_count ? (
                this.props.student.applications.length <
                this.props.student.applying_program_count ? (
                  <p className="text-danger">
                    <b>{this.props.student.applications.length}</b> /{' '}
                    {this.props.student.applying_program_count}
                  </p>
                ) : (
                  <p className="text-info">
                    {this.props.student.applications.length} /{' '}
                    {this.props.student.applying_program_count}
                  </p>
                )
              ) : (
                <b className="text-danger">0</b>
              )}
            </td>
          ) : (
            <></>
          )}
          <td>{applying_university}</td>
          <td>{applying_program}</td>
          <td>{program_semester}</td>
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

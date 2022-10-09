import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import { Link } from 'react-router-dom';
import { getNumberOfDays } from '../../../Utils/contants';
class CVMLRLProgress extends React.Component {
  updateStudentArchivStatus = (studentId, isArchived) => {
    this.props.updateStudentArchivStatus(studentId, isArchived);
  };

  render() {
    var applying_university;
    var applying_program;
    var application_deadline;
    var application_date_left;
    var application_closed;
    var today = new Date();
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university = <p className="mb-1  text-danger"> No University</p>;
      applying_program = <p className="mb-1  text-danger"> No Program</p>;
      application_deadline = <p className="mb-1  text-danger"> No Date</p>;
      application_date_left = <p className="mb-1  text-danger"></p>;
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
    }

    let general_document_items = <></>;
    // TODO: implement:
    let no_started_general_document_items = <></>;
    let application_document_items = <></>;
    // TODO: implement:
    let no_started_application_document_items = <></>;
    general_document_items = this.props.student.generaldocs_threads.map(
      (generaldocs_thread, i) => (
        <tr>
          <td></td>
          <td>
            <Link
              to={'/student-database/' + this.props.student._id + '/CV_ML_RL'}
              style={{ textDecoration: 'none' }}
            >
              <p className="text-light">
                <b>
                  {this.props.student.firstname} {this.props.student.lastname}
                </b>
              </p>
            </Link>
          </td>
          {generaldocs_thread.isFinalVersion ? (
            <td className="mb-1 text-info" key={i}>
              O
            </td>
          ) : generaldocs_thread.isReceivedStudentFeedback ? (
            <td className="mb-1 text-info" key={generaldocs_thread._id}>
              react
            </td>
          ) : (
            <td className="mb-1 text-info" key={generaldocs_thread._id}>
              waiting
            </td>
          )}
          <td>{generaldocs_thread.doc_thread_id.file_type}</td>
          <td>
            {' '}
            {new Date(generaldocs_thread.updatedAt).toLocaleDateString()}
            {', '}
            {new Date(generaldocs_thread.updatedAt).toLocaleTimeString()}
          </td>
          <td>{getNumberOfDays(generaldocs_thread.updatedAt, today)}</td>
          <td></td>
          <td></td>
        </tr>
      )
    );
    application_document_items = this.props.student.applications.map(
      (application, i) =>
        application.doc_modification_thread.map((doc_thread, j) => (
          <tr key={j}>
            <td></td>
            <td>
              <Link
                to={'/student-database/' + this.props.student._id + '/CV_ML_RL'}
                style={{ textDecoration: 'none' }}
              >
                <p className="text-light">
                  <b>
                    {this.props.student.firstname} {this.props.student.lastname}
                  </b>
                </p>
              </Link>
            </td>
            {doc_thread.isFinalVersion ? (
              <td className="mb-1 text-info" key={i}>
                O
              </td>
            ) : doc_thread.isReceivedStudentFeedback ? (
              <td className="mb-1 text-info" key={application._id}>
                react
              </td>
            ) : (
              <td className="mb-1 text-info" key={application._id}>
                waiting
              </td>
            )}
            <td>
              {doc_thread.doc_thread_id.file_type}
              {' - '}
              {application.programId.school}
              {' - '}
              {application.programId.program_name}
            </td>
            <td>
              {' '}
              {new Date(doc_thread.updatedAt).toLocaleDateString()}
              {', '}
              {new Date(doc_thread.updatedAt).toLocaleTimeString()}
            </td>
            <td>{getNumberOfDays(today, doc_thread.updatedAt)}</td>
            <td>
              {
                this.props.student.academic_background.university
                  .expected_application_date
              }
              {'-'}
              {application.programId.application_deadline}
            </td>
            <td>
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
            </td>
          </tr>
        ))
    );
    return (
      <>
        {no_started_general_document_items}
        {no_started_application_document_items}
        {general_document_items}
        {application_document_items}
        <tr>
          {/* <td>
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
                to={'/student-database/' + this.props.student._id + '/CV_ML_RL'}
                style={{ textDecoration: 'none' }}
              >
                <p className="text-info">
                  {this.props.student.firstname}, {this.props.student.lastname}
                </p>
              </Link>
            </td>
          ) : (
            <></>
          )}
          <td>{applying_university}</td>
          <td>{applying_program}</td>
          <td>{application_deadline}</td>
          <td>{application_closed}</td>
          <td>{application_date_left}</td> */}
        </tr>
      </>
    );
  }
}

export default CVMLRLProgress;

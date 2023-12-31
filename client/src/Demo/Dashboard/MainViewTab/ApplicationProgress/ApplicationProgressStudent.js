import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';

import { getNumberOfDays } from '../../../Utils/contants';
import {
  showButtonIfMyStudent,
  application_deadline_calculator
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';

class ApplicationProgressStudent extends React.Component {
  updateStudentArchivStatus = (studentId, isArchived) => {
    this.props.updateStudentArchivStatus(studentId, isArchived);
  };

  render() {
    var applying_university;
    var applying_program;
    var application_deadline;
    var application_decided;
    var application_admission;
    var application_date_left;
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
    } else {
      applying_university = this.props.student.applications.map(
        (application, i) => (
          <Link
            to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
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
            to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
            style={{ textDecoration: 'none' }}
            key={i}
          >
            {application.decided === 'O' ? (
              <p className="mb-1 text-info">
                {application.programId.program_name}
                {' - '}
                {application.programId.degree}
                {' - '}
                {application.programId.semester}
              </p>
            ) : (
              <p className="mb-1 text-secondary" title="Not decided yet">
                {application.programId.program_name}
                {' - '}
                {application.programId.degree}
                {' - '}
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
          application.decided === 'O' ? (
            <p className="mb-1 text-info" key={i}>
              O
            </p>
          ) : application.decided === 'X' ? (
            <p className="mb-1 text-info" key={application._id}>
              X
            </p>
          ) : (
            <p className="mb-1 text-danger" key={application._id}>
              ?
            </p>
          )
      );

      application_admission = this.props.student.applications.map(
        (application, i) =>
          application.admission === 'O' ? (
            <p className="mb-1 text-info" key={i}>
              O
            </p>
          ) : application.admission === 'X' ? (
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
              ? getNumberOfDays(
                  today,
                  application_deadline_calculator(
                    this.props.student,
                    application
                  )
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
            {showButtonIfMyStudent(this.props.user, this.props.student) &&
              this.props.user.role !== 'Editor' &&
              !this.props.isArchivPage && (
                <Link
                  to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(
                    this.props.student._id
                  )}`}
                  style={{ textDecoration: 'none' }}
                >
                  <AiFillEdit color="grey" size={16} />
                </Link>
              )}
          </td>
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
          <td>{application_deadline}</td>
          <td>{application_decided}</td>
          <td>{application_admission}</td>
          <td>{application_date_left}</td>
        </tr>
      </>
    );
  }
}

export default ApplicationProgressStudent;

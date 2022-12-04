import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getNumberOfDays } from '../../../Utils/contants';
import {
  is_cv_finished,
  is_program_ml_rl_essay_finished,
  check_uni_assist_needed,
  check_program_uni_assist_needed,
  application_deadline_calculator
} from '../../../Utils/checking-functions';
class ApplicationFilesProgress extends React.Component {
  updateStudentArchivStatus = (studentId, isArchived) => {
    this.props.updateStudentArchivStatus(studentId, isArchived);
  };
  render() {
    var applying_university;
    var applying_program;
    var application_deadline;
    var application_program_readiniess;
    var application_base_documents;
    var application_uni_assist;
    var application_cv;
    var application_mlrlessay;
    var today = new Date();
    let isMissingBaseDocs = false;

    let keys = Object.keys(window.profile_list);
    let object_init = {};
    for (let i = 0; i < keys.length; i++) {
      object_init[keys[i]] = 'missing';
    }

    if (this.props.student.profile) {
      for (let i = 0; i < this.props.student.profile.length; i++) {
        if (this.props.student.profile[i].status === 'uploaded') {
          object_init[this.props.student.profile[i].name] = 'uploaded';
        } else if (this.props.student.profile[i].status === 'accepted') {
          object_init[this.props.student.profile[i].name] = 'accepted';
        } else if (this.props.student.profile[i].status === 'rejected') {
          object_init[this.props.student.profile[i].name] = 'rejected';
        } else if (this.props.student.profile[i].status === 'missing') {
          object_init[this.props.student.profile[i].name] = 'missing';
        } else if (this.props.student.profile[i].status === 'notneeded') {
          object_init[this.props.student.profile[i].name] = 'notneeded';
        }
      }
    } else {
    }
    for (let i = 0; i < keys.length; i += 1) {
      if (
        object_init[keys[i]] !== 'accepted' &&
        object_init[keys[i]] !== 'notneeded'
      ) {
        isMissingBaseDocs = true;
        break;
      }
    }
    const is_cv_done = is_cv_finished(this.props.student);
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university = <p className="mb-1  text-danger"> No University</p>;
      applying_program = <p className="mb-1  text-danger"> No Program</p>;
      application_deadline = <p className="mb-1  text-danger"> No Date</p>;
      application_program_readiniess = <p className="mb-1  text-danger"></p>;
      application_base_documents = <p className="mb-1  text-danger"></p>;
      application_uni_assist = <p className="mb-1  text-danger"></p>;
      application_cv = <p className="mb-1  text-danger"></p>;
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
      application_base_documents = this.props.student.applications.map(
        (application, i) =>
          application.closed === 'O' ? (
            <Link
              to={'/student-database/' + this.props.student._id + '/profile'}
              style={{ textDecoration: 'none' }}
              key={i}
            >
              <p className="mb-1 text-info">-</p>
            </Link>
          ) : (
            <Link
              to={'/student-database/' + this.props.student._id + '/profile'}
              style={{ textDecoration: 'none' }}
              key={i}
            >
              {isMissingBaseDocs ? (
                <p className="mb-1 text-danger">X</p>
              ) : (
                <p className="mb-1 text-info">O</p>
              )}
            </Link>
          )
      );

      application_uni_assist = this.props.student.applications.map(
        (application, i) => (
          <Link
            to={'/student-database/' + this.props.student._id + '/uni-assist'}
            style={{ textDecoration: 'none' }}
            key={i}
          >
            {application.closed === 'O' ? (
              <p className="mb-1 text-info">-</p>
            ) : (
              <>
                {check_program_uni_assist_needed(application) ? (
                  <>
                    {application.uni_assist &&
                    application.uni_assist.status === 'uploaded' ? (
                      <p className="mb-1 text-info">O</p>
                    ) : (
                      <p className="mb-1 text-danger">X</p>
                    )}
                  </>
                ) : (
                  <p className="mb-1 text-info">Not needed</p>
                )}
              </>
            )}
          </Link>
        )
      );
      application_cv = this.props.student.applications.map((application, i) =>
        application.closed === 'O' ? (
          <p className="mb-1 text-info" key={application._id}>
            -
          </p>
        ) : (
          <Link
            to={'/student-database/' + this.props.student._id + '/CV_ML_RL'}
            style={{ textDecoration: 'none' }}
            key={i}
          >
            {is_cv_done ? (
              <p className="mb-1 text-info">O</p>
            ) : (
              <p className="mb-1 text-danger">X</p>
            )}
          </Link>
        )
      );
      application_mlrlessay = this.props.student.applications.map(
        (application, i) =>
          application.decided === 'O' ? (
            application.closed === 'O' ? (
              <p className="mb-1 text-info" key={application._id}>
                -
              </p>
            ) : (
              <Link
                to={'/student-database/' + this.props.student._id + '/CV_ML_RL'}
                style={{ textDecoration: 'none' }}
                key={i}
              >
                {is_program_ml_rl_essay_finished(application) ? (
                  <p className="mb-1 text-info">O</p>
                ) : (
                  <p className="mb-1 text-danger">X</p>
                )}
              </Link>
            )
          ) : (
            <p
              className="mb-1 text-secondary"
              key={application._id}
              title="Not decided yet"
            >
              X
            </p>
          )
      );
    }
    application_program_readiniess = this.props.student.applications.map(
      (application, i) =>
        application.decided === 'O' ? (
          application.closed === 'O' ? (
            <p className="mb-1 text-info" key={i}>
              -
            </p>
          ) : !isMissingBaseDocs &&
            (!check_program_uni_assist_needed(application) ||
              (check_program_uni_assist_needed(application) &&
                application.uni_assist &&
                application.uni_assist.status === 'uploaded')) &&
            is_cv_done &&
            is_program_ml_rl_essay_finished(application) ? (
            <p className="mb-1 text-light" key={i}>
              <b>Ready!</b>
            </p>
          ) : (
            <p className="mb-1 text-info" key={i}>
              Not Ready :(
            </p>
          )
        ) : (
          <p className="mb-1 text-secondary" key={i} title="Not decided yet">
            Undecided
          </p>
        )
    );
    return (
      <>
        <tr>
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

          <td>{applying_university}</td>
          <td>{applying_program}</td>
          <td>{application_deadline}</td>
          <td>{application_base_documents}</td>
          <td>{application_uni_assist}</td>
          <td>{application_cv}</td>
          <td>{application_mlrlessay}</td>
          <td>{application_program_readiniess}</td>
        </tr>
      </>
    );
  }
}

export default ApplicationFilesProgress;

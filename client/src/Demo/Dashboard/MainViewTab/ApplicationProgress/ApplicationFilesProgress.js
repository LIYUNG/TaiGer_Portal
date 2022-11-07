import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getNumberOfDays } from '../../../Utils/contants';
import {
  is_cv_finished,
  is_program_ml_rl_essay_finished,
  check_uni_assist_needed,
  is_all_uni_assist_vpd_uploaded
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
              ? this.props.student.application_preference &&
                this.props.student.application_preference
                  .expected_application_date
                ? this.props.student.application_preference
                    .expected_application_date + '-'
                : ''
              : '-'}
            {application.programId.application_deadline}
          </p>
        )
      );
      application_base_documents = this.props.student.applications.map(
        (application, i) => (
          <Link
            to={'/student-database/' + this.props.student._id + '/profile'}
            style={{ textDecoration: 'none' }}
            key={i}
          >
            {isMissingBaseDocs ? (
              <p className="mb-1 text-info" key={i}>
                X
              </p>
            ) : (
              <p className="mb-1 text-info" key={application._id}>
                O
              </p>
            )}
          </Link>
        )
      );

      application_uni_assist = this.props.student.applications.map(
        (application, i) => (
          <>
            {check_uni_assist_needed(this.props.student) ? (
              <Link
                to={
                  '/student-database/' + this.props.student._id + '/uni-assist'
                }
                style={{ textDecoration: 'none' }}
                key={i}
              >
                {application.uni_assist &&
                application.uni_assist.status === 'uploaded' ? (
                  <p className="mb-1 text-info" key={i}>
                    O
                  </p>
                ) : (
                  <p className="mb-1 text-info" key={application._id}>
                    X
                  </p>
                )}
              </Link>
            ) : (
              <p className="mb-1 text-info" key={application._id}>
                Not needed
              </p>
            )}
          </>
        )
      );
      application_cv = this.props.student.applications.map((application, i) => (
        <Link
          to={'/student-database/' + this.props.student._id + '/CV_ML_RL'}
          style={{ textDecoration: 'none' }}
          key={i}
        >
          {is_cv_done ? (
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
          )}
        </Link>
      ));
      application_mlrlessay = this.props.student.applications.map(
        (application, i) => (
          <Link
            to={'/student-database/' + this.props.student._id + '/CV_ML_RL'}
            style={{ textDecoration: 'none' }}
            key={i}
          >
            {is_program_ml_rl_essay_finished(application) ? (
              <p className="mb-1 text-info" key={i}>
                O
              </p>
            ) : (
              <p className="mb-1 text-info" key={application._id}>
                X
              </p>
            )}
          </Link>
        )
      );
    }
    application_program_readiniess = this.props.student.applications.map(
      (application, i) => (
        <>
          {!isMissingBaseDocs &&
          (!check_uni_assist_needed(this.props.student) ||
            (check_uni_assist_needed(this.props.student) &&
              application.uni_assist &&
              application.uni_assist.status === 'uploaded')) &&
          is_cv_done &&
          is_program_ml_rl_essay_finished(application) ? (
            <p className="mb-1 text-info" key={i}>
              Ready!
            </p>
          ) : (
            <p className="mb-1 text-info" key={i}>
              Not Ready :(
            </p>
          )}
        </>
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

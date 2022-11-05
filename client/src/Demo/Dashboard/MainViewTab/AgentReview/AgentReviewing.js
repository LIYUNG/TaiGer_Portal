import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { BsFillExclamationCircleFill, BsDash } from 'react-icons/bs';
import { IoCheckmarkCircle } from 'react-icons/io5';
import {
  check_academic_background_filled,
  num_applications_decided,
  num_applications_submitted,
  check_all_applications_decided,
  check_all_applications_submitted,
  check_uni_assist_needed,
  is_all_uni_assist_vpd_uploaded,
  num_uni_assist_vpd_needed,
  num_uni_assist_vpd_uploaded
} from '../../../Utils/checking-functions';

class AgentReviewing extends React.Component {
  render() {
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
    let isMissingBaseDocs = false;
    for (let i = 0; i < keys.length; i += 1) {
      if (
        object_init[keys[i]] !== 'accepted' &&
        object_init[keys[i]] !== 'notneeded'
      ) {
        isMissingBaseDocs = true;
        break;
      }
    }
    // TODO: logic improvement (necessary field)
    let isSurveyCompleted = check_academic_background_filled(
      this.props.student.academic_background
    );

    let num_apps_decided = num_applications_decided(this.props.student);
    let num_apps_closed = num_applications_submitted(this.props.student);
    let is_all_applications_decided = check_all_applications_decided(
      keys,
      this.props.student
    );

    let is_All_Applications_Submitted = check_all_applications_submitted(
      keys,
      this.props.student
    );

    var is_uni_assist_needed = check_uni_assist_needed(this.props.student);
    let isall_uni_assist_vpd_uploaded = is_all_uni_assist_vpd_uploaded(
      this.props.student
    );

    let numb_uni_assist_vpd_needed = num_uni_assist_vpd_needed(
      this.props.student
    );
    let numb_uni_assist_vpd_uploaded = num_uni_assist_vpd_uploaded(
      this.props.student
    );

    return (
      <>
        <tr className="my-0">
          {this.props.role !== 'Student' ? (
            <>
              <td>
                <Link
                  to={
                    '/student-database/' + this.props.student._id + '/profile'
                  }
                  className="text-info"
                  style={{ textDecoration: 'none' }}
                >
                  {this.props.student.firstname}
                  {' - '}
                  {this.props.student.lastname}
                </Link>
              </td>
              <td>
                <Link
                  to={
                    '/student-database/' +
                    this.props.student._id +
                    '/background'
                  }
                  style={{ textDecoration: 'none' }}
                >
                  {isSurveyCompleted ? (
                    <p className="text-warning">
                      <IoCheckmarkCircle
                        size={24}
                        color="limegreen"
                        title="complete"
                        className="mx-2"
                      />
                      complete
                    </p>
                  ) : (
                    <p className="text-warning">
                      <AiFillQuestionCircle
                        size={24}
                        color="lightgray"
                        title="incomplete"
                        className="mx-2"
                      />
                      incomplete
                    </p>
                  )}
                </Link>
              </td>
              <td>
                <Link
                  to={
                    '/student-database/' + this.props.student._id + '/profile'
                  }
                  style={{ textDecoration: 'none' }}
                >
                  {isMissingBaseDocs ? (
                    <p className="text-warning">
                      <AiFillQuestionCircle
                        size={24}
                        color="lightgray"
                        title="incomplete"
                        className="mx-2"
                      />
                      incomplete
                    </p>
                  ) : (
                    <p className="text-warning">
                      <IoCheckmarkCircle
                        size={24}
                        color="limegreen"
                        title="complete"
                        className="mx-2"
                      />
                      complete
                    </p>
                  )}
                </Link>
              </td>
            </>
          ) : (
            <></>
          )}
          <td>
            <Link
              to={'/student-database/' + this.props.student._id + '/uni-assist'}
              style={{ textDecoration: 'none' }}
            >
              {is_uni_assist_needed ? (
                isall_uni_assist_vpd_uploaded ? (
                  <p className="text-warning">
                    <IoCheckmarkCircle
                      size={24}
                      color="limegreen"
                      title="complete"
                      className="mx-2"
                    />
                    complete
                  </p>
                ) : (
                  <p className="text-warning">
                    <AiFillQuestionCircle
                      size={24}
                      color="lightgray"
                      title="incomplete"
                      className="mx-2"
                    />
                    VPD missing({numb_uni_assist_vpd_uploaded}/{numb_uni_assist_vpd_needed})
                  </p>
                )
              ) : (
                <p className="text-warning">
                  <BsDash
                    size={24}
                    color="lightgray"
                    title="incomplete"
                    className="mx-2"
                  />
                  Not needed
                </p>
              )}
            </Link>
          </td>
          <td>
            <Link
              to={'/student-applications/' + this.props.student._id}
              style={{ textDecoration: 'none' }}
            >
              {is_all_applications_decided ? (
                <p className="text-warning">
                  <IoCheckmarkCircle
                    size={24}
                    color="limegreen"
                    title="complete"
                    className="mx-2"
                  />
                  complete
                </p>
              ) : (
                <p className="text-warning">
                  <AiFillQuestionCircle
                    size={24}
                    color="lightgray"
                    title="incomplete"
                    className="mx-2"
                  />
                  incomplete (
                  {num_apps_decided > this.props.student.applying_program_count
                    ? this.props.student.applying_program_count
                    : num_apps_decided}
                  /{this.props.student.applying_program_count})
                </p>
              )}
            </Link>
          </td>
          <td>
            <Link
              to={'/student-applications/' + this.props.student._id}
              style={{ textDecoration: 'none' }}
            >
              {is_All_Applications_Submitted ? (
                <p className="text-warning">
                  <IoCheckmarkCircle
                    size={24}
                    color="limegreen"
                    title="complete"
                    className="mx-2"
                  />
                  complete
                </p>
              ) : (
                <p className="text-warning">
                  <AiFillQuestionCircle
                    size={24}
                    color="lightgray"
                    title="incomplete"
                    className="mx-2"
                  />
                  incomplete(
                  {num_apps_closed > this.props.student.applying_program_count
                    ? this.props.student.applying_program_count
                    : num_apps_closed}
                  /{this.props.student.applying_program_count})
                </p>
              )}
            </Link>
          </td>
        </tr>
      </>
    );
  }
}

export default AgentReviewing;

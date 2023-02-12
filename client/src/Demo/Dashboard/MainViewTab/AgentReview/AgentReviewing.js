import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { BsFillExclamationCircleFill, BsDash } from 'react-icons/bs';
import { IoCheckmarkCircle } from 'react-icons/io5';
import {
  check_if_there_is_language_info,
  check_if_there_is_english_language_info,
  check_if_there_is_german_language_info,
  check_english_language_Notneeded,
  check_german_language_Notneeded,
  check_english_language_passed,
  check_german_language_passed,
  check_academic_background_filled,
  num_applications_decided,
  num_applications_submitted,
  check_all_applications_decided,
  check_all_applications_submitted,
  is_cv_finished,
  is_cv_assigned,
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
      const statuses = {
        uploaded: 'uploaded',
        accepted: 'accepted',
        rejected: 'rejected',
        missing: 'missing',
        notneeded: 'notneeded'
      };

      this.props.student.profile.forEach((item) => {
        object_init[item.name] = statuses[item.status] || '';
      });
    }
    let isMissingBaseDocs = false;
    let total_base_docs_needed = 0;
    let total_accepted_base_docs_needed = 0;
    for (let i = 0; i < keys.length; i += 1) {
      if (object_init[keys[i]] !== 'notneeded') {
        total_base_docs_needed += 1;
      }
      if (
        object_init[keys[i]] === 'accepted' &&
        object_init[keys[i]] !== 'notneeded'
      ) {
        total_accepted_base_docs_needed += 1;
      }
    }
    isMissingBaseDocs =
      total_base_docs_needed > total_accepted_base_docs_needed ? true : false;
    // TODO: logic improvement (necessary field)
    let isEnglishPassed = check_english_language_passed(
      this.props.student.academic_background
    );

    let isGermanPassed = check_german_language_passed(
      this.props.student.academic_background
    );

    let isSurveyCompleted = check_academic_background_filled(
      this.props.student.academic_background
    );

    let num_apps_decided = num_applications_decided(this.props.student);
    let num_apps_closed = num_applications_submitted(this.props.student);
    let is_all_applications_decided = check_all_applications_decided(
      this.props.student
    );

    let is_All_Applications_Submitted = check_all_applications_submitted(
      keys,
      this.props.student
    );

    const isCVFinished = is_cv_finished(this.props.student);
    const isCVAssigned = is_cv_assigned(this.props.student);

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
    let expected_application_year =
      this.props.student.application_preference &&
      this.props.student.application_preference.expected_application_date
        ? this.props.student.application_preference.expected_application_date
        : '';
    let expected_application_semster =
      this.props.student.application_preference &&
      this.props.student.application_preference.expected_application_semester
        ? this.props.student.application_preference
            .expected_application_semester
        : '';
    return (
      <>
        <tr className="my-0 mx-0 py-0">
          <td>
            <Link
              to={'/student-database/' + this.props.student._id + '/profile'}
              className="text-info"
              style={{ textDecoration: 'none' }}
            >
              {this.props.student.firstname}
              {' - '}
              {this.props.student.lastname}
              {', '}
              {this.props.student.birthday}
              {', '}
              {' ( '}
              {expected_application_year}
              {'/'}
              {expected_application_semster}
              {' )'}
            </Link>
          </td>
          <td>
            <Link
              to={'/student-database/' + this.props.student._id + '/background'}
              style={{ textDecoration: 'none' }}
            >
              {isSurveyCompleted ? (
                <p className="text-warning" title="complete">
                  <IoCheckmarkCircle
                    size={24}
                    color="limegreen"
                    className="my-0 mx-2"
                  />
                </p>
              ) : (
                <p className="text-warning" title="incomplete">
                  <AiFillQuestionCircle
                    size={24}
                    color="lightgray"
                    className="my-0 mx-2"
                  />
                </p>
              )}
            </Link>
          </td>
          <td>
            {!check_if_there_is_language_info(
              this.props.student.academic_background
            ) ? (
              <Link
                to={
                  '/student-database/' + this.props.student._id + '/background'
                }
                style={{ textDecoration: 'none' }}
              >
                <p className="text-danger">No info</p>
              </Link>
            ) : (
              <>
                {check_if_there_is_english_language_info(
                  this.props.student.academic_background
                ) && (
                  <Link
                    to={
                      '/student-database/' +
                      this.props.student._id +
                      '/background'
                    }
                    style={{ textDecoration: 'none' }}
                  >
                    {isEnglishPassed ? (
                      <p className="text-warning">
                        <IoCheckmarkCircle
                          size={24}
                          color="limegreen"
                          title="complete"
                          className="my-0 me-2"
                        />
                        {
                          this.props.student.academic_background.language
                            .english_certificate
                        }{' '}
                        {
                          this.props.student.academic_background.language
                            .english_score
                        }
                      </p>
                    ) : (
                      !check_english_language_Notneeded(
                        this.props.student.academic_background
                      ) && (
                        <p className="text-warning" title="Expected Test Date">
                          <AiFillQuestionCircle
                            size={24}
                            color="lightgray"
                            className="my-0 me-2"
                          />
                          {
                            this.props.student.academic_background.language
                              .english_certificate
                          }{' '}
                          {
                            this.props.student.academic_background.language
                              .english_test_date
                          }
                        </p>
                      )
                    )}
                  </Link>
                )}
                {check_if_there_is_german_language_info(
                  this.props.student.academic_background
                ) && (
                  <Link
                    to={
                      '/student-database/' +
                      this.props.student._id +
                      '/background'
                    }
                    style={{ textDecoration: 'none' }}
                  >
                    {isGermanPassed ? (
                      <p className="text-warning">
                        <IoCheckmarkCircle
                          size={24}
                          color="limegreen"
                          title="complete"
                          className="my-0 me-2"
                        />
                        {
                          this.props.student.academic_background.language
                            .german_certificate
                        }{' '}
                        {
                          this.props.student.academic_background.language
                            .german_score
                        }
                      </p>
                    ) : (
                      !check_german_language_Notneeded(
                        this.props.student.academic_background
                      ) && (
                        <p className="text-warning" title="Expected Test Date">
                          <AiFillQuestionCircle
                            size={24}
                            color="lightgray"
                            className="my-0 me-2"
                          />
                          {
                            this.props.student.academic_background.language
                              .german_certificate
                          }{' '}
                          {
                            this.props.student.academic_background.language
                              .german_test_date
                          }
                        </p>
                      )
                    )}
                    {this.props.student.academic_background.language
                      .english_isPassed === '--' &&
                      this.props.student.academic_background.language
                        .german_isPassed === '--' && (
                        <p className="text-warning" title="Not needed">
                          Not needed
                        </p>
                      )}
                  </Link>
                )}
              </>
            )}
          </td>
          <td>
            <Link
              to={'/student-database/' + this.props.student._id + '/profile'}
              style={{ textDecoration: 'none' }}
            >
              {isMissingBaseDocs ? (
                <p className="text-warning" title="incomplete">
                  <AiFillQuestionCircle
                    size={24}
                    color="lightgray"
                    className="my-0 mx-2"
                  />
                  {total_accepted_base_docs_needed}/{total_base_docs_needed}
                </p>
              ) : (
                <p className="text-warning" title="complete">
                  <IoCheckmarkCircle
                    size={24}
                    color="limegreen"
                    className="my-0 mx-2"
                  />
                  {total_accepted_base_docs_needed}/{total_base_docs_needed}
                </p>
              )}
            </Link>
          </td>
          <td>
            <Link
              to={'/student-database/' + this.props.student._id + '/CV_ML_RL'}
              style={{ textDecoration: 'none' }}
            >
              {!isCVFinished ? (
                isCVAssigned ? (
                  <p className="text-warning">
                    <AiFillQuestionCircle
                      size={24}
                      color="lightgray"
                      title="Working"
                      className="my-0 mx-2"
                    />
                  </p>
                ) : (
                  <p className="text-warning">
                    <BsFillExclamationCircleFill
                      size={23}
                      color="red"
                      title="Not created yet"
                      className="my-0 mx-2"
                    />
                  </p>
                )
              ) : (
                <p className="text-warning">
                  <IoCheckmarkCircle
                    size={24}
                    color="limegreen"
                    title="complete"
                    className="my-0 mx-2"
                  />
                </p>
              )}
            </Link>
          </td>
          <td>
            <Link
              to={'/student-database/' + this.props.student._id + '/uni-assist'}
              style={{ textDecoration: 'none' }}
            >
              {is_uni_assist_needed ? (
                isall_uni_assist_vpd_uploaded ? (
                  <p className="text-warning" title="complete">
                    <IoCheckmarkCircle
                      size={24}
                      color="limegreen"
                      className="my-0 mx-2"
                      title="Complete"
                    />
                  </p>
                ) : (
                  <p className="text-warning" title="incomplete">
                    <AiFillQuestionCircle
                      size={24}
                      color="lightgray"
                      className="my-0 mx-2"
                    />
                    ({numb_uni_assist_vpd_uploaded}/{numb_uni_assist_vpd_needed}
                    )
                  </p>
                )
              ) : (
                <p className="text-warning" title="Not needed">
                  <BsDash size={24} color="lightgray" className="mx-2" />
                </p>
              )}
            </Link>
          </td>
          <td>
            <Link
              to={'/student-applications/' + this.props.student._id}
              style={{ textDecoration: 'none' }}
            >
              <p className="text-warning">
                {is_all_applications_decided ? (
                  <IoCheckmarkCircle
                    size={24}
                    color="limegreen"
                    title="complete"
                    className="my-0 mx-2"
                  />
                ) : (
                  <AiFillQuestionCircle
                    size={24}
                    color="lightgray"
                    title="incomplete"
                    className="my-0 mx-2"
                  />
                )}
                (
                {num_apps_decided >
                this.props.student.applying_program_count ? (
                  <b>{num_apps_decided}</b>
                ) : (
                  num_apps_decided
                )}
                /{this.props.student.applying_program_count})
              </p>
            </Link>
          </td>
          <td>
            <Link
              to={'/student-applications/' + this.props.student._id}
              style={{ textDecoration: 'none' }}
            >
              {is_All_Applications_Submitted ? (
                <p className="text-warning">
                  {num_apps_closed >=
                  this.props.student.applying_program_count ? (
                    <>
                      <IoCheckmarkCircle
                        size={24}
                        color="limegreen"
                        title="complete"
                        className="my-0 mx-2"
                      />
                      <b>({num_apps_closed}</b>
                    </>
                  ) : (
                    <>
                      <AiFillQuestionCircle
                        size={24}
                        color="lightgray"
                        className="my-0 mx-2"
                      />
                      ({num_apps_closed}
                    </>
                  )}
                  /{this.props.student.applying_program_count})
                </p>
              ) : (
                <p className="text-warning" title="incomplete">
                  <AiFillQuestionCircle
                    size={24}
                    color="lightgray"
                    className="my-0 mx-2"
                  />
                  (
                  {num_apps_closed >
                  this.props.student.applying_program_count ? (
                    <b>{num_apps_closed}</b>
                  ) : (
                    num_apps_closed
                  )}
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

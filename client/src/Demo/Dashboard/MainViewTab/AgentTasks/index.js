import React from 'react';
import { Link } from 'react-router-dom';
import {
  check_all_applications_decided,
  is_num_Program_Not_specified,
  isProgramNotSelectedEnough,
  check_applications_decision_from_student,
  isCVFinished,
  is_cv_assigned,
  is_all_uni_assist_vpd_uploaded,
  is_program_ml_rl_essay_ready,
  is_the_uni_assist_vpd_uploaded,
  is_program_closed,
  are_base_documents_missing
} from '../../../Utils/checking-functions';

class AgentTasks extends React.Component {
  render() {
    return (
      <>
        {/*  */}
        {is_num_Program_Not_specified(this.props.student) ? (
          <tr>
            <td>
              <Link
                to={
                  '/student-applications/' + this.props.student._id.toString()
                }
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                <b>
                  {' '}
                  {this.props.student.firstname} {this.props.student.lastname}{' '}
                </b>
                Applications
              </Link>
            </td>
            <td>
              Contact Sales or Admin for the number of program of
              <b>
                {this.props.student.firstname} {this.props.student.lastname}
              </b>
            </td>
            <td></td>
          </tr>
        ) : (
          <>
            {/* get programs feedback from student */}
            {check_applications_decision_from_student(this.props.student) ? (
              <>
                {!check_all_applications_decided(this.props.student) && (
                  <tr>
                    <td>
                      <Link
                        to={
                          '/student-applications/' +
                          this.props.student._id.toString()
                        }
                        style={{ textDecoration: 'none' }}
                        className="text-info"
                      >
                        <b>
                          {' '}
                          {this.props.student.firstname}{' '}
                          {this.props.student.lastname}{' '}
                        </b>
                        Applications
                      </Link>
                    </td>
                    <td>
                      Please check the feedback from{' '}
                      <b>
                        {this.props.student.firstname}{' '}
                        {this.props.student.lastname}
                      </b>
                    </td>
                    <td></td>
                  </tr>
                )}
              </>
            ) : (
              <>
                {/* select enough program task */}
                {!is_num_Program_Not_specified(this.props.student) &&
                isProgramNotSelectedEnough([this.props.student]) ? (
                  <>
                    {' '}
                    <tr>
                      <td>
                        <Link
                          to={
                            '/student-applications/' +
                            this.props.student._id.toString()
                          }
                          style={{ textDecoration: 'none' }}
                          className="text-info"
                        >
                          <b>
                            {' '}
                            {this.props.student.firstname}{' '}
                            {this.props.student.lastname}{' '}
                          </b>
                          Applications
                        </Link>
                      </td>
                      <td>
                        Please select enough programs for{' '}
                        <b>
                          {this.props.student.firstname}{' '}
                          {this.props.student.lastname}
                        </b>
                      </td>
                      <td></td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td>
                      <Link
                        to={
                          '/student-applications/' +
                          this.props.student._id.toString()
                        }
                        style={{ textDecoration: 'none' }}
                        className="text-info"
                      >
                        <b>
                          {' '}
                          {this.props.student.firstname}{' '}
                          {this.props.student.lastname}{' '}
                        </b>
                        Applications
                      </Link>
                    </td>
                    <td>
                      Waiting Feedback from{' '}
                      <b>
                        {this.props.student.firstname}{' '}
                        {this.props.student.lastname}
                      </b>
                    </td>
                    <td></td>
                  </tr>
                )}
              </>
            )}
          </>
        )}
        {!isCVFinished(this.props.student) &&
          !is_cv_assigned(this.props.student) && (
            <tr>
              <td>
                <Link
                  to={
                    '/student-database/' +
                    this.props.student._id.toString() +
                    '/CV_ML_RL'
                  }
                  style={{ textDecoration: 'none' }}
                  className="text-info"
                >
                  CV
                </Link>
              </td>
              <td>
                <b>
                  {this.props.student.firstname} {this.props.student.lastname}
                </b>{' '}
                CV not assigned yet.
              </td>
              <td></td>
            </tr>
          )}
        {are_base_documents_missing(this.props.student) && (
          <tr>
            <td>
              <Link
                to={
                  '/student-database/' +
                  this.props.student._id.toString() +
                  '/profile'
                }
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                Base Documents
              </Link>
            </td>
            <td>
              <b>
                {this.props.student.firstname} {this.props.student.lastname}
              </b>{' '}
              Base Documents not completed
            </td>
            <td></td>
          </tr>
        )}
        {/* TODO: add Portal register tasks */}
      </>
    );
  }
}

export default AgentTasks;

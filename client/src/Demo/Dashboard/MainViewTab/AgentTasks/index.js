import React from 'react';
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineUndo
} from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { convertDate } from '../../../Utils/contants';
import {
  check_academic_background_filled,
  check_all_applications_decided,
  is_num_Program_Not_specified,
  isProgramNotSelectedEnough,
  check_applications_decision_from_student,
  is_all_uni_assist_vpd_uploaded
} from '../../../Utils/checking-functions';
class AgentTasks extends React.Component {
  check_base_documents = (student) => {
    let documentlist2_keys = Object.keys(window.profile_list);
    let object_init = {};
    for (let i = 0; i < documentlist2_keys.length; i++) {
      object_init[documentlist2_keys[i]] = 'missing';
    }
    if (student.profile === undefined) {
      return false;
    }
    if (student.profile.length === 0) {
      return false;
    }
    if (student.profile) {
      for (let i = 0; i < student.profile.length; i++) {
        if (student.profile[i].status === 'uploaded') {
          object_init[student.profile[i].name] = 'uploaded';
        } else if (student.profile[i].status === 'accepted') {
          object_init[student.profile[i].name] = 'accepted';
        } else if (student.profile[i].status === 'rejected') {
          object_init[student.profile[i].name] = 'rejected';
        } else if (student.profile[i].status === 'missing') {
          object_init[student.profile[i].name] = 'missing';
        } else if (student.profile[i].status === 'notneeded') {
          object_init[student.profile[i].name] = 'notneeded';
        }
      }
    } else {
      return false;
    }
    for (let i = 0; i < documentlist2_keys.length; i++) {
      if (object_init[documentlist2_keys[i]] === 'uploaded') {
        return false;
      }
    }
    return true;
  };
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

        {/* check uni-assist */}
        {!is_all_uni_assist_vpd_uploaded(this.props.student) && (
          <tr>
            <td>
              <Link
                to={'/uni-assist'}
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                Uni-Assist
              </Link>
            </td>
            <td>Please Uni-Assist to apply and get VPD</td>
            <td></td>
          </tr>
        )}
        {!this.check_base_documents(this.props.student) && (
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
              {this.props.student.firstname} {this.props.student.lastname}{' '}
              uploaded new files
            </td>
            <td></td>
          </tr>
        )}
      </>
    );
  }
}

export default AgentTasks;

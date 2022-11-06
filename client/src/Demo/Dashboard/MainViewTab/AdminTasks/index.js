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
  check_application_preference_filled,
  check_applications_to_decided,
  does_student_have_agents,
  does_student_have_editors,
  is_num_Program_Not_specified,
  is_all_uni_assist_vpd_uploaded
} from '../../../Utils/checking-functions';
class AdminTasks extends React.Component {
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
    const missing_number_of_applications_students = this.props.students.map(
      (student, i) => (
        <>
          {is_num_Program_Not_specified(student) && (
            <tr>
              <td>
                <Link
                  to={'/student-applications/' + student._id.toString()}
                  style={{ textDecoration: 'none' }}
                  className="text-info"
                >
                  Number of Applications{' '}
                  <b>
                    {student.firstname} {student.lastname}
                  </b>
                </Link>
              </td>
              <td>
                Please specify the number of the application for{' '}
                <b>
                  {student.firstname} {student.lastname}
                </b>
              </td>
              <td></td>
            </tr>
          )}
        </>
      )
    );

    return (
      <>
        {!does_student_have_agents(this.props.students) && (
          <tr>
            <td>
              <Link
                to={'/assignment/agents'}
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                Assign Agents
              </Link>
            </td>
            <td>Please assign agents</td>
            <td></td>
          </tr>
        )}
        {!does_student_have_editors(this.props.students) && (
          <tr>
            <td>
              <Link
                to={'/assignment/editors'}
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                Assign Editors
              </Link>
            </td>
            <td>Please assign editors</td>
            <td></td>
          </tr>
        )}
        {/* assign number of application according to contract */}
        {missing_number_of_applications_students}
      </>
    );
  }
}

export default AdminTasks;

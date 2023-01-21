import React from 'react';
import { Link } from 'react-router-dom';
import {
  does_student_have_agents,
  does_student_have_editors,
  is_num_Program_Not_specified
} from '../../../Utils/checking-functions';

class AdminTasks extends React.Component {
  render() {
    const missing_number_of_applications_students = this.props.students.map(
      (student, i) =>
        is_num_Program_Not_specified(student) && (
          <tr key={i}>
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

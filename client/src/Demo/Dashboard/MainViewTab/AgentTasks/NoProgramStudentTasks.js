import React from 'react';
import { Link } from 'react-router-dom';
import { check_application_selection } from '../../../Utils/checking-functions';

class NoProgramStudentTasks extends React.Component {
  render() {
    return (
      <>
        {/* check if no program selected */}
        {!check_application_selection(this.props.student) && (
          <tr>
            <td>
              <Link
                to={
                  '/student-database/' +
                  this.props.student._id.toString() +
                  '/uni-assist'
                }
                style={{ textDecoration: 'none' }}
                className="text-info"
              >
                {this.props.student.firstname} {this.props.student.lastname}
              </Link>
            </td>
            <td>
              {' '}
              {this.props.student.application_preference
                ?.expected_application_date || (
                <span className="text-danger">TBD</span>
              )}
              {'/'}
              {this.props.student.application_preference
                ?.expected_application_semester || (
                <span className="text-danger">TBD</span>
              )}
            </td>
          </tr>
        )}
      </>
    );
  }
}

export default NoProgramStudentTasks;

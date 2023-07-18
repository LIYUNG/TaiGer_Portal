import React from 'react';
import { Link } from 'react-router-dom';
import {
  isCVFinished,
  is_cv_assigned
} from '../../../Utils/checking-functions';

class CVAssignTasks extends React.Component {
  render() {
    return (
      <>
        {/* cv assign tasks */}
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
                </b>
              </td>
              <td>
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

export default CVAssignTasks;

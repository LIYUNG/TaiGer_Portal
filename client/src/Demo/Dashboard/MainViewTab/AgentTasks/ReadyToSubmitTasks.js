import React from 'react';
import { Link } from 'react-router-dom';
import {
  isCVFinished,
  is_program_ml_rl_essay_ready,
  is_the_uni_assist_vpd_uploaded,
  is_program_closed,
  application_deadline_calculator
} from '../../../Utils/checking-functions';

class ReadyToSubmitTasks extends React.Component {
  render() {
    return (
      <>
        {/* check program reday to be submitted */}
        {this.props.student.applications.map(
          (application, i) =>
            application.decided === 'O' &&
            isCVFinished(this.props.student) &&
            is_program_ml_rl_essay_ready(application) &&
            is_the_uni_assist_vpd_uploaded(application) &&
            !is_program_closed(application) && (
              <tr key={i}>
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
                    <b>
                      {this.props.student.firstname}{' '}
                      {this.props.student.lastname}
                    </b>
                  </Link>
                </td>
                <td>
                  {application_deadline_calculator(
                    this.props.student,
                    application
                  )}
                </td>
                <td>
                  <b className="text-warning">{application.programId.degree}</b>
                  {' - '}
                  <b className="text-warning">
                    {application.programId.semester}
                  </b>
                  {' - '}
                  <b className="text-warning">
                    {application.programId.school}{' '}
                    {application.programId.program_name}
                  </b>
                </td>
              </tr>
            )
        )}
      </>
    );
  }
}

export default ReadyToSubmitTasks;

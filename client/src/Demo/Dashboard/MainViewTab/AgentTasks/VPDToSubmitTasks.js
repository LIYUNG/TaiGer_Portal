import React from 'react';
import { Link } from 'react-router-dom';
import {
  is_uni_assist_vpd_needed,
  is_all_uni_assist_vpd_uploaded,
  application_deadline_calculator
} from '../../../Utils/checking-functions';

class VPDToSubmitTasks extends React.Component {
  render() {
    return (
      <>
        {/* check uni-assist */}
        {!is_all_uni_assist_vpd_uploaded(this.props.student) &&
          this.props.student.applications.map(
            (application, i) =>
              is_uni_assist_vpd_needed(application) && (
                <tr key={i}>
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
                      {this.props.student.firstname}{' '}
                      {this.props.student.lastname}
                    </Link>
                  </td>
                  <td>
                    <b>
                      {application_deadline_calculator(
                        this.props.student,
                        application
                      )}
                    </b>
                  </td>
                  <td>
                    {application.programId.school}{' '}
                    {application.programId.program_name}
                  </td>
                </tr>
              )
          )}
      </>
    );
  }
}

export default VPDToSubmitTasks;
import React from 'react';
import { Link } from 'react-router-dom';

import { convertDate } from '../../../Utils/contants';
import DEMO from '../../../../store/constant';

class BaseDocumentCheckingTasks extends React.Component {
  render() {
    return (
      <>
        {/* check program reday to be submitted */}
        {this.props.student.profile.map(
          (file, i) =>
            file.status === 'uploaded' && (
              <tr key={i}>
                <td>
                  <Link
                    to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                      this.props.student._id.toString(),
                      DEMO.PROFILE
                    )}`}
                    style={{ textDecoration: 'none' }}
                    className="text-info"
                  >
                    <b>
                      {this.props.student.firstname}{' '}
                      {this.props.student.lastname}
                    </b>
                  </Link>
                </td>
                <td>{file.name}</td>
                <td>{convertDate(file.updatedAt)}</td>
              </tr>
            )
        )}
      </>
    );
  }
}

export default BaseDocumentCheckingTasks;

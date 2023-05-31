import React from 'react';
import { Link } from 'react-router-dom';

import { convertDate } from '../../../Utils/contants';

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
                    to={
                      '/student-database/' +
                      this.props.student._id.toString() +
                      '/profile'
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

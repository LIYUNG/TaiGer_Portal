import React from 'react';
import { Table } from 'react-bootstrap';
import StudDocsDashboard from './StudDocsDashboard';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table';
class TabStudBackgroundDashboard extends React.Component {
  render() {
    const stdlist = (
      <tbody>
        {this.props.students.map((student, i) => (
          <StudDocsDashboard
            key={i}
            role={this.props.role}
            student={student}
            updateStudentArchivStatus={this.props.updateStudentArchivStatus}
            isDashboard={this.props.isDashboard}
            isArchivPage={this.props.isArchivPage}
          />
        ))}
      </tbody>
    );
    let header = Object.values(window.academic_background_header);
    return (
      <Table
        size="sm"
        // responsive
        bordered
        striped
        hover
        className="mb-0 mx-0"
        variant="dark"
        text="light"
      >
        <thead>
          <tr>
            <th></th>
            <th>
              First-, Last Name <br /> Email
            </th>
            {header.map((name, index) => (
              <th key={index}>{name}</th>
            ))}
          </tr>
        </thead>
        {stdlist}
      </Table>
    );
  }
}

export default TabStudBackgroundDashboard;

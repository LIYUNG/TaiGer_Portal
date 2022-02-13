import React from "react";
import { Table } from "react-bootstrap";
import StudDocsDashboard from "./StudDocsDashboard";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
class TabStudDocsDashboard extends React.Component {
  render() {
    const stdlist = this.props.students.map((student, i) => (
      <StudDocsDashboard
        key={i}
        role={this.props.role}
        student={student}
        onDeleteProgram={this.props.onDeleteProgram}
        updateStudentArchivStatus={this.props.updateStudentArchivStatus}
        isDashboard={this.props.isDashboard}
        isArchivPage={this.props.isArchivPage}
        onSetAsCloseProgram={this.props.onSetAsCloseProgram}
        onSetAsDecidedProgram={this.props.onSetAsDecidedProgram}
        onSetAsGetAdmissionProgram={this.props.onSetAsGetAdmissionProgram}
      />
    ));
    let header = Object.values(window.academic_background_header);
    return (
      <>
        <Table responsive bordered hover>
          <thead>
            <tr>
              <>
                <th></th>
                <th>
                  First-, Last Name <br /> Email
                </th>
              </>
              {header.map((name, index) => (
                <th key={index}>{name}</th>
              ))}
            </tr>
          </thead>
          {stdlist}
        </Table>
        {this.props.SYMBOL_EXPLANATION}
      </>
    );
  }
}

export default TabStudDocsDashboard;

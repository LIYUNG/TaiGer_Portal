import React from "react";
import { Table } from "react-bootstrap";
import StudDocsDashboard from "./StudDocsDashboard";
class TabStudDocsDashboard extends React.Component {
  render() {
    const stdlist = this.props.students.map((student, i) => (
      <StudDocsDashboard
        key={i}
        role={this.props.role}
        student={student}
        editAgent={this.props.editAgent}
        editEditor={this.props.editEditor}
        documentslist={this.props.documentslist}
        documentlist2={this.props.documentlist2}
        agent_list={this.props.agent_list}
        editor_list={this.props.editor_list}
        onDeleteProgram={this.props.onDeleteProgram}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
        updateAgentList={this.props.updateAgentList}
        handleChangeAgentlist={this.props.handleChangeAgentlist}
        submitUpdateAgentlist={this.props.submitUpdateAgentlist}
        updateEditorList={this.props.updateEditorList}
        handleChangeEditorlist={this.props.handleChangeEditorlist}
        submitUpdateEditorlist={this.props.submitUpdateEditorlist}
        updateStudentArchivStatus={this.props.updateStudentArchivStatus}
        isDashboard={this.props.isDashboard}
        isArchivPage={this.props.isArchivPage}
      />
    ));
    let header = Object.values(this.props.documentlist2);
    return (
      <>
        <Table table-responsive>
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

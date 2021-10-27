import React from "react";
import { Table } from "react-bootstrap";
import EditableStudent from "./EditableStudent";

// import UcFirst from "../../App/components/UcFirst";

class Studentlist extends React.Component {
  render() {
    const stdlist = this.props.students.map((student, i) => (
      <Table responsive key={i}>
        <tbody>
          <EditableStudent
            role={this.props.role}
            student={student}
            success={this.props.success}
            editAgent={this.props.editAgent}
            editEditor={this.props.editEditor}
            startEditingAgent={this.props.startEditingAgent}
            startEditingEditor={this.props.startEditingEditor}
            startEditingProgram={this.props.startEditingProgram}
            documentslist={this.props.documentslist}
            startUploadfile={this.props.startUploadfile}
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
          />
        </tbody>
      </Table>
    ));

    return <>{stdlist}</>;
  }
}

export default Studentlist;

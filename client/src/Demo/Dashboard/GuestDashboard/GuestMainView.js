import React from "react";
import { Table } from "react-bootstrap";
import GuestMyself from "./GuestMyself";

class GuestMainView extends React.Component {
  render() {
    const stdlist = this.props.students.map((student, i) => (
      <GuestMyself
        key={i}
        role={this.props.role}
        student={student}
        success={this.props.success}
        editAgent={this.props.editAgent}
        editEditor={this.props.editEditor}
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
    ));

    return (
      <>
        <Table responsive>
          <thead>
            <tr>
              <>
                <th></th>
                <th>First-, Last Name</th>
              </>
              {this.props.documentslist.map((doc, index) => (
                <th key={index}>{doc.name}</th>
              ))}
            </tr>
          </thead>
          {stdlist}
        </Table>
      </>
    );
  }
}

export default GuestMainView;

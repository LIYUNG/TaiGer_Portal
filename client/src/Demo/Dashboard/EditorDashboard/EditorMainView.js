import React from "react";
import { Table, Tabs, Tab } from "react-bootstrap";
import EditorStudents from "./EditorStudents";
import ProgramConflict from "./ProgramConflict";

class EditorMainView extends React.Component {
  render() {
    const stdlist = this.props.students.map((student, i) => (
      <EditorStudents
        key={i}
        role={this.props.role}
        student={student}
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

    const program_conflict = this.props.students.map((student, i) => (
      <ProgramConflict
        key={i}
        student={student}
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
      />
    ));

    return (
      <>
        <Tabs defaultActiveKey="w" id="uncontrolled-tab-example">
          <Tab eventKey="w" title="Student Overview">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th></th>
                    <th>First-/Last Name</th>
                  </>
                  {this.props.documentslist.map((doc, index) => (
                    <th key={index}>{doc.name}</th>
                  ))}
                </tr>
              </thead>
              {stdlist}
            </Table>
          </Tab>
          <Tab eventKey="y" title="Program Conflicts">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th>University</th>
                    <th>Programs</th>
                    <th>First-/Last Name</th>
                    <th>Deadline</th>
                  </>
                  {/* {this.props.documentsprogresslist.map((doc, index) => (
                    <th key={index}>{doc.name}</th>
                  ))} */}
                </tr>
              </thead>
              {program_conflict}
            </Table>
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default EditorMainView;

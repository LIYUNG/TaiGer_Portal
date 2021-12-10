import React from "react";
import { Table, Tabs, Tab } from "react-bootstrap";
import AgentStudents from "./AgentStudents";

class AgentMainView extends React.Component {
  render() {
    const stdlist = this.props.students.map((student, i) => (
      <AgentStudents
        key={i}
        student={student}
        editAgent={this.props.editAgent}
        editEditor={this.props.editEditor}
        startEditingEditor={this.props.startEditingEditor}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        documenheader={this.props.documenheader}
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
        <Tabs defaultActiveKey="x" id="uncontrolled-tab-example">
          <Tab eventKey="x" title="Student Documents Overview">
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
          <Tab eventKey="y" title="Editor & Docs Progress">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th></th>
                    <th>First-/Last Name</th>
                  </>
                  <>
                    <th></th>
                    <th>Editor</th>
                  </>
                  {/* {this.props.documentslist.map((doc, index) => (
                    <th key={index}>{doc.name}</th>
                  ))} */}
                </tr>
              </thead>
            </Table>
          </Tab>
          <Tab eventKey="z" title="Application Overview"></Tab>
        </Tabs>
      </>
    );
  }
}

export default AgentMainView;

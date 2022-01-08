import React from "react";
import { Table, Tabs, Tab } from "react-bootstrap";
import AdminDashboard from "./AdminDashboard";
import AdminTodoList from "./AdminTodoList";
import EditorDocsProgress from "./EditorDocsProgress";
import ApplicationProgress from "./ApplicationProgress";

class AdminMainView extends React.Component {
  render() {
    const stdlist = this.props.students.map((student, i) => (
      <AdminDashboard
        key={i}
        role={this.props.role}
        student={student}
        editAgent={this.props.editAgent}
        editEditor={this.props.editEditor}
        startEditingEditor={this.props.startEditingEditor}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        documentlist2={this.props.documentlist2}
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
    const agent_todo = this.props.students.map((student, i) => (
      <AdminTodoList
        key={i}
        student={student}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        agenttodolist={this.props.agenttodolist}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        agent_list={this.props.agent_list}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));
    
    const student_editor = this.props.students.map((student, i) => (
      <EditorDocsProgress
        key={i}
        student={student}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        agent_list={this.props.agent_list}
        editor_list={this.props.editor_list}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));

    const application_progress = this.props.students.map((student, i) => (
      <ApplicationProgress
        key={i}
        student={student}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        agent_list={this.props.agent_list}
        editor_list={this.props.editor_list}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));
    let header = Object.values(this.props.documentlist2);
    // console.log(header)
    return (
      <>
        <Tabs defaultActiveKey="w" id="uncontrolled-tab-example">
          <Tab eventKey="w" title="Student Documents Overview">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th></th>
                    <th>First-/Last Name</th>
                  </>
                  {header.map((name, index) => (
                    <th key={index}>{name}</th>
                  ))}
                </tr>
              </thead>
              {stdlist}
            </Table>
          </Tab>
          <Tab eventKey="x" title="Agent TODO">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th>First-/Last Name</th>
                  </>
                  {this.props.agenttodolist.map((doc, index) => (
                    <th key={index}>{doc.name}</th>
                  ))}
                </tr>
              </thead>
              {agent_todo}
            </Table>
          </Tab>
          <Tab eventKey="y" title="Editor & Docs Progress">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th>First-/Last Name</th>
                    <th>University</th>
                    <th>Programs</th>
                    <th>Deadline</th>
                  </>
                  {this.props.documentsprogresslist.map((doc, index) => (
                    <th key={index}>{doc.name}</th>
                  ))}
                </tr>
              </thead>
              {student_editor}
            </Table>
          </Tab>
          <Tab eventKey="z" title="Application Overview">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th>First-/Last Name</th>
                    <th>University</th>
                    <th>Programs</th>
                    <th>Deadline</th>
                  </>
                  {this.props.programstatuslist.map((doc, index) => (
                    <th key={index}>{doc.name}</th>
                  ))}
                </tr>
              </thead>
              {application_progress}
            </Table>
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default AdminMainView;

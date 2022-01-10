import React from "react";
import { Table, Tabs, Tab } from "react-bootstrap";
import StudDocsDashboard from "../MainViewTab/StudDocsOverview/StudDocsDashboard";
import AgentTodoList from "./AgentTodoList";
import EditorDocsProgress from "../MainViewTab/EditorDocsProgress/EditorDocsProgress";
import ApplicationProgress from "./ApplicationProgress";

class AgentMainView extends React.Component {
  render() {
    const stdlist = this.props.students.map((student, i) => (
      <StudDocsDashboard
        key={i}
        student={student}
        role={this.props.role}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        documentlist2={this.props.documentlist2}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        onDeleteProgram={this.props.onDeleteProgram}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));
    const agent_todo = this.props.students.map((student, i) => (
      <AgentTodoList
        key={i}
        student={student}
        startEditingProgram={this.props.startEditingProgram}
        agenttodolist={this.props.agenttodolist}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));
    const student_editor = this.props.students.map((student, i) => (
      <EditorDocsProgress
        key={i}
        student={student}
        role={this.props.role}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        onDeleteProgram={this.props.onDeleteProgram}
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
          <Tab eventKey="w" title="Student Documents Overview">
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
                    <th></th>
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

export default AgentMainView;

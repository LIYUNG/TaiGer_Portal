import React from "react";
import { Table, Tabs, Tab } from "react-bootstrap";
import StudentMyself from "./StudentMyself";
// import EditorDocsProgress from "./EditorDocsProgress";
import EditorDocsProgress from "../MainViewTab/EditorDocsProgress/EditorDocsProgress";
import ApplicationProgress from "./ApplicationProgress";
class StudentMainView extends React.Component {
  render() {
    const stdlist = this.props.students.map((student, i) => (
      <StudentMyself
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

    const your_editors = this.props.students.map((student, i) =>
      student.editors.map((editor, i) => (
        <tr>
          <td>
            {editor.firstname} - {editor.lastname}
          </td>
          <td>{editor.email}</td>
        </tr>
      ))
    );

    const your_agents = this.props.students.map((student, i) =>
      student.agents.map((agent, i) => (
        <tr>
          <td>
            {agent.firstname} - {agent.lastname}
          </td>
          <td>{agent.email}</td>
        </tr>
      ))
    );

    return (
      <>
        <Tabs defaultActiveKey="x" id="uncontrolled-tab-example">
          <Tab eventKey="x" title="My Uploaded Documents">
            <h5>Your Agents</h5>
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th>First-/Last Name</th>
                    <th>Email</th>
                  </>
                </tr>
              </thead>
              <tbody>{your_agents}</tbody>
            </Table>
            <Table responsive>
              <thead>
                <tr>
                  <>
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
          <Tab eventKey="y" title="My Editor & Docs Progress">
            <h5>Your Editors</h5>
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th>First-/Last Name</th>
                    <th>Email</th>
                  </>
                </tr>
              </thead>
              <tbody>{your_editors}</tbody>
            </Table>
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
          <Tab eventKey="z" title="My Applications">
            {" "}
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

export default StudentMainView;

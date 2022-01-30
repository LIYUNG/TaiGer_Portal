import React from "react";
import { Row, Col, Table, Tabs, Tab } from "react-bootstrap";
import Card from "../../../App/components/MainCard";
import TabStudDocsDashboard from "../MainViewTab/StudDocsOverview/TabStudDocsDashboard";
import AdminTodoList from "./AdminTodoList";
import AgentReviewing from "../MainViewTab/AgentReview/AgentReviewing";
import EditorReviewing from "../MainViewTab/EditorReview/EditorReviewing";
import TabEditorDocsProgress from "../MainViewTab/EditorDocsProgress/TabEditorDocsProgress";
import TabProgramConflict from "../MainViewTab/ProgramConflict/TabProgramConflict";
import ApplicationProgress from "../MainViewTab/ApplicationProgress/ApplicationProgress";
import StudentsAgentEditor from "../MainViewTab/StudentsAgentEditor/StudentsAgentEditor";

class AdminMainView extends React.Component {
  render() {
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
      />
    ));
    const students_agent_editor = this.props.students.map((student, i) => (
      <StudentsAgentEditor
        key={i}
        student={student}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        agent_list={this.props.agent_list}
        editor_list={this.props.editor_list}
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
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));
    const agent_reviewing = this.props.students.map((student, i) => (
      <AgentReviewing
        key={i}
        role={this.props.role}
        student={student}
        startEditingProgram={this.props.startEditingProgram}
        agenttodolist={this.props.agenttodolist}
        documenheader={this.props.documenheader}
        documentlist2={this.props.documentlist2}
        startUploadfile={this.props.startUploadfile}
      />
    ));
    const editor_reviewing = this.props.students.map((student, i) => (
      <EditorReviewing
        key={i}
        role={this.props.role}
        student={student}
        startEditingProgram={this.props.startEditingProgram}
        agenttodolist={this.props.agenttodolist}
        documenheader={this.props.documenheader}
        documentlist2={this.props.documentlist2}
        startUploadfile={this.props.startUploadfile}
      />
    ));
    return (
      <>
        <Row>
          <Col sm={12}>
            <Card title="Program Conflicts">
              <TabProgramConflict
                students={this.props.students}
                startEditingProgram={this.props.startEditingProgram}
                startUploadfile={this.props.startUploadfile}
                onDeleteProgram={this.props.onDeleteProgram}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card title="Agent Reviewing:">
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>First-/Lastname</th>
                    <th>Missing</th>
                    <th>Under checking</th>
                  </tr>
                </thead>
                {agent_reviewing}
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card title="Editor Progress:">
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>First-, Last Name</th>
                    <th>Waiting Inputs:</th>
                    <th>Editor reviewing:</th>
                    <th>Waiting Student's Feedback</th>
                  </tr>
                </thead>
                {editor_reviewing}
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tabs defaultActiveKey="w" id="uncontrolled-tab-example">
              <Tab eventKey="w" title="Student Documents Overview">
                <TabStudDocsDashboard
                  role={this.props.role}
                  students={this.props.students}
                  editAgent={this.props.editAgent}
                  editEditor={this.props.editEditor}
                  documentslist={this.props.documentslist}
                  documentlist2={this.props.documentlist2}
                  agent_list={this.props.agent_list}
                  editor_list={this.props.editor_list}
                  onFileChange={this.props.onFileChange}
                  onSubmitFile={this.props.onSubmitFile}
                  onUpdateProfileDocStatus={this.props.onUpdateProfileDocStatus}
                  onDeleteProgram={this.props.onDeleteProgram}
                  onDownloadFilefromstudent={
                    this.props.onDownloadFilefromstudent
                  }
                  onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
                  updateAgentList={this.props.updateAgentList}
                  handleChangeAgentlist={this.props.handleChangeAgentlist}
                  submitUpdateAgentlist={this.props.submitUpdateAgentlist}
                  updateEditorList={this.props.updateEditorList}
                  handleChangeEditorlist={this.props.handleChangeEditorlist}
                  submitUpdateEditorlist={this.props.submitUpdateEditorlist}
                  SYMBOL_EXPLANATION={this.props.SYMBOL_EXPLANATION}
                  updateStudentArchivStatus={
                    this.props.updateStudentArchivStatus
                  }
                  isDashboard={this.props.isDashboard}
                />
              </Tab>
              <Tab eventKey="dz" title="Agents and Editors">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>First-, Last Name</th>
                      <th>Agents</th>
                      <th>Editors</th>
                    </tr>
                  </thead>
                  {students_agent_editor}
                </Table>
              </Tab>
              {/* <Tab eventKey="x" title="Admin TODO">
                <Table responsive>
                  <thead>
                    <tr>
                      <>
                        <th>First-, Last Name</th>
                      </>
                      {this.props.agenttodolist.map((doc, index) => (
                        <th key={index}>{doc.name}</th>
                      ))}
                    </tr>
                  </thead>
                  {agent_todo}
                </Table>
              </Tab> */}
              <Tab eventKey="y" title="Editor & Docs Progress">
                <TabEditorDocsProgress
                  role={this.props.role}
                  students={this.props.students}
                  startEditingProgram={this.props.startEditingProgram}
                  documentslist={this.props.documentslist}
                  documentsprogresslist={this.props.documentsprogresslist}
                  documenheader={this.props.documenheader}
                  startUploadfile={this.props.startUploadfile}
                  onDownloadFilefromstudent={
                    this.props.onDownloadFilefromstudent
                  }
                  onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
                />
              </Tab>
              <Tab eventKey="z" title="Application Overview">
                <Table responsive>
                  <thead>
                    <tr>
                      <>
                        <th>First-, Last Name</th>
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
          </Col>
        </Row>
      </>
    );
  }
}

export default AdminMainView;

import React from "react";
import { Row, Col, Tabs, Tab, Table } from "react-bootstrap";
import Card from "../../../App/components/MainCard";
import EditorTodoList from "./EditorTodoList";
import TabStudDocsDashboard from "../MainViewTab/StudDocsOverview/TabStudDocsDashboard";
import EditorReviewing from "../MainViewTab/EditorReview/EditorReviewing";
import TabEditorDocsProgress from "../MainViewTab/EditorDocsProgress/TabEditorDocsProgress";
import TabProgramConflict from "../MainViewTab/ProgramConflict/TabProgramConflict";
import StudentsAgentEditor from "../MainViewTab/StudentsAgentEditor/StudentsAgentEditor";

class EditorMainView extends React.Component {
  render() {
    const editor_todo = this.props.students.map((student, i) => (
      <EditorTodoList
        key={i}
        student={student}
        startEditingProgram={this.props.startEditingProgram}
        editortodolist={this.props.editortodolist}
        documenheader={this.props.documenheader}
        documentlist2={this.props.documentlist2}
        startUploadfile={this.props.startUploadfile}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
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
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
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
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));
    return (
      <>
        {/* <Row>
          <Col sm={12}>
            <Card title="Editor: To Do">
              <Table responsive>
                <thead>
                  <tr>
                    <th>First-, Last Name</th>
                    {this.props.editortodolist.map((doc, index) => (
                      <th key={index}>{doc.name}</th>
                    ))}
                  </tr>
                </thead>
                {editor_todo}
              </Table>
            </Card>
          </Col>
        </Row> */}
        <Row>
          <Col md={12}>
            <Card title="Editor Reviewing:">
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>First-, Last Name</th>
                    <th>Uploaded files will be reviewed by your editor:</th>
                    <th>Waiting Student Feedback</th>
                  </tr>
                </thead>
                {editor_reviewing}
              </Table>
            </Card>
          </Col>
        </Row>
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
          <Col sm={12}>
            <Tabs defaultActiveKey="w" id="uncontrolled-tab-example">
              <Tab eventKey="w" title="Editor & Docs Progress">
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
                  onRejectFilefromstudent={this.props.onRejectFilefromstudent}
                  onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
                  onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
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
              <Tab eventKey="y" title="Student Profile Overview">
                <TabStudDocsDashboard
                  role={this.props.role}
                  students={this.props.students}
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
                  onDownloadFilefromstudent={
                    this.props.onDownloadFilefromstudent
                  }
                  onRejectFilefromstudent={this.props.onRejectFilefromstudent}
                  onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
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
            </Tabs>
          </Col>
        </Row>
      </>
    );
  }
}

export default EditorMainView;

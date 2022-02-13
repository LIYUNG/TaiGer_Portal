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
      />
    ));
    const students_agent_editor = this.props.students.map((student, i) => (
      <StudentsAgentEditor
        key={i}
        role={this.props.role}
        student={student}
        updateStudentArchivStatus={this.props.updateStudentArchivStatus}
        editAgent={this.props.editAgent}
        editEditor={this.props.editEditor}
        agent_list={this.props.agent_list}
        editor_list={this.props.editor_list}
        updateAgentList={this.props.updateAgentList}
        handleChangeAgentlist={this.props.handleChangeAgentlist}
        submitUpdateAgentlist={this.props.submitUpdateAgentlist}
        updateEditorList={this.props.updateEditorList}
        handleChangeEditorlist={this.props.handleChangeEditorlist}
        submitUpdateEditorlist={this.props.submitUpdateEditorlist}
      />
    ));
    const application_progress = this.props.students.map((student, i) => (
      <ApplicationProgress
        key={i}
        student={student}
      />
    ));
    const agent_reviewing = this.props.students.map((student, i) => (
      <AgentReviewing
        key={i}
        role={this.props.role}
        student={student}
      />
    ));
    const editor_reviewing = this.props.students.map((student, i) => (
      <EditorReviewing
        key={i}
        role={this.props.role}
        student={student}
      />
    ));
    return (
      <>
        <Row>
          <Col sm={12}>
            <Card title="Program Conflicts">
              <TabProgramConflict
                students={this.props.students}
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
                    <th>Close</th>
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
              <Tab eventKey="w" title="Student Background Overview">
                <TabStudDocsDashboard
                  role={this.props.role}
                  students={this.props.students}
                  onDeleteProgram={this.props.onDeleteProgram}
                  SYMBOL_EXPLANATION={this.props.SYMBOL_EXPLANATION}
                  updateStudentArchivStatus={
                    this.props.updateStudentArchivStatus
                  }
                  isDashboard={this.props.isDashboard}
                  onSetAsCloseProgram={this.props.onSetAsCloseProgram}
                  onSetAsDecidedProgram={this.props.onSetAsDecidedProgram}
                  onSetAsGetAdmissionProgram={
                    this.props.onSetAsGetAdmissionProgram
                  }
                />
              </Tab>
              <Tab eventKey="dz" title="Agents and Editors">
                <Table responsive>
                  <thead>
                    <tr>
                      <th></th>
                      <th>First-, Last Name</th>
                      <th>Agents</th>
                      <th>Editors</th>
                    </tr>
                  </thead>
                  {students_agent_editor}
                </Table>
              </Tab>
              <Tab eventKey="y" title="Editor & Docs Progress">
                <TabEditorDocsProgress
                  role={this.props.role}
                  students={this.props.students}
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
                      {window.programstatuslist.map((doc, index) => (
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

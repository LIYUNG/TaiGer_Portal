import React from "react";
import { Row, Col, Table, Tabs, Tab } from "react-bootstrap";
import Card from "../../../App/components/MainCard";
import TabStudDocsDashboard from "../MainViewTab/StudDocsOverview/TabStudDocsDashboard";
import AgentTodoList from "./AgentTodoList";
import AgentReviewing from "../MainViewTab/AgentReview/AgentReviewing";
import TabProgramConflict from "../MainViewTab/ProgramConflict/TabProgramConflict";
import ApplicationProgress from "../MainViewTab/ApplicationProgress/ApplicationProgress";
import StudentsAgentEditor from "../MainViewTab/StudentsAgentEditor/StudentsAgentEditor";

class AgentMainView extends React.Component {
  render() {
    const agent_todo = this.props.students.map((student, i) => (
      <AgentTodoList
        key={i}
        student={student}
      />
    ));
    const students_agent_editor = this.props.students.map((student, i) => (
      <StudentsAgentEditor
        key={i}
        role={this.props.role}
        student={student}
        documentslist={this.props.documentslist}
      />
    ));
    const agent_reviewing = this.props.students.map((student, i) => (
      <AgentReviewing
        key={i}
        role={this.props.role}
        student={student}
      />
    ));
    const application_progress = this.props.students.map((student, i) => (
      <ApplicationProgress
        key={i}
        student={student}
      />
    ));

    return (
      <>
        <Row>
          <Col md={12}>
            <Card title="Agent Reviewing:">
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>First-/Lastname</th>
                    <th>Missing</th>
                    <th>Under checking</th>
                    <th>ProgramTobeDecided</th>
                  </tr>
                </thead>
                <tbody>{agent_reviewing}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Card title="Agent: To Do">
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <>
                      <th>First-, Last Name</th>
                    </>
                    {window.agenttodolist.map((doc, index) => (
                      <th key={index}>{doc.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{agent_todo}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Tabs defaultActiveKey="w" id="uncontrolled-tab-example">
              <Tab eventKey="w" title="Student Background Overview">
                <TabStudDocsDashboard
                  role={this.props.role}
                  students={this.props.students}
                  startEditingProgram={this.props.startEditingProgram}
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
                  <tbody>{students_agent_editor}</tbody>
                </Table>
              </Tab>
              <Tab eventKey="z" title="Application Overview">
                <Table responsive>
                  <thead>
                    <tr>
                      <>
                        <th></th>
                        <th>First-, Last Name</th>
                        <th>University</th>
                        <th>Programs</th>
                        <th>Deadline</th>
                      </>
                      {window.programstatuslist.map((doc, index) => (
                        <th key={index}>{doc.name}</th>
                      ))}
                      <th>Days left</th>
                    </tr>
                  </thead>
                  {application_progress}
                </Table>
              </Tab>
              <Tab eventKey="zz" title="Program Conflicts">
                <TabProgramConflict
                  students={this.props.students}
                  startEditingProgram={this.props.startEditingProgram}
                />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </>
    );
  }
}

export default AgentMainView;

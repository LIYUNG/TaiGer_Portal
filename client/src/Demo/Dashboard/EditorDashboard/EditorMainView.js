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
      <EditorTodoList key={i} student={student} />
    ));
    const students_agent_editor = this.props.students.map((student, i) => (
      <StudentsAgentEditor
        key={student._id}
        role={this.props.role}
        student={student}
        agent_list={this.props.agent_list}
        editor_list={this.props.editor_list}
        updateStudentArchivStatus={this.props.updateStudentArchivStatus}
      />
    ));
    const editor_reviewing = this.props.students.map((student, i) => (
      <EditorReviewing
        key={student._id}
        role={this.props.role}
        student={student}
      />
    ));
    return (
      <>
        <Row>
          <Col md={12}>
            <Card title="Editor Reviewing:">
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
                <tbody>{editor_reviewing}</tbody>
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
                  documentslist={this.props.documentslist}
                  onDeleteProgram={this.props.onDeleteProgram}
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

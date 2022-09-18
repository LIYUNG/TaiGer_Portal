import React from 'react';
import { Row, Col, Tabs, Tab, Table } from 'react-bootstrap';
import Card from '../../../App/components/MainCard';
import EditorTodoList from './EditorTodoList';
import TabStudDocsDashboard from '../MainViewTab/StudDocsOverview/TabStudDocsDashboard';
import TabProgramConflict from '../MainViewTab/ProgramConflict/TabProgramConflict';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import NewUpdatedThreadFromStudent from '../MainViewTab/NewUpdatedThreadFromStudent/NewUpdatedThreadFromStudent';
import NewUpdatedThreadFromEditor from '../MainViewTab/NewUpdatedThreadFromEditor/NewUpdatedThreadFromEditor';
import EditorTODOTasks from '../MainViewTab/EditorTODOTasks/EditorTODOTasks';

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
      />
    ));
    const unread_thread = this.props.students.map((student, i) => (
      <NewUpdatedThreadFromStudent
        key={student._id}
        role={this.props.role}
        student={student}
      />
    ));
    const read_thread = this.props.students.map((student, i) => (
      <NewUpdatedThreadFromEditor key={student._id} role={this.props.role} student={student} />
    ));
    const editor_todo_tasks = this.props.students.map((student, i) => (
      <EditorTODOTasks key={student._id} role={this.props.role} student={student} />
    ));

    return (
      <>
        <Row>
          <Col md={6}>
            <Card title="Unread messages:">
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>First-, Last Name</th>
                    <th>Documents</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>{unread_thread}</tbody>
              </Table>
            </Card>
          </Col>
          <Col md={6}>
            <Card title="Waiting responses:">
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>First-, Last Name</th>
                    <th>Documents</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>{read_thread}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card title="Editor Tasks:">
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>First-, Last Name</th>
                    <th>Documents</th>
                    <th>Deadline</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>{editor_todo_tasks}</tbody>
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
            <Tabs defaultActiveKey="dz" id="uncontrolled-tab-example">
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

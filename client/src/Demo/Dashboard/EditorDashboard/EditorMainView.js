import React from 'react';
import { Row, Col, Tabs, Tab, Table } from 'react-bootstrap';
import Card from '../../../App/components/MainCard';
import TabStudDocsDashboard from '../MainViewTab/StudDocsOverview/TabStudDocsDashboard';
import TabProgramConflict from '../MainViewTab/ProgramConflict/TabProgramConflict';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import NewUpdatedThreadFromStudent from '../MainViewTab/NewUpdatedThreadFromStudent/NewUpdatedThreadFromStudent';
import NewUpdatedThreadFromEditor from '../MainViewTab/NewUpdatedThreadFromEditor/NewUpdatedThreadFromEditor';
import EditorTODOTasks from '../MainViewTab/EditorTODOTasks/EditorTODOTasks';

class EditorMainView extends React.Component {
  render() {
    const students_agent_editor = (
      <>
        <thead>
          <tr>
            <th>First-, Last Name</th>
            <th>Agents</th>
            <th>Editors</th>
          </tr>
        </thead>
        <tbody>
          {this.props.students.map((student, i) => (
            <StudentsAgentEditor
              key={student._id}
              role={this.props.role}
              student={student}
              agent_list={this.props.agent_list}
              editor_list={this.props.editor_list}
            />
          ))}
        </tbody>
      </>
    );
    const unread_thread = (
      <>
        <thead>
          <tr>
            <th>First-, Last Name</th>
            <th>Documents</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {this.props.students.map((student, i) => (
            <NewUpdatedThreadFromStudent
              key={student._id}
              role={this.props.role}
              student={student}
            />
          ))}
        </tbody>
      </>
    );
    const read_thread = (
      <>
        <thead>
          <tr>
            <th>First-, Last Name</th>
            <th>Documents</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {this.props.students.map((student, i) => (
            <NewUpdatedThreadFromEditor
              key={student._id}
              role={this.props.role}
              student={student}
            />
          ))}
        </tbody>
      </>
    );
    const editor_todo_tasks = (
      <>
        <thead>
          <tr>
            <th>First-, Last Name</th>
            <th>Documents</th>
            <th>Deadline</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {this.props.students.map((student, i) => (
            <EditorTODOTasks
              key={student._id}
              role={this.props.role}
              student={student}
            />
          ))}
        </tbody>
      </>
    );

    return (
      <>
        <Row>
          <Col md={6}>
            <Card title="Unread messages:">
              <Table responsive bordered hover>
                {unread_thread}
              </Table>
            </Card>
          </Col>
          <Col md={6}>
            <Card title="Waiting responses:">
              <Table responsive bordered hover>
                {read_thread}
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card title="Editor Tasks:">
              <Table responsive bordered hover>
                {editor_todo_tasks}
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
                <Table responsive>{students_agent_editor}</Table>
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

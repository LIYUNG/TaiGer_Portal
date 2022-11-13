import React from 'react';
import { Row, Col, Tabs, Tab, Table, Card } from 'react-bootstrap';
// import Card from '../../../App/components/MainCard';
import TabStudBackgroundDashboard from '../MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import TabProgramConflict from '../MainViewTab/ProgramConflict/TabProgramConflict';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import UnrespondedThreads from '../MainViewTab/NewUpdatedThreadFromStudent/UnrespondedThreads';
import RespondedThreads from '../MainViewTab/RespondedThreads/RespondedThreads';
import EditorTODOTasks from '../MainViewTab/EditorTODOTasks/EditorTODOTasks';
import { BsExclamationTriangle, BsX } from 'react-icons/bs';

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
            <UnrespondedThreads
              user={this.props.user}
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
            <RespondedThreads
              user={this.props.user}
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
          <Col md={12}>
            <Card className="mb-2 mx-0" bg={'danger'} text={'light'}>
              <Card.Header>
                <Card.Title>Unread messages:</Card.Title>
              </Card.Header>
              <Table
                responsive
                bordered
                hover
                className="my-0 mx-0"
                variant="dark"
                text="light"
              >
                {unread_thread}
              </Table>
            </Card>
          </Col>
          {/* <Col md={6}>
            <Card className="mb-2 mx-0" bg={'danger'} text={'light'}>
              <Card.Header>
                <Card.Title>Waiting responses:</Card.Title>
              </Card.Header>
              <Table
                responsive
                bordered
                hover
                className="my-0 mx-0"
                variant="dark"
                text="light"
              >
                {read_thread}
              </Table>
            </Card>
          </Col> */}
        </Row>
        <Row>
          <Col md={12}>
            <Card className="mb-2 mx-0" bg={'danger'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  <BsExclamationTriangle size={18} />{' '}
                  Editor Open Tasks:
                </Card.Title>
              </Card.Header>
              <Table
                responsive
                bordered
                hover
                className="my-0 mx-0"
                variant="dark"
                text="light"
              >
                {editor_todo_tasks}
              </Table>
            </Card>
          </Col>
        </Row>
        <TabProgramConflict students={this.props.students} />
        <Row>
          <Col sm={12}>
            <Tabs defaultActiveKey="dz" id="uncontrolled-tab-example">
              <Tab eventKey="dz" title="Agents and Editors">
                <Table
                  responsive
                  className="my-0 mx-0"
                  variant="dark"
                  text="light"
                >
                  {students_agent_editor}
                </Table>
              </Tab>
              <Tab eventKey="y" title="Student Profile Overview">
                <TabStudBackgroundDashboard
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

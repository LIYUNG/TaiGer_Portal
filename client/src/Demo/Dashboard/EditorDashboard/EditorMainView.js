import React from 'react';
import { Row, Col, Tabs, Tab, Table, Card } from 'react-bootstrap';
// import Card from '../../../App/components/MainCard';
import TabStudBackgroundDashboard from '../MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import TabProgramConflict from '../MainViewTab/ProgramConflict/TabProgramConflict';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import UnrespondedThreads from '../MainViewTab/NewUpdatedThreadFromStudent/UnrespondedThreads';
import EditorTODOTasks from '../MainViewTab/EditorTODOTasks/EditorTODOTasks';
import { BsExclamationTriangle, BsX } from 'react-icons/bs';

class EditorMainView extends React.Component {
  render() {
    const students_agent_editor = (
      <>
        <thead>
          <tr>
            <th></th>
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
            <th>Deadline</th>
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
    const editor_todo_tasks = (
      <>
        <thead>
          <tr>
            <th>First-, Last Name</th>
            <th>Status</th>
            <th>Documents</th>
            <th>Deadline</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {this.props.students.map((student, i) => (
            <EditorTODOTasks
              user={this.props.user}
              key={student._id}
              student={student}
            />
          ))}
        </tbody>
      </>
    );

    return (
      <>
        <Row>
          <Card className="px-0 mb-2 mx-0" bg={'danger'} text={'light'}>
            <Card.Header>
              <Card.Title className="my-0 mx-0 text-light">
                <BsExclamationTriangle size={18} /> Unreplied messages:
              </Card.Title>
            </Card.Header>
            <Table
              responsive
              bordered
              hover
              className="my-0 mx-0"
              variant="dark"
              text="light"
              size="sm"
            >
              {unread_thread}
            </Table>
          </Card>
        </Row>
        <TabProgramConflict students={this.props.students} />
        <Row>
          <Card className="px-0 mb-2 mx-0" bg={'primary'} text={'light'}>
            <Card.Header>
              <Card.Title className="my-0 mx-0 text-light">
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
              size="sm"
            >
              {editor_todo_tasks}
            </Table>
          </Card>
        </Row>
        <Row>
          <Tabs
            defaultActiveKey="dz"
            id="uncontrolled-tab-example"
            fill={true}
            justify={true}
          >
            <Tab eventKey="dz" title="Agents and Editors">
              <Table
                size="sm"
                responsive
                bordered
                hover
                className="my-0 mx-0"
                variant="dark"
                text="light"
              >
                {students_agent_editor}
              </Table>
            </Tab>
            <Tab eventKey="y" title="Student Profile Overview">
              <TabStudBackgroundDashboard
                students={this.props.students}
                user={this.props.user}
                updateStudentArchivStatus={this.props.updateStudentArchivStatus}
                isDashboard={this.props.isDashboard}
              />
            </Tab>
          </Tabs>
        </Row>
      </>
    );
  }
}

export default EditorMainView;

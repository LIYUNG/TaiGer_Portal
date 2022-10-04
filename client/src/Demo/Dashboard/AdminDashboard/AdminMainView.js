import React from 'react';
import { Row, Card, Col, Table, Tabs, Tab } from 'react-bootstrap';
// import Card from '../../../App/components/MainCard';
import TabStudDocsDashboard from '../MainViewTab/StudDocsOverview/TabStudDocsDashboard';
// import AdminTodoList from './AdminTodoList';
import AgentReviewing from '../MainViewTab/AgentReview/AgentReviewing';
import TabProgramConflict from '../MainViewTab/ProgramConflict/TabProgramConflict';
import ApplicationProgress from '../MainViewTab/ApplicationProgress/ApplicationProgress';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import NoEditorsStudentsCard from '../MainViewTab/NoEditorsStudentsCard/NoEditorsStudentsCard';
import NoAgentsStudentsCard from '../MainViewTab/NoAgentsStudentsCard/NoAgentsStudentsCard';

class AdminMainView extends React.Component {
  render() {
    const no_agent_students = this.props.students.map((student, i) => (
      <NoAgentsStudentsCard
        key={i}
        role={this.props.role}
        student={student}
        updateStudentArchivStatus={this.props.updateStudentArchivStatus}
        editAgent={this.props.editAgent}
        agent_list={this.props.agent_list}
        updateAgentList={this.props.updateAgentList}
        handleChangeAgentlist={this.props.handleChangeAgentlist}
        submitUpdateAgentlist={this.props.submitUpdateAgentlist}
      />
    ));
    const no_editor_students = this.props.students.map((student, i) => (
      <NoEditorsStudentsCard
        key={i}
        role={this.props.role}
        student={student}
        updateStudentArchivStatus={this.props.updateStudentArchivStatus}
        editEditor={this.props.editEditor}
        editor_list={this.props.editor_list}
        updateEditorList={this.props.updateEditorList}
        handleChangeEditorlist={this.props.handleChangeEditorlist}
        submitUpdateEditorlist={this.props.submitUpdateEditorlist}
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
      <ApplicationProgress key={i} role={this.props.role} student={student} />
    ));
    const agent_reviewing = this.props.students.map((student, i) => (
      <AgentReviewing key={i} role={this.props.role} student={student} />
    ));
    return (
      <>
        <Row className="mb-2">
          <Col md={6} className="mx-0">
            <Card className="my-0 mx-0" bg={'danger'} text={'white'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0">
                  No Agents Students
                </Card.Title>
              </Card.Header>
              <Table
                responsive
                variant="dark"
                text="light"
                className="my-0 mx-0"
              >
                <thead>
                  <tr>
                    <th></th>
                    <th>First-, Last Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>{no_agent_students}</tbody>
              </Table>
            </Card>
          </Col>
          <Col md={6} className="mx-0">
            <Card className="my-0 mx-0" bg={'danger'} text={'white'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0">
                  No Editors Students
                </Card.Title>
              </Card.Header>
              <Table
                responsive
                className="my-0 mx-0"
                variant="dark"
                text="light"
              >
                <thead>
                  <tr>
                    <th></th>
                    <th>First-, Last Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>{no_editor_students}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col md={12}>
            <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0">Program Conflicts</Card.Title>
              </Card.Header>
              <TabProgramConflict students={this.props.students} />
            </Card>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col md={12}>
            <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0">Agent Reviewing:</Card.Title>
              </Card.Header>
              <Table
                responsive
                bordered
                hover
                className="my-0 mx-0"
                variant="dark"
                text="light"
              >
                <thead>
                  <tr>
                    <th>First-/Lastname</th>
                    <th>Missing</th>
                    <th>ProgramTobeDecided</th>
                  </tr>
                </thead>
                <tbody>{agent_reviewing}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tabs defaultActiveKey="w" id="uncontrolled-tab-example">
              <Tab
                eventKey="w"
                title="Student Background Overview"
                className="my-0 mx-0"
              >
                <TabStudDocsDashboard
                  role={this.props.role}
                  students={this.props.students}
                  SYMBOL_EXPLANATION={this.props.SYMBOL_EXPLANATION}
                  updateStudentArchivStatus={
                    this.props.updateStudentArchivStatus
                  }
                  isDashboard={this.props.isDashboard}
                />
              </Tab>
              <Tab eventKey="dz" title="Agents and Editors">
                <Table
                  responsive
                  bordered
                  hover
                  className="my-0 mx-0"
                  variant="dark"
                  text="light"
                >
                  <thead>
                    <tr>
                      <th></th>
                      <th>First-, Last Name</th>
                      <th>Agents</th>
                      <th>Editors</th>
                    </tr>
                  </thead>
                  <tbody>{students_agent_editor}</tbody>
                </Table>
              </Tab>
              <Tab eventKey="z" title="Application Overview">
                <Table
                  responsive
                  bordered
                  hover
                  className="my-0 mx-0"
                  variant="dark"
                  text="light"
                >
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
                    </tr>
                  </thead>
                  <tbody>{application_progress}</tbody>
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

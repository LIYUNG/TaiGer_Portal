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
import AdminTasks from '../MainViewTab/AdminTasks/index';
import { BsExclamationTriangle, BsX } from 'react-icons/bs';

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

    const agent_reviewing = this.props.students.map((student, i) => (
      <AgentReviewing key={i} role={this.props.role} student={student} />
    ));
    const admin_tasks = (
      <AdminTasks role={this.props.role} students={this.props.students} />
    );
    return (
      <>
        <Row>
          <Col>
            <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  <BsExclamationTriangle size={18} /> To Do Tasks:
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
                <thead>
                  <tr>
                    <th>Tasks</th>
                    <th>Description</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>{admin_tasks}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <TabProgramConflict students={this.props.students} />
        <Row className="mb-2 my-2">
          <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
            <Card.Header>
              <Card.Title className="my-0 mx-0 text-light">
                Agent Reviewing
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
              <thead>
                <tr>
                  <th>First-/Lastname</th>
                  <th>Survey</th>
                  <th>Base Documents</th>
                  <th>Uni-Assist</th>
                  <th>Program Selection</th>
                  <th>Submission</th>
                </tr>
              </thead>
              <tbody>{agent_reviewing}</tbody>
            </Table>
          </Card>
        </Row>
        <Row>
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
                updateStudentArchivStatus={this.props.updateStudentArchivStatus}
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
          </Tabs>
        </Row>
      </>
    );
  }
}

export default AdminMainView;

import React from 'react';
import { Row, Card, Table, Tabs, Tab } from 'react-bootstrap';
import { BsExclamationTriangle } from 'react-icons/bs';

// import TabStudBackgroundDashboard from '../MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import AgentReviewing from '../MainViewTab/AgentReview/AgentReviewing';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import AdminTasks from '../MainViewTab/AdminTasks/index';
import { academic_background_header } from '../../Utils/contants';

class AdminMainView extends React.Component {
  render() {
    const students_agent_editor = this.props.students
      .sort((a, b) =>
        a.agents.length === 0 && a.agents.length < b.agents.length
          ? -2
          : a.editors.length < b.editors.length
          ? -1
          : 1
      )
      .map((student, i) => (
        <StudentsAgentEditor
          key={i}
          role={this.props.role}
          user={this.props.user}
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
          isDashboard={this.props.isDashboard}
        />
      ));

    const agent_reviewing = this.props.students.map((student, i) => (
      <AgentReviewing key={i} role={this.props.role} student={student} />
    ));
    const admin_tasks = (
      <AdminTasks role={this.props.role} students={this.props.students} />
    );
    let header = Object.values(academic_background_header);

    return (
      <>
        <Row className="px-0 py-0 mb-2 my-0">
          <Card className="py-0 px-0 my-0 mx-0" bg={'danger'} text={'light'}>
            <Card.Header>
              <Card.Title className="px-0 py-0 my-0 mx-0 text-light">
                <BsExclamationTriangle size={18} /> Admin To Do Tasks:
              </Card.Title>
            </Card.Header>
            <Table
              size="sm"
              responsive
              bordered
              hover
              className="px-0 my-0 mx-0"
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
        </Row>
        <Row className="px-0 mb-2 my-2">
          <Card className="px-0 my-0 mx-0" bg={'dark'} text={'white'}>
            <Card.Header>
              <Card.Title className="my-0 mx-0 text-light">
                Agent Reviewing
              </Card.Title>
            </Card.Header>
            <Table
              responsive
              bordered
              hover
              className="px-0 my-0 mx-0 py-0"
              variant="dark"
              text="light"
              size="sm"
            >
              <thead>
                <tr>
                  <th>First-/Lastname,Birthday</th>
                  <th>Target Year</th>
                  <th>Survey</th>
                  <th>Language</th>
                  <th>Base Documents</th>
                  <th>CV</th>
                  <th>Portals</th>
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
          {/* <Tabs
            defaultActiveKey="w"
            id="uncontrolled-tab-example"
            fill={true}
            justify={true}
          >
            <Tab
              eventKey="w"
              title="Student Background Overview"
              className="my-0 mx-0 py-0"
            >
              <TabStudBackgroundDashboard
                students={this.props.students}
                user={this.props.user}
                updateStudentArchivStatus={this.props.updateStudentArchivStatus}
                isDashboard={this.props.isDashboard}
              />
            </Tab>
            <Tab eventKey="dz" title="Agents and Editors"></Tab>
          </Tabs> */}
          <Table
            size="sm"
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
                <th>
                  First-, Last Name | 姓名 <br /> Email
                </th>
                <th>Agents</th>
                <th>Editors</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Degree</th>
                {header.map((name, index) => (
                  <th key={index}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>{students_agent_editor}</tbody>
          </Table>
        </Row>
      </>
    );
  }
}

export default AdminMainView;

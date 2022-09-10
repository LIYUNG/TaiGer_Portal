import React from 'react';
import { Row, Col, Table, Tabs, Tab } from 'react-bootstrap';
import Card from '../../../App/components/MainCard';
import StudentMyself from './StudentMyself';
import StudentTodoList from './StudentTodoList';
import AgentReviewing from '../MainViewTab/AgentReview/AgentReviewing';
import TabEditorDocsProgress from '../MainViewTab/EditorDocsProgress/TabEditorDocsProgress';
import ApplicationProgress from '../MainViewTab/ApplicationProgress/ApplicationProgress';
import { addHours, addDays, addWeeks, startOfWeek } from 'date-fns';
// import TimeLine from "react-gantt-timeline";
import Generator from './Generator';
import NewUpdatedThreadFromStudent from '../MainViewTab/NewUpdatedThreadFromStudent/NewUpdatedThreadFromStudent';
import NewUpdatedThreadFromEditor from '../MainViewTab/NewUpdatedThreadFromEditor/NewUpdatedThreadFromEditor';

import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const config = {
  header: {
    top: {
      style: {
        background: 'linear-gradient( grey, black)',
        textShadow: '0.5px 0.5px black',
        fontSize: 12
      }
    },
    middle: {
      style: {
        background: 'linear-gradient( orange, grey)',
        fontSize: 9
      }
    },
    bottom: {
      style: {
        background: 'linear-gradient( grey, black)',
        fontSize: 9,
        color: 'orange'
      },
      selectedStyle: {
        background: 'linear-gradient( #d011dd ,#d011dd)',
        fontWeight: 'bold',
        color: 'white'
      }
    }
  },
  taskList: {
    title: {
      label: 'Task Todo',
      style: {
        background: 'linear-gradient( grey, black)'
      }
    },
    task: {
      style: {
        backgroundColor: 'grey',
        color: 'white'
      }
    },
    verticalSeparator: {
      style: {
        backgroundColor: '#fbf9f9'
      },
      grip: {
        style: {
          backgroundColor: 'red'
        }
      }
    }
  },
  dataViewPort: {
    rows: {
      style: {
        backgroundColor: 'white',
        borderBottom: 'solid 0.5px silver'
      }
    },
    task: {
      showLabel: true,
      style: {
        borderRadius: 1,
        boxShadow: '2px 2px 8px #888888'
      }
    }
  }
};

class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);
    let result = Generator.generateData();
    this.data = result.data;
    this.state = {
      itemheight: 20,
      data: [],
      links: result.links
    };
  }

  // handleAddEvent = () => {
  //   setState((state) => ({ ...state, allEvents }));
  // };
  onHorizonChange = (start, end) => {
    //Return data the is in the range
    let result = this.data.filter((item) => {
      return (
        (item.start < start && item.end > end) ||
        (item.start > start && item.start < end) ||
        (item.end > start && item.end < end)
      );
    });
    this.setState({ data: result });
  };

  render() {
    const stdlist = this.props.students.map((student, i) => (
      <StudentMyself
        key={i}
        role={this.props.role}
        student={student}
        profile_list={window.profile_list}
      />
    ));

    const application_progress = this.props.students.map((student, i) => (
      <ApplicationProgress key={i} role={this.props.role} student={student} />
    ));

    const your_editors = this.props.students.map((student, i) =>
      student.editors ? (
        student.editors.map((editor, i) => (
          <tr key={i}>
            <td>Editor</td>
            <td>
              {editor.firstname} - {editor.lastname}
            </td>
            <td>{editor.email}</td>
          </tr>
        ))
      ) : (
        <></>
      )
    );

    const your_agents = this.props.students.map((student, i) =>
      student.agents ? (
        student.agents.map((agent, i) => (
          <tr key={i}>
            <td>Agent</td>
            <td>
              {agent.firstname} - {agent.lastname}
            </td>
            <td>{agent.email}</td>
          </tr>
        ))
      ) : (
        <></>
      )
    );

    const std_todo = this.props.students.map((student, i) => (
      <StudentTodoList key={i} student={student} />
    ));
    const agent_reviewing = this.props.students.map((student, i) => (
      <AgentReviewing key={i} role={this.props.role} student={student} />
    ));
    const read_thread = this.props.students.map((student, i) => (
      <NewUpdatedThreadFromStudent
        key={student._id}
        role={this.props.role}
        student={student}
      />
    ));
    const unread_thread = this.props.students.map((student, i) => (
      <NewUpdatedThreadFromEditor
        key={student._id}
        role={this.props.role}
        student={student}
      />
    ));

    return (
      <>
        <Row>
          {/* <Card title={"Schedule"}> */}
          {/* <TimeLine
              data={this.state.data}
              links={this.state.links}
              config={config}
              onHorizonChange={this.onHorizonChange}
            /> */}
          {/* </Card> */}
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
                {unread_thread}
              </Table>
            </Card>
          </Col>
          <Col md={6}>
            <Card title="Pending:">
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>First-, Last Name</th>
                    <th>Documents</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                {read_thread}
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card title="Your TaiGer Team">
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>First-, Last Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {your_agents}
                  {your_editors}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Tabs defaultActiveKey="x" id="uncontrolled-tab-example">
              <Tab eventKey="x" title="My Uploaded Documents">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Documents</th>
                    </tr>
                  </thead>
                  <tbody>{stdlist}</tbody>
                </Table>
                {/* {this.props.SYMBOL_EXPLANATION} */}
              </Tab>
            </Tabs>
          </Col>
          <Col md={4}>
            <Card title="Agent Reviewing:">
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>Uploaded files will be reviewed by your agent:</th>
                    <th>Programs will be reviewed by your agent:</th>
                  </tr>
                </thead>
                {agent_reviewing}
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card title="My Editor & Docs Progress">
              <TabEditorDocsProgress
                role={this.props.role}
                students={this.props.students}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card title="My Application Progress">
              <Table responsive>
                <thead>
                  <tr>
                    <>
                      {this.props.role !== 'Student' ? (
                        <th>First-, Last Name</th>
                      ) : (
                        <></>
                      )}
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
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default StudentDashboard;

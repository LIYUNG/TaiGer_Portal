import React from 'react';
import { Row, Col, Table, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import Card from '../../../App/components/MainCard';
import StudentMyself from './StudentMyself';
import AgentReviewing_StudentView from '../MainViewTab/AgentReview/AgentReviewing_StudentView';
import ApplicationProgress from '../MainViewTab/ApplicationProgress/ApplicationProgress';
// import { addHours, addDays, addWeeks, startOfWeek } from 'date-fns';
// import TimeLine from "react-gantt-timeline";
import Generator from './Generator';
import NewUpdatedThreadFromStudent from '../MainViewTab/NewUpdatedThreadFromStudent/NewUpdatedThreadFromStudent';
import NewUpdatedThreadFromEditor from '../MainViewTab/NewUpdatedThreadFromEditor/NewUpdatedThreadFromEditor';
import { BsExclamationTriangle } from 'react-icons/bs';
import {
  check_survey_filled,
  check_application_selection
} from '../../Utils/checking-functions';

// import format from 'date-fns/format';
// import getDay from 'date-fns/getDay';
// import parse from 'date-fns/parse';
// import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// const config = {
//   header: {
//     top: {
//       style: {
//         background: 'linear-gradient( grey, black)',
//         textShadow: '0.5px 0.5px black',
//         fontSize: 12
//       }
//     },
//     middle: {
//       style: {
//         background: 'linear-gradient( orange, grey)',
//         fontSize: 9
//       }
//     },
//     bottom: {
//       style: {
//         background: 'linear-gradient( grey, black)',
//         fontSize: 9,
//         color: 'orange'
//       },
//       selectedStyle: {
//         background: 'linear-gradient( #d011dd ,#d011dd)',
//         fontWeight: 'bold',
//         color: 'white'
//       }
//     }
//   },
//   taskList: {
//     title: {
//       label: 'Task Todo',
//       style: {
//         background: 'linear-gradient( grey, black)'
//       }
//     },
//     task: {
//       style: {
//         backgroundColor: 'grey',
//         color: 'white'
//       }
//     },
//     verticalSeparator: {
//       style: {
//         backgroundColor: '#fbf9f9'
//       },
//       grip: {
//         style: {
//           backgroundColor: 'red'
//         }
//       }
//     }
//   },
//   dataViewPort: {
//     rows: {
//       style: {
//         backgroundColor: 'white',
//         borderBottom: 'solid 0.5px silver'
//       }
//     },
//     task: {
//       showLabel: true,
//       style: {
//         borderRadius: 1,
//         boxShadow: '2px 2px 8px #888888'
//       }
//     }
//   }
// };

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

  check_application_selection_to_decided = (student) => {
    for (let i = 0; i < student.applications.length; i += 1) {
      if (student.applications[i].decided === '-') {
        return true;
      }
    }
    return false;
  };

  check_base_documents = (student) => {
    let documentlist2_keys = Object.keys(window.profile_list);
    let object_init = {};
    for (let i = 0; i < documentlist2_keys.length; i++) {
      object_init[documentlist2_keys[i]] = 'missing';
    }
    if (student.profile.length === 0) {
      return false;
    }
    if (student.profile) {
      for (let i = 0; i < student.profile.length; i++) {
        if (student.profile[i].status === 'uploaded') {
          object_init[student.profile[i].name] = 'uploaded';
        } else if (student.profile[i].status === 'accepted') {
          object_init[student.profile[i].name] = 'accepted';
        } else if (student.profile[i].status === 'rejected') {
          object_init[student.profile[i].name] = 'rejected';
        } else if (student.profile[i].status === 'missing') {
          object_init[student.profile[i].name] = 'missing';
        } else if (student.profile[i].status === 'notneeded') {
          object_init[student.profile[i].name] = 'notneeded';
        }
      }
    } else {
      return false;
    }
    for (let i = 0; i < documentlist2_keys.length; i++) {
      if (object_init[documentlist2_keys[i]] === 'missing') {
        return false;
      }
    }
    return true;
  };
  check_base_documents_rejected = (student) => {
    let documentlist2_keys = Object.keys(window.profile_list);
    let object_init = {};
    for (let i = 0; i < documentlist2_keys.length; i++) {
      object_init[documentlist2_keys[i]] = 'missing';
    }
    if (student.profile.length === 0) {
      return false;
    }
    if (student.profile) {
      for (let i = 0; i < student.profile.length; i++) {
        if (student.profile[i].status === 'uploaded') {
          object_init[student.profile[i].name] = 'uploaded';
        } else if (student.profile[i].status === 'accepted') {
          object_init[student.profile[i].name] = 'accepted';
        } else if (student.profile[i].status === 'rejected') {
          object_init[student.profile[i].name] = 'rejected';
        } else if (student.profile[i].status === 'missing') {
          object_init[student.profile[i].name] = 'missing';
        } else if (student.profile[i].status === 'notneeded') {
          object_init[student.profile[i].name] = 'notneeded';
        }
      }
    } else {
      return false;
    }
    for (let i = 0; i < documentlist2_keys.length; i++) {
      if (object_init[documentlist2_keys[i]] === 'rejected') {
        return false;
      }
    }
    return true;
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

    const agent_reviewing = this.props.students.map((student, i) => (
      <AgentReviewing_StudentView
        key={i}
        role={this.props.role}
        student={student}
      />
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
    const student = this.props.students[0];

    return (
      <>
        {!check_survey_filled(student.academic_background) && (
          <Row>
            <Col>
              <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                <Card.Body>
                  <BsExclamationTriangle size={18} />
                  <b className="mx-2">Reminder:</b> It looks like you did not
                  finish survey:{' '}
                  <Link to={'/survey'} style={{ textDecoration: 'none' }}>
                    Survey
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        {!check_application_selection(student) && (
          <Row>
            <Col>
              <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                <Card.Body>
                  <BsExclamationTriangle size={18} />
                  <b className="mx-2">Reminder:</b> It looks like you did not
                  decide programs:{' '}
                  <Link
                    to={'/student-applications'}
                    style={{ textDecoration: 'none' }}
                  >
                    My Applications
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        {check_application_selection(student) &&
          this.check_application_selection_to_decided(student) && (
            <Row>
              <Col>
                <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                  <Card.Body>
                    <BsExclamationTriangle size={18} />
                    <b className="mx-2">Reminder:</b>
                    It looks like you did not confirm the programs yet:{' '}
                    <Link
                      to={'/student-applications'}
                      style={{ textDecoration: 'none' }}
                    >
                      My Applications
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        {!this.check_base_documents(student) && (
          <Row>
            <Col>
              <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                <Card.Body>
                  <BsExclamationTriangle size={18} />
                  <b className="mx-2">Reminder:</b>Some of Base Documents are
                  still missing :{' '}
                  <Link
                    to={'/base-documents'}
                    style={{ textDecoration: 'none' }}
                  >
                    My Base Documents
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        {!this.check_base_documents_rejected(student) && (
          <Row>
            <Col>
              <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                <Card.Body>
                  <BsExclamationTriangle size={18} />
                  <b className="mx-2">Reminder:</b>Some of Base Documents are
                  rejected :{' '}
                  <Link
                    to={'/base-documents'}
                    style={{ textDecoration: 'none' }}
                  >
                    My Base Documents
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <Card className="my-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title>My Application Progress</Card.Title>
              </Card.Header>
              <Table
                responsive
                className="my-0 mx-0"
                variant="dark"
                text="light"
              >
                <thead>
                  <tr>
                    <>
                      {this.props.role !== 'Student' ? (
                        <th>First-, Last Name</th>
                      ) : (
                        <th></th>
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
                <tbody>{application_progress}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
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
            <Card className="my-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0">Your TaiGer Team</Card.Title>
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
            <Card className="my-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0">
                  <Link
                    to={'/student-database/' + student._id + '/profile'}
                    style={{ textDecoration: 'none' }}
                    className="text-info"
                  >
                    My Uploaded Documents
                  </Link>
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
                    <th>Status</th>
                    <th>Documents</th>
                  </tr>
                </thead>
                <tbody>{stdlist}</tbody>
              </Table>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="my-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0">Unread messages:</Card.Title>
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
                    <th>First-, Last Name</th>
                    <th>Documents</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>{unread_thread}</tbody>
              </Table>
            </Card>
            <Card className="my-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0">Pending</Card.Title>
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
                    <th>First-, Last Name</th>
                    <th>Documents</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>{read_thread}</tbody>
              </Table>
            </Card>
            <Card className="my-0 mx-0" bg={'dark'} text={'light'}>
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
                    <th>Uploaded files will be reviewed by your agent:</th>
                    <th>Programs will be reviewed by your agent:</th>
                  </tr>
                </thead>
                <tbody>{agent_reviewing}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default StudentDashboard;

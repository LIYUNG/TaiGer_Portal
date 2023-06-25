import React from 'react';
import { Row, Col, Tabs, Tab, Table, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import Card from '../../../App/components/MainCard';
import TabStudBackgroundDashboard from '../MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import TabProgramConflict from '../MainViewTab/ProgramConflict/TabProgramConflict';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import UnrespondedThreads from '../MainViewTab/NewUpdatedThreadFromStudent/UnrespondedThreads';
import EditorTODOTasks from '../MainViewTab/EditorTODOTasks/EditorTODOTasks';
import { BsExclamationTriangle, BsX } from 'react-icons/bs';
import TasksDistributionBarChart from '../../../components/Charts/TasksDistributionBarChart';
import {
  does_student_have_editors,
  frequencyDistribution,
  open_tasks_with_editors
} from '../../Utils/checking-functions';
import { academic_background_header } from '../../Utils/contants';

class EditorMainView extends React.Component {
  render() {
    const students_agent_editor = (
      <>
        {this.props.students
          .sort((a, b) =>
            a.agents.length === 0 && a.agents.length < b.agents.length
              ? -2
              : a.editors.length < b.editors.length
              ? -1
              : 1
          )
          .map((student, i) => (
            <StudentsAgentEditor
              key={student._id}
              user={this.props.user}
              role={this.props.role}
              student={student}
              editor_list={this.props.editor_list}
              editEditor={this.props.editEditor}
              updateEditorList={this.props.updateEditorList}
              handleChangeEditorlist={this.props.handleChangeEditorlist}
              submitUpdateEditorlist={this.props.submitUpdateEditorlist}
              isDashboard={this.props.isDashboard}
              updateStudentArchivStatus={this.props.updateStudentArchivStatus}
            />
          ))}
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
          {this.props.students
            .filter((student) =>
              student.editors.some(
                (editor) => editor._id === this.props.user._id.toString()
              )
            )
            .map((student, i) => (
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
          {this.props.students
            .filter((student) =>
              student.editors.some(
                (editor) => editor._id === this.props.user._id.toString()
              )
            )
            .map((student, i) => (
              <EditorTODOTasks
                user={this.props.user}
                key={student._id}
                student={student}
              />
            ))}
        </tbody>
      </>
    );
    const open_tasks_arr = open_tasks_with_editors(this.props.students);
    const task_distribution = open_tasks_arr
      .filter(({ isFinalVersion, show }) => isFinalVersion !== true)
      .map(({ deadline, file_type, show }) => {
        return { deadline, file_type, show };
      });
    const open_distr = frequencyDistribution(task_distribution);

    const sort_date = Object.keys(open_distr).sort();

    const sorted_date_freq_pair = [];
    sort_date.forEach((date, i) => {
      sorted_date_freq_pair.push({
        name: `${date}`,
        active: open_distr[date].show,
        potentials: open_distr[date].potentials
      });
    });
    let header = Object.values(academic_background_header);

    return (
      <>
        <Row>
          <Card className="px-0 mb-2 mx-0">
            <Card.Header text={'dark'}>
              <Card.Title>
                <Row>
                  <Col className="my-0 mx-0">
                    <b>
                      {this.props.user.firstname} {this.props.user.lastname}
                    </b>{' '}
                    Open Tasks Distribution
                  </Col>
                </Row>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              Tasks distribute among the date. Note that CVs, MLs, RLs, and
              Essay are mixed together.
              <p className="my-0">
                <b style={{ color: 'red' }}>active:</b> students decide
                programs. These will be shown in{' '}
                <Link to={'/dashboard/cv-ml-rl'}>Tasks Dashboard</Link>
              </p>
              <p className="my-0">
                <b style={{ color: '#A9A9A9' }}>potentials:</b> students do not
                decide programs yet. But the tasks will be potentially active
                when they decided.
              </p>
              <TasksDistributionBarChart data={sorted_date_freq_pair} />
            </Card.Body>
          </Card>
        </Row>
        {!does_student_have_editors(this.props.students) && (
          <Row>
            <Card className="px-0 mb-2 mx-0" bg={'danger'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  <b>Assign Editor</b>{' '}
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
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Link
                        to={'/assignment/editors'}
                        style={{ textDecoration: 'none' }}
                        className="text-info"
                      >
                        Assign Editors
                      </Link>
                    </td>
                    <td>Please assign editors</td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Row>
        )}
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
            <Tab eventKey="dz" title="Agents and Editors"></Tab>
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
        <Row>
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

export default EditorMainView;

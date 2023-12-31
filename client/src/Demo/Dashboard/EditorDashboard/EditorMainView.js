import React from 'react';
import { Row, Col, Table, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TabProgramConflict from '../MainViewTab/ProgramConflict/TabProgramConflict';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import UnrespondedThreads from '../MainViewTab/NewUpdatedThreadFromStudent/UnrespondedThreads';
import TasksDistributionBarChart from '../../../components/Charts/TasksDistributionBarChart';
import {
  does_student_have_editors,
  frequencyDistribution,
  open_tasks_with_editors
} from '../../Utils/checking-functions';
import {
  academic_background_header,
  is_new_message_status,
  is_pending_status
} from '../../Utils/contants';
import DEMO from '../../../store/constant';

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
    const unreplied_task = this.props.students
      .filter((student) =>
        student.editors.some(
          (editor) => editor._id === this.props.user._id.toString()
        )
      )
      .flatMap((student, i) => [
        ...student.generaldocs_threads
          .filter(
            (generaldocs_threads) =>
              !generaldocs_threads.isFinalVersion &&
              is_new_message_status(this.props.user, generaldocs_threads)
          )
          .flatMap((generaldocs_threads, i) => [generaldocs_threads]),
        ...student.applications.flatMap((application, i) =>
          application.doc_modification_thread
            .filter(
              (application_doc_thread) =>
                !application_doc_thread.isFinalVersion &&
                is_new_message_status(this.props.user, application_doc_thread)
            )
            .flatMap((application_doc_thread, idx) => [application_doc_thread])
        )
      ]);
    const follow_up_task = this.props.students
      .filter((student) =>
        student.editors.some(
          (editor) => editor._id === this.props.user._id.toString()
        )
      )
      .flatMap((student, i) => [
        ...student.generaldocs_threads
          .filter(
            (generaldocs_threads) =>
              !generaldocs_threads.isFinalVersion &&
              is_pending_status(this.props.user, generaldocs_threads) &&
              generaldocs_threads.latest_message_left_by_id !== ''
          )
          .flatMap((generaldocs_threads, i) => [generaldocs_threads]),
        ...student.applications.flatMap((application, i) =>
          application.doc_modification_thread
            .filter(
              (application_doc_thread) =>
                !application_doc_thread.isFinalVersion &&
                is_pending_status(this.props.user, application_doc_thread) &&
                application_doc_thread.latest_message_left_by_id !== ''
            )
            .flatMap((application_doc_thread, idx) => [application_doc_thread])
        )
      ]);

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
                    Dashboard
                  </Col>
                </Row>
              </Card.Title>
            </Card.Header>
          </Card>
        </Row>
        <Row>
          <Col md={3}>
            <Card className="px-0 mb-2 mx-0" bg={'danger'}>
              <Card.Header>
                <Card.Title className="text-light">Action required</Card.Title>
              </Card.Header>
              <Card.Body>
                <h4>
                  <Link to={DEMO.CV_ML_RL_CENTER_LINK} className="text-light">
                    <b>
                      <u>{unreplied_task?.length}</u>
                    </b>{' '}
                    Task{unreplied_task?.length > 1 ? 's' : ''}
                  </Link>
                </h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="px-0 mb-2 mx-0 card-with-scroll" bg={'primary'}>
              <Card.Header text={'dark'}>
                <Card.Title className="text-light">Followup Task</Card.Title>
              </Card.Header>
              <Card.Body>
                <h4>
                  <Link to={DEMO.CV_ML_RL_CENTER_LINK} className="text-light">
                    <b>
                      <u>{follow_up_task?.length}</u>
                    </b>{' '}
                    Task{follow_up_task?.length > 1 ? 's' : ''}
                  </Link>
                </h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="px-0 mb-2 mx-0 card-with-scroll" bg={'secondary'}>
              <Card.Header text={'dark'}>
                <Row>
                  <Col className="my-0 mx-0">
                    <Card.Title className="text-light">
                      # of my students
                    </Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <h4>
                  <Link
                    to={DEMO.STUDENT_APPLICATIONS_LINK}
                    className="text-light"
                  >
                    <b>
                      <u>
                        {
                          this.props.students.filter((student) =>
                            student.editors.some(
                              (editor) =>
                                editor._id === this.props.user._id.toString()
                            )
                          )?.length
                        }
                      </u>
                    </b>
                  </Link>
                </h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="px-0 mb-2 mx-0 card-with-scroll" bg={'success'}>
              <Card.Header text={'dark'}>
                <Row>
                  <Col className="my-0 mx-0">
                    <Card.Title className="text-light">XXXXXX</Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <h4 className="text-light">Coming soon</h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Card className="px-0 mb-2 mx-0 card-with-scroll">
            <Card.Body>
              <p>My workload over time</p>
              Tasks distribute among the date. Note that CVs, MLs, RLs, and
              Essay are mixed together.
              <p className="my-0">
                <b style={{ color: 'red' }}>active:</b> students decide
                programs. These will be shown in{' '}
                <Link to={`${DEMO.CV_ML_RL_DASHBOARD_LINK}`}>
                  Tasks Dashboard
                </Link>
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
        <TabProgramConflict students={this.props.students} />
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

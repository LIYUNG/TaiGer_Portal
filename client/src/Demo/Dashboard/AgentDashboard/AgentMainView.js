import React from 'react';
import { Row, Col, Table, Tabs, Tab, Card } from 'react-bootstrap';
// import Card from '../../../App/components/MainCard';
import TabStudDocsDashboard from '../MainViewTab/StudDocsOverview/TabStudDocsDashboard';
import AgentTodoList from './AgentTodoList';
import AgentReviewing from '../MainViewTab/AgentReview/AgentReviewing';
import NewBaseFilesUploaded from '../MainViewTab/NewBaseFilesUploaded/NewBaseFilesUploaded';
import TabProgramConflict from '../MainViewTab/ProgramConflict/TabProgramConflict';
import ApplicationProgress from '../MainViewTab/ApplicationProgress/ApplicationProgress';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import {
  uploadforstudent,
  updateProfileDocumentStatus,
  deleteFile,
  getStudents,
  downloadProfile
} from '../../../api';
class AgentMainView extends React.Component {
  checkMissingBaseDocument = (students) => {
    for (let stud_idx = 0; stud_idx < students.length; stud_idx += 1) {
      let student = students[stud_idx];
      let keys = Object.keys(window.profile_list);
      let object_init = {};
      for (let i = 0; i < keys.length; i++) {
        object_init[keys[i]] = 'missing';
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
      }
      for (let i = 0; i < keys.length; i += 1) {
        if (object_init[keys[i]] === 'uploaded') {
          return true;
        }
      }

      return false;
    }
  };
  render() {
    const agent_todo = this.props.students.map((student, i) => (
      <AgentTodoList key={i} student={student} />
    ));
    const students_agent_editor = this.props.students.map((student, i) => (
      <StudentsAgentEditor
        key={i}
        role={this.props.role}
        student={student}
        documentslist={this.props.documentslist}
      />
    ));
    const new_base_files_card = this.props.students.map((student, i) => (
      <NewBaseFilesUploaded
        key={i}
        role={this.props.role}
        student={student}
        isLoaded={this.props.isLoaded}
        onUpdateProfileFilefromstudent={
          this.props.onUpdateProfileFilefromstudent
        }
      />
    ));
    const new_uploaded_files = this.checkMissingBaseDocument(this.props.students);
    const agent_reviewing = this.props.students.map((student, i) => (
      <AgentReviewing key={i} role={this.props.role} student={student} />
    ));
    const application_progress = this.props.students.map((student, i) => (
      <ApplicationProgress key={i} student={student} />
    ));

    return (
      <>
        {new_uploaded_files && (
          <Row>
            <Col md={12}>
              <Card className="mb-2 mx-0" bg={'danger'} text={'light'}>
                <Card.Header>
                  <Card.Title>New Uploaded Files:</Card.Title>
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
                      <th>New Uploaded Files</th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>{new_base_files_card}</tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        )}
        <Row>
          <Col md={12}>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title>Agent Reviewing</Card.Title>
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
                    <th>Applications</th>
                  </tr>
                </thead>
                <tbody>{agent_reviewing}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <TabProgramConflict students={this.props.students} />
        <Row>
          <Col sm={12}>
            <Tabs defaultActiveKey="w" id="uncontrolled-tab-example">
              <Tab
                eventKey="w"
                title="Student Background Overview"
                className="my-0 mx-0"
              >
                <TabStudDocsDashboard
                  role={this.props.role}
                  students={this.props.students}
                  startEditingProgram={this.props.startEditingProgram}
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
                  className="my-0 mx-0"
                  variant="dark"
                  text="light"
                >
                  <thead>
                    <tr>
                      <th>First-, Last Name</th>
                      <th>Agents</th>
                      <th>Editors</th>
                    </tr>
                  </thead>
                  <tbody>{students_agent_editor}</tbody>
                </Table>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </>
    );
  }
}

export default AgentMainView;

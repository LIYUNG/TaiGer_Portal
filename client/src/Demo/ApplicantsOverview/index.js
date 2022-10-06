import React from 'react';
import { Row, Col, Spinner, Table, Card } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import ApplicationProgress from '../Dashboard/MainViewTab/ApplicationProgress/ApplicationProgress';

import { updateArchivStudents, getStudents } from '../../api';

class ApplicantSOverview extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    file: '',
    student_id: '',
    status: '', //reject, accept... etc
    category: '',
    feedback: '',
    expand: false,
    CommentModel: false,
    // accordionKeys: new Array(-1, this.props.user.students.length), // To collapse all
    accordionKeys:
      this.props.user.students &&
      (this.props.user.role === 'Editor' || this.props.user.role === 'Agent')
        ? new Array(this.props.user.students.length).fill().map((x, i) => i)
        : [0] // to expand all]
    // accordionKeys:
    //   this.props.user.students &&
    //   new Array(this.props.user.students.length).fill().map((x, i) => i)
    // // to expand all]
  };

  componentDidMount() {
    getStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
            success: success
            // accordionKeys: new Array(data.length).fill().map((x, i) => i), // to expand all
            // accordionKeys: new Array(-1, data.length) // to collapse all
          });
        } else {
          if (resp.status === 401) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  }

  updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            students: data,
            success: success
          }));
        } else {
          if (resp.status === 401) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  };
  render() {
    const { unauthorizederror, timeouterror, isLoaded } = this.state;

    if (timeouterror) {
      return (
        <div>
          <TimeOutErrors />
        </div>
      );
    }
    if (unauthorizederror) {
      return (
        <div>
          <UnauthorizedError />
        </div>
      );
    }

    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };

    if (!isLoaded && !this.state.students) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    const application_progress = this.state.students.map((student, i) => (
      <ApplicationProgress
        key={i}
        role={this.props.user.role}
        student={student}
        updateStudentArchivStatus={this.updateStudentArchivStatus}
        isDashboard={true}
      />
    ));

    return (
      <Aux>
        <Row className="sticky-top">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title>
                  <Row>
                    <Col>Students Applications Overview</Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
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
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default ApplicantSOverview;

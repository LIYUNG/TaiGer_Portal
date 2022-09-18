import React from 'react';
import { Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';
import ProgramsOptionForm from './ProgramsOptionForm';
import ProgramsInterview from './ProgramsInterview';
import Aux from '../../hoc/_Aux';
import {
  getMyInterviews,
  createInterview,
  updateAcademicBackground,
  updateLanguageSkill
} from '../../api';

class InterviewStudentPage extends React.Component {
  state = {
    error: null,
    program_id: '',
    role: '',
    isLoaded: false,
    category: null,
    interviews: [],
    success: false,
    academic_background: {},
    updateconfirmed: false,
    unauthorizederror: null
  };

  componentDidMount() {
    getMyInterviews().then(
      (resp) => {
        const { data, success } = resp.data;
        console.log(data);
        if (success) {
          this.setState({
            isLoaded: true,
            interviews: data,
            success: success
          });
        } else {
          if (resp.status == 401) {
            this.setState({ isLoaded: true, error: true });
          } else if (resp.status == 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
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
    this.setState({ isLoaded: true });
  }

  handleSelect = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState({ program_id: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    createInterview(this.state.program_id, this.props.user._id).then(
      (resp) => {
        const { data, success } = resp.data;
        console.log(data);
        if (success) {
          this.setState({
            isLoaded: true,
            interviews: data,
            success: success
          });
        } else {
          if (resp.status == 401) {
            this.setState({ isLoaded: true, error: true });
          } else if (resp.status == 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
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
    const { error, isLoaded } = this.state;
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    if (!isLoaded && !this.state.interviews) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    return (
      <>
        <Card className="mt-0">
          <Card.Header>
            <Card.Title>Student interview page</Card.Title>
          </Card.Header>
        </Card>
        <Card className="mt-0">
          <Card.Header>
            <Card.Title>Open interviews</Card.Title>
          </Card.Header>
          <Card.Body>
            <ProgramsInterview interviews={this.state.interviews} />
          </Card.Body>
        </Card>
        <Card className="mt-0">
          <Card.Body>
            <Row>
              <ProgramsOptionForm
                program_id={this.state.program_id}
                handleSelect={this.handleSelect}
                handleSubmit={this.handleSubmit}
              />
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default InterviewStudentPage;

import React from 'react';
import { Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import {
  getMyInterviews,
  updateAcademicBackground,
  updateLanguageSkill
} from '../../api';

class InterviewStudentPage extends React.Component {
  state = {
    error: null,
    role: '',
    isLoaded: false,
    category: null,
    data: null,
    success: false,
    academic_background: {},
    updateconfirmed: false,
    unauthorizederror: null
  };

  componentDidMount() {
    getMyInterviews().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            academic_background: data,
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
    this.setState({ category: e.target.value });
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
    if (!isLoaded) {
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
          <Card.Body></Card.Body>
        </Card>
        <Card className="mt-0">
          <Card.Body>
            <Row>
              <Col md={9}>
                <Form>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control
                      as="select"
                      onChange={(e) => this.handleSelect(e)}
                      value={this.state.category}
                    >
                      <option value="">Please Select</option>
                      <option value="CV">CV</option>
                      <option value="RL_A">RL (Referee A)</option>
                      <option value="RL_B">RL (Referee B)</option>
                      <option value="RL_C">RL (Referee C)</option>
                      <option value="Others">Others</option>
                    </Form.Control>
                  </Form.Group>
                </Form>
              </Col>
              <Col md={3}>
                <Button>Submit</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default InterviewStudentPage;

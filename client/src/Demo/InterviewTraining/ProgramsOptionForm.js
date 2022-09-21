import React from 'react';
import { Col, Form, Button, Spinner } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import { getCVMLRLOverview } from '../../api';

class ProgramsOptionForm extends React.Component {
  state = {
    error: null,
    role: '',
    isLoaded: false,
    data: null,
    students: [],
    success: false,
    academic_background: {},
    updateconfirmed: false,
    unauthorizederror: null
  };

  componentDidMount() {
    getCVMLRLOverview().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
            success: success
          });
        } else {
          if (resp.status === 401) {
            this.setState({ isLoaded: true, error: true });
          } else if (resp.status === 403) {
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
    if (!isLoaded && this.state.students.length === 0) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    const program_name = this.state.students.map((student, i) =>
      student.applications.map((application, j) => (
        <option value={application.programId._id}>
          {application.programId.school} - {application.programId.program_name}
        </option>
      ))
    );
    return (
      <>
        <Col md={9}>
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control
                as="select"
                onChange={(e) => this.props.handleSelect(e)}
                value={this.props.program_id}
              >
                <option value="">Please Select</option>
                {program_name}
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>
        <Col md={3}>
          <Button onClick={(e) => this.props.handleSubmit(e)}>Submit</Button>
        </Col>
      </>
    );
  }
}

export default ProgramsOptionForm;

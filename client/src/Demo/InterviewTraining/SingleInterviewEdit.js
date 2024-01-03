import React from 'react';
import { Form, Card, Button } from 'react-bootstrap';
import { is_TaiGer_role } from '../Utils/checking-functions';
import NotesEditor from '../Notes/NotesEditor';

class SingleInterviewEdit extends React.Component {
  state = {
    interview: this.props.interview
  };

  componentDidMount() {
    this.setState({ interview: this.props.interview });
  }

  handleChange = (e) => {
    const interview_temp = { ...this.state.interview };
    interview_temp[e.target.id] = e.target.value;
    this.setState((state) => ({
      ...state,
      interview: interview_temp
    }));
  };

  handleClickSave = (e, editorState) => {
    e.preventDefault();
    this.props.handleClickSave(e, this.state.interview, editorState);
  };

  render() {
    return (
      <>
        <Card className="mb-2 mx-0">
          <Card.Body>
            <h3>Provide Interview Information</h3>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Interview Date</td>
                  <td>
                    <Form>
                      <Form.Group controlId="interview_date">
                        <Form.Control
                          type="date"
                          value={this.state.interview.interview_date}
                          placeholder="Date of Interview"
                          onChange={(e) => this.handleChange(e)}
                        />
                      </Form.Group>
                    </Form>
                  </td>
                </tr>
                <tr>
                  <td>Interview time</td>
                  <td>
                    <Form>
                      <Form.Group controlId="interview_time">
                        <Form.Control
                          type="text"
                          value={this.state.interview.interview_time}
                          placeholder="Date of Interview"
                          onChange={(e) => this.handleChange(e)}
                        />
                      </Form.Group>
                    </Form>
                  </td>
                </tr>
                <tr>
                  <td>Interview duration</td>
                  <td>
                    <Form>
                      <Form.Group controlId="interview_duration">
                        <Form.Control
                          type="text"
                          value={this.state.interview.interview_duration}
                          placeholder="1 hour"
                          onChange={(e) => this.handleChange(e)}
                        />
                      </Form.Group>
                    </Form>
                  </td>
                </tr>
                <tr>
                  <td>Interview University</td>
                  <td>
                    <Form>
                      <Form.Group controlId="program_id">
                        <Form.Control
                          as="select"
                          onChange={(e) => this.handleChange(e)}
                        >
                          <option value={''}>Select Document Category</option>
                          {/* {!is_TaiGer_role(this.props.user) &&
                            available_interview_request_programs.map(
                              (cat, i) => (
                                <option value={cat.key} key={i}>
                                  {cat.value}
                                </option>
                              )
                            )} */}
                        </Form.Control>
                      </Form.Group>
                    </Form>
                  </td>
                </tr>
                <tr>
                  <td>Interviewer</td>
                  <td>
                    <Form>
                      <Form.Group controlId="interviewer">
                        <Form.Control
                          type="text"
                          value={this.state.interview.interviewer}
                          placeholder="Prof. Sebastian"
                          onChange={(e) => this.handleChange(e)}
                        />
                      </Form.Group>
                    </Form>
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>
                    <Form>
                      <Form.Group controlId="status">
                        <Form.Control
                          as="select"
                          value={this.state.interview.status}
                          onChange={(e) => this.handleChange(e)}
                        >
                          <option value={''}>Select Document Category</option>
                          {is_TaiGer_role(this.props.user) &&
                            ['Unscheduled', 'Scheduled', 'Closed'].map(
                              (stat, i) => (
                                <option value={stat} key={i}>
                                  {stat}
                                </option>
                              )
                            )}
                        </Form.Control>
                      </Form.Group>
                    </Form>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <p>
              Please provide further information (invitation email content,
              reading assignment, etc.) below:{' '}
            </p>
            <NotesEditor
              thread={this.state.thread}
              buttonDisabled={this.state.buttonDisabled}
              editorState={this.props.editorState}
              handleClickSave={this.handleClickSave}
            />
          </Card.Body>
        </Card>
      </>
    );
  }
}
export default SingleInterviewEdit;

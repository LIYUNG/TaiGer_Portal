import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { Button, Spinner } from 'react-bootstrap';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { getStudents } from '../../api';

class ProgramListSubpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      isLoaded: false,
      timeouterror: null,
      unauthorizederror: null
    };
  }

  componentDidMount() {
    getStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({ isLoaded: true, students: data, success });
        } else {
          if (resp.status === 401 || resp.status === 500) {
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
          error
        });
      }
    );
  }

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
    let program_names = [];
    for (let i = 0; i < this.props.uni_name.length; i++) {
      program_names.push(
        this.props.uni_name[i] + ' - ' + this.props.program_name[i]
      );
    }
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.setModalHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Assign{' '}
            {program_names.map((program_name) => (
              <h5>{program_name}</h5>
            ))}{' '}
            to
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Student:</h4>
          <table>
            <tbody>
              {this.state.students.map((student) => (
                <tr key={student._id}>
                  <th>
                    <div>
                      <Form.Group>
                        <Form.Check
                          custom
                          type="radio"
                          name="student_id"
                          value={student._id}
                          id={student._id}
                          onChange={this.props.handleChange2}
                        />
                      </Form.Group>
                    </div>
                  </th>
                  <td>
                    <h4 className="mb-1">
                      {student.firstname}, {student.lastname}
                    </h4>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={(e) => this.props.onSubmitAddToStudentProgramList(e)}
          >
            Assign
          </Button>
          <Button onClick={this.props.setModalHide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default ProgramListSubpage;

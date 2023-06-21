import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { Button, Spinner } from 'react-bootstrap';

import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getStudents } from '../../api';

class ProgramListSingleStudentAssignSubpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      students: [],
      isLoaded: false,
      timeouterror: null,
      unauthorizederror: null,
      res_status: 0
    };
  }

  componentDidMount() {
    this.props.setStudentId(this.props.student._id.toString());
  }

  render() {
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.students) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
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
        <Modal.Body>
          Assign{' '}
          {program_names.map((program_name, i) => (
            <p className="my-0" key={i}>
              <b>{program_name}</b>
            </p>
          ))}
          <p>to the student:</p>
          <table>
            <tbody>
              {this.state.students.map((student, i) => (
                <tr key={student._id} key={i}>
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
                    {student.firstname}, {student.lastname}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={this.props.isAssgining}
            onClick={(e) => this.props.onSubmitAddToStudentProgramList(e)}
          >
            {this.props.isAssgining ? (
              <Spinner animation="border" size="sm" role="status">
                <span className="visually-hidden"></span>
              </Spinner>
            ) : (
              'Assign'
            )}
          </Button>
          <Button onClick={this.props.setModalHide} variant="light">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default ProgramListSingleStudentAssignSubpage;

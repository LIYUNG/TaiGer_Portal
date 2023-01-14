import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { Button, Spinner } from 'react-bootstrap';

import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getStudents } from '../../api';

class ProgramListSubpage extends React.Component {
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
    getStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
            success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
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

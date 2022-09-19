import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import { getStudents } from '../../api';

class ProgramListSubpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    getStudents().then(
      (resp) => {
        const { data: students, success } = resp.data;
        this.setState({ data: students, success });
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
    // const school_program = this.props.uni_name ;
    let program_names = [];
    for (let i = 0; i < this.props.uni_name.length; i++) {
      program_names.push(
        this.props.uni_name[i] + ' - ' + this.props.program_name[i]
      );
    }
    // console.log(program_names);
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
              {this.state.data.map((student) => (
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

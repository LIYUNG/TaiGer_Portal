import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button, Spinner } from 'react-bootstrap';

class ProgramListSingleStudentAssignSubpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      students: []
    };
  }

  componentDidMount() {
    this.props.setStudentId(this.props.student._id.toString());
  }

  render() {
    let program_names = [];
    for (let i = 0; i < this.props.uni_name.length; i++) {
      program_names.push(
        `${this.props.uni_name[i]}-${this.props.program_name[i]}-${this.props.degree[i]}-${this.props.semester[i]}`
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
          <h4>Assign </h4>
          {program_names.map((program_name, i) => (
            <p className="my-0" key={i}>
              <b>{program_name}</b>
            </p>
          ))}
          <p>to the student:</p>
          <table>
            <tbody>
              <b>{`${this.props.student.firstname} ${this.props.student.lastname}`}</b>
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

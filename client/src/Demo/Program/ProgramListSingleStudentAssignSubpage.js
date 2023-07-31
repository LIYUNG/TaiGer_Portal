import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button, Spinner } from 'react-bootstrap';

class ProgramListSingleStudentAssignSubpage extends React.Component {
  state = {
    uni_name: this.props.uni_name,
    program_name: this.props.program_name,
    degree: this.props.degree,
    semester: this.props.semester,
  };
  componentDidMount() {
    this.props.setStudentId(this.props.student._id.toString());
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.show !== this.props.show) {
      this.setState({
        uni_name: this.props.uni_name,
        program_name: this.props.program_name,
        degree: this.props.degree,
        semester: this.props.semester
      });
    }
  }

  render() {
    let program_names = [];
    for (let i = 0; i < this.state.uni_name.length; i++) {
      program_names.push(
        `${this.state.uni_name[i]}-${this.state.program_name[i]}-${this.state.degree[i]}-${this.state.semester[i]}`
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
            disabled={this.props.isButtonDisable}
            onClick={(e) => this.props.onSubmitAddToStudentProgramList(e)}
          >
            {this.props.isButtonDisable ? (
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

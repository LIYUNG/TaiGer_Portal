import React from 'react';
import {
  Row,
  Col,
  Spinner,
  Card,
  Table,
  Form,
  Button,
  Modal
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Aux from '../../hoc/_Aux';
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime,
  AiFillDelete
} from 'react-icons/ai';
import { UpdateStudentApplications, removeProgramFromStudent } from '../../api';

class StudentApplicationsTableTemplate extends React.Component {
  state = {
    student: this.props.student,
    applications: this.props.student.applications,
    isLoaded: false,
    student_id: null,
    program_id: null,
    success: false,
    error: null,
    modalDeleteApplication: false
  };

  handleChange = (e, application_idx) => {
    e.preventDefault();
    let applications_temp = [...this.state.applications];
    applications_temp[application_idx][e.target.id] =
      e.target.value === 'O' ? true : false;
    this.setState((state) => ({
      ...state,
      applications: applications_temp
    }));
  };

  handleDelete = (e, program_id, student_id) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      student_id,
      program_id,
      modalDeleteApplication: true
    }));
  };
  onHideModalDeleteApplication = () => {
    this.setState({
      modalDeleteApplication: false
    });
  };

  handleDeleteConfirm = (e) => {
    e.preventDefault();
    removeProgramFromStudent(this.state.program_id, this.state.student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            student: data,
            success: success,
            modalDeleteApplication: false
          });
        } else {
          alert(resp.data.message);
          this.setState({
            isLoaded: true,
            error: true
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true
          // error: true
        });
      }
    );
  };

  handleSubmit = (e, student_id, applications) => {
    e.preventDefault();
    let applications_temp = [...this.state.applications];
    for (let i = 0; i < applications_temp.length; i += 1) {
      delete applications_temp[i].programId;
      delete applications_temp[i].doc_modification_thread;
    }
    UpdateStudentApplications(student_id, applications_temp).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            student: data,
            success: success
          });
        } else {
          alert(resp.data.message);
          this.setState({
            isLoaded: true,
            error: true
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true
          // error: true
        });
      }
    );
  };

  getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
  }
  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };

    if (!isLoaded && !this.state.student) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    var applying_university_info;
    var applying_university;
    var applying_program;
    var application_deadline;
    var application_date_left;
    var application_decided;
    var application_closed;
    var application_admission;
    var today = new Date();
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university_info = (
        <>
          <tr>
            <td></td>
            <td>
              <h6 className="mb-1"> No University</h6>
            </td>
            <td>
              <h6 className="mb-1"> No Program</h6>
            </td>
            <td>
              <h6 className="mb-1"> No Date</h6>
            </td>
            <td>
              <h6 className="mb-1"> </h6>
            </td>
            <td>
              <h6 className="mb-1"> </h6>
            </td>
            <td>
              <h6 className="mb-1"> </h6>
            </td>
            <td>
              <h6 className="mb-1"> </h6>
            </td>
          </tr>
        </>
      );
    } else {
      // applying_university = this.props.student.applications.map(
      applying_university_info = this.state.student.applications.map(
        (application, application_idx) => (
          <>
            <tr>
              <td>
                <Button
                  onClick={(e) =>
                    this.handleDelete(
                      e,
                      application.programId._id,
                      this.state.student._id
                    )
                  }
                >
                  <AiFillDelete size={16} />
                </Button>
              </td>
              <td>
                <Link to={'/programs/' + application.programId._id}>
                  <h6 className="mb-1" key={application_idx}>
                    {application.programId.school}
                  </h6>
                </Link>
              </td>
              <td>
                <Link to={'/programs/' + application.programId._id}>
                  <h6 className="mb-1" key={application_idx}>
                    {application.programId.program_name}
                  </h6>
                </Link>
              </td>
              <td>
                <h6 className="mb-1" key={application_idx}>
                  {this.props.student.academic_background.university
                    .expected_application_date
                    ? this.props.student.academic_background.university
                        .expected_application_date + '-'
                    : ''}
                  {application.programId.application_deadline}
                </h6>
              </td>
              <td>
                <Form.Group controlId="decided">
                  <Form.Control
                    as="select"
                    onChange={(e) => this.handleChange(e, application_idx)}
                    defaultValue={
                      application.decided !== undefined && application.decided
                        ? 'O'
                        : 'X'
                    }
                  >
                    <option value={'X'}>No</option>
                    <option value={'O'}>Yes</option>
                  </Form.Control>
                </Form.Group>
              </td>
              <td>
                <Form.Group controlId="closed">
                  <Form.Control
                    as="select"
                    onChange={(e) => this.handleChange(e, application_idx)}
                    defaultValue={
                      application.closed !== undefined && application.closed
                        ? 'O'
                        : 'X'
                    }
                  >
                    <option value={'X'}>No</option>
                    <option value={'O'}>Yes</option>
                  </Form.Control>
                </Form.Group>
              </td>
              <td>
                <Form.Group controlId="admission">
                  <Form.Control
                    as="select"
                    onChange={(e) => this.handleChange(e, application_idx)}
                    defaultValue={
                      application.admission !== undefined &&
                      application.admission
                        ? 'O'
                        : 'X'
                    }
                  >
                    <option value={'X'}>No</option>
                    <option value={'O'}>Yes</option>
                  </Form.Control>
                </Form.Group>
              </td>
              <td>
                <h6 className="mb-1" key={application_idx}>
                  {application.closed
                    ? '-'
                    : this.props.student.academic_background.university
                        .expected_application_date &&
                      this.getNumberOfDays(
                        today,
                        this.props.student.academic_background.university
                          .expected_application_date +
                          '-' +
                          application.programId.application_deadline
                      )}
                </h6>
              </td>
            </tr>
          </>
        )
      );
    }
    return (
      <Aux>
        <Row>
          <Col>
            <Card className="mt-0">
              <Card.Header>
                <Card.Title as="h5">
                  {' '}
                  {this.props.student.firstname} {this.props.student.lastname}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <>
                        <th></th>
                        <th>University</th>
                        <th>Programs</th>
                        <th>Deadline</th>
                      </>
                      {window.programstatuslist.map((doc, index) => (
                        <th key={index}>{doc.name}</th>
                      ))}
                      <th>Days left</th>
                    </tr>
                  </thead>
                  <tbody>{applying_university_info}</tbody>
                </Table>
                <Button
                  onClick={(e) =>
                    this.handleSubmit(
                      e,
                      this.state.student._id,
                      this.state.applications
                    )
                  }
                >
                  Update
                </Button>
              </Card.Body>
            </Card>
            <Modal
              show={this.state.modalDeleteApplication}
              onHide={this.onHideModalDeleteApplication}
              size="m"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                  Warning: Delete an application
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                This will delete all message and editted files in discussion.
                Are you sure?
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleDeleteConfirm}>Yes</Button>
                <Button onClick={this.onHideModalDeleteApplication}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default StudentApplicationsTableTemplate;

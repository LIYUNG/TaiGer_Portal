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
  // AiFillCloseCircle,
  // AiFillQuestionCircle,
  // AiOutlineFieldTime,
  AiFillDelete
} from 'react-icons/ai';
import { UpdateStudentApplications, removeProgramFromStudent } from '../../api';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
class StudentApplicationsTableTemplate extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    student: this.props.student,
    applications: this.props.student.applications,
    isLoaded: false,
    student_id: null,
    program_id: null,
    success: false,
    application_status_changed: false,

    modalDeleteApplication: false,
    modalUpdatedApplication: false
  };

  handleChange = (e, application_idx) => {
    e.preventDefault();
    let applications_temp = [...this.state.applications];
    applications_temp[application_idx][e.target.id] = e.target.value;
    this.setState((state) => ({
      ...state,
      application_status_changed: true,
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
  onHideUpdatedApplicationWindow = () => {
    this.setState({
      modalUpdatedApplication: false
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
          if (resp.status === 401) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          }
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
            success: success,
            application_status_changed: false,
            modalUpdatedApplication: true
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
    // var applying_university;
    var today = new Date();
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university_info = (
        <>
          <tr>
            {this.props.role !== 'Student' && <td></td>}
            <td>
              <p className="mb-1 text-danger"> No University</p>
            </td>
            <td>
              <p className="mb-1 text-danger"> No Program</p>
            </td>
            <td>
              <p className="mb-1 text-danger"> No Date</p>
            </td>
            <td>
              <p className="mb-1"> </p>
            </td>
            <td>
              <p className="mb-1"> </p>
            </td>
            <td>
              <p className="mb-1"> </p>
            </td>
            <td>
              <p className="mb-1"> </p>
            </td>
          </tr>
        </>
      );
    } else {
      // applying_university = this.props.student.applications.map(
      applying_university_info = this.state.student.applications.map(
        (application, application_idx) => (
          <tr key={application_idx}>
            {this.props.role !== 'Student' && (
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
            )}
            <td>
              <Link
                to={'/programs/' + application.programId._id}
                style={{ textDecoration: 'none' }}
              >
                <p className="mb-1 text-info" key={application_idx}>
                  {application.programId.school}
                </p>
              </Link>
            </td>
            <td>
              <Link
                to={'/programs/' + application.programId._id}
                style={{ textDecoration: 'none' }}
              >
                <p className="mb-1 text-info" key={application_idx}>
                  {application.programId.program_name}
                </p>
              </Link>
            </td>
            <td>
              <p className="mb-1 text-info" key={application_idx}>
                {this.props.student.academic_background.university
                  .expected_application_date
                  ? this.props.student.academic_background.university
                      .expected_application_date + '-'
                  : ''}
                {application.programId.application_deadline}
              </p>
            </td>
            <td>
              <Form.Group controlId="decided">
                <Form.Control
                  as="select"
                  onChange={(e) => this.handleChange(e, application_idx)}
                  defaultValue={application.decided}
                >
                  <option value={'-'}>-</option>
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
                  disabled={
                    !(
                      application.decided !== '-' && application.decided !== 'X'
                    )
                  }
                  defaultValue={application.closed}
                >
                  <option value={'-'}>-</option>
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
                  disabled={
                    !(application.closed !== '-' && application.closed !== 'X')
                  }
                  defaultValue={application.admission}
                >
                  <option value={'-'}>-</option>
                  <option value={'X'}>No</option>
                  <option value={'O'}>Yes</option>
                </Form.Control>
              </Form.Group>
            </td>
            <td>
              <p className="mb-1 text-info" key={application_idx}>
                {application.closed
                  ? '-'
                  : application.programId.application_deadline
                  ? this.props.student.academic_background.university
                      .expected_application_date &&
                    this.getNumberOfDays(
                      today,
                      this.props.student.academic_background.university
                        .expected_application_date +
                        '-' +
                        application.programId.application_deadline
                    )
                  : '-'}
              </p>
            </td>
          </tr>
        )
      );
    }
    return (
      <Aux>
        <Row>
          <Col>
            <Card className="my-0 mx-0" bg={'info'} text={'white'}>
              <Card.Header>
                <Card.Title>
                  {this.props.student.firstname} {this.props.student.lastname}
                </Card.Title>
              </Card.Header>
              <Row>
                <Col>
                  <Table
                    responsive
                    className="my-0 mx-0"
                    variant="dark"
                    text="light"
                  >
                    <thead>
                      <tr>
                        <>
                          {this.props.role !== 'Student' && <th></th>}
                          <th>University</th>
                          <th>Programs</th>
                          <th>Deadline</th>
                        </>
                        {window.programstatuslist.map((doc, index) => (
                          <th key={index}>{doc.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>{applying_university_info}</tbody>
                  </Table>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Button
                    disabled={!this.state.application_status_changed}
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
                </Col>
              </Row>
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
            <Modal
              show={this.state.modalUpdatedApplication}
              onHide={this.onHideUpdatedApplicationWindow}
              size="m"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                  Info:
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>Applications status updated successfully!</Modal.Body>
              <Modal.Footer>
                <Button onClick={this.onHideUpdatedApplicationWindow}>
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

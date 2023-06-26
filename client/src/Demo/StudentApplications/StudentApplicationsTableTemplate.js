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
import { AiFillDelete } from 'react-icons/ai';

import Aux from '../../hoc/_Aux';
import {
  is_TaiGer_role,
  isProgramNotSelectedEnough,
  is_num_Program_Not_specified,
  is_program_ml_rl_essay_ready,
  is_the_uni_assist_vpd_uploaded,
  isCVFinished,
  application_deadline_calculator
} from '../Utils/checking-functions';
import OverlayButton from '../../components/Overlay/OverlayButton';
import Banner from '../../components/Banner/Banner';
import {
  getNumberOfDays,
  programstatuslist,
  spinner_style
} from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { UpdateStudentApplications, removeProgramFromStudent } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import ProgramList from '../Program/ProgramList';

class StudentApplicationsTableTemplate extends React.Component {
  state = {
    error: '',
    student: this.props.student,
    applications: this.props.student.applications,
    isLoaded: this.props.isLoaded,
    student_id: null,
    program_id: null,
    success: false,
    application_status_changed: false,
    applying_program_count: this.props.student.applying_program_count,
    modalDeleteApplication: false,
    modalUpdatedApplication: false,
    show: false,
    isProgramAssignMode: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  };

  handleChangeProgramCount = (e) => {
    e.preventDefault();
    let applying_program_count = e.target.value;
    this.setState((state) => ({
      ...state,
      application_status_changed: true,
      applying_program_count
    }));
  };

  handleChange = (e, application_idx) => {
    e.preventDefault();
    let applications_temp = [...this.state.student.applications];
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
    // let applications_temp = [...this.state.applications];
    // for (let i = 0; i < applications_temp.length; i += 1) {
    //   delete applications_temp[i].programId;
    //   delete applications_temp[i].doc_modification_thread;
    // }
    this.setState({ isLoaded: false });
    removeProgramFromStudent(this.state.program_id, this.state.student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            student: {
              ...state.student,
              applications: data
            },
            success: success,
            modalDeleteApplication: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  handleSubmit = (e, student_id, applications) => {
    e.preventDefault();
    let applications_temp = [...this.state.student.applications];
    let applying_program_count = this.state.applying_program_count;
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    UpdateStudentApplications(
      student_id,
      applications_temp,
      applying_program_count
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            student: data,
            success: success,
            application_status_changed: false,
            modalUpdatedApplication: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  onClickProgramAssignHandler = () => {
    this.setState({
      isProgramAssignMode: true
    });
  };

  onClickBackToApplicationOverviewnHandler = () => {
    this.setState({
      isProgramAssignMode: false
    });
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    const { res_status, isLoaded, res_modal_status, res_modal_message } =
      this.state;

    if (!isLoaded && !this.state.student) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    TabTitle(
      `Student ${this.state.student.firstname} ${this.state.student.lastname} || Applications Status`
    );
    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }
    var applying_university_info;
    // var applying_university;
    var today = new Date();
    if (
      this.state.student.applications === undefined ||
      this.state.student.applications.length === 0
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
                  size="sm"
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
                  {application.programId.degree}
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
              <Link
                to={'/programs/' + application.programId._id}
                style={{ textDecoration: 'none' }}
              >
                <p className="mb-1 text-info" key={application_idx}>
                  {application.programId.semester}
                </p>
              </Link>
            </td>
            <td>
              <Link
                to={'/programs/' + application.programId._id}
                style={{ textDecoration: 'none' }}
              >
                <p className="mb-1 text-info" key={application_idx}>
                  {application.programId.toefl
                    ? application.programId.toefl
                    : '-'}
                </p>
              </Link>
            </td>
            <td>
              <Link
                to={'/programs/' + application.programId._id}
                style={{ textDecoration: 'none' }}
              >
                <p className="mb-1 text-info" key={application_idx}>
                  {application.programId.ielts
                    ? application.programId.ielts
                    : '-'}
                </p>
              </Link>
            </td>
            <td>
              {application.closed === 'O' ? (
                <p className="mb-1 text-warning" key={application_idx}>
                  Close
                </p>
              ) : (
                <p className="mb-1 text-info" key={application_idx}>
                  {application_deadline_calculator(
                    this.props.student,
                    application
                  )}
                </p>
              )}
            </td>
            <td>
              <Form.Group controlId="decided">
                <Form.Control
                  as="select"
                  onChange={(e) => this.handleChange(e, application_idx)}
                  value={application.decided}
                >
                  <option value={'-'}>-</option>
                  <option value={'X'}>No</option>
                  <option value={'O'}>Yes</option>
                </Form.Control>
              </Form.Group>
            </td>
            {application.decided === 'O' ? (
              <td>
                {/* When all thread finished */}
                {application.closed === 'O' ||
                (is_program_ml_rl_essay_ready(application) &&
                  isCVFinished(this.state.student) &&
                  is_the_uni_assist_vpd_uploaded(application)) ? (
                  <Form.Group controlId="closed">
                    <Form.Control
                      as="select"
                      onChange={(e) => this.handleChange(e, application_idx)}
                      disabled={
                        !(
                          application.decided !== '-' &&
                          application.decided !== 'X'
                        )
                      }
                      value={application.closed}
                    >
                      <option value={'-'}>Not Yet</option>
                      <option value={'X'}>Withdraw</option>
                      <option value={'O'}>Submitted</option>
                    </Form.Control>
                  </Form.Group>
                ) : (
                  <OverlayButton
                    text={`Please make sure ${
                      !isCVFinished(this.state.student) ? 'CV ' : ''
                    }${
                      !is_program_ml_rl_essay_ready(application)
                        ? 'ML/RL/Essay '
                        : ''
                    }${
                      !is_the_uni_assist_vpd_uploaded(application)
                        ? 'Uni-Assist '
                        : ''
                    }are prepared to unlock this.`}
                  />
                )}
              </td>
            ) : (
              <td></td>
            )}
            {application.closed === 'O' ? (
              <td>
                <Form.Group controlId="admission">
                  <Form.Control
                    as="select"
                    onChange={(e) => this.handleChange(e, application_idx)}
                    disabled={
                      !(
                        application.closed !== '-' && application.closed !== 'X'
                      )
                    }
                    value={application.admission}
                  >
                    <option value={'-'}>-</option>
                    <option value={'X'}>No</option>
                    <option value={'O'}>Yes</option>
                  </Form.Control>
                </Form.Group>
              </td>
            ) : (
              <td></td>
            )}

            <td>
              <p className="mb-1 text-info" key={application_idx}>
                {application.closed
                  ? '-'
                  : application.programId.application_deadline
                  ? this.props.student.application_preference &&
                    this.props.student.application_preference
                      .expected_application_date &&
                    getNumberOfDays(
                      today,
                      this.props.student.application_preference
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
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <Row>
          <Col>
            <Card className="my-2 mx-0" bg={'black'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  {this.props.student.firstname} {this.props.student.lastname}{' '}
                  Applications
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        {this.state.isProgramAssignMode ? (
          <>
            <ProgramList
              user={this.props.user}
              student={this.props.student}
              isStudentApplicationPage={true}
            />
            {/* <Button variant='primary'>Assign</Button>*/}
            <Button
              variant="secondary"
              onClick={this.onClickBackToApplicationOverviewnHandler}
            >
              Back
            </Button>
          </>
        ) : (
          <>
            {isProgramNotSelectedEnough([this.state.student]) && (
              <Row>
                <Col>
                  <Card className="mb-2 mx-0" bg={'danger'} text={'light'}>
                    <Card.Body>
                      {this.props.student.firstname}{' '}
                      {this.props.student.lastname} did not choose enough
                      programs.
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
            {this.props.role === 'Admin' &&
              is_num_Program_Not_specified(this.state.student) && (
                <Row>
                  <Col>
                    <Card className="mb-2 mx-0" bg={'danger'} text={'light'}>
                      <Card.Body>
                        The number of student's applications is not specified!
                        Please determine the number of the programs according to
                        the contract
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            <Row>
              <Col>
                <Card className="my-0 mx-0" bg={'info'} text={'white'}>
                  <Row bg={'info'}>
                    <Col md={4} className="mx-2 my-2">
                      <h4>Applying Program Count: </h4>
                    </Col>
                    {this.props.role === 'Admin' ? (
                      <Col md={2} className="mx-2 my-1">
                        <Form.Group controlId="applying_program_count">
                          <Form.Control
                            as="select"
                            defaultValue={
                              this.state.student.applying_program_count
                            }
                            onChange={(e) => this.handleChangeProgramCount(e)}
                          >
                            <option value="0">Please Select</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    ) : (
                      <>
                        <Col md={2} className="mx-2 my-3">
                          <h4>{this.state.student.applying_program_count}</h4>
                        </Col>
                      </>
                    )}
                  </Row>
                  <Row>
                    <Col>
                      <Banner
                        ReadOnlyMode={true}
                        bg={'primary'}
                        to={`${DEMO.BASE_DOCUMENTS_LINK}`}
                        title={'Info:'}
                        text={
                          'TaiGer Portal 網站上的學程資訊主要為管理申請進度為主，學校學程詳細資訊仍以學校網站為主。'
                        }
                        link_name={''}
                        removeBanner={this.removeBanner}
                        notification_key={''}
                      />
                      <Table
                        size="sm"
                        bordered
                        hover
                        responsive
                        className="my-0 mx-0"
                        variant="dark"
                        text="light"
                      >
                        <thead>
                          <tr>
                            {this.props.role !== 'Student' && <th></th>}
                            {programstatuslist.map((doc, index) => (
                              <th key={index}>{doc.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>{applying_university_info}</tbody>
                      </Table>
                    </Col>
                  </Row>
                </Card>
                <Row className="my-2 mx-0">
                  <Button
                    size="sm"
                    disabled={
                      !this.state.application_status_changed ||
                      !this.state.isLoaded
                    }
                    onClick={(e) =>
                      this.handleSubmit(
                        e,
                        this.state.student._id,
                        this.state.student.applications
                      )
                    }
                  >
                    {this.state.isLoaded ? (
                      'Update'
                    ) : (
                      <Spinner animation="border" size="sm" role="status">
                        <span className="visually-hidden"></span>
                      </Spinner>
                    )}
                  </Button>
                </Row>
                {is_TaiGer_role(this.props.user) && (
                  <>
                    <Row>
                      <p>
                        <span
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          You want to add more programs to{' '}
                          {this.props.student.firstname}{' '}
                          {this.props.student.lastname}?
                        </span>
                      </p>
                    </Row>
                    <Row className="mt-2 mx-0">
                      <p>
                        <span
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          {/* <Link to={'/programs'}> */}
                          <Button
                            size="sm"
                            onClick={this.onClickProgramAssignHandler}
                          >
                            Add New Programs
                          </Button>{' '}
                          {/* </Link> */}
                        </span>
                      </p>
                    </Row>
                  </>
                )}

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
                    This will delete all message and editted files in
                    discussion. Are you sure?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      disabled={!this.state.isLoaded}
                      onClick={this.handleDeleteConfirm}
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={this.onHideModalDeleteApplication}
                      variant="light"
                    >
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
                  <Modal.Body>
                    Applications status updated successfully!
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={this.onHideUpdatedApplicationWindow}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Col>
            </Row>
          </>
        )}
      </Aux>
    );
  }
}

export default StudentApplicationsTableTemplate;

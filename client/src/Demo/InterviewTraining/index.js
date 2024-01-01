import React from 'react';
import { Row, Col, Spinner, Button, Card, Form, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import { is_TaiGer_role } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import {
  getMyInterviews,
  createInterview,
  deleteInterview,
  getAllInterviews
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import NotesEditor from '../Notes/NotesEditor';
import InterviewItems from './InterviewItems';
import DEMO from '../../store/constant';

class InterviewTraining extends React.Component {
  state = {
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    interviewslist: [],
    interview_id_toBeDelete: '',
    interview_name_toBeDelete: '',
    program_id: '',
    interviewData: {},
    category: '',
    SetDeleteDocModel: false,
    isEdit: false,
    expand: true,
    editorState: '',
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    if (is_TaiGer_role(this.props.user)) {
      getAllInterviews().then(
        (resp) => {
          const { data, success, student } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              interviewslist: data,
              student: student,
              success: success,
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
    } else {
      getMyInterviews().then(
        (resp) => {
          const { data, success, student } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              interviewslist: data,
              student: student,
              success: success,
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
  }

  handleClick = () => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };

  handleDeleteInterview = (doc) => {
    deleteInterview(this.state.interview_id_toBeDelete).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          let interviewslist_temp = [...this.state.interviewslist];
          let to_be_delete_doc_idx = interviewslist_temp.findIndex(
            (doc) => doc._id.toString() === this.state.interview_id_toBeDelete
          );
          if (to_be_delete_doc_idx > -1) {
            // only splice array when item is found
            interviewslist_temp.splice(to_be_delete_doc_idx, 1); // 2nd parameter means remove one item only
          }
          this.setState({
            success,
            interviewslist: interviewslist_temp,
            SetDeleteDocModel: false,
            isEdit: false,
            isLoaded: true,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
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
  openDeleteDocModalWindow = (interview) => {
    this.setState((state) => ({
      ...state,
      interview_id_toBeDelete: interview._id,
      interview_name_toBeDelete: `${interview.program_id.school} ${interview.program_id.program_name}`,
      SetDeleteDocModel: true
    }));
  };

  closeDeleteDocModalWindow = (e) => {
    this.setState((state) => ({
      ...state,
      SetDeleteDocModel: false
    }));
  };

  handleClickEditToggle = (e) => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };

  handleClickSave = (e, editorState) => {
    e.preventDefault();
    const message = JSON.stringify(editorState);
    const msg = {
      program_id: this.state.program_id,
      interview_date: this.state.category,
      prop: this.props.item,
      interview_notes: message
    };
    const interviewData_temp = this.state.interviewData;
    interviewData_temp.interview_notes = message;
    createInterview(
      this.state.interviewData.program_id,
      this.props.user._id.toString(),
      interviewData_temp
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          let interviewslist_temp = [...this.state.interviewslist];
          interviewslist_temp.push(data);
          this.setState({
            success,
            interviewslist: interviewslist_temp,
            editorState: '',
            isEdit: !this.state.isEdit,
            isLoaded: true,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
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
    this.setState((state) => ({ ...state, in_edit_mode: false }));
  };

  handleChange_InterviewTraining = (e) => {
    const interviewData_temp = { ...this.state.interviewData };
    interviewData_temp[e.target.id] = e.target.value;
    this.setState((state) => ({
      ...state,
      interviewData: interviewData_temp
    }));
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    // if (!is_TaiGer_role(this.props.user)) {
    //   return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    // }
    const {
      res_status,
      isLoaded,
      res_modal_status,
      res_modal_message,
      interviewslist,
      student
    } = this.state;

    if (!isLoaded) {
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
    let available_interview_request_programs = [];
    if (!is_TaiGer_role(this.props.user)) {
      available_interview_request_programs = student.applications
        .filter(
          (application) =>
            application.decided === 'O' &&
            application.admission !== 'O' &&
            application.admission !== 'X' &&
            !interviewslist.find(
              (interview) =>
                interview.program_id._id.toString() ===
                application.programId._id.toString()
            )
        )
        .map((application) => {
          return {
            key: application.programId._id.toString(),
            value: `${application.programId.school} ${application.programId.program_name} ${application.programId.degree} ${application.programId.semester}`
          };
        });
    }

    // console.log(available_interview_request_programs);

    TabTitle('Docs Database');
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
          <Col sm={12}>
            {this.state.isEdit ? (
              <>
                <Row className="sticky-top ">
                  <Col>
                    <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
                      <Card.Header text={'dark'}>
                        <Card.Title>
                          <Row>
                            <Col className="my-0 mx-0 text-light">
                              {is_TaiGer_role(this.props.user)
                                ? 'All Interviews'
                                : 'Create Interview Training Request'}
                            </Col>
                          </Row>
                        </Card.Title>
                      </Card.Header>
                    </Card>
                  </Col>
                </Row>
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
                                  //   value={''}
                                  placeholder="Date of Interview"
                                  onChange={(e) =>
                                    this.handleChange_InterviewTraining(e)
                                  }
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
                                  //   value={''}
                                  placeholder="Date of Interview"
                                  onChange={(e) =>
                                    this.handleChange_InterviewTraining(e)
                                  }
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
                                  //   value={''}
                                  placeholder="1 hour"
                                  onChange={(e) =>
                                    this.handleChange_InterviewTraining(e)
                                  }
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
                                  onChange={(e) =>
                                    this.handleChange_InterviewTraining(e)
                                  }
                                >
                                  <option value={''}>
                                    Select Document Category
                                  </option>
                                  {!is_TaiGer_role(this.props.user) &&
                                    available_interview_request_programs.map(
                                      (cat, i) => (
                                        <option value={cat.key} key={i}>
                                          {cat.value}
                                        </option>
                                      )
                                    )}
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
                                  //   value={''}
                                  placeholder="Prof. Sebastian"
                                  onChange={(e) =>
                                    this.handleChange_InterviewTraining(e)
                                  }
                                />
                              </Form.Group>
                            </Form>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    <p>
                      Please provide further information (invitation email
                      content, reading assignment, etc.) below:{' '}
                    </p>
                    <NotesEditor
                      thread={this.state.thread}
                      buttonDisabled={this.state.buttonDisabled}
                      editorState={this.state.editorState}
                      handleClickSave={this.handleClickSave}
                    />
                  </Card.Body>
                </Card>
              </>
            ) : (
              <>
                <Row className="sticky-top ">
                  <Col>
                    <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
                      <Card.Header text={'dark'}>
                        <Card.Title>
                          <Row>
                            <Col className="my-0 mx-0 text-light">
                              {is_TaiGer_role(this.props.user)
                                ? 'All Interviews'
                                : 'My Interviews'}
                            </Col>
                          </Row>
                        </Card.Title>
                      </Card.Header>
                    </Card>
                  </Col>
                </Row>
                {interviewslist.map((interview, i) => (
                  <InterviewItems
                    key={i}
                    user={this.props.user}
                    interview={interview}
                    openDeleteDocModalWindow={this.openDeleteDocModalWindow}
                  />
                ))}
                {!is_TaiGer_role(this.props.user) &&
                  available_interview_request_programs.length > 0 && (
                    <Button onClick={this.handleClick}>Add</Button>
                  )}
              </>
            )}
          </Col>
        </Row>
        <Modal
          show={this.state.SetDeleteDocModel}
          onHide={this.closeDeleteDocModalWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to delete the interview request of{' '}
            <b>{this.state.interview_name_toBeDelete}</b>?
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={!isLoaded} onClick={this.handleDeleteInterview}>
              Yes
            </Button>

            <Button onClick={this.closeDeleteDocModalWindow}>No</Button>
          </Modal.Footer>
        </Modal>
      </Aux>
    );
  }
}

export default InterviewTraining;

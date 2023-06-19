import React from 'react';
import { Spinner, Button, Card, Modal } from 'react-bootstrap';
import { assignProgramToStudent, getProgram, updateProgram } from '../../api';
import SingleProgramView from './SingleProgramView';
import SingleProgramEdit from './SingleProgramEdit';
import ProgramDeleteWarning from './ProgramDeleteWarning';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { TabTitle } from '../Utils/TabTitle';
import {
  is_TaiGer_AdminAgent,
  is_TaiGer_Admin
} from '../Utils/checking-functions';

import { deleteProgram } from '../../api';
import { Link } from 'react-router-dom';
import ProgramListSubpage from './ProgramListSubpage';

class SingleProgram extends React.Component {
  state = {
    error: '',
    isLoaded: false,
    program: null,
    success: false,
    isEdit: false,
    modalShowAssignSuccessWindow: false,
    modalShowAssignWindow: false,
    deleteProgramWarning: false,
    isDeleted: false,
    res_status: 0,
    students: [],
    student_id: '',
    res_modal_message: '',
    res_modal_status: 0
  };
  componentDidMount() {
    getProgram(this.props.match.params.programId).then(
      (resp) => {
        const { data, success, students } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            program: data,
            students,
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

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.match.params.programId !== this.props.match.params.programId
    ) {
      getProgram(this.props.match.params.programId).then(
        (resp) => {
          const { data, success, students } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              program: data,
              students,
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

  assignProgram = (assign_data) => {
    const { student_id, program_ids } = assign_data;
    this.setState((state) => ({
      ...state,
      isAssgining: true
    }));
    assignProgramToStudent(student_id, program_ids).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            isAssgining: false,
            modalShowAssignSuccessWindow: true,
            modalShowAssignWindow: false,
            success,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            isAssgining: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        setStatedataTable2((state) => ({
          ...state,
          isLoaded: true,
          isAssgining: false,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  onSubmitAddToStudentProgramList = (e) => {
    e.preventDefault();
    const student_id = this.state.student_id;
    this.assignProgram({
      student_id,
      program_ids: [this.state.program._id.toString()]
    });
  };

  onHideAssignSuccessWindow = () => {
    this.setState((state) => ({
      ...state,
      modalShowAssignSuccessWindow: false
    }));
  };

  setModalShow2 = () => {
    this.setState((state) => ({
      ...state,
      modalShowAssignWindow: true
    }));
  };

  setModalHide = () => {
    this.setState((state) => ({
      ...state,
      modalShowAssignWindow: false
    }));
  };
  handleSetStudentId = (e) => {
    const { value } = e.target;
    this.setState((state) => ({
      ...state,
      student_id: value
    }));
  };

  handleSubmit_Program = (program) => {
    updateProgram(program).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            program: data,
            success: success,
            isEdit: !this.state.isEdit,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          });
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

  ConfirmError = () => {
    // window.location.reload(true);
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  handleClick = () => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };

  setModalShowDDelete = () => {
    this.setState({
      deleteProgramWarning: true
    });
  };

  setModalHideDDelete = () => {
    this.setState({
      deleteProgramWarning: false
    });
  };
  RemoveProgramHandler = (program_id) => {
    deleteProgram(program_id).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            deleteProgramWarning: false,
            isDeleted: true,
            success: success,
            isEdit: !this.state.isEdit,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          });
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

  render() {
    const {
      res_status,
      isLoaded,
      isDeleted,
      res_modal_status,
      res_modal_message,
      program,
      students
    } = this.state;
    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }
    if (!isLoaded) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    TabTitle(`${program.school} - ${program.program_name}`);

    if (isDeleted) {
      return (
        <Card>
          <Card.Header>The program is deleted</Card.Header>
          <Card.Body>
            <Link to={'/programs'}>Click me back to the program list</Link>
          </Card.Body>
        </Card>
      );
    }
    if (this.state.isEdit) {
      return (
        <>
          {res_modal_status >= 400 && (
            <ModalMain
              ConfirmError={this.ConfirmError}
              res_modal_status={res_modal_status}
              res_modal_message={res_modal_message}
            />
          )}
          <SingleProgramEdit
            program={program}
            isLoaded={isLoaded}
            handleSubmit_Program={this.handleSubmit_Program}
            handleClick={this.handleClick}
          />
        </>
      );
    } else {
      return (
        <>
          {res_modal_status >= 400 && (
            <ModalMain
              ConfirmError={this.ConfirmError}
              res_modal_status={res_modal_status}
              res_modal_message={res_modal_message}
            />
          )}
          <SingleProgramView
            program={program}
            isLoaded={isLoaded}
            user={this.props.user}
            students={students}
            programId={this.props.match.params.programId}
          />
          {is_TaiGer_AdminAgent(this.props.user) && (
            <>
              <Button size="sm" onClick={() => this.handleClick()}>
                Edit
              </Button>
              <Button size="sm" variant='secondary' onClick={() => this.setModalShow2()}>
                Assign
              </Button>
              {is_TaiGer_Admin(this.props.user) && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => this.setModalShowDDelete()}
                >
                  Delete
                </Button>
              )}
            </>
          )}
          <ProgramDeleteWarning
            deleteProgramWarning={this.state.deleteProgramWarning}
            setModalHideDDelete={this.setModalHideDDelete}
            uni_name={program.school}
            program_name={program.program_name}
            RemoveProgramHandler={this.RemoveProgramHandler}
            program_id={program._id.toString()}
          />
          <ProgramListSubpage
            userId={this.props.user._id.toString()}
            show={this.state.modalShowAssignWindow}
            setModalHide={this.setModalHide}
            uni_name={[program.school]}
            program_name={[program.program_name]}
            handleChange2={this.handleSetStudentId}
            isAssgining={this.state.isAssgining}
            onSubmitAddToStudentProgramList={
              this.onSubmitAddToStudentProgramList
            }
          />
          <Modal
            show={this.state.modalShowAssignSuccessWindow}
            onHide={this.onHideAssignSuccessWindow}
            size="m"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter">
                Success
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Program(s) assigned to student successfully!
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.onHideAssignSuccessWindow}>Close</Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
  }
}
export default SingleProgram;

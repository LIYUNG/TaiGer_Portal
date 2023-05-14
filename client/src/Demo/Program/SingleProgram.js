import React from 'react';
import { Spinner, Button } from 'react-bootstrap';
import { getProgram, updateProgram } from '../../api';
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

class SingleProgram extends React.Component {
  state = {
    error: '',
    isLoaded: false,
    program: null,
    success: false,
    isEdit: false,
    deleteProgramWarning: false,
    res_status: 0,
    students: [],
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
    // this.setState({
    //   deleteProgramWarning: false
    // });
    deleteProgram(program_id).then(
      (resp) => {
        console.log(resp);
        this.setState({
          deleteProgramWarning: false
        });
      },
      (error) => {}
    );
  };

  render() {
    const {
      res_status,
      isLoaded,
      res_modal_status,
      res_modal_message,
      program,
      students
    } = this.state;
    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }
    if (!isLoaded || !program) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    TabTitle(`${program.school} - ${program.program_name}`);

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
        </>
      );
    }
  }
}
export default SingleProgram;

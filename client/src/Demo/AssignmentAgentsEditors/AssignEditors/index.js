import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../../hoc/_Aux';
import AssignEditorsPage from './AssignEditorsPage';
import ErrorPage from '../../Utils/ErrorPage';
import { SYMBOL_EXPLANATION, spinner_style } from '../../Utils/contants';

import { getStudents, getEditors, updateEditors } from '../../../api';

class AssignEditors extends React.Component {
  state = {
    error: null,
    editor_list: [],
    isLoaded: false,
    students: [],
    updateEditorList: {},
    success: false,
    isDashboard: true,
    res_status: 0
  };

  componentDidMount() {
    getStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
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
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      getStudents().then(
        (resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              students: data,
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
          this.setState({
            isLoaded: true,
            error: true
          });
        }
      );
    }
  }

  editEditor = (student) => {
    getEditors().then(
      (resp) => {
        const { success } = resp;
        const { status } = resp;
        if (success) {
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
        const { data: editors } = resp.data;
        const { editors: student_editors } = student;
        const updateEditorList = editors.reduce(
          (prev, { _id }) => ({
            ...prev,
            [_id]: student_editors
              ? student_editors.findIndex(
                  (student_editor) => student_editor._id === _id
                ) > -1
              : false
          }),
          {}
        );

        this.setState((state) => ({
          ...state,
          editor_list: editors,
          updateEditorList
        }));
      },
      (error) => {}
    );
  };

  handleChangeEditorlist = (e) => {
    const { value, checked } = e.target;
    this.setState((prevState) => ({
      updateEditorList: {
        ...prevState.updateEditorList,
        [value]: checked
      }
    }));
  };

  submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    this.UpdateEditorlist(e, updateEditorList, student_id);
  };

  UpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    updateEditors(updateEditorList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = [...this.state.students];
          var studentIdx = students_temp.findIndex(
            ({ _id }) => _id === student_id
          );
          students_temp[studentIdx] = data; // datda is single student updated
          this.setState({
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateEditorList: [],
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
        alert('UpdateEditorlist is failed.');
      }
    );
  };

  render() {
    if (this.props.user.role !== 'Admin') {
      return <Redirect to="/dashboard/default" />;
    }
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.data) {
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

    return (
      <Aux>
        {!isLoaded && (
          <div style={spinner_style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )}
        <AssignEditorsPage
          role={this.props.user.role}
          editEditor={this.editEditor}
          editor_list={this.state.editor_list}
          students={this.state.students}
          updateEditorList={this.state.updateEditorList}
          handleChangeEditorlist={this.handleChangeEditorlist}
          submitUpdateEditorlist={this.submitUpdateEditorlist}
          SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
          updateStudentArchivStatus={this.updateStudentArchivStatus}
          isDashboard={this.state.isDashboard}
        />
      </Aux>
    );
  }
}

export default AssignEditors;

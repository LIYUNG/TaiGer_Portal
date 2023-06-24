import React from 'react';
import { Spinner } from 'react-bootstrap';

import SingleInterviewView from './SingleInterviewView';
import SingleInterviewEdit from './SingleInterviewEdit';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { getInterview, updateInterview } from '../../api';
import { TabTitle } from '../Utils/TabTitle';

class SingleInterview extends React.Component {
  state = {
    error: '',
    author: '',
    isLoaded: false,
    success: false,
    interview: {},
    editorState: null,
    isEdit: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };
  componentDidMount() {
    getInterview(this.props.match.params.interview_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (!data) {
          this.setState({ isLoaded: true, res_status: status });
        }
        if (success) {
          var initialEditorState = null;
          const author = data.author;
          if (data.interview_notes) {
            initialEditorState = JSON.parse(data.interview_notes);
          } else {
            initialEditorState = { time: new Date(), blocks: [] };
          }
          console.log(initialEditorState);
          this.setState({
            isLoaded: true,
            interview: data,
            editorState: initialEditorState,
            author,
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
      prevProps.match.params.interview_id !==
      this.props.match.params.interview_id
    ) {
      getInterview(this.props.match.params.interview_id).then(
        (resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (!data) {
            this.setState({ isLoaded: true, res_status: status });
          }
          if (success) {
            var initialEditorState = null;
            const author = data.author;
            if (data.interview_notes) {
              initialEditorState = JSON.parse(data.interview_notes);
            } else {
              initialEditorState = { time: new Date(), blocks: [] };
            }
            this.setState({
              isLoaded: true,
              interview: data,
              editorState: initialEditorState,
              author,
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

  handleClickEditToggle = (e) => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };
  handleClickSave = (e, interview, editorState) => {
    e.preventDefault();
    const message = JSON.stringify(editorState);
    const interviewData_temp = interview;
    interviewData_temp.interview_notes = message;
    updateInterview(
      this.props.match.params.interview_id,
      interviewData_temp
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            interview: data,
            editorState,
            isEdit: !this.state.isEdit,
            author: data.author,
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
        this.setState({ error });
      }
    );
    this.setState((state) => ({ ...state, in_edit_mode: false }));
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    const {
      res_status,
      editorState,
      interview,
      isLoaded,
      res_modal_status,
      res_modal_message
    } = this.state;

    if (!isLoaded && !editorState) {
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
    TabTitle(`Doc: ${this.state.document_title}`);
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
          <SingleInterviewEdit
            user={this.props.user}
            category={this.state.category}
            interview={interview}
            editorState={this.state.editorState}
            author={this.state.author}
            isLoaded={isLoaded}
            handleClickEditToggle={this.handleClickEditToggle}
            handleClickSave={this.handleClickSave}
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
          <SingleInterviewView
            category={this.state.category}
            interview={interview}
            editorState={this.state.editorState}
            author={this.state.author}
            isLoaded={isLoaded}
            user={this.props.user}
            handleClickEditToggle={this.handleClickEditToggle}
          />
        </>
      );
    }
  }
}
export default SingleInterview;

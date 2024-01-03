import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

import NotesEditor from './NotesEditor';
import { updateStudentNotes } from '../../api';

class NotesCard extends Component {
  state = {
    editorState: null,
    message_id: '',
    isLoaded: false,
    buttonDisabled: false
  };

  componentDidMount() {
    this.setState((state) => ({
      ...state,
      isLoaded: this.props.isLoaded,
      buttonDisabled: true
    }));
  }

  handleClickSave = (e, editorState) => {
    e.preventDefault();
    this.setState({ buttonDisabled: true });
    var notes = JSON.stringify(editorState);

    updateStudentNotes(this.props.student_id, notes).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            file: null,
            thread: data,
            isLoaded: true,
            buttonDisabled: true,
            res_modal_status: status
          });
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            buttonDisabled: false,
            res_modal_message: message,
            res_modal_status: status
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
    this.setState((state) => ({ ...state, in_edit_mode: false }));
  };

  render() {
    return (
      <>
        <NotesEditor
          thread={this.state.thread}
          notes_id={'editorjs'}
          // buttonDisabled={this.state.buttonDisabled}
          editorState={this.props.notes}
          unique_id={this.props.student_id}
          handleClickSave={this.handleClickSave}
        />
      </>
    );
  }
}

export default NotesCard;

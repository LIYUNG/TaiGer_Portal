import React, { Component } from 'react';
import { Spinner, Button, Modal } from 'react-bootstrap';

import { convertDate, spinner_style } from '../Utils/contants';
import NotesEditor from './NotesEditor';
import { updateStudentNotes } from '../../api';

class NotesCard extends Component {
  state = {
    editorState: null,
    message_id: '',
    isLoaded: false,
    buttonDisabled: false,
    deleteMessageModalShow: false
  };
  componentDidMount() {
    this.setState((state) => ({
      ...state,
      // editorState: initialEditorState,
      isLoaded: this.props.isLoaded,
      buttonDisabled: true,
      deleteMessageModalShow: false
    }));
  }

  onOpendeleteMessageModalShow = (e, message_id, createdAt) => {
    this.setState({ message_id, deleteMessageModalShow: true, createdAt });
  };
  onHidedeleteMessageModalShow = (e) => {
    this.setState({
      message_id: '',
      createdAt: '',
      deleteMessageModalShow: false
    });
  };

  onDeleteSingleMessage = (e) => {
    e.preventDefault();
    this.setState({ deleteMessageModalShow: false });
    this.props.onDeleteSingleMessage(e, this.state.message_id);
  };

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
          // buttonDisabled={this.state.buttonDisabled}
          editorState={this.props.notes}
          unique_id={this.props.student_id}
          handleClickSave={this.handleClickSave}
        />
        <Modal
          show={this.state.deleteMessageModalShow}
          onHide={this.onHidedeleteMessageModalShow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you wan to delete this message on{' '}
            <b>{convertDate(this.state.createdAt)}?</b>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!this.props.isLoaded}
              variant="danger"
              onClick={this.onDeleteSingleMessage}
            >
              {this.props.isLoaded ? 'Delete' : 'Pending'}
            </Button>
            <Button onClick={this.onHidedeleteMessageModalShow} variant="light">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default NotesCard;

import React, { Component } from 'react';
import Message from './Message';
import { updateAMessageInCommunicationThread } from '../../api';
import MessageEdit from './MessageEdit';

class MessageContainer extends Component {
  state = {
    error: '',
    isEdit: false,
    isLoaded: false,
    message: this.props.message,
    thread: null,
    upperThread: [],
    buttonDisabled: false,
    editorState: {},
    expand: true,
    pageNumber: 1,
    deadline: '',
    SetAsFinalFileModel: false,
    uppderaccordionKeys: [], // to expand all]
    accordionKeys: [0], // to expand all]
    loadButtonDisabled: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  };
  componentDidMount() {
    var initialEditorState = null;
    if (this.props.message.message && this.props.message.message !== '{}') {
      try {
        initialEditorState = JSON.parse(this.props.message.message);
      } catch (e) {
        initialEditorState = { time: new Date(), blocks: [] };
      }
    } else {
      initialEditorState = { time: new Date(), blocks: [] };
    }
    this.setState((state) => ({
      ...state,
      editorState: initialEditorState,
      isLoaded: true
      //   deleteMessageModalShow: false
    }));
  }
  updateMessage = (e, editorState, messageId) => {
    e.preventDefault();
    this.setState({ buttonDisabled: true });
    let message = JSON.stringify(editorState);
    // let messageId = '1';
    updateAMessageInCommunicationThread(
      this.props.student_id,
      messageId,
      message
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            editorState,
            message: data,
            // thread: [...this.state.thread, ...data],
            isLoaded: true,
            isEdit: false,
            buttonDisabled: false,
            accordionKeys: [
              ...this.state.accordionKeys,
              this.state.accordionKeys.length
            ],
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
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: error
        }));
      }
    );
  };
  onEditMode = () => {
    this.setState({
      isEdit: true
    });
  };
  handleCancelEdit = () => {
    this.setState({
      isEdit: false
    });
  };
  render() {
    let firstname = this.props.message.user_id
      ? this.props.message.user_id.firstname
      : 'Staff';
    let lastname = this.props.message.user_id
      ? this.props.message.user_id.lastname
      : 'TaiGer';
    const editable = this.props.message.user_id
      ? this.props.message.user_id._id.toString() ===
        this.props.user._id.toString()
        ? true
        : false
      : false;
    const full_name = `${firstname} ${lastname}`;
    return (
      <>
        {this.state.isEdit ? (
          <>
            <MessageEdit
              singleExpandtHandler={this.props.singleExpandtHandler}
              idx={this.props.idx}
              editorState={this.state.editorState}
              onTrashClick={this.props.onTrashClick}
              lastupdate={this.props.lastupdate}
              isLoaded={this.props.isLoaded}
              user={this.props.user}
              full_name={full_name}
              message={this.props.message}
              editable={editable}
              onDeleteSingleMessage={this.props.onDeleteSingleMessage}
              buttonDisabled={this.state.buttonDisabled}
              handleClickSave={this.updateMessage}
              handleCancelEdit={this.handleCancelEdit}
            />
          </>
        ) : (
          <Message
            accordionKeys={this.props.accordionKeys}
            singleExpandtHandler={this.props.singleExpandtHandler}
            idx={this.props.idx}
            message={this.state.message}
            onTrashClick={this.props.onTrashClick}
            lastupdate={this.props.lastupdate}
            isLoaded={this.props.isLoaded}
            user={this.props.user}
            onDeleteSingleMessage={this.props.onDeleteSingleMessage}
            onEditMode={this.onEditMode}
          />
        )}
      </>
    );
  }
}

export default MessageContainer;

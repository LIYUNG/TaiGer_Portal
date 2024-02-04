import React, { useEffect, useState } from 'react';

import Message from './Message';
import { updateAMessageInCommunicationThread } from '../../api';
import MessageEdit from './MessageEdit';
import { useAuth } from '../../components/AuthProvider';

function MessageContainer(props) {
  const { user } = useAuth();
  const [messageContainerState, setMessageContainerState] = useState({
    error: '',
    isEdit: false,
    isLoaded: false,
    message: props.message,
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
  });

  useEffect(() => {
    var initialEditorState = null;
    if (props.message.message && props.message.message !== '{}') {
      try {
        initialEditorState = JSON.parse(props.message.message);
      } catch (e) {
        initialEditorState = { time: new Date(), blocks: [] };
      }
    } else {
      initialEditorState = { time: new Date(), blocks: [] };
    }
    setMessageContainerState((prevState) => ({
      ...prevState,
      editorState: initialEditorState,
      isLoaded: true
      //   deleteMessageModalShow: false
    }));
  }, []);

  const updateMessage = (e, editorState, messageId) => {
    e.preventDefault();
    setMessageContainerState((prevState) => ({
      ...prevState,
      buttonDisabled: true
    }));
    let message = JSON.stringify(editorState);
    // let messageId = '1';
    updateAMessageInCommunicationThread(
      props.student_id,
      messageId,
      message
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          setMessageContainerState((prevState) => ({
            ...prevState,
            success,
            editorState,
            message: data,
            isLoaded: true,
            isEdit: false,
            buttonDisabled: false,
            accordionKeys: [
              ...prevState.accordionKeys,
              prevState.accordionKeys.length
            ],
            res_modal_status: status
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setMessageContainerState((prevState) => ({
            ...prevState,
            isLoaded: true,
            buttonDisabled: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setMessageContainerState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: error
        }));
      }
    );
  };

  const onEditMode = () => {
    setMessageContainerState((prevState) => ({
      ...prevState,
      isEdit: true
    }));
  };

  const handleCancelEdit = () => {
    setMessageContainerState((prevState) => ({
      ...prevState,
      isEdit: false
    }));
  };
  let firstname = props.message.user_id
    ? props.message.user_id.firstname
    : 'Staff';
  let lastname = props.message.user_id
    ? props.message.user_id.lastname
    : 'TaiGer';
  const editable = props.message.user_id
    ? props.message.user_id._id.toString() === user._id.toString()
      ? true
      : false
    : false;
  const full_name = `${firstname} ${lastname}`;
  return (
    <>
      {messageContainerState.isEdit ? (
        <>
          <MessageEdit
            idx={props.idx}
            editorState={messageContainerState.editorState}
            onTrashClick={props.onTrashClick}
            lastupdate={props.lastupdate}
            isLoaded={props.isLoaded}
            full_name={full_name}
            message={props.message}
            editable={editable}
            onDeleteSingleMessage={props.onDeleteSingleMessage}
            buttonDisabled={messageContainerState.buttonDisabled}
            handleClickSave={updateMessage}
            handleCancelEdit={handleCancelEdit}
          />
        </>
      ) : (
        <Message
          accordionKeys={props.accordionKeys}
          idx={props.idx}
          message={messageContainerState.message}
          onTrashClick={props.onTrashClick}
          lastupdate={props.lastupdate}
          isLoaded={props.isLoaded}
          onDeleteSingleMessage={props.onDeleteSingleMessage}
          onEditMode={onEditMode}
        />
      )}
    </>
  );
}

export default MessageContainer;

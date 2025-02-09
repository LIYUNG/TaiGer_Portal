import React from 'react';

import MessageContainer from './MessageContainer';

const MessageList = (props) => {
    const messageList = props.thread.map((message, i) => (
        <MessageContainer
            accordionKeys={props.accordionKeys}
            idx={props.isUpperMessagList ? props.thread.length - i - 1 : i}
            isDeleting={props.isDeleting}
            isTaiGerView={props.isTaiGerView}
            key={message._id.toString()}
            lastupdate={props.lastupdate}
            message={message}
            onDeleteSingleMessage={props.onDeleteSingleMessage}
            onTrashClick={props.onTrashClick}
            student_id={props.student_id}
        />
    ));
    return messageList;
};

export default MessageList;

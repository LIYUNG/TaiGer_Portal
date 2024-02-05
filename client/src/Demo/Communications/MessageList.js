import React from 'react';

import MessageContainer from './MessageContainer';

function MessageList(props) {
  const thread = props.thread.map((message, i) => (
    <MessageContainer
      accordionKeys={props.accordionKeys}
      idx={props.isUpperMessagList ? props.thread.length - i - 1 : i}
      key={message._id.toString()}
      student_id={props.student_id}
      message={message}
      onTrashClick={props.onTrashClick}
      lastupdate={props.lastupdate}
      isLoaded={props.isLoaded}
      onDeleteSingleMessage={props.onDeleteSingleMessage}
    />
  ));
  return <>{thread}</>;
}

export default MessageList;

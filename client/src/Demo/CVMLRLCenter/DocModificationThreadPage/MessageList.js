import React from 'react';

import Message from './Message';

function MessageList(props) {
  const thread = props.thread?.messages?.map((message, i) => (
    <Message
      documentsthreadId={props.documentsthreadId}
      accordionKeys={props.accordionKeys}
      singleExpandtHandler={props.singleExpandtHandler}
      id={message._id}
      idx={i}
      key={i}
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

import React from 'react';

import MessageCard from './MessageCard';

function MessageList(props) {
  const thread = props.thread?.messages?.map((message, i) => (
    <MessageCard
      documentsthreadId={props.documentsthreadId}
      accordionKeys={props.accordionKeys}
      singleExpandtHandler={props.singleExpandtHandler}
      id={message._id}
      idx={i}
      key={i}
      message={message}
      isLoaded={props.isLoaded}
      onDeleteSingleMessage={props.onDeleteSingleMessage}
      apiPrefix={props.apiPrefix}
    />
  ));
  return <>{thread}</>;
}

export default MessageList;

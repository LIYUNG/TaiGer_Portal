import React from 'react';

import MessageCard from './MessageCard';

const MessageList = (props) => {
    const thread = props.thread?.messages?.map((message, i) => (
        <MessageCard
            accordionKeys={props.accordionKeys}
            apiPrefix={props.apiPrefix}
            documentsthreadId={props.documentsthreadId}
            id={message._id}
            idx={i}
            isLoaded={props.isLoaded}
            key={i}
            message={message}
            onDeleteSingleMessage={props.onDeleteSingleMessage}
            singleExpandtHandler={props.singleExpandtHandler}
        />
    ));
    return thread;
};

export default MessageList;

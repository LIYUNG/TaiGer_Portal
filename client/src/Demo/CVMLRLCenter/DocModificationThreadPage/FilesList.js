import React from 'react';

import FileItem from './FileItem';

function FilesList(props) {
  const thread = props.thread.messages.map((message, i) => (
    <FileItem
      documentsthreadId={props.documentsthreadId}
      id={message._id}
      idx={i}
      key={i}
      message={message}
      lastupdate={props.lastupdate}
      isLoaded={props.isLoaded}
    />
  ));
  return <>{thread}</>;
}

export default FilesList;

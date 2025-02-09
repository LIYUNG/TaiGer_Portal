import React from 'react';

import FileItem from './FileItem';

const FilesList = (props) => {
    const thread = props.thread.messages.map((message, i) => (
        <FileItem
            documentsthreadId={props.documentsthreadId}
            id={message._id}
            idx={i}
            isLoaded={props.isLoaded}
            key={i}
            lastupdate={props.lastupdate}
            message={message}
        />
    ));
    return <>{thread}</>;
}

export default FilesList;

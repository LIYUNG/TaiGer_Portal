import React, { Component } from 'react';
import FileItem from './FileItem';

class FilesList extends Component {
  render() {
    const thread = this.props.thread.messages.map((message, i) => (
      <FileItem
        documentsthreadId={this.props.documentsthreadId}
        id={message._id}
        idx={i}
        key={i}
        message={message}
        lastupdate={this.props.lastupdate}
        isLoaded={this.props.isLoaded}
        user={this.props.user}
      />
    ));
    return <>{thread}</>;
  }
}

export default FilesList;

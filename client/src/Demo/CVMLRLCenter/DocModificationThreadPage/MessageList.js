import React, { Component } from "react";
import Message from "./Message";

class MessageList extends Component {
  render() {
    const thread = this.props.thread.messages.map((message, i) => (
      <Message
        onDownloadFileInMessage={this.props.onDownloadFileInMessage}
        documentsthreadId={this.props.documentsthreadId}
        accordionKeys={this.props.accordionKeys}
        singleExpandtHandler={this.props.singleExpandtHandler}
        id={message._id}
        idx={i}
        key={i}
        message={message}
        onTrashClick={this.props.onTrashClick}
        lastupdate={this.props.lastupdate}
        isLoaded={this.props.isLoaded}
      />
    ));
    return <>{thread}</>;
  }
}

export default MessageList;

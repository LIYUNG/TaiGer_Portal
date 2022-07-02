import React, { Component } from "react";
import Message from "./Message";

class MessageList extends Component {
  render() {
    const thread = this.props.thread.messages.map((message, i) => (
      <Message
        accordionKeys={this.props.accordionKeys}
        singleExpandtHandler={this.props.singleExpandtHandler}
        id={message._id}
        idx={i}
        key={message._id}
        message={message}
        onTrashClick={this.props.onTrashClick}
        lastupdate={this.props.lastupdate}
        role={this.props.role}
        isLoaded={this.props.isLoaded}
      />
    ));
    return <div>{thread}</div>;
  }
}

export default MessageList;

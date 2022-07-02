import React, { Component } from "react";
import Message from "./Message";

class MessageList extends Component {
  render() {
    const thread = this.props.thread.messages.map((message) => (
      <Message
        id={message._id}
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

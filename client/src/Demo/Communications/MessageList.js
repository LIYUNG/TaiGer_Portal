import React, { Component } from 'react';
import Message from './Message';

class MessageList extends Component {
  render() {
    const thread = this.props.thread.map((message, i) => (
      <Message
        accordionKeys={this.props.accordionKeys}
        singleExpandtHandler={this.props.singleExpandtHandler}
        idx={
          this.props.isUpperMessagList ? this.props.thread.length - i - 1 : i
        }
        key={message._id.toString()}
        message={message}
        onTrashClick={this.props.onTrashClick}
        lastupdate={this.props.lastupdate}
        isLoaded={this.props.isLoaded}
        user={this.props.user}
        onDeleteSingleMessage={this.props.onDeleteSingleMessage}
      />
    ));
    return <>{thread}</>;
  }
}

export default MessageList;

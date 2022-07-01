import React, { Component } from "react";
import EditableMessage from "./EditableMessage";

class MessageList extends Component {

  render() {
    const articles = this.props.articles.map((article) => (
      <EditableMessage
        key={article._id}
        id={article._id}
        title={article.Titel_}
        content={article.Content_}
        lastupdate={article.LastUpdate_}
        category={this.props.category}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
        role={this.props.role}
        isLoaded={this.props.isLoaded}
      />
    ));
    return <div>{articles}</div>;
  }
}

export default MessageList;

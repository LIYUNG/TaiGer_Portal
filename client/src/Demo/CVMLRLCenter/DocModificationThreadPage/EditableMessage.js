import React, { Component } from "react";
import MessageForm from "./MessageForm";
import Message from "./Message";

class EditableMessage extends Component {
  state = {
    editFormOpen: false,
  };

  handleEditClick = () => {
    this.openForm();
  };

  handleFormClose = () => {
    this.closeForm();
  };

  handleSubmit = (article) => {
    this.props.onFormSubmit(article);
    this.closeForm();
  };

  closeForm = () => {
    this.setState({ editFormOpen: false });
  };

  openForm = () => {
    this.setState({ editFormOpen: true });
  };

  render() {
    if (this.state.editFormOpen) {
      return (
        <MessageForm
          id={this.props.id}
          title={this.props.title}
          content={this.props.content}
          category={this.props.category}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
          isLoaded={this.props.isLoaded}
        />
      );
    } else {
      return (
        <Message
          id={this.props.id}
          title={this.props.title}
          content={this.props.content}
          onEditClick={this.handleEditClick}
          onTrashClick={this.props.onTrashClick}
          lastupdate={this.props.lastupdate}
          role={this.props.role}
          isLoaded={this.props.isLoaded}
        />
      );
    }
  }
}

export default EditableMessage;

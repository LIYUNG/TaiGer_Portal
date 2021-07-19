import React, { Component } from "react";
import ApplicationArticleForm from "./ApplicationArticleForm";
import ApplicationArticle from "./ApplicationArticle";

class EditableApplicationArticle extends Component {
  state = {
    editFormOpen: false,
  };

  handleFormClose = () => {
    this.setState({ editFormOpen: false });
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
        <ApplicationArticleForm
          id={this.props.id}
          title={this.props.title}
          content={this.props.content}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <ApplicationArticle
          id={this.props.id}
          title={this.props.title}
          content={this.props.content}
          onEditClick={this.handleEditClick}
          onTrashClick={this.props.onTrashClick}
          lastupdate={this.props.lastupdate}
        />
      );
    }
  }
}

export default EditableApplicationArticle;

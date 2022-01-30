import React, { Component } from "react";
import ArticleForm from "./ArticleForm";
import Article from "./Article";

class EditableArticle extends Component {
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
        <ArticleForm
          id={this.props.id}
          title={this.props.title}
          content={this.props.content}
          category={this.props.category}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <Article
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

export default EditableArticle;

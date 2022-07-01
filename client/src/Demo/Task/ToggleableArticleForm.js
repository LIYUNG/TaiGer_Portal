import React, { Component } from "react";
import ArticleForm from "./ArticleForm";
import { IoMdAdd } from "react-icons/io";
import { Button } from "react-bootstrap";

class ToggleableArticleForm extends Component {
  // TODO: replace by database
  state = {
    isOpen: false,
  };
  handleFormOpen = () => {
    this.setState({ isOpen: true });
  };

  handleFormClose = () => {
    this.setState({ isOpen: false });
  };

  handleFormSubmit = (article) => {
    this.props.onFormSubmit(article);
    this.setState({ isOpen: false });
  };

  render() {
    if (this.state.isOpen) {
      return (
        <ArticleForm
          category={this.props.category}
          onFormSubmit={this.handleFormSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <div className="ui basic content center aligned segment">
          <Button
            className="ui basic button icon"
            onClick={this.handleFormOpen}
          >
            <IoMdAdd />
          </Button>
        </div>
      );
    }
  }
}

export default ToggleableArticleForm;

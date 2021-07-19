import React, { Component } from "react";
import ApplicationArticleForm from "./ApplicationArticleForm";
import { IoMdAdd } from "react-icons/io";

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
        <ApplicationArticleForm
          onFormSubmit={this.handleFormSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <div className="ui basic content center aligned segment">
          <button
            className="ui basic button icon"
            onClick={this.handleFormOpen}
          >
            <IoMdAdd />
          </button>
        </div>
      );
    }
  }
}

export default ToggleableArticleForm;

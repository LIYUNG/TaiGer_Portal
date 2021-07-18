import React, { Component } from "react";
import Card from "../../App/components/MainCard";

class ApplicationArticle extends Component {
  state = {
    editFormOpen: false,
  };

  render() {
    if (this.state.editFormOpen) {
      return (
        <></>
        // <TimerForm title={this.props.title} project={this.props.project} />
      );
    } else {
      return (
      <Card title={this.props.title} isOption>
        <p>{this.props.content}</p>
      </Card>
      );
    }
  }
}

export default ApplicationArticle;

import React, { Component } from "react";
import Card from "../../App/components/MainCard";
import { AiFillEdit } from "react-icons/ai";

import { BsTrash } from "react-icons/bs";
class ApplicationArticle extends Component {
  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id);
  };
  render() {
    return (
      <Card title={this.props.title}>
        <p>{this.props.content}</p>
        <div>
          <p>Last Update: {this.props.lastupdate}</p>
          <span className="right">
            <AiFillEdit onClick={this.props.onEditClick} />
          </span>
          <span className="right">
            <BsTrash onClick={this.handleTrashClick} />
          </span>
        </div>
      </Card>
    );
  }
}

export default ApplicationArticle;

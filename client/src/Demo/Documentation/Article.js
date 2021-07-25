import React, { Component } from "react";
import Card from "../../App/components/MainCard";
import { AiFillEdit } from "react-icons/ai";

import { BsTrash } from "react-icons/bs";
class Article extends Component {
  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id);
  };
  renderText() {
    let parts = this.props.content.split("\n"); // re is a matching regular expression
    for (let i = 0; i < parts.length; i += 1) {
      if (parts[i].includes("http")) {
        parts[i] = (
          <span>
            <span>
              <a key={"link" + i} href={parts[i]}>
                {parts[i]}
              </a>
            </span>
            <br />
          </span>
        );
      } else {
        parts[i] = (
          <span>
            <span>{parts[i]}</span>
            <br />
          </span>
        );
      }
    }
    return parts;
  }
  render() {
    let text2 = this.renderText();
    return (
      <Card title={this.props.title}>
        <div>{text2}</div>

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

export default Article;

import React, { Component } from "react";
import Card from "../../../App/components/MainCard";
import { AiFillEdit } from "react-icons/ai";
import { Form, Button } from "react-bootstrap";

import { BsTrash } from "react-icons/bs";
class HandWrittenFile extends Component {
  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id);
  };
  render() {
    return (
      <div>
        <h5>Document Name: {this.props.document.name}</h5>
        <Button>Upload</Button>
        <Button>Download</Button>
        <Button>Delete</Button>
      </div>
    );
  }
}

export default HandWrittenFile;

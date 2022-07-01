import React, { Component } from "react";
// import Card from "../../../App/components/MainCard";
import { AiFillEdit } from "react-icons/ai";
import { Card, Spinner } from "react-bootstrap";

import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import parse from "html-react-parser";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./DraftEditor.css";

class Message extends Component {
  state = {
    editorState: null,
    ConvertedContent: "",
    isLoaded: false,
  };
  componentDidMount() {
    var initialEditorState = null;
    if (this.props.content) {
      const rawContentFromStore = convertFromRaw(
        JSON.parse(this.props.content)
      );
      initialEditorState = EditorState.createWithContent(rawContentFromStore);
      console.log(initialEditorState);
    } else {
      initialEditorState = EditorState.createEmpty();
    }
    this.setState((state) => ({
      ...state,
      editorState: initialEditorState,
      ConvertedContent: initialEditorState,
      isLoaded: this.props.isLoaded,
    }));
  }
  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id);
  };
  renderText() {
    let parts = this.props.content.split("\n"); // re is a matching regular expression
    for (let i = 0; i < parts.length; i += 1) {
      if (parts[i].includes("http")) {
        parts[i] = (
          <span key={i}>
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
          <span key={i}>
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
    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    if (!this.state.isLoaded) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    return (
      <Card key={this.props.id}>
        <Card.Header>
          <Card.Title as="h5">
            {this.props.name}
            {this.props.title}
            {" on "}
            {new Date(this.props.lastupdate).toLocaleTimeString()}
            {", "}
            {new Date(this.props.lastupdate).toLocaleDateString()}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {/* {text2} */}
          {parse(convertToHTML(this.state.editorState.getCurrentContent()))}
        </Card.Body>
        {/* <div>
          {this.props.role === "Admin" || this.props.role === "Agent" ? (
            <>
              <span className="right">
                <AiFillEdit onClick={this.props.onEditClick} />
              </span>
              <span className="right">
                <BsTrash onClick={this.handleTrashClick} />
              </span>
            </>
          ) : (
            <></>
          )}
        </div> */}
      </Card>
    );
  }
}

export default Message;

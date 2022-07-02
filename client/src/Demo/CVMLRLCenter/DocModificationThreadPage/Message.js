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
    if (this.props.message.message) {
      const rawContentFromStore = convertFromRaw(
        JSON.parse(this.props.message.message)
      );
      initialEditorState = EditorState.createWithContent(rawContentFromStore);
      // console.log(initialEditorState);
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

  render() {
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
    const files_info = this.props.message.file.map((file) => (
      <>
        <div>{file.name}</div>
      </>
    ));
    return (
      <Card key={this.props.id}>
        <Card.Header>
          <Card.Title as="h5">
            {this.props.message.user_id.firstname}{" "}
            {this.props.message.user_id.lastname}
            {" on "}
            {new Date(this.props.message.createdAt).toLocaleTimeString()}
            {", "}
            {new Date(this.props.message.createdAt).toLocaleDateString()}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {/* {this.props.message.message} */}
          {/* {parse(convertToHTML(this.state.editorState.getCurrentContent()))} */}
          <Editor
            spellCheck={true}
            readOnly={true}
            toolbarHidden={true}
            editorState={this.state.editorState}
            onEditorStateChange={this.handleEditorChange}
          />
          {files_info}
        </Card.Body>
      </Card>
    );
  }
}

export default Message;

import React, { Component } from "react";
import {
  Card,
  Spinner,
  Collapse,
  Button,
} from "react-bootstrap";
import { RiMoreFill } from "react-icons/ri";
import { convertFromRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./../../../components/DraftEditor.css";

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
        <div>{file._id}</div>
        <div>{file.name}</div>
        <Button
          size="sm"
          onClick={(e) =>
            this.props.onDownloadFileInMessage(
              e,
              this.props.message._id,
              file._id
            )
          }
        ></Button>
      </>
    ));


    return (
      <Card border="primary" key={this.props.id}>
        <Card.Header
          onClick={() => this.props.singleExpandtHandler(this.props.idx)}
        >
          <Card.Title
            as="h5"
            aria-controls={"accordion" + this.props.idx}
            aria-expanded={
              this.props.accordionKeys[this.props.idx] === this.props.idx
            }
          >
            {this.props.message.user_id.firstname}{" "}
            {this.props.message.user_id.lastname}
            {" on "}
            {new Date(this.props.message.createdAt).toLocaleTimeString()}
            {", "}
            {new Date(this.props.message.createdAt).toLocaleDateString()}
          </Card.Title>
          <RiMoreFill />
          {/* <Dropdown >
            <FiMoreHorizontal />
            <Dropdown.Toggle
              split
              variant="secondary"
              id="dropdown-split-basic-2"
            />
            <Dropdown.Menu>
              <Dropdown.Item hred="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item hred="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item hred="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
        </Card.Header>
        <Collapse
          in={this.props.accordionKeys[this.props.idx] === this.props.idx}
        >
          <Card.Body>
            <Editor
              spellCheck={true}
              readOnly={true}
              toolbarHidden={true}
              editorState={this.state.editorState}
              onEditorStateChange={this.handleEditorChange}
            />
            {files_info}
          </Card.Body>
        </Collapse>
      </Card>
    );
  }
}

export default Message;

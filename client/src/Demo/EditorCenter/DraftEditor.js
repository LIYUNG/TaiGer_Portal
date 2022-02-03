import React, { useState, useEffect } from "react";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import parse from "html-react-parser";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./DraftEditor.css";
import {
  Row,
  Col,
  Button,
  Card,
  Collapse,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
// See: https://blog.logrocket.com/building-rich-text-editors-in-react-using-draft-js-and-react-draft-wysiwyg/
// const DraftEditor = (props) => {
class DraftEditor extends React.Component {
  state = {
    isLoaded: false,
    convertedContent: null,
    editorState: null,
    student: this.props.student,
    filetype: this.props.filetype,
    ConvertedContent: "",
    whoupdate: "",
  };
  componentDidMount() {
    // 常見用法（別忘了比較 prop）：
    console.log("is update");
    console.log(this.props.isLoaded);
    console.log(this.props.defaultComments);
    var initialEditorState = null;
    if (this.props.defaultComments) {
      const rawContentFromStore = convertFromRaw(
        JSON.parse(this.props.defaultComments)
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
  componentDidUpdate(prevProps) {
    // 常見用法（別忘了比較 prop）：
    if (
      this.props.isLoaded !== this.state.isLoaded ||
      prevProps.defaultComments !== this.props.defaultComments ||
      prevProps.defaultComments !== this.props.defaultComments ||
      prevProps.whoupdate !== this.props.whoupdate
    ) {
      console.log("is update");
      console.log(this.props.whoupdate);
      console.log(this.props.isLoaded);
      console.log(this.props.defaultComments);
      var initialEditorState = null;
      if (this.isJson(this.props.defaultComments)) {
        const rawContentFromStore = convertFromRaw(
          JSON.parse(this.props.defaultComments)
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
        whoupdate: this.props.whoupdate,
      }));
    }
  }
  isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  handleEditorChange = (newstate) => {
    this.setState((state) => ({ ...state, editorState: newstate }));
    // this.convertContentToHTML();
  };

  onClick3 = (e) => {
    var initialEditorState = null;
    if (this.isJson(this.props.defaultComments)) {
      const rawContentFromStore = convertFromRaw(
        JSON.parse(this.props.defaultComments)
      );
      initialEditorState = EditorState.createWithContent(rawContentFromStore);
      console.log(initialEditorState);
    } else {
      initialEditorState = EditorState.createEmpty();
    }
    this.setState((state) => ({
      ...state,
      editorState: initialEditorState,
    }));
    this.props.onClick3();
  };
  render() {
    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    const json = '{"result":true, "count":42}';
    if (this.props.error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    if (!this.state.isLoaded) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
console.log(this.state.whoupdate);
    return (
      <Modal
        size="xl"
        show={this.props.show}
        onHide={this.props.onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {this.props.docName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <header className="App-header">Rich Text Editor Example</header> */}
          {this.props.role === this.state.whoupdate ? (
            <Editor
              editorState={this.state.editorState}
              onEditorStateChange={this.handleEditorChange}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
            />
          ) : (
            <>
              {parse(convertToHTML(this.state.editorState.getCurrentContent()))}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {this.props.filetype === "General" ? (
            <Button
              // disabled={!isLoaded}
              onClick={() =>
                this.props.onClick1(
                  JSON.stringify(
                    convertToRaw(this.state.editorState.getCurrentContent())
                  )
                )
              }
            >
              Yes
            </Button>
          ) : (
            <Button
              // disabled={!isLoaded}
              onClick={() =>
                this.props.onClick2(
                  JSON.stringify(
                    convertToRaw(this.state.editorState.getCurrentContent())
                  )
                )
              }
            >
              Yes
            </Button>
          )}

          <Button onClick={(e) => this.onClick3(e)}>No</Button>
          {/* {!isLoaded && (
          <div style={style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )} */}
        </Modal.Footer>
      </Modal>
    );
  }
}
export default DraftEditor;

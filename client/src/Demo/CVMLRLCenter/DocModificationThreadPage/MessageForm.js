import React from "react";
import Card from "../../../App/components/MainCard";
import { Form, Button } from "react-bootstrap";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import parse from "html-react-parser";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./DraftEditor.css";

import TextEditor from "./TextEditor";

class MessageForm extends React.Component {
  state = {
    Titel_: this.props.title || "",
    Content_: this.props.content || "",
    text: "",
  };

  handleTitleChange = (e) => {
    this.setState({ Titel_: e.target.value });
  };

  handleContentChange = (e) => {
    this.setState({ Content_: e.target.value });
  };

  handleChange = (value) => {
    this.setState({ text: value });
  };

  handleSubmit = () => {
    this.props.onFormSubmit({
      _id: this.props.id,
      LastUpdate_: Date(),
      Category_: this.props.category,
      Titel_: this.state.Titel_,
      Content_: this.state.Content_,
    });
  };

  render() {
    const submitText = this.props.id ? "Update" : "Create";

    return (
      <Form>
        <Card>
          <Editor
            editorState={this.state.editorState}
            onEditorStateChange={this.handleEditorChange}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
          />
          <Button
          // disabled={!isLoaded}
          // onClick={() =>
          //   this.props.onClick1(
          //     JSON.stringify(
          //       convertToRaw(this.state.editorState.getCurrentContent())
          //     )
          //   )
          // }
          >
            Yes
          </Button>
          {/* <Button onClick={this.handleSubmit}>{submitText}</Button> */}
          <Button onClick={this.props.onFormClose}>Cancel</Button>
        </Card>
      </Form>
    );
  }
}

export default MessageForm;

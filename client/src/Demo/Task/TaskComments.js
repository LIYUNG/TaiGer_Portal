import React, { Component } from "react";
import Card from "../../App/components/MainCard";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class TaskComments extends Component {
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
    return (
      <Card title={this.props.title} key={this.props.id}>
        <Editor
          spellCheck={true}
          readOnly={true}
          toolbarHidden={true}
          editorState={this.state.editorState}
          onEditorStateChange={this.handleEditorChange}
        />
        <div>
          <p>Last Update: {this.props.lastupdate}</p>
        </div>
      </Card>
    );
  }
}

export default TaskComments;

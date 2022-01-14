import React from "react";
import Card from "../../App/components/MainCard";
import { Form, Button } from "react-bootstrap";
// import ReactQuill from 'react-quill'; // ES6
import TextEditor from "./TextEditor";

class ArticleForm extends React.Component {
  state = {
    Titel_: this.props.title || "",
    Content_: this.props.content || "",
    text:""
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
          {/* <Form.Group className="mb-3">
            <Form.Control
              type="test"
              onChange={this.handleTitleChange}
              defaultValue={this.props.title}
              placeholder="Title"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows="10"
              onChange={this.handleContentChange}
              defaultValue={this.props.content}
              placeholder="Content"
            />
          </Form.Group> */}
          {/* <TextEditor defaultContent={this.props.content} /> */}
          <TextEditor defaultContent="" />
          <Button onClick={this.handleSubmit}>{submitText}</Button>
          <Button onClick={this.props.onFormClose}>Cancel</Button>
        </Card>
      </Form>
    );
  }
}

export default ArticleForm;

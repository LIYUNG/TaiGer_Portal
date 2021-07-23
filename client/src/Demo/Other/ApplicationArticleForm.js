import React from "react";
import Card from "../../App/components/MainCard";
import { Form, Button } from "react-bootstrap";

class ApplicationArticleForm extends React.Component {
  state = {
    Titel_: this.props.title || "",
    Content_: this.props.content || "",
  };

  handleTitleChange = (e) => {
    this.setState({ Titel_: e.target.value });
  };

  handleContentChange = (e) => {
    this.setState({ Content_: e.target.value });
  };

  handleSubmit = () => {
    this.props.onFormSubmit({
      _id: this.props.id,
      LastUpdate_: Date(),
      Category_: "Application",
      Titel_: this.state.Titel_,
      Content_: this.state.Content_,
    });
  };

  render() {
    const submitText = this.props.id ? "Update" : "Create";
    return (
      <Form>
        <Card>
          <Form.Group className="mb-3">
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
          </Form.Group>
          <Button onClick={this.handleSubmit}>{submitText}</Button>
          <Button onClick={this.props.onFormClose}>Cancel</Button>
        </Card>
      </Form>
    );
  }
}

export default ApplicationArticleForm;

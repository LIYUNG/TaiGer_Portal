import React from "react";
import { Form, Button } from "react-bootstrap";

class ArticleForm extends React.Component {
  state = {
    FileName: "",
    text: "",
  };

  handleContentChange = (e) => {
    this.setState({ FileName: e.target.value });
  };

  handleChange = (value) => {
    this.setState({ text: value });
  };

  handleSubmit = () => {
    this.props.onFormSubmit(
      this.props.student._id,
      this.props.application.programId._id,
      this.state.FileName
    );
  };

  render() {
    console.log(this.props.student);
    const submitText = this.props.student._id ? "Update" : "Create";

    return (
      <>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows="1"
            onChange={this.handleContentChange}
            defaultValue={this.state.FileName}
            placeholder="Content"
          />
        </Form.Group>
        <Button onClick={this.handleSubmit}>{submitText}</Button>
        <Button onClick={this.props.onFormClose}>Cancel</Button>
      </>
    );
  }
}

export default ArticleForm;

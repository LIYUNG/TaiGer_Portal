import React from "react";
import Card from "../../App/components/MainCard";
import uuid from "react-uuid";

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
      <Card title={this.props.title}>
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>Title</label>
              <input
                type="text"
                defaultValue={this.props.title}
                onChange={this.handleTitleChange}
              />
            </div>
            <div className="field">
              <label>Content</label>
              <input
                type="text"
                defaultValue={this.props.content}
                onChange={this.handleContentChange}
              />
            </div>
            <div className="ui two bottom attached buttons">
              <button
                className="ui basic blue button"
                onClick={this.handleSubmit}
              >
                {submitText}
              </button>
              <button
                className="ui basic red button"
                onClick={this.props.onFormClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Card>
      // <div className="ui centered card">
      //   <div className="content">
      //     <div className="ui form">
      //       <div className="field">
      //         <label>Title</label>
      //         <input type="text" defaultValue={this.props.title} />
      //       </div>
      //       <div className="field">
      //         <label>Project</label>
      //         <input type="text" defaultValue={this.props.project} />
      //       </div>
      //       <div className="ui two bottom attached buttons">
      //         <button className="ui basic blue button">{submitText}</button>
      //         <button className="ui basic red button">Cancel</button>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
  }
}

export default ApplicationArticleForm;

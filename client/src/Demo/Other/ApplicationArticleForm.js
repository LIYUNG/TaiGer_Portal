import React from "react";
import Card from "../../App/components/MainCard";

class ApplicationArticleForm extends React.Component {
  state = {
    Titel_: this.props.Titel_ || "",
    Content_: this.props.Content_ || "",
  };

  handleTitleChange = (e) => {
    this.setState({ Titel_: e.target.value });
  };

  handleProjectChange = (e) => {
    this.setState({ Content_: e.target.value });
  };

  handleSubmit = () => {
    this.props.onFormSubmit({
      id: this.props.id,
      Titel_: this.state.Titel_,
      Content_: this.state.Content_,
    });
  };

  render() {
    const submitText = this.props.title ? "Update" : "Create";
    return (
      <Card title={this.props.title} isOption>
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
              <label>Project</label>
              <input
                type="text"
                defaultValue={this.props.project}
                onChange={this.handleProjectChange}
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

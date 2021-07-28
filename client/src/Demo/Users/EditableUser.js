import React from "react";
import UserForm from "./UserForm";
import User from "./User";

class EditableUser extends React.Component {
  state = {
    editFormOpen: false,
  };

  handleFormClose = () => {
    this.closeForm();
  };

  handleEditClick = () => {
    this.openForm();
  };

  handleSubmit = (program) => {
    this.props.onFormSubmit(program);
    this.closeForm();
  };

  closeForm = () => {
    this.setState({ editFormOpen: false });
  };
  openForm = () => {
    this.setState({ editFormOpen: true });
  };

  render() {
    if (this.state.editFormOpen) {
      return (
        <UserForm
          user={this.props.user}
          header={this.props.header}
          onFormSubmit={this.handleSubmit}
          RemoveProgramHandler3={this.props.RemoveProgramHandler3}
          handleFormClose={this.handleFormClose}
          openForm={this.openForm}
          setModalShow={this.props.setModalShow}
          role={this.props.role}
        />
      );
    } else {
      return (
        <User
          user={this.props.user}
          header={this.props.header}
          onFormSubmit={this.props.onFormSubmit}
          RemoveProgramHandler3={this.props.RemoveProgramHandler3}
          onEditClick={this.handleEditClick}
          setModalShow={this.props.setModalShow}
          role={this.props.role}
        />
      );
    }
  }
}

export default EditableUser;

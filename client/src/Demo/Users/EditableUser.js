import React from "react";
import UserForm from "./UserForm";
import User from "./User";
import { deleteUser, updateUser, changeUserRole } from "../../api";

class EditableUser extends React.Component {
  state = {
    editFormOpen: false,
    user: this.props.user,
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
          user={this.state.user}
          header={this.props.header}
          onFormSubmit={this.handleSubmit}
          RemoveProgramHandler3={this.props.RemoveProgramHandler3}
          handleFormClose={this.handleFormClose}
          openForm={this.openForm}
          setModalShow={this.props.setModalShow}
          success={this.props.success}
        />
      );
    } else {
      return (
        <User
          user={this.state.user}
          header={this.props.header}
          onFormSubmit={this.props.onFormSubmit}
          setModalShowDelete={this.props.setModalShowDelete}
          RemoveProgramHandler3={this.props.RemoveProgramHandler3}
          onEditClick={this.handleEditClick}
          setModalShow={this.props.setModalShow}
          success={this.props.success}
        />
      );
    }
  }
}

export default EditableUser;

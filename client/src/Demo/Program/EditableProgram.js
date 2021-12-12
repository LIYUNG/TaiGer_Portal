import React from "react";
import ProgramForm from "./ProgramForm";
import Program from "./Program";

class EditableProgram extends React.Component {
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
        <ProgramForm
          program={this.props.program}
          header={this.props.header}
          onFormSubmit={this.handleSubmit}
          handleFormClose={this.handleFormClose}
          openForm={this.openForm}
          setModalShow={this.props.setModalShow}
          success={this.props.success}
        />
      );
    } else {
      return (
        <Program
          program={this.props.program}
          role={this.props.role}
          userId={this.props.userId}
          header={this.props.header}
          onFormSubmit={this.props.onFormSubmit}
          setModalShowDelete={this.props.setModalShowDelete}
          RemoveProgramHandler3={this.props.RemoveProgramHandler3}
          onEditClick={this.handleEditClick}
          onSubmit3={this.props.onSubmit3}
          setModalShow={this.props.setModalShow}
          success={this.props.success}
        />
      );
    }
  }
}

export default EditableProgram;

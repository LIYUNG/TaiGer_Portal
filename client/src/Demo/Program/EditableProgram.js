import React from "react";
import { Table, Form } from "react-bootstrap";
import {
  Button,
  // OverlayTrigger,
  // Tooltip,
  // ButtonToolbar,
  Dropdown,
  DropdownButton,
  // SplitButton
} from "react-bootstrap";
import UcFirst from "../../App/components/UcFirst";
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
          RemoveProgramHandler3={this.props.RemoveProgramHandler3}
          handleFormClose={this.handleFormClose}
          openForm={this.openForm}
          setModalShow={this.props.setModalShow}
          role={this.props.role}
        />
      );
    } else {
      return (
        <Program
          program={this.props.program}
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

export default EditableProgram;

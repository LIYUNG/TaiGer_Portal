import React from "react";
import ProgramForm from "./ProgramForm";
import Program from "./Program";

class EditableProgram extends React.Component {
  render() {
    
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

export default EditableProgram;

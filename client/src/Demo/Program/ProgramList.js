import React from "react";
import {
  Table,
  Row,
  Col,
  Card,
  ButtonToolbar,
} from "react-bootstrap";

import ProgramListSubpage from "./ProgramListSubpage";
import EditableProgram from "./EditableProgram";
import NewProgramWindow from "./NewProgramWindow";
import ProgramDeleteWarning from "./ProgramDeleteWarning";

class Programlist extends React.Component {
  state = {
    modalShow: false,
    uni_name: "",
    program_name: "",
    program_id: "",

    modalShowNewProgram: false,

    deleteProgramWarning: false,
  };

  handleChange2 = (e) => {
    const { value } = e.target;
    // console.log("std_id " + value)
    console.log("program_id " + this.state.program_id);
    console.log("student_id " + value);
    this.setState((state) => ({
      StudentId: value,
    }));
  };

  onSubmit2 = (e) => {
    e.preventDefault();
    const program_id = this.state.program_id;
    const student_id = this.state.StudentId;
    console.log("before submit");
    console.log("program_id " + this.state.program_id);
    console.log("student_id " + this.state.StudentId);
    this.props.assignProgram({ student_id, program_id });
    console.log("click assign");
    this.setState({
      modalShow: false,
    });
  };

  setModalShow = (uni_name, program_name, programID) => {
    this.setState({
      modalShow: true,
      uni_name: uni_name,
      program_name: program_name,
      program_id: programID,
    });
  };

  setModalHide = () => {
    this.setState({
      modalShow: false,
    });
  };

  setModalShowDelete = (uni_name, program_name, programID) => {
    this.setState({
      deleteProgramWarning: true,
      uni_name: uni_name,
      program_name: program_name,
      program_id: programID,
    });
  };

  setModalHideDDelete = () => {
    this.setState({
      deleteProgramWarning: false,
    });
  };

  NewProgram = () => {
    console.log("click NewProgram");
    this.setState({
      modalShowNewProgram: true,
    });
  };

  onSubmitNewProgram = (newProgramData) => {
    this.props.submitNewProgram(newProgramData);
    this.setModalHide2();
  };

  setModalHide2 = () => {
    this.setState({
      modalShowNewProgram: false,
    });
  };

  render() {
    const headers = (
      <tr>
        <th> </th>
        {this.props.header.map((x, i) => (
          <th key={i}>{x.name}</th>
        ))}
      </tr>
    );

    const programs = this.props.data.map((program) => (
      <EditableProgram
        key={program._id}
        program={program}
        header={this.props.header}
        // handleChange={this.props.handleChange}
        onFormSubmit={this.props.onFormSubmit}
        setModalShowDelete={this.setModalShowDelete}
        RemoveProgramHandler3={this.props.RemoveProgramHandler3}
        setModalShow={this.setModalShow}
        role={this.props.role}
      />
    ));

    if (this.state.modalShow) {
      return (
        <>
          <Row>
            <Col>
              <Card.Title as="h4">Program List</Card.Title>
            </Col>
            <Col>
              <ButtonToolbar className="float-right">
                {this.props.role === "Student" ? (
                  <></>
                ) : (
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={() => this.NewProgram()}
                  >
                    New Program
                  </button>
                )}
              </ButtonToolbar>
            </Col>
          </Row>
          <Table responsive>
            <thead>{headers}</thead>
            <tbody>{programs}</tbody>
          </Table>
          <ProgramListSubpage
            show={this.state.modalShow}
            setModalHide={this.setModalHide}
            uni_name={this.state.uni_name}
            program_name={this.state.program_name}
            handleChange2={this.handleChange2}
            onSubmit2={this.onSubmit2}
          />
        </>
      );
    } else if (this.state.modalShowNewProgram) {
      return (
        <>
          <Row>
            <Col>
              <Card.Title as="h4">Program List</Card.Title>
            </Col>
            <Col>
              <ButtonToolbar className="float-right">
                {this.props.role === "Student" ? (
                  <></>
                ) : (
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={() => this.NewProgram()}
                  >
                    New Program
                  </button>
                )}
              </ButtonToolbar>
            </Col>
          </Row>
          <Table responsive>
            <thead>{headers}</thead>
            <tbody>{programs}</tbody>
          </Table>
          <NewProgramWindow
            show={this.state.modalShowNewProgram}
            setModalHide2={this.setModalHide2}
            submitNewProgram={this.onSubmitNewProgram}
            header={window.NewProgramHeader}
          />
        </>
      );
    } else if (this.state.deleteProgramWarning) {
      return (
        <>
          <Row>
            <Col>
              <Card.Title as="h4">Program List</Card.Title>
            </Col>
            <Col>
              <ButtonToolbar className="float-right">
                {this.props.role === "Student" ? (
                  <></>
                ) : (
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={() => this.NewProgram()}
                  >
                    New Program
                  </button>
                )}
              </ButtonToolbar>
            </Col>
          </Row>
          <Table responsive>
            <thead>{headers}</thead>
            <tbody>{programs}</tbody>
          </Table>
          <ProgramDeleteWarning
            deleteProgramWarning={this.state.deleteProgramWarning}
            setModalHideDDelete={this.setModalHideDDelete}
            program_id={this.state.program_id}
            program_name={this.state.program_name}
            uni_name={this.state.uni_name}
            RemoveProgramHandler3={this.props.RemoveProgramHandler3}
          />
        </>
      );
    } else {
      return (
        <>
          <Row>
            <Col>
              <Card.Title as="h4">Program List</Card.Title>
            </Col>
            <Col>
              <ButtonToolbar className="float-right">
                {this.props.role === "Student" ? (
                  <></>
                ) : (
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={() => this.NewProgram()}
                  >
                    New Program
                  </button>
                )}
              </ButtonToolbar>
            </Col>
          </Row>
          <Table responsive>
            <thead>{headers}</thead>
            <tbody>{programs}</tbody>
          </Table>
        </>
      );
    }
  }
}

export default Programlist;

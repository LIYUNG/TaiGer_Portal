import React from "react";
import { Button, Table, Row, Col, ButtonToolbar } from "react-bootstrap";
import Card from "../../App/components/MainCard";

import ProgramListSubpage from "./ProgramListSubpage";
import EditableProgram from "./EditableProgram";
import NewProgramWindow from "./NewProgramWindow";
import ProgramDeleteWarning from "./ProgramDeleteWarning";
import ProgramAddedMyWatchList from "./ProgramAddedMyWatchList";

class Programlist extends React.Component {
  state = {
    modalShow: false,
    uni_name: "",
    program_name: "",
    program_id: "",
    modalShowNewProgram: false,
    modalShowNAddMyWatchList: false,
    deleteProgramWarning: false,
    StudentId: "",
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

  onSubmit3 = (e, UserId, program_id, uni_name, program_name) => {
    // e.preventDefault();
    const student_id = UserId;
    console.log("before submit");
    console.log("program_id " + this.state.program_id);
    console.log("UserId " + UserId);
    this.props.assignProgram({ student_id, program_id });
    console.log("click assign");
    this.setState({
      modalShowNAddMyWatchList: true,
      uni_name: uni_name,
      program_name: program_name,
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

  setModalShow_AddToMyWatchList = () => {
    this.setState({
      modalShowNAddMyWatchList: true,
    });
  };
  setModalHide_AddToMyWatchList = () => {
    this.setState({
      modalShowNAddMyWatchList: false,
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
        role={this.props.role}
        userId={this.props.userId}
        program={program}
        header={this.props.header}
        onFormSubmit={this.props.onFormSubmit}
        setModalShowDelete={this.setModalShowDelete}
        RemoveProgramHandler3={this.props.RemoveProgramHandler3}
        onSubmit3={this.onSubmit3}
        setModalShow={this.setModalShow}
        success={this.props.success}
      />
    ));
    return (
      <>
        <Row>
          <Col>
            <ButtonToolbar className="float-right">
              {this.props.role === "Student" ? (
                <></>
              ) : (
                <Button
                  className="btn btn-primary"
                  type="submit"
                  size="sm"
                  onClick={() => this.NewProgram()}
                >
                  New Program
                </Button>
              )}
            </ButtonToolbar>
          </Col>
        </Row>
        <Card title={"Program List"}>
          <Table responsive>
            <thead>{headers}</thead>
            <tbody>{programs}</tbody>
          </Table>
          <ProgramListSubpage
            userId={this.props.userId}
            show={this.state.modalShow}
            setModalHide={this.setModalHide}
            uni_name={this.state.uni_name}
            program_name={this.state.program_name}
            handleChange2={this.handleChange2}
            onSubmit2={this.onSubmit2}
          />
          <NewProgramWindow
            show={this.state.modalShowNewProgram}
            setModalHide2={this.setModalHide2}
            submitNewProgram={this.onSubmitNewProgram}
            header={window.NewProgramHeader}
          />
          <ProgramDeleteWarning
            deleteProgramWarning={this.state.deleteProgramWarning}
            setModalHideDDelete={this.setModalHideDDelete}
            program_id={this.state.program_id}
            program_name={this.state.program_name}
            uni_name={this.state.uni_name}
            RemoveProgramHandler3={this.props.RemoveProgramHandler3}
          />
          <ProgramAddedMyWatchList
            setModalHide_AddToMyWatchList={this.setModalHide_AddToMyWatchList}
            modalShowNAddMyWatchList={this.state.modalShowNAddMyWatchList}
            program_id={this.state.program_id}
            program_name={this.state.program_name}
            uni_name={this.state.uni_name}
            setModalShow_AddToMyWatchList={this.setModalShow_AddToMyWatchList}
          />
        </Card>
      </>
    );
  }
}

export default Programlist;

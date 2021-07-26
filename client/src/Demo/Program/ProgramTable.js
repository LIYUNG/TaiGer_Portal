import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import {
  // OverlayTrigger,
  // Tooltip,
  ButtonToolbar,
  // Dropdown,
  // DropdownButton,
  // SplitButton
} from "react-bootstrap";
import Aux from "../../hoc/_Aux";
import Programlist from "./ProgramList";
import NewProgramWindow from "./NewProgramWindow";

import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  assignProgramToStudent,
} from "../../api";

class ProgramTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      role: "",
      isLoaded: false,
      editIdx: -1,
      modalShow: false,
      modalShowNewProgram: false,
      Uni: "",
      Program: "",
      ProgramId: "",
      StudentId: "",
      newProgramData: [],
      data: [],
    };
  }

  componentDidMount() {
    getPrograms().then(
      (resp) => {
        const { data, role } = resp.data;
        this.setState({ isLoaded: true, data, role });
      },
      (error) => this.setState({ isLoaded: true, error })
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      getPrograms().then(
        (resp) => {
          const { data } = resp.data;
          this.setState({ isLoaded: true, data });
        },
        (error) => this.setState({ isLoaded: true, error })
      );
    }
  }

  deleteProgram = (program_id) => {
    deleteProgram(program_id).then(
      (resp) => {},
      (error) => {}
    );
  };

  editProgram = (edited_program) => {
    updateProgram(edited_program).then(
      (resp) => {},
      (error) => {}
    );
  };

  addProgram = (new_program) => {
    createProgram(new_program).then(
      (resp) => {},
      (error) => {}
    );
  };

  handleRemove = (i) => {
    this.setState((state) => ({
      data: state.data.filter((row, j) => j !== i),
    }));
  };

  startEditing = (i, program_id) => {
    this.setState({
      editIdx: i,
    });
  };

  stopEditing = (edited_program) => {
    this.editProgram(edited_program);
    this.setState({
      editIdx: -1,
      isLoaded: false,
    });
  };

  cancelEditing = () => {
    console.log("cancel edit");
    this.setState({
      editIdx: -1,
      // isLoaded: false
    });
  };

  handleSave = (i, x) => {
    this.setState((state) => ({
      data: this.state.data.map((row, j) => (j === i ? x : row)),
    }));
    this.stopEditing();
  };

  handleChange = (e, name, i) => {
    const { value } = e.target;
    this.setState((state) => ({
      data: this.state.data.map((row, j) =>
        j === i ? { ...row, [name]: value } : row
      ),
    }));
    // this.cancelEditing();
  };

  handleChangeNewProgram = (e, name, i) => {
    const { value } = e.target;
    this.setState((prevState) => ({
      newProgramData: {
        ...prevState.newProgramData,
        [name]: value,
      },
    }));
  };

  NewProgram = (new_program) => {
    console.log("click NewProgram");
    this.setState({
      modalShowNewProgram: true,
    });
  };

  submitNewProgram = () => {
    console.log(this.state.newProgramData);
    this.addProgram(this.state.newProgramData);
    this.setState({
      editIdx: -1,
      newProgramData: [],
      modalShowNewProgram: false,
      isLoaded: false,
    });
  };

  RemoveProgramHandler3 = (program_id) => {
    console.log("click delete");
    console.log("id = " + program_id);
    this.deleteProgram({ program_id });
    this.setState({
      isLoaded: false,
    });
  };
  validate = () => {
    let isError = false;
    const errors = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    };

    const { username, email } = this.state.values;

    if (username.length < 5) {
      isError = true;
      errors.username = "Username needs to be atleast 5 characters long";
    }

    if (email.indexOf("@") === -1) {
      isError = true;
      errors.email = "Requires valid email";
    }

    this.setState({
      errors,
    });

    return isError;
  };

  setModalShow = (uni_name, program_name, programID) => {
    this.setState({
      modalShow: true,
      Uni: uni_name,
      Program: program_name,
      ProgramId: programID,
    });
  };

  setModalHide = () => {
    this.setState({
      modalShow: false,
    });
  };

  setModalHide2 = () => {
    this.setState({
      modalShowNewProgram: false,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const err = this.validate();
    if (!err) {
      this.props.handleSave(this.props.i, this.state.values);
    }
  };

  assignProgram = (assign_data) => {
    assignProgramToStudent(assign_data).then(
      (resp) => {},
      (error) => {}
    );
  };

  handleChange2 = (e) => {
    const { value } = e.target;
    // console.log("std_id " + value)
    console.log("program_id " + this.state.ProgramId);
    console.log("student_id " + value);
    this.setState((state) => ({
      StudentId: value,
    }));
  };

  onSubmit2 = (e) => {
    e.preventDefault();
    const program_id = this.state.ProgramId;
    const student_id = this.state.StudentId;
    console.log("before submit");
    console.log("program_id " + this.state.ProgramId);
    console.log("student_id " + this.state.StudentId);
    this.assignProgram({ student_id, program_id });
    console.log("click assign");
    this.setModalHide();
  };

  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      //TODO: put error page component for timeout
      localStorage.removeItem("token");
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <Aux>
          <Row>
            <Col>
              <Card>
                {/* <Card.Header>

                                </Card.Header> */}
                <Card.Body>
                  <Row>
                    <Col>
                      <Card.Title as="h4">Program List</Card.Title>
                    </Col>
                    <Col>
                      <ButtonToolbar className="float-right">
                        {this.state.role === "Student" ? (
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
                  <Programlist
                    role={this.state.role}
                    ModalShow={this.state.modalShow}
                    ProgramID={this.state.ProgramId}
                    StudentId={this.state.StudentId}
                    Uni_Name={this.state.Uni}
                    Program_Name={this.state.Program}
                    setModalShow={this.setModalShow}
                    setModalHide={this.setModalHide}
                    handleRemove={this.handleRemove}
                    startEditing={this.startEditing}
                    editIdx={this.state.editIdx}
                    stopEditing={this.stopEditing}
                    handleChange={this.handleChange}
                    handleChange2={this.handleChange2}
                    data={this.state.data}
                    cancelEditing={this.cancelEditing}
                    RemoveProgramHandler3={this.RemoveProgramHandler3}
                    onSubmit2={this.onSubmit2}
                    header={window.ProgramlistHeader}
                  />
                  <NewProgramWindow
                    show={this.state.modalShowNewProgram}
                    setModalHide2={this.setModalHide2}
                    handleChangeNewProgram={this.handleChangeNewProgram}
                    submitNewProgram={this.submitNewProgram}
                    newProgramData={this.state.newProgramData}
                    header={window.NewProgramHeader}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Aux>
      );
    }
  }
}

export default ProgramTable;

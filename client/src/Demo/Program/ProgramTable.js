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
      modalShowNewProgram: false,
      Program: "",
      newProgramData: [],
      data: [],
    };
  }

  componentDidMount() {
    getPrograms().then(
      (resp) => {
        if (resp.status === 401) {
          return this.setState({ error: resp.status });
        }
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
      (error) => {
        console.log("deleteProgram error:" + error);
      }
    );
  };

  editProgram = (edited_program) => {
    updateProgram(edited_program).then(
      (resp) => {
        this.setState({
          isLoaded: false,
        });
      },
      (error) => {
        console.log("editProgram error:" + error);
      }
    );
  };

  addProgram = (new_program) => {
    console.log("enter addProgram");
    createProgram(new_program)
      .then(
        (result) => {
          console.log(JSON.stringify(result.data));
          this.setState({
            data: this.state.data.concat(result.data),
            isLoaded: false,
          });
        },
        (error) => {
          console.log("addProgram error:" + error);
        }
      );
  };

  onFormSubmit = (edited_program) => {
    this.editProgram(edited_program);
  };

  cancelEditing = () => {
    console.log("cancel edit");
    this.setState({
      // isLoaded: false
    });
  };

  handleSave = (i, x) => {
    this.setState((state) => ({
      data: this.state.data.map((row, j) => (j === i ? x : row)),
    }));
    this.onFormSubmit();
  };

  // handleChangeNewProgram = (e, name, i) => {
  //   const { value } = e.target;
  //   this.setState((prevState) => ({
  //     newProgramData: {
  //       ...prevState.newProgramData,
  //       [name]: value,
  //     },
  //   }));
  // };

  NewProgram = (new_program) => {
    console.log("click NewProgram");
    this.setState({
      modalShowNewProgram: true,
    });
  };

  submitNewProgram = (newProgramData) => {
    // console.log(this.state.newProgramData);
    this.addProgram(newProgramData);
  };

  RemoveProgramHandler3 = (program_id) => {
    console.log("click delete");
    console.log("id = " + program_id);
    this.setState({
      data: this.state.data.filter((data) => data._id !== program_id),
    });
    this.deleteProgram(program_id);
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
                  <Programlist
                    role={this.state.role}
                    onFormSubmit={this.onFormSubmit}
                    data={this.state.data}
                    cancelEditing={this.cancelEditing}
                    RemoveProgramHandler3={this.RemoveProgramHandler3}
                    assignProgram={this.assignProgram}
                    header={window.ProgramlistHeader}
                    submitNewProgram={this.submitNewProgram}
                    modalShowNewProgram={this.state.modalShowNewProgram}
                    setModalHide2={this.setModalHide2}
                  />
                  {/* <NewProgramWindow
                    show={this.state.modalShowNewProgram}
                    setModalHide2={this.setModalHide2}
                    handleChangeNewProgram={this.handleChangeNewProgram}
                    submitNewProgram={this.submitNewProgram}
                    newProgramData={this.state.newProgramData}
                    header={window.NewProgramHeader}
                  /> */}
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

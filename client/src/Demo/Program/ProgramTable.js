import React from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import Card from "../../App/components/MainCard";
import Aux from "../../hoc/_Aux";
import Programlist from "./ProgramList";

import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  assignProgramToStudent,
} from "../../api";

class ProgramTable extends React.Component {
  state = {
    error: null,
    role: "",
    isLoaded: false,
    data: null,
    success: false,
  };

  componentDidMount() {
    console.log("ProgramTable.js rendered");
    getPrograms().then(
      (resp) => {
        if (resp.status === 401) {
          return this.setState({ error: resp.status });
        }
        console.log(resp.data);
        const { data, success } = resp.data;
        this.setState({ isLoaded: true, data, success });
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
    // Upldate local program list
    this.setState({
      data: this.state.data.map((program) => {
        if (program._id === edited_program._id) {
          return Object.assign(program, edited_program);
        } else {
          return program;
        }
      }),
    });
    // Upload remote program list, without fetching data from remote again.
    updateProgram(edited_program).then(
      (resp) => {},
      (error) => {
        console.log("editProgram error:" + error);
      }
    );
  };

  addProgram = (new_program) => {
    console.log("enter addProgram");
    createProgram(new_program).then(
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

  assignProgram = (assign_data) => {
    const { student_id, program_id } = assign_data;
    assignProgramToStudent(student_id, program_id).then(
      (resp) => {
        console.log(resp.data);
      },
      (error) => {}
    );
  };

  render() {
    const { error, isLoaded } = this.state;
    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    if (!isLoaded && !this.state.data) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    return (
      <Aux>
        <Row>
          <Col>
            {this.props.user.role === "Guest" ? (
              <Card>This is for Premium only. Please contact our sales!</Card>
            ) : (
              <Programlist
                role={this.props.user.role}
                userId={this.props.user._id}
                success={this.state.success}
                onFormSubmit={this.onFormSubmit}
                data={this.state.data}
                RemoveProgramHandler3={this.RemoveProgramHandler3}
                assignProgram={this.assignProgram}
                header={window.ProgramlistHeader}
                submitNewProgram={this.submitNewProgram}
                modalShowNewProgram={this.state.modalShowNewProgram}
              />
            )}
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default ProgramTable;

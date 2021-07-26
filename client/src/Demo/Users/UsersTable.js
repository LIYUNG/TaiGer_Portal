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
import UsersList from "./UsersList";

class UsersTable extends React.Component {
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
    const auth = localStorage.getItem("token");
    fetch(window.users_list_API, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            data: result.data,
            role: result.role,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      const auth = localStorage.getItem("token");
      fetch(window.users_list_API, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + JSON.parse(auth),
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              data: result.data,
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        );
    }
  }

  deleteUser = (user_id) => {
    console.log("click user delete");
    console.log(user_id);
    const auth = localStorage.getItem("token");
    fetch(window.delete_user_API, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
      body: JSON.stringify(user_id),
    })
      .then((res) => res.json())
      .then(
        // (result) => {
        //     this.setState({
        //         isLoaded: false,
        //     });
        // },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          // this.setState({
          //     isLoaded: false,
          //     error
          // });
        }
      );
  };

  editProgram = (edited_program) => {
    console.log("click edit");
    console.log(edited_program);
    const auth = localStorage.getItem("token");
    fetch(window.edit_program_API + "/" + edited_program._id, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
      body: JSON.stringify(edited_program),
    })
      .then((res) => res.json())
      .then(
        // (result) => {
        //     this.setState({
        //         isLoaded: false,
        //     });
        // },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          // this.setState({
          //     isLoaded: false,
          //     error
          // });
        }
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
  };

  RemoveUserHandler3 = (user_id) => {
    console.log("click delete user");
    console.log("id = " + user_id);
    this.deleteUser({ user_id });
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

  assignUserAs = (assign_data) => {
    console.log("click assign Program");
    console.log(assign_data);
    const auth = localStorage.getItem("token");
    fetch(window.assign_program_API, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
      body: JSON.stringify(assign_data),
    })
      .then((res) => res.json())
      .then(
        // (result) => {
        //     this.setState({
        //         isLoaded: false,
        //     });
        // },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          // this.setState({
          //     isLoaded: false,
          //     error
          // });
        }
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
    this.assignUserAs({ student_id, program_id });
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
                      <Card.Title as="h4">Users List</Card.Title>
                    </Col>
                  </Row>
                  <UsersList
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
                    RemoveUserHandler3={this.RemoveUserHandler3}
                    onSubmit2={this.onSubmit2}
                    header={window.UserlistHeader}
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

export default UsersTable;

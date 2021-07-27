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

import { getUsers, deleteUser, updateUser } from "../../api";

class UsersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      selected_user_role: "",
      selected_user_id: "",
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
    getUsers().then(
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
      getUsers().then(
        (resp) => {
          const { data } = resp.data;
          this.setState({ isLoaded: true, data });
        },
        (error) => this.setState({ isLoaded: true, error })
      );
    }
  }

  deleteUser = (user_id) => {
    deleteUser(user_id).then(
      (resp) => {},
      (error) => {}
    );
  };

  editUser = (edited_user) => {
    updateUser(edited_user).then(
      (resp) => {
        this.setState({
          editIdx: -1,
          isLoaded: false,
        });
      },
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

  stopEditing = (edited_user) => {
    this.editUser(edited_user);
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
    this.deleteUser(user_id);
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

  setModalShow = (user_firstname, user_lastname, user_role, user_id) => {
    this.setState({
      modalShow: true,
      firstname: user_firstname,
      lastname: user_lastname,
      selected_user_role: user_role,
      selected_user_id: user_id,
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

  assignUserAs = (user_data) => {
    console.log("click assign user role");
    console.log(user_data);
    const auth = localStorage.getItem("token");
    fetch(window.update_user_role_API, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
      body: JSON.stringify(user_data),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: false,
          });
        },
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
    console.log("name  " + value);
    this.setState((state) => ({
      selected_user_role: value,
    }));
  };

  onSubmit2 = (e) => {
    e.preventDefault();
    const user_role = this.state.selected_user_role;
    const user_id = this.state.selected_user_id;
    console.log("before submit");
    console.log("selected_user_role " + this.state.selected_user_role);
    console.log("selected_user_id " + this.state.selected_user_id);
    this.assignUserAs({ user_role, user_id });
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
                    firstname={this.state.firstname}
                    lastname={this.state.lastname}
                    selected_user_role={this.state.selected_user_role}
                    selected_user_id={this.state.selected_user_id}
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

import React from "react";
import { Table } from "react-bootstrap";
import EditableUser from "./EditableUser";
import UsersListSubpage from "./UsersListSubpage";
import UserDeleteWarning from "./UserDeleteWarning";

class Userslist extends React.Component {
  state = {
    modalShow: false,
    firstname: "",
    lastname: "",
    selected_user_role: "",
    selected_user_id: "",

    modalShowNewProgram: false,

    deleteUserWarning: false,
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

  setModalHideDDelete = () => {
    this.setState({
      deleteUserWarning: false,
    });
  };

  setModalShowDelete = (user_firstname, user_lastname, user_id) => {
    this.setState({
      deleteUserWarning: true,
      firstname: user_firstname,
      lastname: user_lastname,
      selected_user_id: user_id,
    });
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
    this.props.assignUserAs({ role_: user_role, _id: user_id });
    console.log("click assign");
    this.setState({
      modalShow: false,
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
    const users = this.props.data.map((user) => (
      <EditableUser
        key={user._id}
        user={user}
        header={this.props.header}
        onFormSubmit={this.props.onFormSubmit}
        setModalShowDelete={this.setModalShowDelete}
        setModalShow={this.setModalShow}
        role={this.props.role}
      />
    ));
    if (this.props.role === "Agent" || this.props.role === "Admin") {
      return (
        <>
          <Table responsive>
            <thead>{headers}</thead>
            <tbody>{users}</tbody>
          </Table>
          <UsersListSubpage
            show={this.state.modalShow}
            setModalHide={this.setModalHide}
            firstname={this.state.firstname}
            lastname={this.state.lastname}
            selected_user_role={this.state.selected_user_role}
            selected_user_id={this.state.selected_user_id}
            handleChange2={this.handleChange2}
            onSubmit2={this.onSubmit2}
          />
          <UserDeleteWarning
            deleteUserWarning={this.state.deleteUserWarning}
            setModalHideDDelete={this.setModalHideDDelete}
            firstname={this.state.firstname}
            lastname={this.state.lastname}
            selected_user_id={this.state.selected_user_id}
            RemoveUserHandler3={this.props.RemoveUserHandler3}
          />
        </>
      );
    } else {
      return <></>;
    }
  }
}

export default Userslist;

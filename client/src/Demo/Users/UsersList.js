import React from "react";
import { Table } from "react-bootstrap";
import EditableUser from "./EditableUser";
import UsersListSubpage from "./UsersListSubpage";
import UserDeleteWarning from "./UserDeleteWarning";
import { deleteUser, updateUser, changeUserRole } from "../../api";

class Userslist extends React.Component {
  state = {
    modalShow: false,
    firstname: "",
    lastname: "",
    selected_user_role: "",
    selected_user_id: "",
    data: this.props.data,
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

  deleteUser = (user_id) => {
    // TODO: also delete files in file system
    var array = [...this.state.data];
    let idx = this.state.data.findIndex((user) => user._id === user_id);
    if (idx !== -1) {
      array.splice(idx, 1);
    }
    deleteUser(user_id).then(
      (resp) => {
        this.setState((state) => ({
          deleteUserWarning: false,
          data: array,
        }));
      },
      (error) => {
        console.log("error at deleteUser: " + deleteUser);
      }
    );
  };

  editUser = (edited_user) => {
    // update remote
    updateUser(edited_user).then(
      (resp) => {
        // update local
        this.setState({
          data: this.state.data.map((user) => {
            if (user._id === edited_user._id) {
              return Object.assign(user, edited_user);
            } else {
              return user;
            }
          }),
        });
      },
      (error) => {
        console.log("error at editUser: " + error);
      }
    );
  };

  onFormSubmit = (edited_user) => {
    this.editUser(edited_user);
  };

  assignUserAs = (user_data) => {
    console.log("click assign user role");
    changeUserRole(user_data._id, user_data.role)
      // .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            modalShow: false,
            data: this.state.data.map((user) => {
              if (user._id === user_data._id) {
                return Object.assign(user, user_data);
              } else {
                return user;
              }
            }),
          });
        },
        (error) => {
          console.log(" error at assignUserAs" + error);
        }
      );
  };

  onSubmit2 = (e) => {
    e.preventDefault();
    const user_role = this.state.selected_user_role;
    const user_id = this.state.selected_user_id;
    console.log("before submit");
    console.log("selected_user_role " + this.state.selected_user_role);
    console.log("selected_user_id " + this.state.selected_user_id);
    this.assignUserAs({ role: user_role, _id: user_id });
    console.log("click assign");
  };

  RemoveUserHandler3 = (user_id) => {
    console.log("click delete user");
    console.log("id = " + user_id);
    this.deleteUser(user_id);
  };

  render() {
    if (this.props.success) {
      const headers = (
        <tr>
          <th> </th>
          {this.props.header.map((x, i) => (
            <th key={i}>{x.name}</th>
          ))}
        </tr>
      );
      const users = this.state.data.map((user) => (
        <EditableUser
          key={user._id}
          user={user}
          header={this.props.header}
          onFormSubmit={this.onFormSubmit}
          setModalShowDelete={this.setModalShowDelete}
          setModalShow={this.setModalShow}
          success={this.props.success}
        />
      ));
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
            RemoveUserHandler3={this.RemoveUserHandler3}
          />
        </>
      );
    } else {
      return (
        <>
          <p>This is for Admin only.</p>
        </>
      );
    }
  }
}

export default Userslist;

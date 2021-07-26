import React from "react";
import { Table, Form } from "react-bootstrap";
import {
  Button,
  // OverlayTrigger,
  // Tooltip,
  // ButtonToolbar,
  Dropdown,
  DropdownButton,
  // SplitButton
} from "react-bootstrap";

import UcFirst from "../../App/components/UcFirst";
import UsersListSubpage from "./UsersListSubpage";

const row = (
  user,
  i,
  header,
  handleRemove,
  startEditing,
  editIdx,
  handleChange,
  stopEditing,
  RemoveUserHandler3,
  cancelEditing,
  setModalShow,
  role
) => {
  const currentlyEditing = editIdx === i;
    return (
      <tr key={user._id}>
        <th>
          {currentlyEditing ? (
            <div>
              <Button
                className="btn-square"
                variant="danger"
                onClick={() => stopEditing(user)}
              >
                <UcFirst text="Save" />
              </Button>
              <Button
                className="btn-square"
                variant="info"
                onClick={() => cancelEditing()}
              >
                <UcFirst text="Cancel" />
              </Button>
            </div>
          ) : (
            <DropdownButton
              size="sm"
              title="Option"
              variant="primary"
              id={`dropdown-variants-${user._id}`}
              key={user._id}
            >
              {/* TODO: email should not be editable */}
              <Dropdown.Item eventKey="1" onSelect={() => startEditing(i)}> 
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="2"
                onSelect={() => setModalShow(user.firstname_, user.lastname_, user.role_, user._id)}
              >
                Set User as...
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="3"
                onSelect={() => RemoveUserHandler3(user._id)}
              >
                Delete
              </Dropdown.Item>
            </DropdownButton>
          )}
        </th>
        {header.map((y, k) => (
          <td key={k}>
            {currentlyEditing ? (
              <Form>
                <Form.Group>
                  <Form.Control
                    type="text"
                    onChange={(e) => handleChange(e, y.prop, i)}
                    value={user[y.prop]}
                  />
                </Form.Group>
              </Form>
            ) : (
              user[y.prop]
            )}
          </td>
        ))}
      </tr>
    );
};

class Userslist extends React.Component {
  render() {
    if (this.props.role === "Agent" || this.props.role === "Admin") {
      return (
        <>
          <Table responsive>
            <thead>
              <tr>
                <th> </th>
                {this.props.header.map((x, i) => (
                  <th key={i}>{x.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.props.data.map((user, i) =>
                row(
                  user,
                  i,
                  this.props.header,
                  this.props.handleRemove,
                  this.props.startEditing,
                  this.props.editIdx,
                  this.props.handleChange,
                  this.props.stopEditing,
                  this.props.RemoveUserHandler3,
                  this.props.cancelEditing,
                  this.props.setModalShow,
                  this.props.role
                )
              )}
            </tbody>
          </Table>
          <UsersListSubpage
            show={this.props.ModalShow}
            setModalHide={this.props.setModalHide}
            firstname={this.props.firstname}
            lastname={this.props.lastname}
            selected_user_role={this.props.selected_user_role}
            selected_user_id={this.props.selected_user_id}
            handleChange2={this.props.handleChange2}
            onSubmit2={this.props.onSubmit2}
          />
        </>
      );
    } else {
      return (
        <>
        </>
      );
    }
  }
}

export default Userslist;

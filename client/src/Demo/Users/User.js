import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

class User extends React.Component {
  state = {
    program: this.props.program || "",
    Content_: this.props.content || "",
  };

  render() {
    if (
      this.props.role === "Agent" ||
      this.props.role === "Editor" ||
      this.props.role === "Admin"
    ) {
      return (
        <tr key={this.props.user._id}>
          <th>
            <DropdownButton
              size="sm"
              title="Option"
              variant="primary"
              id={`dropdown-variants-${this.props.user._id}`}
              key={this.props.user._id}
            >
              {/* TODO: email should not be editable */}
              <Dropdown.Item
                eventKey="1"
                onSelect={() => this.props.onEditClick(this.props.i)}
              >
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="2"
                onSelect={() =>
                  this.props.setModalShow(
                    this.props.user.firstname_,
                    this.props.user.lastname_,
                    this.props.user.role_,
                    this.props.user._id
                  )
                }
              >
                Set User as...
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="3"
                onSelect={() =>
                  // this.props.RemoveUserHandler3(this.props.user._id)
                  this.props.setModalShowDelete(
                    this.props.user.firstname_,
                    this.props.user.lastname_,
                    this.props.user._id,
                  )
                }
              >
                Delete
              </Dropdown.Item>
            </DropdownButton>
          </th>
          {this.props.header.map((y, k) => (
            <td key={k}>{this.props.user[y.prop]}</td>
          ))}
        </tr>
      );
    } else {
      return <></>;
    }
  }
}

export default User;

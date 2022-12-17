import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

class User extends React.Component {
  render() {
    if (this.props.success) {
      return (
        <tr key={this.props.user._id}>
          <th>
            {/* {this.props.user.role !== 'Admin' && ( */}
              <DropdownButton
                size="sm"
                title="Option"
                variant="primary"
                id={`dropdown-variants-${this.props.user._id}`}
                key={this.props.user._id}
              >
                <Dropdown.Item
                  eventKey="2"
                  onClick={() =>
                    this.props.setModalShow(
                      this.props.user.firstname,
                      this.props.user.lastname,
                      this.props.user.role,
                      this.props.user._id
                    )
                  }
                >
                  Set User as...
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onClick={() =>
                    this.props.setModalShowDelete(
                      this.props.user.firstname,
                      this.props.user.lastname,
                      this.props.user._id
                    )
                  }
                >
                  Delete
                </Dropdown.Item>
              </DropdownButton>
            {/* )} */}
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

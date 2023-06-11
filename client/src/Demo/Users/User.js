import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import { UserlistHeader, convertDate } from '../Utils/contants';
import { Link } from 'react-router-dom';
class User extends React.Component {
  render() {
    if (this.props.success) {
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
                eventKey="4"
                onClick={() =>
                  this.props.setModalArchiv(
                    this.props.user.firstname,
                    this.props.user.lastname,
                    this.props.user._id.toString(),
                    this.props.user.archiv
                  )
                }
              >
                {this.props.user.archiv === true ? 'Activate' : 'Archiv'}
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
          {UserlistHeader.map((y, k) => (
            <td key={k}>
              {typeof this.props.user[y.prop] == 'boolean' ? (
                this.props.user[y.prop] ? (
                  'Yes'
                ) : (
                  'No'
                )
              ) : this.props.user.role === 'Student' ? (
                <Link
                  className="text-info"
                  to={`/student-database/${this.props.user._id.toString()}/profile`}
                >
                  {this.props.user[y.prop]}
                </Link>
              ) : this.props.user.role === 'Agent' ? (
                <Link
                  className="text-info"
                  to={`/teams/agents/${this.props.user._id.toString()}`}
                >
                  {this.props.user[y.prop]}
                </Link>
              ) : this.props.user.role === 'Editor' ? (
                <Link
                  className="text-info"
                  to={`/teams/editors/${this.props.user._id.toString()}`}
                >
                  {this.props.user[y.prop]}
                </Link>
              ) : (
                this.props.user[y.prop]
              )}
            </td>
          ))}
          <td>{convertDate(this.props.user.lastLoginAt)}</td>
        </tr>
      );
    } else {
      return <></>;
    }
  }
}

export default User;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Dropdown, Button } from 'react-bootstrap';
import { Avatar } from '@mui/material';

import { stringAvatar } from '../../../../../Demo/Utils/contants';
import ChatList from './ChatList';
import Aux from '../../../../../hoc/_Aux';
import DEMO from '../../../../../store/constant';
import { AiOutlineMail } from 'react-icons/ai';
import { is_TaiGer_Student } from '../../../../../Demo/Utils/checking-functions';

class NavRight extends Component {
  state = {
    listOpen: false,
    dropdownShow: false
  };

  handleOnClick(e) {
    this.props.handleOnClickLogout(e);
  }

  handleOpenChat = (e) => {
    // e.preventDefaults();
    this.setState({ listOpen: true });
  };
  handleCloseChat = (e) => {
    // e.preventDefaults();
    this.setState({ listOpen: false });
  };

  handleClick = (path) => {
    history.push(path);
  };
  handleDropdownSelect = (eventKey) => {
    this.setState({ dropdownShow: false });
  };
  handleDropdownToggle = (isOpen) => {
    this.setState({ dropdownShow: isOpen });
  };
  render() {
    const user_name = `${this.props.userdata.firstname} ${this.props.userdata.lastname}`;
    return (
      <Aux>
        <Col>
          <ul className="navbar-nav ml-auto my-0 py-0">
            {is_TaiGer_Student(this.props.userdata) ? (
              <li>
                <Link
                  to={`/communications/${this.props.userdata._id.toString()}`}
                  className="dropdown-item"
                  onClick={() => this.setState({ dropdownShow: false })}
                >
                  <AiOutlineMail size={24} />
                </Link>
              </li>
            ) : (
              <li className="mail-icon" onClick={this.handleOpenChat}>
                <AiOutlineMail size={24} center />
              </li>
            )}
            <li className="py-0">
              <Dropdown
                alignRight
                className="drp-user"
                show={this.state.dropdownShow}
                onSelect={this.handleDropdownSelect}
                onToggle={this.handleDropdownToggle}
              >
                <Dropdown.Toggle variant="dafault" id="dropdown-basic">
                  <Row>
                    <Avatar
                      {...stringAvatar(user_name)}
                      className="mt-1 mx-2"
                      title={user_name}
                    />
                  </Row>
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight className="profile-notification">
                  <div className="pro-head">
                    <span>{user_name}</span>
                  </div>
                  <ul className="pro-body">
                    <li>
                      <Link
                        to={DEMO.PROFILE}
                        className="dropdown-item"
                        onClick={() => this.setState({ dropdownShow: false })}
                      >
                        <i className="feather icon-user" /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={DEMO.SETTINGS}
                        className="dropdown-item"
                        onClick={() => this.setState({ dropdownShow: false })}
                      >
                        <i
                          className="feather icon-settings"
                          href="#/action-2"
                        />{' '}
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Dropdown.Item onClick={(e) => this.handleOnClick(e)}>
                        <i className="feather icon-log-out" /> Log Out
                      </Dropdown.Item>
                    </li>
                  </ul>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        </Col>
        <ChatList
          listOpen={this.state.listOpen}
          handleCloseChat={this.handleCloseChat}
          user={this.props.userdata}
          closed={() => {
            this.setState({ listOpen: false });
          }}
        />
      </Aux>
    );
  }
}

export default NavRight;

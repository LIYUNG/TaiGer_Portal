import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Dropdown } from 'react-bootstrap';
import { Avatar } from '@mui/material';

import { stringAvatar } from '../../../../../Demo/Utils/contants';
import ChatList from './ChatList';
import Aux from '../../../../../hoc/_Aux';
import DEMO from '../../../../../store/constant';
import { AiOutlineCalendar, AiOutlineMail } from 'react-icons/ai';
import {
  is_TaiGer_AdminAgent,
  is_TaiGer_Agent,
  is_TaiGer_Student
} from '../../../../../Demo/Utils/checking-functions';
import { getMyCommunicationUnreadNumber } from '../../../../../api';
import { appConfig } from '../../../../../config';

class NavRight extends Component {
  state = {
    listOpen: false,
    dropdownShow: false,
    unreadCount: 0
  };

  componentDidMount() {
    // Start the periodic polling after the component is mounted
    if (is_TaiGer_AdminAgent(this.props.userdata)) {
      getMyCommunicationUnreadNumber()
        .then((resp) => {
          // Assuming the backend returns JSON data, update the state with the received data
          const { data } = resp;
          this.setState({ unreadCount: data.data });
        })
        .catch((error) => {
          // Handle errors, if any
          console.error('Error fetching data:', error);
          clearInterval(this.pollingInterval);
        });
    }
  }

  handleOnClick(e) {
    this.props.handleOnClickLogout(e);
  }

  handleOpenChat = (e) => {
    // e.preventDefaults();
    this.setState({ listOpen: true, unreadCount: 0 });
  };
  handleCloseChat = (e) => {
    // e.preventDefaults();
    this.setState({ listOpen: false, unreadCount: 0 });
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
            {/* <li className="mail-icon">
              <AiOutlineCalendar size={24} />
            </li> */}
            {appConfig.messengerEnable &&
              is_TaiGer_Student(this.props.userdata) && (
                <li>
                  <Link
                    to={`${DEMO.COMMUNICATIONS_LINK(
                      this.props.userdata._id.toString()
                    )}`}
                    className="dropdown-item"
                    onClick={() => this.setState({ dropdownShow: false })}
                  >
                    <AiOutlineMail size={28} />
                  </Link>
                </li>
              )}
            {appConfig.meetingEnable &&
              is_TaiGer_Agent(this.props.userdata) && (
                <li className="mail-icon">
                  <Link
                    to={`${
                      DEMO.EVENT_TAIGER_LINK
                    }/${this.props.userdata._id.toString()}`}
                    className="dropdown-item"
                  >
                    <AiOutlineCalendar size={28} />
                  </Link>
                </li>
              )}
            {appConfig.messengerEnable &&
              is_TaiGer_AdminAgent(this.props.userdata) && (
                <li className="mail-icon" onClick={this.handleOpenChat}>
                  <AiOutlineMail size={28} />
                  {this.state.unreadCount > 0 && (
                    <span className="mail-icon-container badge">
                      {this.state.unreadCount}
                    </span>
                  )}
                </li>
              )}
            <li className="py-0">
              <Dropdown
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
                <Dropdown.Menu className="profile-notification">
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
        {this.state.listOpen && (
          <ChatList
            listOpen={this.state.listOpen}
            handleCloseChat={this.handleCloseChat}
            user={this.props.userdata}
            closed={() => {
              this.setState({ listOpen: false });
            }}
          />
        )}
      </Aux>
    );
  }
}

export default NavRight;

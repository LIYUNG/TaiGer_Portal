import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Container,
  Col,
  Row,
  Button,
  DropdownButton,
  Dropdown
} from 'react-bootstrap';
import { Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import { stringAvatar } from '../../../../../Demo/Utils/contants';
// import ChatList from './ChatList';
import Aux from '../../../../../hoc/_Aux';
import DEMO from '../../../../../store/constant';

class NavRight extends Component {
  state = {
    listOpen: false
  };

  handleOnClick(e) {
    this.props.handleOnClickLogout(e);
  }

  render() {
    return (
      <Aux>
        <Container className="my-0 py-0 pb-0 mb-0">
          <Col>
            <ul className="navbar-nav ml-auto my-0 py-0">
              <li className={this.props.rtlLayout ? 'mr-0' : 'm-l-0'}>
                <Link to={DEMO.SETTINGS} style={{ textDecoration: 'none' }}>
                  <Row>
                    {this.props.userdata.firstname}{' '}
                    {this.props.userdata.lastname}{' '}
                    <Avatar
                      {...stringAvatar(
                        this.props.userdata.firstname +
                          ' ' +
                          this.props.userdata.lastname
                      )}
                      className="mt-3 mx-2"
                      title={
                        this.props.userdata.firstname +
                        ' ' +
                        this.props.userdata.lastname
                      }
                    />
                  </Row>
                </Link>
              </li>
              {/* <Button></Button> */}
              <li className="py-0">
                <Dropdown variant="default">
                  <Dropdown.Toggle variant="default" id="dropdown-basic">
                    {`${this.props.userdata.firstname} ${this.props.userdata.lastname}`}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Link to="/base-documents">
                      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    </Link>{' '}
                    <Link to="/settings">
                      <Dropdown.Item href="#/action-2">
                        My Settings
                      </Dropdown.Item>
                    </Link>
                    <Dropdown.Item onClick={(e) => this.handleOnClick(e)}>
                      Sign Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {/* <DropdownButton
                  variant="default"
                  size="sm"
                  id="dropdown-basic-button"
                  title={`${this.props.userdata.firstname} ${this.props.userdata.lastname}`}
                >
                  <NavLink to="/base-documents">
                    <Dropdown.Item size="sm">Base Documents</Dropdown.Item>
                  </NavLink>
                  <NavLink
                    to={'/settings'}
                    className="dud-logout"
                    style={{ textDecoration: 'none' }}
                  >
                    <Dropdown.Item>My Settings</Dropdown.Item>
                  </NavLink>
                  <NavLink
                    to={'/logout'}
                    className="dud-logout"
                    style={{ textDecoration: 'none' }}
                  >
                    <Dropdown.Item onClick={(e) => this.handleOnClick(e)}>
                      Sign Out
                    </Dropdown.Item>
                  </NavLink>
                </DropdownButton> */}
              </li>
              {/* <li className={this.props.rtlLayout ? 'm-r-15' : 'm-l-15'}>
                <a
                  // href={DEMO.BLANK_LINK}
                  // className="displayChatbox"
                  onClick={() => {
                    this.setState({ listOpen: true });
                  }}
                >
                  <i className="icon feather icon-mail" /> Messages
                </a>
              </li> */}
              {/* <li>
                <Row>
                  <Link
                    to={'/settings'}
                    // onClick={(e) => this.handleOnClick(e)}
                    className="dud-logout"
                    style={{ textDecoration: 'none' }}
                  >
                    ettings
                  </Link>
                </Row>
              </li> */}
            </ul>
          </Col>
        </Container>
      </Aux>
    );
  }
}

export default NavRight;

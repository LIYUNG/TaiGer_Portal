import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Container, Col, Row } from 'react-bootstrap';
import { Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  stringAvatar
} from '../../../../../Demo/Utils/contants';
import ChatList from './ChatList';
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
        {/* <Container> */}
        <Col>
          <ul className="navbar-nav ml-auto">
            <li className={this.props.rtlLayout ? 'mr-0' : 'm-l-0'}>
              <Link to={DEMO.SETTINGS} style={{ textDecoration: 'none' }}>
                <Row>
                  {this.props.userdata.firstname} {this.props.userdata.lastname}{' '}
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
            {/* <li className={this.props.rtlLayout ? 'm-r-0' : 'm-l-0'}> */}

            {/* <i className="icon feather icon-user" />{' '} */}
            {/* {this.props.userdata.firstname} {this.props.userdata.lastname} */}
            {/* </li> */}
            {/* <li>
              <Dropdown alignRight={!this.props.rtlLayout}>
                <Dropdown.Toggle variant={"link"} id="dropdown-basic">
                  <i className="icon feather icon-bell" />
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight className="notification">
                  <div className="noti-head">
                    <h6 className="d-inline-block m-b-0">Notifications</h6>
                    <div className="float-right">
                      <a href={DEMO.BLANK_LINK} className="m-r-10">
                        mark as read
                      </a>
                      <a href={DEMO.BLANK_LINK}>clear all</a>
                    </div>
                  </div>
                  <ul className="noti-body">
                    <li className="n-title">
                      <p className="m-b-0">NEW</p>
                    </li>
                    <li className="notification">
                      <div className="media">
                        <img
                          className="img-radius"
                          src={Avatar1}
                          alt="Generic placeholder"
                        />
                        <div className="media-body">
                          <p>
                            <strong>John Doe</strong>
                            <span className="n-time text-muted">
                              <i className="icon feather icon-clock m-r-10" />
                              30 min
                            </span>
                          </p>
                          <p>New ticket Added</p>
                        </div>
                      </div>
                    </li>
                    <li className="n-title">
                      <p className="m-b-0">EARLIER</p>
                    </li>
                    <li className="notification">
                      <div className="media">
                        <img
                          className="img-radius"
                          src={Avatar2}
                          alt="Generic placeholder"
                        />
                        <div className="media-body">
                          <p>
                            <strong>Joseph William</strong>
                            <span className="n-time text-muted">
                              <i className="icon feather icon-clock m-r-10" />
                              30 min
                            </span>
                          </p>
                          <p>Prchace New Theme and make payment</p>
                        </div>
                      </div>
                    </li>
                    <li className="notification">
                      <div className="media">
                        <img
                          className="img-radius"
                          src={Avatar3}
                          alt="Generic placeholder"
                        />
                        <div className="media-body">
                          <p>
                            <strong>Sara Soudein</strong>
                            <span className="n-time text-muted">
                              <i className="icon feather icon-clock m-r-10" />
                              30 min
                            </span>
                          </p>
                          <p>currently login</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div className="noti-footer">
                    <a href={DEMO.BLANK_LINK}>show all</a>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </li> 
            <li className={this.props.rtlLayout ? "m-r-15" : "m-l-15"}>
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
            <li>
              <Row>
                {/* <LogoutIcon color="success" /> */}
                <Link
                  to={'/'}
                  onClick={(e) => this.handleOnClick(e)}
                  className="dud-logout"
                  style={{ textDecoration: 'none' }}
                >
                  Logout
                </Link>
              </Row>
            </li>
          </ul>
          <ChatList
            listOpen={this.state.listOpen}
            closed={() => {
              this.setState({ listOpen: false });
            }}
          />
        </Col>
        {/* </Container> */}
      </Aux>
    );
  }
}

export default NavRight;

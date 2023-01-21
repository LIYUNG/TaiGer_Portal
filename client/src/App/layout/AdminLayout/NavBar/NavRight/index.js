import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Col,
  Row,
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
                <Link
                  to={DEMO.SETTINGS}
                  style={{ textDecoration: 'none' }}
                ></Link>
              </li>
              {/* <Button></Button> */}
              <li className="py-0">
                <Dropdown variant="default">
                  <Dropdown.Toggle variant="default" id="dropdown-basic">
                    {' '}
                    <Row>
                      {/* {this.props.userdata.firstname}{' '}
                    {this.props.userdata.lastname}{' '} */}
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
                      />{' '}
                      {`${this.props.userdata.firstname} ${this.props.userdata.lastname}`}
                    </Row>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
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
              </li>
            </ul>
          </Col>
        </Container>
      </Aux>
    );
  }
}

export default NavRight;

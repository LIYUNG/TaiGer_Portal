import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Dropdown } from 'react-bootstrap';
import { Avatar } from '@mui/material';

import { stringAvatar } from '../../../../../Demo/Utils/contants';
import ChatList from './ChatList';
import Aux from '../../../../../hoc/_Aux';
import DEMO from '../../../../../store/constant';
import { AiOutlineCalendar, AiOutlineMail } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

import {
  is_TaiGer_AdminAgent,
  is_TaiGer_Agent,
  is_TaiGer_Student
} from '../../../../../Demo/Utils/checking-functions';
import { getMyCommunicationUnreadNumber } from '../../../../../api';
import { appConfig } from '../../../../../config';

function NavRight(props) {
  const { t, i18n } = useTranslation();
  const [navState, setNavState] = useState({
    listOpen: false,
    dropdownShow: false,
    unreadCount: 0
  });

  useEffect(() => {
    // Start the periodic polling after the component is mounted
    if (is_TaiGer_AdminAgent(props.userdata)) {
      getMyCommunicationUnreadNumber()
        .then((resp) => {
          // Assuming the backend returns JSON data, update the state with the received data
          const { data } = resp;
          setNavState({ unreadCount: data.data });
        })
        .catch((error) => {
          // Handle errors, if any
          console.error('Error fetching data:', error);
        });
    }
  }, []);

  const handleOnClick = (e) => {
    props.handleOnClickLogout(e);
  };

  const handleOpenChat = (e) => {
    // e.preventDefaults();
    setNavState({ listOpen: true, unreadCount: 0 });
  };
  const handleCloseChat = (e) => {
    // e.preventDefaults();
    setNavState({ listOpen: false, unreadCount: 0 });
  };

  const handleClick = (path) => {
    history.push(path);
  };
  const handleDropdownSelect = (eventKey) => {
    setNavState({ dropdownShow: false });
  };
  const handleDropdownToggle = (isOpen) => {
    setNavState({ dropdownShow: isOpen });
  };
  const user_name = `${props.userdata.firstname} ${props.userdata.lastname}`;
  return (
    <Aux>
      <Col>
        <ul className="navbar-nav ml-auto my-0 py-0">
          {/* <li className="mail-icon">
              <AiOutlineCalendar size={24} />
            </li> */}
          {appConfig.messengerEnable && is_TaiGer_Student(props.userdata) && (
            <li>
              <Link
                to={`${DEMO.COMMUNICATIONS_LINK(
                  props.userdata._id.toString()
                )}`}
                className="dropdown-item"
                onClick={() => setNavState({ dropdownShow: false })}
              >
                <AiOutlineMail size={28} />
              </Link>
            </li>
          )}
          {appConfig.meetingEnable && is_TaiGer_Agent(props.userdata) && (
            <li className="mail-icon">
              <Link
                to={`${
                  DEMO.EVENT_TAIGER_LINK
                }/${props.userdata._id.toString()}`}
                className="dropdown-item"
              >
                <AiOutlineCalendar size={28} />
              </Link>
            </li>
          )}
          {appConfig.messengerEnable &&
            is_TaiGer_AdminAgent(props.userdata) && (
              <li className="mail-icon" onClick={handleOpenChat}>
                <AiOutlineMail size={28} />
                {navState.unreadCount > 0 && (
                  <span className="mail-icon-container badge">
                    {navState.unreadCount}
                  </span>
                )}
              </li>
            )}
          <li className="py-0">
            <Dropdown
              className="drp-user"
              show={navState.dropdownShow}
              onSelect={handleDropdownSelect}
              onToggle={handleDropdownToggle}
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
                      onClick={() => setNavState({ dropdownShow: false })}
                    >
                      <i className="feather icon-user" /> {t('Profile')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={DEMO.SETTINGS}
                      className="dropdown-item"
                      onClick={() => setNavState({ dropdownShow: false })}
                    >
                      <i className="feather icon-settings" href="#/action-2" />{' '}
                      {t('Settings')}
                    </Link>
                  </li>
                  <li>
                    <Dropdown.Item onClick={(e) => handleOnClick(e)}>
                      <i className="feather icon-log-out" />
                      {t('Log Out')}
                    </Dropdown.Item>
                  </li>
                </ul>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      </Col>
      {navState.listOpen && (
        <ChatList
          listOpen={navState.listOpen}
          handleCloseChat={handleCloseChat}
          user={props.userdata}
          closed={() => {
            setNavState({ listOpen: false });
          }}
        />
      )}
    </Aux>
  );
}

export default NavRight;

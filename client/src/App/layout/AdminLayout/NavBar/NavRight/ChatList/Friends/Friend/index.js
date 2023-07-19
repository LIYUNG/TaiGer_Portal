import React from 'react';

import Aux from '../../../../../../../../hoc/_Aux';
import DEMO from '../../../../../../../../store/constant';
import { Link } from 'react-router-dom';
import {
  convertDate,
  convertDate_ux_friendly
} from '../../../../../../../../Demo/Utils/contants';
const images = require.context(
  '../../../../../../../../assets/images/user',
  true
);

const friend = (props) => {
  let timeClass = ['d-block'];
  if (props.data.status) {
    timeClass = [...timeClass, 'text-c-green'];
  } else {
    timeClass = [...timeClass, 'text-muted'];
  }

  let time = '';
  if (props.data.time) {
    time = <small className={timeClass.join(' ')}>{props.data.time}</small>;
  }

  let newFriend = '';
  if (props.data.new) {
    newFriend = <div className="live-status">{props.data.new}</div>;
  }

  return (
    <Aux>
      <Link
        to={`/communications/${props.data?._id?.toString()}`}
        className="media-left"
      >
        <div
          className={
            props.data.latestCommunication?.readBy.includes(props.activeId)
              ? 'media userlist-box friend-list ripple'
              : 'media userlist-box friend-list ripple active'
          }
          onClick={props.clicked}
        >
          {/* {newFriend} */}

          {/* <a className="media-left" href={DEMO.BLANK_LINK}>
            {' '}
            {newFriend}
          </a> */}
          <div className="media-body">
            <h6 className="chat-header">
              {props.data.firstname} {props.data.lastname}
              <br></br>
            </h6>
            <span
              className="text-secondary mb-1 me-2 "
              style={{ float: 'left' }}
            >
              {props.data.latestCommunication &&
                convertDate_ux_friendly(
                  props.data.latestCommunication.createdAt
                )}
            </span>
          </div>
        </div>
      </Link>
    </Aux>
  );
};

export default friend;

import React from 'react';

import Aux from '../../../../../../../../hoc/_Aux';
import DEMO from '../../../../../../../../store/constant';
import { Link } from 'react-router-dom';
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
        to={`/communications/${props.data._id.toString()}`}
        className="media-left"
      >
        <div
          className={
            props.activeId === props.data.id
              ? 'media userlist-box ripple active'
              : 'media userlist-box ripple'
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
              {props.data.latestCommunication.createdAt}
            </h6>
          </div>
        </div>{' '}
      </Link>
    </Aux>
  );
};

export default friend;

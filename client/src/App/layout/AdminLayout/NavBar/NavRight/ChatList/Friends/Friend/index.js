import React from 'react';

import Aux from '../../../../../../../../hoc/_Aux';
import { Link } from 'react-router-dom';
import { convertDate_ux_friendly } from '../../../../../../../../Demo/Utils/contants';
import { RxDotFilled } from 'react-icons/rx';

const friend = (props) => {
  let timeClass = ['d-block'];
  if (props.data.status) {
    timeClass = [...timeClass, 'text-c-green'];
  } else {
    timeClass = [...timeClass, 'text-secondary'];
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
          <div className="media-body">
            <h6 className="chat-header">
              {props.data.latestCommunication?.user_id !== props.activeId && (
                <RxDotFilled size={18} title='Not Reply Yet' className="me-2" />
              )}
              {props.data.firstname} {props.data.lastname}{' '}
              {props.data.firstname_chinese ? props.data.firstname_chinese : ''}{' '}
              {props.data.lastname ? props.data.lastname_chinese : ''}
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

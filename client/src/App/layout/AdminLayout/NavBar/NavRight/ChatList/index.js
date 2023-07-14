import React, { useRef, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Friends from './Friends';
import Aux from '../../../../../../hoc/_Aux';
import DEMO from '../../../../../../store/constant';

const chatList = (props) => {
  const componentRef = useRef();

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleClickOutside = (event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      // Clicked outside the component, trigger props.closed
      props.closed();
    }
  };
  let listClass = ['header-user-list'];
  if (props.listOpen) {
    listClass = [...listClass, 'open'];
  }

  return (
    <Aux>
      <div className={listClass.join(' ')} ref={componentRef}>
        <div className="h-list-header">
          <div className="input-group">
            <input
              type="text"
              id="search-friends"
              className="form-control"
              placeholder="Search Friend . . ."
            />
          </div>
        </div>
        <div className="h-list-body">
          <div className="main-friend-cont scroll-div">
            <div
              className="main-friend-list"
              style={{ height: 'calc(100vh - 85px)' }}
            >
              <PerfectScrollbar>
                <Friends
                  listOpen={props.listOpen}
                  handleCloseChat={props.handleCloseChat}
                  user={props.user}
                />
              </PerfectScrollbar>
            </div>
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default chatList;

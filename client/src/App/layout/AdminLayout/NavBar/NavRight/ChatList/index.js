import React, { useRef, useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Placeholder } from 'react-bootstrap';

import Friends from './Friends';
import Friend from './Friends/Friend';

import Aux from '../../../../../../hoc/_Aux';
import { getQueryStudentResults } from '../../../../../../api';

const chatList = (props) => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [isError, setIsErrorTerm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const response = await getQueryStudentResults(searchTerm);
      if (response.data.success) {
        setSearchResults(response.data?.data?.students);
        setLoading(false);
        // setTimeout(function () {
        //   setSearchResults(response.data?.data?.students);
        //   setIsResultsVisible(true);
        //   setLoading(false);
        // }, 2000);
      } else {
        setStatedata((state) => ({
          ...state,
          res_modal_status: 401,
          res_modal_message: 'Session expired. Please refresh.'
        }));
        setSearchTerm('');
        setSearchResults([]);
        setIsErrorTerm(true);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setStatedata((state) => ({
        ...state,
        res_modal_status: 403,
        res_modal_message: error
      }));
      setSearchTerm('');
      setSearchResults([]);
      setIsErrorTerm(true);
      setLoading(false);
    }
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchSearchResults();
      } else {
        setSearchResults([]);
        setLoading(false);
      }
    }, 400); // Adjust the delay as needed
    return () => {
      document.removeEventListener('click', handleClickOutside);
      clearTimeout(delayDebounceFn);
    };
  }, [searchTerm]);

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setLoading(true);
  };
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
              placeholder="Search Students . . ."
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* {} */}
        {loading ? (
          <>
            <div className="h-list-body">
              <div className="main-friend-cont scroll-div">
                <div
                  className="main-friend-list"
                  style={{ height: 'calc(100vh - 85px)' }}
                >
                  <PerfectScrollbar>
                    {[0, 1, 2, 3].map((x, i) => (
                      <div className="media-body">
                        <Placeholder as="h6" animation="glow">
                          <Placeholder xs={8} />
                        </Placeholder>
                        <Placeholder as="p" animation="glow">
                          <Placeholder xs={3} bg="secondary" />
                        </Placeholder>
                      </div>
                    ))}
                  </PerfectScrollbar>
                </div>
              </div>
            </div>
          </>
        ) : searchTerm === '' ? (
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
                    searchMode={false}
                    searchResults={[]}
                  />
                </PerfectScrollbar>
              </div>
            </div>
          </div>
        ) : (
          <>
            {searchResults.length > 0 ? (
              searchResults.map((std, i) => (
                <div className="h-list-body">
                  <div className="main-friend-cont scroll-div">
                    <div
                      className="main-friend-list"
                      style={{ height: 'calc(100vh - 85px)' }}
                    >
                      <PerfectScrollbar>
                        <Friend
                          key={std.id}
                          data={std}
                          activeId={props.user._id.toString()}
                          clicked={props.handleCloseChat}
                        />
                      </PerfectScrollbar>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="h-list-body">
                  <div className="main-friend-cont scroll-div">
                    <div
                      className="main-friend-list"
                      style={{ height: 'calc(100vh - 85px)' }}
                    >
                      <PerfectScrollbar>
                        <div className="media userlist-box friend-list ripple active">
                          <div className="media-body">
                            <h6 className="chat-header">
                              Not found
                              <br></br>
                            </h6>
                            <span
                              className="text-secondary mb-1 me-2 "
                              style={{ float: 'left' }}
                            ></span>
                          </div>
                        </div>
                      </PerfectScrollbar>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Aux>
  );
};

export default chatList;

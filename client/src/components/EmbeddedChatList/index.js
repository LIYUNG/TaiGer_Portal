import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { MenuItem, Skeleton } from '@mui/material';

import Friends from './Friends';
import { getMyCommunicationThread, getQueryStudentResults } from '../../api';
import { useAuth } from '../AuthProvider';
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
  EmbeddedChatListWidth
} from '../../Demo/Utils/contants';

const EmbeddedChatList = (props) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [chatListState, setEmbeddedChatListState] = useState({
    success: false,
    searchMode: false,
    students: [],
    isLoaded: false
  });
  useEffect(() => {
    getMyCommunicationThread().then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          setEmbeddedChatListState((prevState) => ({
            ...prevState,
            success,
            students: data.students,
            isLoaded: true,
            res_status: status
          }));
        } else {
          setEmbeddedChatListState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setEmbeddedChatListState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [props.count]);

  useEffect(() => {
    if (chatListState.searchMode) {
      setEmbeddedChatListState((prevState) => ({
        ...prevState,
        isLoaded: false
      }));
      const delayDebounceFn = setTimeout(() => {
        if (searchTerm) {
          fetchSearchResults();
        } else {
          setSearchResults([]);
          setEmbeddedChatListState((prevState) => ({
            ...prevState,
            isLoaded: true
          }));
        }
      }, 300); // Adjust the delay as needed
      return () => {
        clearTimeout(delayDebounceFn);
      };
    }
  }, [searchTerm]);

  const fetchSearchResults = async () => {
    try {
      const response = await getQueryStudentResults(searchTerm);
      if (response.data.success) {
        setSearchResults(response.data?.data?.students);
        setEmbeddedChatListState((prevState) => ({
          ...prevState,
          isLoaded: true
        }));
      } else {
        setSearchTerm('');
        setSearchResults([]);
        setEmbeddedChatListState((prevState) => ({
          ...prevState,
          res_modal_status: 401,
          res_modal_message: 'Session expired. Please refresh.',
          isLoaded: true
        }));
      }
    } catch (error) {
      setSearchTerm('');
      setSearchResults([]);
      setEmbeddedChatListState((prevState) => ({
        ...prevState,
        isLoaded: true,
        res_modal_status: 403,
        res_modal_message: error
      }));
    }
  };

  const handleInputChange = (e) => {
    if (e.target.value !== '') {
      setSearchTerm(e.target.value);
      setEmbeddedChatListState((prevState) => ({
        ...prevState,
        searchMode: true,
        isLoaded: false
      }));
    } else {
      setSearchTerm('');
      setEmbeddedChatListState((prevState) => ({
        ...prevState,
        searchMode: false,
        isLoaded: true
      }));
    }
  };

  return (
    <>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          id="search-friends"
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          value={searchTerm}
          onClick={(e) => e.stopPropagation()}
          onChange={handleInputChange}
        />
      </Search>
      {!chatListState.isLoaded &&
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <MenuItem key={i}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton
              variant="rectangular"
              width={EmbeddedChatListWidth - 50}
              height={54}
              style={{
                marginLeft: '10px'
              }}
            />
          </MenuItem>
        ))}
      {chatListState.isLoaded && (
        <Friends
          user={user}
          students={
            chatListState.searchMode ? searchResults : chatListState.students
          }
        />
      )}
    </>
  );
};

const MemoizedEmbeddedChatList = React.memo(EmbeddedChatList);

export default MemoizedEmbeddedChatList;

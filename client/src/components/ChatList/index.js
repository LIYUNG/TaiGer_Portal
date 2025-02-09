import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Box, ListItem, MenuItem, Skeleton, Typography } from '@mui/material';
import i18next from 'i18next';

import Friends from './Friends';
import { getMyCommunicationThread, getQueryStudentResults } from '../../api';
import { useAuth } from '../AuthProvider';
import {
    Search,
    SearchIconWrapper,
    StyledInputBase,
    menuWidth
} from '../../utils/contants';

const ChatList = (props) => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [chatListState, setChatListState] = useState({
        success: false,
        searchMode: false,
        students: [],
        isLoaded: true
    });

    useEffect(() => {
        setChatListState((prevState) => ({
            ...prevState,
            isLoaded: false
        }));
        getMyCommunicationThread().then(
            (resp) => {
                const { success, data } = resp.data;
                const { status } = resp;
                if (success) {
                    setChatListState((prevState) => ({
                        ...prevState,
                        success,
                        students: data.students,
                        isLoaded: true,
                        res_status: status
                    }));
                } else {
                    setChatListState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setChatListState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_status: 500
                }));
            }
        );
    }, []);

    useEffect(() => {
        if (chatListState.searchMode) {
            setChatListState((prevState) => ({
                ...prevState,
                isLoaded: false
            }));
            const delayDebounceFn = setTimeout(() => {
                if (searchTerm) {
                    fetchSearchResults();
                } else {
                    setSearchResults([]);
                    setChatListState((prevState) => ({
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
                setChatListState((prevState) => ({
                    ...prevState,
                    isLoaded: true
                }));
            } else {
                setSearchTerm('');
                setSearchResults([]);
                setChatListState((prevState) => ({
                    ...prevState,
                    res_modal_status: 401,
                    res_modal_message: 'Session expired. Please refresh.',
                    isLoaded: true
                }));
            }
        } catch (error) {
            setSearchTerm('');
            setSearchResults([]);
            setChatListState((prevState) => ({
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
            setChatListState((prevState) => ({
                ...prevState,
                searchMode: true,
                isLoaded: false
            }));
        } else {
            setSearchTerm('');
            setChatListState((prevState) => ({
                ...prevState,
                searchMode: false,
                isLoaded: true
            }));
        }
    };

    return (
        <>
            <ListItem onClick={(e) => e.stopPropagation()}>
                <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                >
                    <Box>
                        <Typography variant="h6">
                            {i18next.t('Chat', { ns: 'common' })}
                        </Typography>
                    </Box>
                </Box>
            </ListItem>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    id="search-friends"
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={handleInputChange}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Search…"
                    value={searchTerm}
                />
            </Search>
            {!chatListState.isLoaded
                ? [0, 1, 2, 3].map((x, i) => (
                      <MenuItem key={i}>
                          <Skeleton
                              height={40}
                              variant="rectangular"
                              width={menuWidth}
                          />
                      </MenuItem>
                  ))
                : null}
            {chatListState.isLoaded ? (
                <Friends
                    handleCloseChat={props.handleCloseChat}
                    students={
                        chatListState.searchMode
                            ? searchResults
                            : chatListState.students
                    }
                    user={user}
                />
            ) : null}
        </>
    );
};

export default ChatList;

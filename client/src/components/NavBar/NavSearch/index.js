import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_role, Role } from '@taiger-common/core';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';

import { getQueryPublicResults, getQueryResults } from '../../../api';
import ModalMain from '../../../Demo/Utils/ModalHandler/ModalMain';
import './search.css';
import { useAuth } from '../../AuthProvider';
import {
    Search,
    SearchIconWrapper,
    StyledInputBase
} from '../../../utils/contants';
import DEMO from '../../../store/constant';

const NavSearch = () => {
    // const history = useHistory();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();
    let [statedata, setStatedata] = useState({
        error: '',
        res_status: 0,
        res_modal_status: 0,
        res_modal_message: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [isError, setIsErrorTerm] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [, setLoading] = useState(false);
    const [isResultsVisible, setIsResultsVisible] = useState(false);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const response = is_TaiGer_role(user)
                    ? await getQueryResults(searchTerm)
                    : await getQueryPublicResults(searchTerm);
                if (response.data.success) {
                    setSearchResults(response.data.data);
                    setIsResultsVisible(true);
                    setLoading(false);
                } else {
                    setIsResultsVisible(false);
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
                setIsResultsVisible(false);
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
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== '') {
                fetchSearchResults();
            } else {
                setSearchResults([]);
            }
        }, 300); // Adjust the delay as needed
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
            clearTimeout(delayDebounceFn);
        };
    }, [searchTerm, user]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value.trimLeft());
        if (e.target.value.length === 0) {
            setIsResultsVisible(false);
        }
    };

    const handleInputBlur = () => {
        setIsResultsVisible(false);
    };

    const onClickStudentHandler = (result) => {
        navigate(
            `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                result._id.toString(),
                DEMO.PROFILE_HASH
            )}`
        );

        setSearchResults([]);
        setIsResultsVisible(false);
        setSearchTerm('');
    };
    const onClickAgentHandler = (result) => {
        navigate(`/teams/agents/${result._id.toString()}`);

        setSearchResults([]);
        setIsResultsVisible(false);
        setSearchTerm('');
    };
    const onClickEditorHandler = (result) => {
        navigate(`/teams/editors/${result._id.toString()}`);

        setSearchResults([]);
        setIsResultsVisible(false);
        setSearchTerm('');
    };
    const onClickProgramHandler = (result) => {
        navigate(`/programs/${result._id.toString()}`);

        setSearchResults([]);
        setIsResultsVisible(false);
        setSearchTerm('');
    };
    const onClickDocumentationHandler = (result) => {
        navigate(`/docs/search/${result._id.toString()}`);

        setSearchResults([]);
        setIsResultsVisible(false);
        setSearchTerm('');
    };

    const onClickInternalDocumentationHandler = (result) => {
        navigate(`/docs/internal/search/${result._id.toString()}`);
        setSearchResults([]);
        setIsResultsVisible(false);
        setSearchTerm('');
    };

    const handleClickOutside = (event) => {
        // Check if the click target is outside of the search container and result list
        if (
            searchContainerRef.current &&
            !searchContainerRef.current.contains(event.target)
        ) {
            // Clicked outside, hide the result list
            setIsResultsVisible(false);
        }
    };

    const ConfirmError = () => {
        window.location.reload(true);
    };

    return (
        <Box>
            {isError && (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_status={statedata.res_modal_status}
                    res_modal_message={statedata.res_modal_message}
                />
            )}
            <Box className="search-container" ref={searchContainerRef}>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        autoFocus={false}
                        inputProps={{ 'aria-label': 'search' }}
                        placeholder={`${t('Search', { ns: 'common' })}...`}
                        value={searchTerm}
                        onMouseDown={handleInputBlur}
                        onChange={handleInputChange}
                        autoComplete="off"
                    />
                </Search>
                {/* {loading && <div>Loading...</div>} */}
                {isResultsVisible &&
                    (searchResults.length > 0 ? (
                        <Box className="search-results result-list">
                            {searchResults.map((result, i) =>
                                result.role === Role.Student ? (
                                    <li
                                        onClick={() =>
                                            onClickStudentHandler(result)
                                        }
                                        key={i}
                                    >
                                        {`${result.firstname} ${result.lastname} ${
                                            result.firstname_chinese
                                                ? result.firstname_chinese
                                                : ' '
                                        }${
                                            result.lastname_chinese
                                                ? result.lastname_chinese
                                                : ' '
                                        }`}
                                    </li>
                                ) : result.role === Role.Agent ? (
                                    <li
                                        onClick={() =>
                                            onClickAgentHandler(result)
                                        }
                                        key={i}
                                    >
                                        {`${result.firstname} ${result.lastname}`}
                                    </li>
                                ) : result.role === Role.Editor ? (
                                    <li
                                        onClick={() =>
                                            onClickEditorHandler(result)
                                        }
                                        key={i}
                                    >
                                        {`${result.firstname} ${result.lastname}`}
                                    </li>
                                ) : result.school ? (
                                    <li
                                        onClick={() =>
                                            onClickProgramHandler(result)
                                        }
                                        key={i}
                                    >
                                        {`${result.school} ${result.program_name} ${result.degree} ${result.semester}`}
                                    </li>
                                ) : result.internal ? (
                                    <li
                                        onClick={() =>
                                            onClickInternalDocumentationHandler(
                                                result
                                            )
                                        }
                                        key={i}
                                    >
                                        {`${result.title}`}
                                    </li>
                                ) : (
                                    <li
                                        onClick={() =>
                                            onClickDocumentationHandler(result)
                                        }
                                        key={i}
                                    >
                                        {`${result.title}`}
                                    </li>
                                )
                            )}
                        </Box>
                    ) : (
                        <Box className="search-results result-list">
                            <li>No result</li>
                        </Box>
                    ))}
            </Box>
        </Box>
    );
};

export default NavSearch;

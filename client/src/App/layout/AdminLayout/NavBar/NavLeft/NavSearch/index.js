import React, { useState, useRef, useEffect } from 'react';
import { getQueryPublicResults, getQueryResults } from '../../../../../../api';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ModalMain from '../../../../../../Demo/Utils/ModalHandler/ModalMain';
import './search.css';
import { is_TaiGer_role } from '../../../../../../Demo/Utils/checking-functions';
import { Role } from '../../../../../../Demo/Utils/contants';
import { Form } from 'react-bootstrap';

const NavSearch = (props) => {
  const { t, i18n } = useTranslation();
  let [statedata, setStatedata] = useState({
    error: '',
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isError, setIsErrorTerm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
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
  }, [searchTerm]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const response = is_TaiGer_role(props.user)
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
      console.error(error);
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
    props.history.push(`/student-database/${result._id.toString()}/profile`);

    setSearchResults([]);
    setIsResultsVisible(false);
    setSearchTerm('');
  };
  const onClickAgentHandler = (result) => {
    props.history.push(`/teams/agents/${result._id.toString()}`);

    setSearchResults([]);
    setIsResultsVisible(false);
    setSearchTerm('');
  };
  const onClickEditorHandler = (result) => {
    props.history.push(`/teams/editors/${result._id.toString()}`);

    setSearchResults([]);
    setIsResultsVisible(false);
    setSearchTerm('');
  };
  const onClickProgramHandler = (result) => {
    props.history.push(`/programs/${result._id.toString()}`);

    setSearchResults([]);
    setIsResultsVisible(false);
    setSearchTerm('');
  };
  const onClickDocumentationHandler = (result) => {
    props.history.push(`/docs/search/${result._id.toString()}`);

    setSearchResults([]);
    setIsResultsVisible(false);
    setSearchTerm('');
  };

  const onClickInternalDocumentationHandler = (result) => {
    props.history.push(`/docs/internal/search/${result._id.toString()}`);

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
    <div className="ms-4">
      {isError && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={statedata.res_modal_status}
          res_modal_message={statedata.res_modal_message}
        />
      )}
      <div className="search-container" ref={searchContainerRef}>
        <Form>
          <Form.Group className="my-0 mx-0">
            <Form.Control
              type="text"
              className="search-input"
              placeholder={`${t('Search')}...`}
              value={searchTerm}
              onMouseDown={handleInputBlur}
              onChange={handleInputChange}
            ></Form.Control>
          </Form.Group>
        </Form>
        {/* {loading && <div>Loading...</div>} */}
        {isResultsVisible &&
          (searchResults.length > 0 ? (
            <div className="search-results result-list">
              {searchResults.map((result, i) =>
                result.role === 'Student' ? (
                  <li onClick={() => onClickStudentHandler(result)} key={i}>
                    {`${result.firstname} ${result.lastname} ${
                      result.firstname_chinese ? result.firstname_chinese : ' '
                    }${
                      result.lastname_chinese ? result.lastname_chinese : ' '
                    }`}
                  </li>
                ) : result.role === Role.Agent ? (
                  <li onClick={() => onClickAgentHandler(result)} key={i}>
                    {`${result.firstname} ${result.lastname}`}
                  </li>
                ) : result.role === Role.Editor ? (
                  <li onClick={() => onClickEditorHandler(result)} key={i}>
                    {`${result.firstname} ${result.lastname}`}
                  </li>
                ) : result.school ? (
                  <li onClick={() => onClickProgramHandler(result)} key={i}>
                    {`${result.school} ${result.program_name} ${result.degree} ${result.semester}`}
                  </li>
                ) : result.internal ? (
                  <li
                    onClick={() => onClickInternalDocumentationHandler(result)}
                    key={i}
                  >
                    {`${result.title}`}
                  </li>
                ) : (
                  <li
                    onClick={() => onClickDocumentationHandler(result)}
                    key={i}
                  >
                    {`${result.title}`}
                  </li>
                )
              )}
            </div>
          ) : (
            <div className="search-results result-list">
              <li>No result</li>
            </div>
          ))}
      </div>
    </div>
  );
};
export default withRouter(NavSearch);

// export default NavSearch;

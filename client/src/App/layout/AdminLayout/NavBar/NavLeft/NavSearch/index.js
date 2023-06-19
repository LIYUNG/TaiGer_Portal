import React, { useState, useRef, useEffect } from 'react';
import { getQueryResults } from '../../../../../../api';
import { withRouter } from 'react-router-dom';
import ModalMain from '../../../../../../Demo/Utils/ModalHandler/ModalMain';
import './search.css';

const NavSearch = (props) => {
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
    }, 500); // Adjust the delay as needed
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      clearTimeout(delayDebounceFn);
    };
  }, [searchTerm]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const response = await getQueryResults(searchTerm);
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
    setSearchTerm(e.target.value);
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
    // setIsErrorTerm(false);
    // setStatedata((state) => ({
    //   ...state,
    //   res_modal_status: 0,
    //   res_modal_message: ''
    // }));
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
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchTerm}
          onMouseDown={handleInputBlur}
          onChange={handleInputChange}
        />
        {/* {loading && <div>Loading...</div>} */}
        {searchResults.length > 0
          ? isResultsVisible && (
              <div className="search-results result-list">
                {searchResults.map((result, i) =>
                  result.role === 'Student' ? (
                    <li onClick={() => onClickStudentHandler(result)} key={i}>
                      {`${result.firstname} ${result.lastname}`}
                    </li>
                  ) : result.role === 'Agent' ? (
                    <li onClick={() => onClickAgentHandler(result)} key={i}>
                      {`${result.firstname} ${result.lastname}`}
                    </li>
                  ) : result.role === 'Editor' ? (
                    <li onClick={() => onClickEditorHandler(result)} key={i}>
                      {`${result.firstname} ${result.lastname}`}
                    </li>
                  ) : result.school ? (
                    <li onClick={() => onClickProgramHandler(result)} key={i}>
                      {`${result.school} ${result.program_name} ${result.degree} ${result.semester}`}
                    </li>
                  ) : result.internal ? (
                    <li
                      onClick={() =>
                        onClickInternalDocumentationHandler(result)
                      }
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
            )
          : isResultsVisible && (
              <div className="search-results result-list">
                <li>No result</li>
              </div>
            )}
      </div>
    </div>
  );
};
export default withRouter(NavSearch);

// export default NavSearch;

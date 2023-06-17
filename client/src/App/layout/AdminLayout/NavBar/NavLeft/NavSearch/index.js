import React, { useState, useEffect } from 'react';
import { getQueryResults } from '../../../../../../api';
import { Link, withRouter } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

import './search.css';

const NavSearch = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchSearchResults();
      } else {
        setSearchResults([]);
      }
    }, 500); // Adjust the delay as needed

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const response = await getQueryResults(searchTerm);
      console.log(response.data.data);
      setSearchResults(response.data.data);
      setIsResultsVisible(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
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
  const onClickDocumentationHandler = (result) => {
    props.history.push(`/docs/search/${result._id.toString()}`);

    setSearchResults([]);
    setIsResultsVisible(false);
    setSearchTerm('');
  };

  return (
    <div className="ms-4">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchTerm}
          // onBlur={handleInputBlur}
          onChange={handleInputChange}
        />
        {/* {loading && <div>Loading...</div>} */}
        {searchResults.length > 0
          ? isResultsVisible && (
              <div class="search-results result-list">
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
              <div class="search-results result-list">
                <li>No result</li>
              </div>
            )}
      </div>
    </div>
  );
};
export default withRouter(NavSearch);

// export default NavSearch;

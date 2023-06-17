import React, { useState, useEffect } from 'react';
import { getQueryResults } from '../../../../../../api';
import { Link, useHistory } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

import './search.css';

const NavSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
      //   getQueryResults(searchTerm).then();
      const response = await getQueryResults(searchTerm);
      console.log(response.data.data);
      //   setSearchResults(response.data);
      setSearchResults(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onClickStudentHandler = (result) => {
    history.push(`/student-database/${result._id.toString()}/profile`);

    setSearchResults([]);
    setSearchTerm('');
  };
  const onClickDocumentationHandler = (result) => {
    history.push(`/student-database/${result._id.toString()}/profile`);

    setSearchResults([]);
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
          onChange={handleInputChange}
        />
        {/* {loading && <div>Loading...</div>} */}
        {searchResults.length > 0 && (
          <div class="search-results result-list">
            {searchResults.map((result, i) =>
              result.role ? (
                <li onClick={() => onClickStudentHandler(result)} key={i}>
                  {`${result.firstname} ${result.lastname}`}
                </li>
              ) : (
                <li onClick={() => onClickDocumentationHandler(result)} key={i}>
                  {`${result.title}`}
                </li>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavSearch;

import React, { useState, useRef, useEffect } from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import {
  AddValidProgram,
  BINARY_STATE_OPTIONS,
  COUNTRIES_OPTIONS,
  DEGREE_OPTIONS,
  LANGUAGES_OPTIONS,
  SEMESTER_OPTIONS,
  field_alert
} from '../Utils/contants';

function NewProgramEdit(props) {
  let [initStates, setInitStates] = useState({
    program: {},
    school_name_set: new Set(props.programs.map((program) => program.school))
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const searchContainerRef = useRef(null);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

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
      console.log(initStates.school_name_set);
      console.log(
        [...initStates.school_name_set].filter((school) =>
          school.includes(initStates.program.school)
        )
      );
      setSearchResults(
        [...initStates.school_name_set].filter((school) =>
          school.toLowerCase().includes(initStates.program.school.toLowerCase())
        )
      );
      setIsResultsVisible(true);
    } catch (error) {}
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
  const handleChange = (e) => {
    e.preventDefault();
    var program_temp = { ...initStates.program };
    program_temp[e.target.id] = e.target.value;
    setInitStates((initStates) => ({
      ...initStates,
      program: program_temp
    }));
    if (e.target.id === 'school') {
      setSearchTerm(e.target.value);
    }
  };

  const handleSubmit_Program = (e, program) => {
    if (AddValidProgram(program)) {
      e.preventDefault();
      props.handleSubmit_Program(program);
    } else {
      field_alert(program);
    }
  };

  const onClickResultHandler = (result) => {
    setSearchResults([]);
    setInitStates((initStates) => ({
      ...initStates,
      program: {
        ...initStates.program,
        school: result
      }
    }));
    setIsResultsVisible(false);
    setSearchTerm('');
  };
  return (
    <>
      <Card>
        <Card.Body>
          <Row>
            <Col md={4}>
              <h5>University *</h5>
            </Col>
            <Col md={4}>
              <h5>
                <div
                  className="search-container-school"
                  ref={searchContainerRef}
                >
                  <Form.Group controlId="school">
                    <Form.Control
                      type="text"
                      placeholder="National Taiwan University"
                      onChange={(e) => handleChange(e)}
                      value={initStates.program.school || searchTerm}
                    />
                  </Form.Group>
                  {/* {loading && <div>Loading...</div>} */}
                  {searchResults.length > 0
                    ? isResultsVisible && (
                        <div className="search-results result-list">
                          {searchResults.map((result, i) => (
                            <li
                              onClick={() => onClickResultHandler(result)}
                              key={i}
                            >
                              {`${result}`}
                            </li>
                          ))}
                        </div>
                      )
                    : isResultsVisible && (
                        <div className="search-results result-list">
                          <li>No result</li>
                        </div>
                      )}
                </div>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Program*</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="program_name">
                  <Form.Control
                    type="text"
                    placeholder="Electrical Engineering"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.program_name
                        ? initStates.program.program_name
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Degree *</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="degree">
                  <Form.Control
                    as="select"
                    onChange={(e) => handleChange(e)}
                    value={initStates.program.degree}
                  >
                    {DEGREE_OPTIONS()}
                  </Form.Control>
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Semester *</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="semester">
                  <Form.Control
                    as="select"
                    onChange={(e) => handleChange(e)}
                    value={initStates.program.semester}
                  >
                    {SEMESTER_OPTIONS()}
                  </Form.Control>
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row> </Row>
          <Row>
            <Col md={4}>
              <h5>Teaching Language*</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="lang">
                  <Form.Control
                    as="select"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.lang ? initStates.program.lang : ''
                    }
                  >
                    {LANGUAGES_OPTIONS()}
                  </Form.Control>
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>GPA Requirement (German system)</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="gpa_requirement">
                  <Form.Control
                    type="text"
                    placeholder="2,5"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.gpa_requirement
                        ? initStates.program.gpa_requirement
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Application Start (MM-DD)</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="application_start">
                  <Form.Control
                    type="text"
                    placeholder="05-31"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.application_start
                        ? initStates.program.application_start
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Application Deadline (MM-DD) *</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="application_deadline">
                  <Form.Control
                    type="text"
                    placeholder="05-31"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.application_deadline
                        ? initStates.program.application_deadline
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Need Uni-Assist?</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="uni_assist">
                  <Form.Control
                    as="select"
                    onChange={(e) => handleChange(e)}
                    value={initStates.program.uni_assist}
                  >
                    <option value="No">No</option>
                    <option value="Yes-VPD">Yes-VPD</option>
                    <option value="Yes-Full">Yes-Full</option>
                  </Form.Control>
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>TOEFL Requirement</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="toefl">
                  <Form.Control
                    type="text"
                    placeholder="88"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.toefl ? initStates.program.toefl : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>IELTS Requirement</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="ielts">
                  <Form.Control
                    type="text"
                    placeholder="6.5"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.ielts ? initStates.program.ielts : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>TestDaF Requirement</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="testdaf">
                  <Form.Control
                    type="text"
                    placeholder="4"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.testdaf
                        ? initStates.program.testdaf
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>GRE Requirement</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="gre">
                  <Form.Control
                    type="text"
                    placeholder="V145Q160"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.gre ? initStates.program.gre : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>GMAT Requirement</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="gmat">
                  <Form.Control
                    type="text"
                    placeholder="640"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.gmat ? initStates.program.gmat : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>ML Required? *</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="ml_required">
                  <Form.Control
                    as="select"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.ml_required
                        ? initStates.program.ml_required
                        : ''
                    }
                  >
                    {BINARY_STATE_OPTIONS()}
                  </Form.Control>
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>ML Requirements</h5>
            </Col>
            <Col md={6}>
              <h5>
                <Form.Group controlId="ml_requirements">
                  <Form.Control
                    as="textarea"
                    rows="5"
                    placeholder="1200-1500words"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.ml_requirements
                        ? initStates.program.ml_requirements
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>RL Required? *</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="rl_required">
                  <Form.Control
                    as="select"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.rl_required
                        ? initStates.program.rl_required
                        : '0'
                    }
                  >
                    <option value="0">no</option>
                    <option value="1">yes - 1</option>
                    <option value="2">yes - 2</option>
                    <option value="3">yes - 3</option>
                  </Form.Control>
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>RL Requirements</h5>
            </Col>
            <Col md={6}>
              <h5>
                <Form.Group controlId="rl_requirements">
                  <Form.Control
                    as="textarea"
                    rows="5"
                    placeholder="1 page"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.rl_requirements
                        ? initStates.program.rl_requirements
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Essay Required? *</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="essay_required">
                  <Form.Control
                    as="select"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.essay_required
                        ? initStates.program.essay_required
                        : ''
                    }
                  >
                    {BINARY_STATE_OPTIONS()}
                  </Form.Control>
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Essay Requirements</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="essay_requirements">
                  <Form.Control
                    type="text"
                    placeholder="2000 words"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.essay_requirements
                        ? initStates.program.essay_requirements
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Portfolio Required?</h5>
            </Col>
            <Col md={6}>
              <h5>
                <Form.Group controlId="portfolio_required">
                  <Form.Control
                    as="select"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.portfolio_required
                        ? initStates.program.portfolio_required
                        : ''
                    }
                  >
                    {BINARY_STATE_OPTIONS()}
                  </Form.Control>
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Portfolio Requirements</h5>
            </Col>
            <Col md={6}>
              <h5>
                <Form.Group controlId="portfolio_requirements">
                  <Form.Control
                    as="textarea"
                    rows="5"
                    placeholder="2000 words"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.portfolio_requirements
                        ? initStates.program.portfolio_requirements
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Supplementary Form Required?</h5>
            </Col>
            <Col md={6}>
              <h5>
                <Form.Group controlId="supplementary_form_required">
                  <Form.Control
                    as="select"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.supplementary_form_required
                        ? initStates.program.supplementary_form_required
                        : ''
                    }
                  >
                    {BINARY_STATE_OPTIONS()}
                  </Form.Control>
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Supplementary Form Requirements</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="supplementary_form_requirements">
                  <Form.Control
                    type="text"
                    placeholder="2000 words"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.supplementary_form_requirements
                        ? initStates.program.supplementary_form_requirements
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Special Notes</h5>
            </Col>
            <Col md={6}>
              <h5>
                <Form.Group controlId="special_notes">
                  <Form.Control
                    as="textarea"
                    rows="5"
                    placeholder="2000 words"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.special_notes
                        ? initStates.program.special_notes
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            {' '}
            <Col md={4}>
              <h5>Comments</h5>
            </Col>
            <Col md={6}>
              <h5>
                <Form.Group controlId="comments">
                  <Form.Control
                    as="textarea"
                    rows="5"
                    placeholder="2000 words"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.comments
                        ? initStates.program.comments
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Portal 1 link url</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="application_portal_a">
                  <Form.Control
                    type="text"
                    placeholder="url"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.application_portal_a
                        ? initStates.program.application_portal_a
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Portal 1 TaiGer Instrution link url</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="application_portal_a_instructions">
                  <Form.Control
                    type="text"
                    placeholder="url"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.application_portal_a_instructions
                        ? initStates.program.application_portal_a_instructions
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Portal 2 link url</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="application_portal_b">
                  <Form.Control
                    type="text"
                    placeholder="url"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.application_portal_b
                        ? initStates.program.application_portal_b
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Portal 2 TaiGer Instrution link url</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="application_portal_b_instructions">
                  <Form.Control
                    type="text"
                    placeholder="url"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.application_portal_b_instructions
                        ? initStates.program.application_portal_b_instructions
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Website</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="website">
                  <Form.Control
                    type="text"
                    placeholder="url"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.website
                        ? initStates.program.website
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Country*</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="country">
                  <Form.Control
                    as="select"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.country
                        ? initStates.program.country
                        : ''
                    }
                  >
                    {COUNTRIES_OPTIONS()}
                  </Form.Control>
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>FPSO</h5>
            </Col>
            <Col md={4}>
              <h5>
                <Form.Group controlId="fpso">
                  <Form.Control
                    type="text"
                    placeholder="url"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.fpso ? initStates.program.fpso : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h5>Group</h5>
            </Col>
            <Col md={6}>
              <h5>
                <Form.Group controlId="study_group_flag">
                  <Form.Control
                    type="text"
                    placeholder="ee"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      initStates.program.study_group_flag
                        ? initStates.program.study_group_flag
                        : ''
                    }
                  />
                </Form.Group>
              </h5>
            </Col>
          </Row>
          <p>*: Must fill fields</p>
        </Card.Body>
      </Card>
      <Button
        size="sm"
        onClick={(e) => handleSubmit_Program(e, initStates.program)}
      >
        Create
      </Button>
      <Button size="sm" onClick={() => props.handleClick()} variant="light">
        Cancel
      </Button>
    </>
  );
}
export default NewProgramEdit;

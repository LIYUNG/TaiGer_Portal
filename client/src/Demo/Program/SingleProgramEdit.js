import React from "react";
import { Form, Row, Col, Card, Button } from "react-bootstrap";

class SingleProgramEdit extends React.Component {
  state = {
    program: this.props.program,
  };
  handleChange = (e) => {
    e.preventDefault();
    var program_temp = { ...this.state.program };
    program_temp[e.target.id] = e.target.value;
    this.setState((state) => ({
      ...state,
      program: program_temp,
    }));
  };
  handleSubmit_Program = (e, program) => {
    e.preventDefault();
    this.props.handleSubmit_Program(program);
  };
  render() {
    return (
      <>
        <Card>
          <Card.Body>
            <Row>
              <Col md={4}>
                <h5>University</h5>
              </Col>
              <Col md={4}>
                {/* <h5>
                  <Form.Group controlId="school">
                    <Form.Control
                      type="text"
                      placeholder="National Taiwan University"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.school
                          ? this.state.program.school
                          : ''
                      }
                    />
                  </Form.Group>
                </h5> */}
                <h5>
                  {this.state.program.school ? this.state.program.school : ''}
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Program</h5>
              </Col>
              <Col md={4}>
                {/* <h5>
                  <Form.Group controlId="program_name">
                    <Form.Control
                      type="text"
                      placeholder="Electrical Engineering"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.program_name
                          ? this.state.program.program_name
                          : ''
                      }
                    />
                  </Form.Group>
                </h5> */}
                <h5>
                  {this.state.program.program_name
                    ? this.state.program.program_name
                    : ''}
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Degree</h5>
              </Col>
              <Col md={4}>
                {/* <h5>
                  <Form.Group controlId="degree">
                    <Form.Control
                      type="text"
                      placeholder="M.Sc."
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.degree
                          ? this.state.program.degree
                          : ''
                      }
                    />
                  </Form.Group>
                </h5> */}
                <h5>
                  {this.state.program.degree ? this.state.program.degree : ''}
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Semester</h5>
              </Col>
              <Col md={4}>
                {/* <h5>
                  <Form.Group controlId="semester">
                    <Form.Control
                      type="text"
                      placeholder="Winter"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.semester
                          ? this.state.program.semester
                          : ''
                      }
                    />
                  </Form.Group>
                </h5> */}
                <h5>
                  {this.state.program.semester
                    ? this.state.program.semester
                    : ''}
                </h5>
              </Col>
            </Row>
            <Row> </Row>
            <Row>
              <Col md={4}>
                <h5>Teaching Language</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="language">
                    <Form.Control
                      type="text"
                      placeholder="English"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.language
                          ? this.state.program.language
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.application_start
                          ? this.state.program.application_start
                          : ''
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Application Deadline (MM-DD)</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="application_deadline">
                    <Form.Control
                      type="text"
                      placeholder="05-31"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.application_deadline
                          ? this.state.program.application_deadline
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
                      onChange={(e) => this.handleChange(e)}
                      value={this.state.program.uni_assist}
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.toefl ? this.state.program.toefl : ''
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.ielts ? this.state.program.ielts : ''
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.testdaf
                          ? this.state.program.testdaf
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.gre ? this.state.program.gre : ''
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.gmat ? this.state.program.gmat : ''
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>ML Required?</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="ml_required">
                    <Form.Control
                      as="select"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.ml_required
                          ? this.state.program.ml_required
                          : ''
                      }
                    >
                      <option value="no">no</option>
                      <option value="yes">yes</option>
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.ml_requirements
                          ? this.state.program.ml_requirements
                          : ''
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>RL Required?</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="rl_required">
                    <Form.Control
                      as="select"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.rl_required
                          ? this.state.program.rl_required
                          : ''
                      }
                    >
                      <option value="no">no</option>
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.rl_requirements
                          ? this.state.program.rl_requirements
                          : ''
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Essay Required?</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="essay_required">
                    <Form.Control
                      as="select"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.essay_required
                          ? this.state.program.essay_required
                          : ''
                      }
                    >
                      <option value="no">no</option>
                      <option value="yes">yes</option>
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.essay_requirements
                          ? this.state.program.essay_requirements
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
              <Col md={4}>
                <h5>
                  <Form.Group controlId="portfolio_required">
                    <Form.Control
                      as="select"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.portfolio_required
                          ? this.state.program.portfolio_required
                          : ''
                      }
                    >
                      <option value="no">no</option>
                      <option value="yes">yes</option>
                    </Form.Control>
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Portfolio Requirements</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="portfolio_requirements">
                    <Form.Control
                      type="text"
                      placeholder="2000 words"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.portfolio_requirements
                          ? this.state.program.portfolio_requirements
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
              <Col md={4}>
                <h5>
                  <Form.Group controlId="supplementary_form_required">
                    <Form.Control
                      as="select"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.supplementary_form_required
                          ? this.state.program.supplementary_form_required
                          : ''
                      }
                    >
                      <option value="no">no</option>
                      <option value="yes">yes</option>
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.supplementary_form_requirements
                          ? this.state.program.supplementary_form_requirements
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.special_notes
                          ? this.state.program.special_notes
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.comments
                          ? this.state.program.comments
                          : ''
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Portal Link 1</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="application_portal_a">
                    <Form.Control
                      type="text"
                      placeholder="url"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.application_portal_a
                          ? this.state.program.application_portal_a
                          : ''
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Portal Link 2</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="application_portal_b">
                    <Form.Control
                      type="text"
                      placeholder="url"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.application_portal_b
                          ? this.state.program.application_portal_b
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.website
                          ? this.state.program.website
                          : ''
                      }
                    />
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.fpso ? this.state.program.fpso : ''
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
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.state.program.study_group_flag
                          ? this.state.program.study_group_flag
                          : ''
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Button
          size="sm"
          onClick={(e) => this.handleSubmit_Program(e, this.state.program)}
        >
          Update
        </Button>
        <Button
          size="sm"
          onClick={() => this.props.handleClick()}
          variant="light"
        >
          Cancel
        </Button>
      </>
    );
  }
}
export default SingleProgramEdit;

import React from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  is_TaiGer_AdminAgent,
  is_TaiGer_role
} from '../Utils/checking-functions';
import { convertDate } from '../Utils/contants';

class SingleProgramView extends React.Component {
  render() {
    return (
      <>
        <Row>
          <Col md={is_TaiGer_role(this.props.user) ? 8 : 12}>
            <Card>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>University</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.school}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Program</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.program_name}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Degree</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.degree}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Semester</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.semester}</p>
                  </Col>
                </Row>
                <Row> </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Teaching Language</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.lang}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>GPA Requirement (German system)</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.gpa_requirement}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Application Start (MM-DD)</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">
                      {this.props.program.application_start}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Application Deadline (MM-DD)</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">
                      {this.props.program.application_deadline}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Need Uni-Assist?</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.uni_assist}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>TOEFL Requirement</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.toefl}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>IELTS Requirement</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.ielts}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>TestDaF Requirement</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.testdaf}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>GRE Requirement</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.gre}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>GMAT Requirement</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.gmat}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>ML Required?</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.ml_required}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>ML Requirements</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.ml_requirements}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>RL Required?</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.rl_required}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>RL Requirements</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.rl_requirements}</p>
                  </Col>
                </Row>
                <Row>
                  {' '}
                  <Col md={4}>
                    <p className="my-0">
                      <b>Essay Required?</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.essay_required}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Essay Requirements</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">
                      {this.props.program.essay_requirements}
                    </p>
                  </Col>
                </Row>
                <Row>
                  {' '}
                  <Col md={4}>
                    <p className="my-0">
                      <b>Portfolio Required?</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">
                      {this.props.program.portfolio_required}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Portfolio Requirements</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">
                      {this.props.program.portfolio_requirements}
                    </p>
                  </Col>
                </Row>
                <Row>
                  {' '}
                  <Col md={4}>
                    <p className="my-0">
                      <b>Supplementary Form Required?</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">
                      {this.props.program.supplementary_form_required}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Supplementary Form Requirements</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">
                      {this.props.program.supplementary_form_requirements}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Special Notes</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.special_notes}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Comments</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.comments}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Tuition Fees</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.tuition_fees}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Country</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.country}</p>
                  </Col>
                </Row>
                {this.props.program.application_portal_a && (
                  <>
                    <Row>
                      <Col md={4}>
                        <p className="my-0">
                          <b>Portal Link 1</b>
                        </p>
                      </Col>
                      <Col md={8}>
                        <a
                          className="my-0"
                          href={this.props.program.application_portal_a}
                          target="_blank"
                        >
                          Portal Link 1
                        </a>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <p className="my-0">
                          <b>Portal Instructions 1</b>
                        </p>
                      </Col>
                      <Col md={8}>
                        <a
                          className="my-0"
                          href={
                            this.props.program.application_portal_a_instructions
                          }
                          target="_blank"
                        >
                          Portal Instructions 1
                        </a>
                      </Col>
                    </Row>
                  </>
                )}
                {this.props.program.application_portal_b && (
                  <>
                    <Row>
                      <Col md={4}>
                        <p className="my-0">
                          <b>Portal Link 2</b>
                        </p>
                      </Col>
                      <Col md={8}>
                        <a
                          className="my-0"
                          href={this.props.program.application_portal_b}
                          target="_blank"
                        >
                          Portal Link 2
                        </a>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <p className="my-0">
                          <b>Portal Instructions 2</b>
                        </p>
                      </Col>
                      <Col md={8}>
                        <a
                          className="my-0"
                          href={
                            this.props.program.application_portal_b_instructions
                          }
                          target="_blank"
                        >
                          Portal Instructions 2
                        </a>
                      </Col>
                    </Row>
                  </>
                )}
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Website</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0"></p>
                    <a
                      className="my-0"
                      href={this.props.program.website}
                      target="_blank"
                    >
                      website
                    </a>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>FPSO</b>
                    </p>
                  </Col>
                  <Col md={8}>
                    <p className="my-0">{this.props.program.fpso}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="my-0">
                      <b>Last Update</b>
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="my-0">
                      <b>{convertDate(this.props.program.updatedAt)}</b>
                    </p>
                  </Col>
                </Row>
                {is_TaiGer_AdminAgent(this.props.user) && (
                  <>
                    <Row>
                      <Col md={4}>
                        <p className="my-0">Updated by</p>
                      </Col>
                      <Col md={6}>
                        <p className="my-0">{this.props.program.whoupdated}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <p className="my-0">Group</p>
                      </Col>
                      <Col md={6}>
                        <p className="my-0">
                          {this.props.program.study_group_flag}
                        </p>
                      </Col>
                    </Row>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
          {is_TaiGer_role(this.props.user) && (
            <Col md={4}>
              <Card>
                <Card.Header>
                  <Card.Title>Who has applied this?</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Table className="px-0 my-0 mx-0" size="sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Year</th>
                        <th>Admission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.students.map((student, i) => (
                        <tr key={i}>
                          <td>
                            <Link
                              to={`/student-database/${student._id.toString()}/profile`}
                            >
                              {student.firstname} {student.lastname}
                            </Link>
                          </td>
                          <td>
                            {student.application_preference
                              ? student.application_preference
                                  .expected_application_date
                              : '-'}
                          </td>
                          <td>
                            {student.applications.find(
                              (application) =>
                                application.programId.toString() ===
                                this.props.programId
                            )
                              ? student.applications.find(
                                  (application) =>
                                    application.programId.toString() ===
                                    this.props.programId
                                ).admission
                              : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <br></br>
                  O: admitted, X: rejected, -: not confirmed
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </>
    );
  }
}
export default SingleProgramView;

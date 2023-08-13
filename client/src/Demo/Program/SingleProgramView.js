import React from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  is_TaiGer_AdminAgent,
  is_TaiGer_role
} from '../Utils/checking-functions';
import { convertDate, program_fields } from '../Utils/contants';

class SingleProgramView extends React.Component {
  render() {
    return (
      <>
        <Row>
          <Col md={is_TaiGer_role(this.props.user) ? 8 : 12}>
            <Card>
              <Card.Body>
                {program_fields.map((program_field, i) => (
                  <Row>
                    <Col md={4}>
                      <p className="my-0">
                        <b>{program_field.name}</b>
                      </p>
                    </Col>
                    <Col md={8}>
                      <p className="my-0">
                        {this.props.program[program_field.prop]}
                      </p>
                    </Col>
                  </Row>
                ))}
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

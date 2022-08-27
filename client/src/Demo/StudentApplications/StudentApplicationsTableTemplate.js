import React from 'react';
import { Row, Col, Spinner, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Aux from '../../hoc/_Aux';

class StudentApplicationsTableTemplate extends React.Component {
 
  getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
  }
  render() {
    var applying_university;
    var applying_program;
    var application_deadline;
    var application_date_left;
    var application_decided;
    var application_closed;
    var application_admission;
    var today = new Date();
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university = <h6 className="mb-1"> No University</h6>;
      applying_program = <h6 className="mb-1"> No Program</h6>;
      application_deadline = <h6 className="mb-1"> No Date</h6>;
      application_date_left = <h6 className="mb-1"></h6>;
      application_decided = <h6 className="mb-1"></h6>;
      application_closed = <h6 className="mb-1"></h6>;
    } else {
      applying_university = this.props.student.applications.map(
        (application, i) => (
          <Link to={'/programs/' + application.programId._id}>
            <h6 className="mb-1" key={i}>
              {application.programId.school}
            </h6>
          </Link>
        )
      );
      applying_program = this.props.student.applications.map(
        (application, i) => (
          <Link to={'/programs/' + application.programId._id}>
            <h6 className="mb-1" key={i}>
              {application.programId.program_name}
            </h6>
          </Link>
        )
      );
      application_deadline = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {this.props.student.academic_background.university
              .expected_application_date
              ? this.props.student.academic_background.university
                  .expected_application_date + '-'
              : ''}
            {application.programId.application_deadline}
          </h6>
        )
      );

      application_date_left = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {application.closed
              ? '-'
              : this.props.student.academic_background.university
                  .expected_application_date &&
                this.getNumberOfDays(
                  today,
                  this.props.student.academic_background.university
                    .expected_application_date +
                    '-' +
                    application.programId.application_deadline
                )}
          </h6>
        )
      );
      application_decided = this.props.student.applications.map(
        (application, i) =>
          application.decided !== undefined && application.decided === true ? (
            <h6 className="mb-1" key={i}>
              O
            </h6>
          ) : (
            <h6 className="mb-1" key={i}>
              X
            </h6>
          )
      );
      application_closed = this.props.student.applications.map(
        (application, i) =>
          application.closed !== undefined && application.closed === true ? (
            <h6 className="mb-1" key={i}>
              O
            </h6>
          ) : (
            <h6 className="mb-1" key={i}>
              X
            </h6>
          )
      );
      application_admission = this.props.student.applications.map(
        (application, i) =>
          application.admission !== undefined &&
          application.admission === true ? (
            <h6 className="mb-1" key={i}>
              O
            </h6>
          ) : (
            <h6 className="mb-1" key={i}>
              X
            </h6>
          )
      );
    }
    return (
      <Aux>
        <Row>
          <Col>
            <Card className="mt-0">
              <Card.Header>
                <Card.Title as="h5">
                  {' '}
                  {this.props.student.firstname} {this.props.student.lastname}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <>
                        <th>University</th>
                        <th>Programs</th>
                        <th>Deadline</th>
                      </>
                      {window.programstatuslist.map((doc, index) => (
                        <th key={index}>{doc.name}</th>
                      ))}
                      <th>Days left</th>
                    </tr>
                  </thead>
                  {/* {application_progress} */}
                  <tr>
                    <td>{applying_university}</td>
                    <td>{applying_program}</td>
                    <td>{application_deadline}</td>
                    <td>{application_decided}</td>
                    <td>{application_closed}</td>
                    <td>{application_admission}</td>
                    <td>{application_date_left}</td>
                  </tr>{' '}
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default StudentApplicationsTableTemplate;

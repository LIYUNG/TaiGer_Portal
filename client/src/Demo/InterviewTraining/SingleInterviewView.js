import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import EditorNew from '../../components/EditorJs/EditorNew';
import { convertDate } from '../Utils/contants';
import { is_TaiGer_AdminAgent } from '../Utils/checking-functions';

class SingleDocView extends React.Component {
  render() {
    return (
      <>
        <Card className="mb-2 mx-0">
          <Card.Body>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Interview Date</td>
                  <td>{this.props.interview.interview_date}</td>
                </tr>
                <tr>
                  <td>Interview time</td>
                  <td>{this.props.interview.interview_time}</td>
                </tr>
                <tr>
                  <td>Interview duration</td>
                  <td>{this.props.interview.interview_duration}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{this.props.interview.status}</td>
                </tr>
                <tr>
                  <td>Interview University</td>
                  <td>
                    {`${this.props.interview.program_id.school} - ${this.props.interview.program_id.program_name}`}
                  </td>
                </tr>
                <tr>
                  <td>Interviewer</td>
                  <td>{this.props.interview.interviewer}</td>
                </tr>
                <tr>Notes:</tr>
                <tr>
                  <EditorNew
                    readOnly={true}
                    handleClickSave={this.props.handleClickSave}
                    handleClickEditToggle={this.props.handleClickEditToggle}
                    editorState={this.props.editorState}
                  />
                </tr>
              </tbody>
            </table>

            {is_TaiGer_AdminAgent(this.props.user) && (
              <>
                <Row>
                  <Col md={2}>
                    <p className="my-0">Updated at</p>
                  </Col>
                  <Col md={2}>
                    <p className="my-0">
                      {convertDate(this.props.editorState.time)}
                    </p>
                  </Col>
                  <Col md={2}>
                    <p className="my-0">Updated by</p>
                  </Col>
                  <Col md={6}>
                    <p className="my-0">
                      {this.props.author ? this.props.author : '-'}
                    </p>
                  </Col>
                </Row>
              </>
            )}
            {is_TaiGer_AdminAgent(this.props.user) && (
              <Button
                size="sm"
                onClick={(e) => this.props.handleClickEditToggle(e)}
              >
                Edit
              </Button>
            )}
          </Card.Body>
        </Card>
      </>
    );
  }
}
export default SingleDocView;

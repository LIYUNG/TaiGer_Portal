import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import EditorNew from '../../components/EditorJs/EditorNew';
import { convertDate } from '../Utils/contants';
class SingleProgramView extends React.Component {
  render() {
    return (
      <>
        <Card className="mb-2 mx-0">
          <Card.Header>
            <Card.Title>{this.props.document_title}</Card.Title>
          </Card.Header>
          <Card.Body>
            <EditorNew
              readOnly={true}
              handleClickSave={this.props.handleClickSave}
              handleClickCancel={this.props.handleClickCancel}
              editorState={this.props.editorState}
            />
            {(this.props.role === 'Admin' || this.props.role === 'Agent') && (
              <>
                <Row>
                  <Col md={2}>
                    <p className="my-0">Updated at</p>
                  </Col>
                  <Col md={10}>
                    <p className="my-0">
                      {convertDate(this.props.editorState.time)}
                    </p>
                  </Col>
                </Row>
              </>
            )}
            {(this.props.role === 'Admin' || this.props.role === 'Agent') && (
              <Button size="sm" onClick={() => this.props.handleClick()}>
                Edit
              </Button>
            )}
          </Card.Body>
        </Card>
      </>
    );
  }
}
export default SingleProgramView;

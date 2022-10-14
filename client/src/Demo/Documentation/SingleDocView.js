import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
class SingleProgramView extends React.Component {
  render() {
    return (
      <>
        <Card className="mb-2 mx-0">
          <Card.Header>
            <Card.Title>{this.props.document_title}</Card.Title>
          </Card.Header>
          <Card.Body>
            <Editor
              spellCheck={true}
              readOnly={true}
              toolbarHidden={true}
              editorState={this.props.editorState}
            />
            {this.props.role === 'Admin' ||
              (this.props.role === 'Agent' && (
                <>
                  <Row>
                    <Col md={4}>
                      <p className="my-0">Updated by</p>
                    </Col>
                    <Col md={6}>
                      <p className="my-0">{this.props.document}</p>
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
              ))}
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

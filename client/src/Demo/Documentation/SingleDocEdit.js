import React from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import DocumentsListItemsEditor from './DocumentsListItemsEditor';

class SingleProgramEdit extends React.Component {
  state = {
    editorState: this.props.editorState,
    doc_title: ''
  };
  handleChange = (e) => {
    e.preventDefault();
    var doc_title_temp = { ...this.state.doc_title };
    doc_title_temp[e.target.id] = e.target.value;
    this.setState((state) => ({
      ...state,
      doc_title: doc_title_temp
    }));
  };

  handleClickSave = (e, editorState) => {
    e.preventDefault();
    this.props.handleClickSave(e, this.state.doc_title, editorState);
  };
  render() {
    return (
      <>
        <Card>
          <Card.Body>
            <Row>
              <Col>
                <h4>
                  <Form.Group controlId="document_title">
                    <Form.Control
                      type="text"
                      placeholder="Title"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={this.props.document_title}
                    />
                  </Form.Group>
                </h4>
              </Col>
            </Row>
            <Row>
              <DocumentsListItemsEditor
                editorState={this.state.editorState}
                handleClickSave={this.props.handleClickSave}
                handleClickCancel={this.props.handleClickCancel}
                role={this.props.role}
              />
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
}
export default SingleProgramEdit;

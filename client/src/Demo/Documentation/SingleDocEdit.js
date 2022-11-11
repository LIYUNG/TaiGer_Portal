import React from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import DocumentsListItemsEditor from './DocumentsListItemsEditor';
import { valid_categories } from '../Utils/contants';
class SingleDocEdit extends React.Component {
  state = {
    doc_title: this.props.document_title,
    category: this.props.category
  };
  componentDidMount() {
    this.setState({ doc_title: this.props.document_title });
  }
  handleChange_category = (e) => {
    e.preventDefault();
    var category_temp = { ...this.state.category };
    category_temp = e.target.value;
    this.setState((state) => ({
      ...state,
      category: category_temp
    }));
  };

  handleChange = (e) => {
    e.preventDefault();
    var doc_title_temp = { ...this.state.doc_title };
    doc_title_temp = e.target.value;
    this.setState((state) => ({
      ...state,
      doc_title: doc_title_temp
    }));
  };

  handleClickSave = (e, editorState) => {
    e.preventDefault();
    this.props.handleClickSave(
      e,
      this.state.category,
      this.state.doc_title,
      editorState
    );
  };

  render() {
    return (
      <>
        <Card>
          <Card.Body>
            {' '}
            <Row>
              <Col>
                {this.props.category === 'internal' ? (
                  <h4>
                    Category:<b className='text-danger'>Internal</b>
                  </h4>
                ) : (
                  <h4>
                    <Form.Group controlId="category">
                      <Form.Control
                        as="select"
                        onChange={(e) => this.handleChange_category(e)}
                        defaultValue={this.props.category}
                      >
                        <option value={''}>Select Document Category</option>
                        {valid_categories.map((cat, i) => (
                          <option value={cat.key}>{cat.value}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </h4>
                )}
              </Col>
            </Row>{' '}
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
            </Row>{' '}
            <DocumentsListItemsEditor
              doc_title={this.state.doc_title}
              editorState={this.props.editorState}
              handleClickSave={this.handleClickSave}
              handleClickCancel={this.props.handleClickCancel}
              role={this.props.role}
            />
          </Card.Body>
        </Card>
      </>
    );
  }
}
export default SingleDocEdit;

import React from 'react';
import { Row, Col, Spinner, Button, Card, Form, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import DocumentsListItems from './DocumentsListItems';
import DocumentsListItemsEditor from './DocumentsListItemsEditor';
import { valid_internal_categories, spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import {
  getAllInternalDocumentations,
  createInternalDocumentation,
  deleteInternalDocumentation
} from '../../api';

class InternalDocCreatePage extends React.Component {
  state = {
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    documentlists: [],
    doc_id_toBeDelete: '',
    doc_title_toBeDelete: '',
    doc_title: '',
    category: '',
    SetDeleteDocModel: false,
    isEdit: false,
    expand: true,
    editorState: '',
    res_status: 0
  };

  componentDidMount() {
    getAllInternalDocumentations().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            documentlists: data,
            success: success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }

  handleChange_doc_title = (e) => {
    const { value } = e.target;
    this.setState((state) => ({
      ...state,
      doc_title: value
    }));
  };

  handleClick = () => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };

  handleClickAdd = (e) => {
    e.preventDefault();
  };

  handleChange_category = (e) => {
    e.preventDefault();
    const { value } = e.target;
    this.setState({
      category: value
    });
  };

  handleDeleteDoc = (doc) => {
    deleteInternalDocumentation(this.state.doc_id_toBeDelete).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          let documentlists_temp = [...this.state.documentlists];
          let to_be_delete_doc_idx = documentlists_temp.findIndex(
            (doc) => doc._id.toString() === this.state.doc_id_toBeDelete
          );
          if (to_be_delete_doc_idx > -1) {
            // only splice array when item is found
            documentlists_temp.splice(to_be_delete_doc_idx, 1); // 2nd parameter means remove one item only
          }
          this.setState({
            success,
            documentlists: documentlists_temp,
            SetDeleteDocModel: false,
            isEdit: false,
            isLoaded: true,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          });
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };
  openDeleteDocModalWindow = (doc) => {
    this.setState((state) => ({
      ...state,
      doc_id_toBeDelete: doc._id,
      doc_title_toBeDelete: doc.title,
      SetDeleteDocModel: true
    }));
  };

  closeDeleteDocModalWindow = (e) => {
    this.setState((state) => ({
      ...state,
      SetDeleteDocModel: false
    }));
  };

  handleClickCancel = (e) => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };

  handleClickSave = (e, editorState) => {
    e.preventDefault();
    // Editorjs. editorState is in JSON form
    const message = JSON.stringify(editorState);
    const msg = {
      title: this.state.doc_title,
      category: this.state.category,
      prop: this.props.item,
      text: message
    };
    createInternalDocumentation(msg).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          let documentlists_temp = [...this.state.documentlists];
          documentlists_temp.push(data);
          this.setState({
            success,
            documentlists: documentlists_temp,
            editorState: '',
            isEdit: !this.state.isEdit,
            isLoaded: true,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          });
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
    this.setState((state) => ({ ...state, in_edit_mode: false }));
  };

  render() {
    if (
      this.props.user.role !== 'Admin' &&
      this.props.user.role !== 'Editor' &&
      this.props.user.role !== 'Agent'
    ) {
      return <Redirect to="/dashboard/default" />;
    }
    const { res_status, isLoaded } = this.state;

    if (!isLoaded) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    const documentlist_key = Object.keys(window.internaldocumentlist);

    const document_list = (cat) => {
      let sections = {};
      sections[`${cat}`] = this.state.documentlists.filter(
        (document) => document.category === cat
      );
      return sections[`${cat}`].map((document, i) => (
        <DocumentsListItems
          idx={i}
          key={i}
          path={'/docs/internal/search'}
          document={document}
          role={this.props.user.role}
          openDeleteDocModalWindow={this.openDeleteDocModalWindow}
        />
      ));
    };

    return (
      <Aux>
        <Row className="sticky-top ">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0 text-light">
                      All Internal Documentations
                    </Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Card className="mb-2 mx-0">
              {this.state.isEdit ? (
                <>
                  <Card.Body>
                    <Row>
                      <Col>
                        <Form.Group controlId="decided">
                          <Form.Control
                            as="select"
                            onChange={(e) => this.handleChange_category(e)}
                          >
                            <option value={''}>Select Document Category</option>
                            {valid_internal_categories.map((cat, i) => (
                              <option value={cat.key} key={i}>
                                {cat.value}
                              </option>
                            ))}
                            {/* <option value={'X'}>No</option>
                            <option value={'O'}>Yes</option> */}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>{' '}
                    <Row>
                      <Col>
                        <Form.Group controlId="doc_title" className="mb-4">
                          <Form.Control
                            type="text"
                            placeholder="Title"
                            defaultValue={''}
                            onChange={(e) => this.handleChange_doc_title(e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <DocumentsListItemsEditor
                      category={this.state.category}
                      doc_title={this.state.doc_title}
                      editorState={this.state.editorState}
                      handleClickSave={this.handleClickSave}
                      handleClickCancel={this.handleClickCancel}
                      // readOnlyMode={this.readOnlyMode}
                      role={this.props.role}
                    />
                  </Card.Body>
                </>
              ) : (
                <Card.Body>
                  {documentlist_key.map((catego, i) => (
                    <Row className="mb-4" key={i}>
                      <h5>- {window.internaldocumentlist[`${catego}`]}</h5>
                      {document_list(catego)}
                    </Row>
                  ))}
                  {(this.props.user.role === 'Admin' ||
                    this.props.user.role === 'Agent') && (
                    <Button onClick={this.handleClick}>Add</Button>
                  )}
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
        <Modal
          show={this.state.SetDeleteDocModel}
          onHide={this.closeDeleteDocModalWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to delete documentation of title:{' '}
            {this.state.doc_title_toBeDelete}?
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={!isLoaded} onClick={this.handleDeleteDoc}>
              Yes
            </Button>

            <Button onClick={this.closeDeleteDocModalWindow}>No</Button>
          </Modal.Footer>
        </Modal>
      </Aux>
    );
  }
}

export default InternalDocCreatePage;

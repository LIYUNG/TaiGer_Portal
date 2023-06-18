import React from 'react';
import { Row, Col, Spinner, Button, Card, Form, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import DocumentsListItems from './DocumentsListItems';
import DocumentsListItemsEditor from './DocumentsListItemsEditor';
import {
  valid_categories,
  spinner_style,
  documentation_categories
} from '../Utils/contants';
import {
  is_TaiGer_AdminAgent,
  is_TaiGer_role
} from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import {
  getAllDocumentations,
  createDocumentation,
  deleteDocumentation
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';

class DocCreatePage extends React.Component {
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
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    getAllDocumentations().then(
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
    deleteDocumentation(this.state.doc_id_toBeDelete).then(
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
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
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

  handleClickEditToggle = (e) => {
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
    createDocumentation(msg).then(
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
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
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

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    if (!is_TaiGer_role(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }

    const { res_status, isLoaded, res_modal_status, res_modal_message } =
      this.state;

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

    const documentlist_key = Object.keys(documentation_categories);

    const document_list = (cat) => {
      let sections = {};
      sections[`${cat}`] = this.state.documentlists.filter(
        (document) => document.category === cat
      );
      return sections[`${cat}`].map((document, i) => (
        <DocumentsListItems
          idx={i}
          key={i}
          path={'/docs/search'}
          document={document}
          user={this.props.user}
          openDeleteDocModalWindow={this.openDeleteDocModalWindow}
        />
      ));
    };
    TabTitle('Docs Database');
    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <Row className="sticky-top ">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0 text-light">
                      All Documentations
                    </Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            {this.state.isEdit ? (
              <>
                <Card className="mb-2 mx-0">
                  <Card.Body>
                    <Row>
                      <Col>
                        <Form.Group controlId="decided">
                          <Form.Control
                            as="select"
                            onChange={(e) => this.handleChange_category(e)}
                          >
                            <option value={''}>Select Document Category</option>
                            {valid_categories.map((cat, i) => (
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
                            placeholder="title"
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
                      handleClickEditToggle={this.handleClickEditToggle}
                      // readOnlyMode={this.readOnlyMode}
                      role={this.props.role}
                    />
                  </Card.Body>
                </Card>
              </>
            ) : (
              <>
                <Row className="mb-2">
                  {documentlist_key.map((catego, i) => (
                    <Col md={4} key={i}>
                      <Card className="mb-1 mx-0">
                        <Card.Header>
                          <Card.Title className="my-0 mx-0">
                            {documentation_categories[`${catego}`]}
                          </Card.Title>
                        </Card.Header>
                        <Card.Body>{document_list(catego)}</Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {is_TaiGer_AdminAgent(this.props.user) && (
                  <Button onClick={this.handleClick}>Add</Button>
                )}
              </>
            )}
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

export default DocCreatePage;

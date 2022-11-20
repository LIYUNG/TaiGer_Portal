import React from 'react';
import { Row, Col, Spinner, Button, Card, Form, Modal } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import DocumentsListItems from './DocumentsListItems';
import DocumentsListItemsEditor from './DocumentsListItemsEditor';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import PageNotFoundError from '../Utils/PageNotFoundError';
import { valid_categories } from '../Utils/contants';
import { Redirect } from 'react-router-dom';
import {
  getAllDocumentations,
  createDocumentation,
  deleteDocumentation
} from '../../api';

class DocCreatePage extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
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
    accordionKeys:
      Object.keys(window.checklist) &&
      (this.props.user.role === 'Editor' || this.props.user.role === 'Agent')
        ? new Array(Object.keys(window.checklist).length)
            .fill()
            .map((x, i) => i)
        : [0] // to expand all]
  };

  componentDidMount() {
    getAllDocumentations().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            documentlists: data,
            success: success
          });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          } else {
            this.setState({ isLoaded: true, pagenotfounderror: true });
          }
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  }

  singleExpandtHandler = (idx) => {
    let accordionKeys = [...this.state.accordionKeys];
    accordionKeys[idx] = accordionKeys[idx] !== idx ? idx : -1;
    this.setState((state) => ({
      ...state,
      accordionKeys: accordionKeys
    }));
  };

  AllCollapsetHandler = () => {
    const checklist = Object.keys(window.checklist);
    this.setState((state) => ({
      ...state,
      expand: false,
      accordionKeys:
        checklist &&
        (this.props.user.role === 'Editor' || this.props.user.role === 'Agent')
          ? new Array(checklist.length).fill().map((x, i) => -1)
          : [-1] // to expand all]
    }));
  };

  AllExpandtHandler = () => {
    const checklist = Object.keys(window.checklist);
    this.setState((state) => ({
      ...state,
      expand: true,
      accordionKeys:
        checklist && new Array(checklist.length).fill().map((x, i) => i)
      // to expand all]
    }));
  };

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
        let documentlists_temp = [...this.state.documentlists];
        let to_be_delete_doc_idx = documentlists_temp.findIndex(
          (doc) => doc._id.toString() === this.state.doc_id_toBeDelete
        );
        if (to_be_delete_doc_idx > -1) {
          // only splice array when item is found
          documentlists_temp.splice(to_be_delete_doc_idx, 1); // 2nd parameter means remove one item only
        }
        if (success) {
          this.setState({
            success,
            documentlists: documentlists_temp,
            SetDeleteDocModel: false,
            isEdit: false,
            isLoaded: true
          });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          } else if (resp.status === 400) {
            this.setState({ isLoaded: true, pagenotfounderror: true });
          }
        }
      },
      (error) => {
        this.setState({ error });
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
    // react-draftjs-wysiwyg
    // const message = JSON.stringify(
    //   convertToRaw(editorState.getCurrentContent())
    // );

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
        let documentlists_temp = [...this.state.documentlists];
        documentlists_temp.push(data);
        if (success) {
          this.setState({
            success,
            documentlists: documentlists_temp,
            editorState: '',
            isEdit: !this.state.isEdit,
            isLoaded: true
          });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          } else {
            this.setState({ isLoaded: true, pagenotfounderror: true });
          }
        }
      },
      (error) => {
        this.setState({ error });
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
    const { unauthorizederror, timeouterror, isLoaded, pagenotfounderror } =
      this.state;
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (timeouterror) {
      return (
        <div>
          <TimeOutErrors />
        </div>
      );
    }
    if (unauthorizederror) {
      return (
        <div>
          <UnauthorizedError />
        </div>
      );
    }
    if (pagenotfounderror) {
      return (
        <div>
          <PageNotFoundError />
        </div>
      );
    }
    if (!isLoaded) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    const documentlist_key = Object.keys(window.documentlist);

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
                      All Documentations
                    </Col>
                    <Col md={{ span: 2, offset: 0 }}>
                      {this.state.expand ? (
                        <Button
                          size="sm"
                          onClick={() => this.AllCollapsetHandler()}
                        >
                          Collaspse
                        </Button>
                      ) : (
                        <Button
                          size={'sm'}
                          onClick={() => this.AllExpandtHandler()}
                        >
                          Expand
                        </Button>
                      )}
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
                      handleClickCancel={this.handleClickCancel}
                      // readOnlyMode={this.readOnlyMode}
                      role={this.props.role}
                    />
                  </Card.Body>
                </>
              ) : (
                <Card.Body>
                  {documentlist_key.map((catego, i) => (
                    <>
                      <Row key={i}>
                        <h5>- {window.documentlist[`${catego}`]}</h5>
                      </Row>
                      <Row key={i}>{document_list(catego)}</Row>
                    </>
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

export default DocCreatePage;

import React, { Component } from 'react';
import {
  Card,
  Spinner,
  Collapse,
  Button,
  Modal,
  Row,
  Col
} from 'react-bootstrap';
import { RiCloseFill } from 'react-icons/ri';
import { BASE_URL } from '../../../api/request';
import EditorSimple from '../../../components/EditorJs/EditorSimple';
import { FileIcon, defaultStyles } from 'react-file-icon';
// import Output from 'editorjs-react-renderer';
import { stringAvatar, convertDate } from '../../Utils/contants';
import { Avatar } from '@mui/material';

class Message extends Component {
  state = {
    editorState: null,
    ConvertedContent: '',
    message_id: '',
    isLoaded: false,
    deleteMessageModalShow: false
  };
  componentDidMount() {
    var initialEditorState = null;
    if (this.props.message.message && this.props.message.message !== '{}') {
      try {
        initialEditorState = JSON.parse(this.props.message.message);
      } catch (e) {
        initialEditorState = { time: new Date(), blocks: [] };
      }
    } else {
      initialEditorState = { time: new Date(), blocks: [] };
    }
    this.setState((state) => ({
      ...state,
      editorState: initialEditorState,
      ConvertedContent: initialEditorState,
      isLoaded: this.props.isLoaded
    }));
  }

  onOpendeleteMessageModalShow = (e, message_id, createdAt) => {
    this.setState({ message_id, deleteMessageModalShow: true, createdAt });
  };
  onHidedeleteMessageModalShow = (e) => {
    this.setState({
      message_id: '',
      createdAt: '',
      deleteMessageModalShow: false
    });
  };

  onDeleteSingleMessage = (e) => {
    e.preventDefault();
    this.props.onDeleteSingleMessage(e, this.state.message_id);
  };

  render() {
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (!this.state.isLoaded && !this.state.editorState) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    let firstname = this.props.message.user_id
      ? this.props.message.user_id.firstname
      : 'Staff';
    let lastname = this.props.message.user_id
      ? this.props.message.user_id.lastname
      : 'TaiGer';
    const editable = this.props.message.user_id
      ? this.props.message.user_id._id.toString() ===
        this.props.user._id.toString()
        ? true
        : false
      : false;
    const full_name = `${firstname} ${lastname}`;
    const files_info = this.props.message.file.map((file, i) => (
      <Card key={i} className="my-0 mx-0">
        <Card.Body>
          <Row>
            <Col md={1} style={{ height: '15%', width: '15%' }}>
              {/* <h5> */}
              <span>
                {/* /api/document-threads/${documentsthreadId}/${messageId}/${file_key} */}
                <a
                  href={`${BASE_URL}/api/document-threads/${
                    this.props.documentsthreadId
                  }/${this.props.message._id.toString()}/${
                    file.path.replace(/\\/g, '/').split('/')[2]
                  }`}
                  target="_blank"
                >
                  <FileIcon
                    // style={{ cursor: 'pointer', width: '0%', size: 12 }}
                    extension={file.name.split('.').pop()}
                    {...defaultStyles[file.name.split('.').pop()]}
                  />
                </a>
              </span>
              {/* </h5> */}
            </Col>
            <Col className="my-4" style={{ height: '15%' }}>
              {/* /api/document-threads/${documentsthreadId}/${messageId}/${file_key} */}
              <a
                href={`${BASE_URL}/api/document-threads/${
                  this.props.documentsthreadId
                }/${this.props.message._id.toString()}/${
                  file.path.replace(/\\/g, '/').split('/')[2]
                }`}
                target="_blank"
              >
                {file.name}
              </a>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    ));

    return (
      <>
        <Card border="primary" className="mb-2 mx-0">
          <Card.Header
            as="h5"
            aria-controls={'accordion' + this.props.idx}
            aria-expanded={
              this.props.accordionKeys[this.props.idx] === this.props.idx
            }
            className="ps-2 py-2 pe-0 "
          >
            <Row className="my-0">
              <Col
                md={1}
                className="px-1  pe-0 "
                style={{ height: '10%', width: '10%' }}
                onClick={() => this.props.singleExpandtHandler(this.props.idx)}
              >
                <Avatar {...stringAvatar(full_name)} />
              </Col>
              <Col className="ps-2 mx-2 mt-2">
                <p>
                  <b
                    style={{ cursor: 'pointer' }}
                    className="ps-0 my-1"
                    onClick={() =>
                      this.props.singleExpandtHandler(this.props.idx)
                    }
                  >
                    {full_name}
                  </b>
                  <span style={{ float: 'right' }}>
                    {convertDate(this.props.message.createdAt)}
                    {editable && (
                      <RiCloseFill
                        className="mx-0"
                        color="red"
                        title="Delete this message and file"
                        size={20}
                        onClick={(e) =>
                          this.onOpendeleteMessageModalShow(
                            e,
                            this.props.message._id.toString(),
                            this.props.message.createdAt
                          )
                        }
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                  </span>
                </p>
              </Col>
              {/* <Col>
              <p className="ps-0">
                <span style={{ float: 'right', cursor: 'pointer' }}>
                <span style={{ float: 'right' }}></span>
              </p>
            </Col> */}
            </Row>
          </Card.Header>
          <Collapse
            in={this.props.accordionKeys[this.props.idx] === this.props.idx}
          >
            <Card.Body>
              {/* {JSON.stringify(this.state.editorState)} */}
              {/* <section>
              <Output data={this.state.editorState} />
            </section> */}
              <EditorSimple
                holder={`${this.props.message._id.toString()}`}
                readOnly={true}
                handleClickSave={this.props.handleClickSave}
                editorState={this.state.editorState}
                defaultHeight={0}
              />
              {files_info}
            </Card.Body>
          </Collapse>
        </Card>
        <Modal
          show={this.state.deleteMessageModalShow}
          onHide={this.onHidedeleteMessageModalShow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you wan to delete this message on{' '}
            <b>{convertDate(this.state.createdAt)}?</b>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!this.props.isLoaded}
              variant="danger"
              onClick={this.onDeleteSingleMessage}
            >
              {this.props.isLoaded ? 'Delete' : 'Pending'}
            </Button>
            <Button onClick={this.onHidedeleteMessageModalShow}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Message;

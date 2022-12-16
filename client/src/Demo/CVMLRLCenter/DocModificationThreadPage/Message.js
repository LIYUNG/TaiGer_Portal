import React, { Component } from 'react';
import { Card, Spinner, Collapse, Button, Row, Col } from 'react-bootstrap';
import { RiMoreFill } from 'react-icons/ri';
import { BASE_URL } from '../../../api/request';
// import EditorSimple from '../../../components/EditorJs/EditorSimple';
import { FileIcon, defaultStyles } from 'react-file-icon';
import Output from 'editorjs-react-renderer';
import { stringAvatar } from '../../Utils/contants';
import { Avatar } from '@mui/material';

class Message extends Component {
  state = {
    editorState: null,
    ConvertedContent: '',
    isLoaded: false
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

  render() {
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (!this.state.isLoaded) {
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
      <Card border="primary" className="mb-2 mx-0">
        <Card.Header
          onClick={() => this.props.singleExpandtHandler(this.props.idx)}
          as="h5"
          aria-controls={'accordion' + this.props.idx}
          aria-expanded={
            this.props.accordionKeys[this.props.idx] === this.props.idx
          }
          className="my-0 mx-0"
        >
          <Row className="my-0 me-0">
            <Col
              md={1}
              className="mx-0 my-0"
              style={{ height: '15%', width: '15%' }}
            >
              <Avatar {...stringAvatar(full_name)} />
            </Col>
            <Col className="mt-2">
              <p className="my-0">
                <b>{full_name}</b>
                <span style={{ float: 'right', cursor: 'pointer' }}>
                  {new Date(this.props.message.createdAt).toLocaleTimeString()}
                  {', '}
                  {new Date(this.props.message.createdAt).toLocaleDateString()}
                  <RiMoreFill className="ms-2" />
                </span>
              </p>
            </Col>
          </Row>
        </Card.Header>
        <Collapse
          in={this.props.accordionKeys[this.props.idx] === this.props.idx}
        >
          <Card.Body>
            {/* {JSON.stringify(this.state.editorState)} */}
            <section>
              <Output data={this.state.editorState} />
            </section>
            {/* <EditorSimple
              holder={`${this.props.message._id.toString()}`}
              readOnly={true}
              handleClickSave={this.props.handleClickSave}
              handleClickCancel={this.props.handleClickCancel}
              editorState={this.state.editorState}
            /> */}
            {files_info}
          </Card.Body>
        </Collapse>
      </Card>
    );
  }
}

export default Message;

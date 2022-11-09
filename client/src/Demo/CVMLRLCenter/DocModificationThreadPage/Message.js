import React, { Component } from 'react';
import { Card, Spinner, Collapse, Button, Row, Col } from 'react-bootstrap';
import { RiMoreFill } from 'react-icons/ri';
import EditorSimple from '../../../components/EditorJs/EditorSimple';
import { FileIcon, defaultStyles } from 'react-file-icon';

class Message extends Component {
  state = {
    editorState: null,
    ConvertedContent: '',
    isLoaded: false
  };
  componentDidMount() {
    var initialEditorState = null;
    if (this.props.message.message) {
      try {
        initialEditorState = JSON.parse(this.props.message.message);
      } catch (e) {
        initialEditorState = {};
      }
    } else {
      initialEditorState = {};
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
    const files_info = this.props.message.file.map((file, i) => (
      <Row key={i}>
        {/* <div>{file._id}</div>
         */}
        <Col
          md={1}
          style={{ cursor: 'pointer' }}
          onClick={(e) =>
            this.props.onDownloadFileInMessage(
              e,
              this.props.message._id,
              file._id
            )
          }
        >
          <FileIcon
            radius={4}
            extension={file.name.split('.').pop()}
            {...defaultStyles[file.name.split('.').pop()]}
          />
        </Col>
        <Col md={11} className="my-3">
          {' '}
          <p
            style={{ cursor: 'pointer' }}
            onClick={(e) =>
              this.props.onDownloadFileInMessage(
                e,
                this.props.message._id,
                file._id
              )
            }
          >
            {file.name}
          </p>
        </Col>
      </Row>
    ));

    return (
      <Card border="primary" className="mb-2 mx-0">
        <Card.Header
          onClick={() => this.props.singleExpandtHandler(this.props.idx)}
        >
          <Card.Title
            as="h5"
            aria-controls={'accordion' + this.props.idx}
            aria-expanded={
              this.props.accordionKeys[this.props.idx] === this.props.idx
            }
          >
            {this.props.message.user_id.firstname}{' '}
            {this.props.message.user_id.lastname}
            {' on '}
            {new Date(this.props.message.createdAt).toLocaleTimeString()}
            {', '}
            {new Date(this.props.message.createdAt).toLocaleDateString()}
          </Card.Title>
          <RiMoreFill />
          {/* <Dropdown >
            <FiMoreHorizontal />
            <Dropdown.Toggle
              split
              variant="secondary"
              id="dropdown-split-basic-2"
            />
            <Dropdown.Menu>
              <Dropdown.Item hred="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item hred="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item hred="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
        </Card.Header>
        <Collapse
          in={this.props.accordionKeys[this.props.idx] === this.props.idx}
        >
          <Card.Body>
            {/* {JSON.stringify(this.state.editorState)} */}
            <EditorSimple
              holder={`${this.props.message._id.toString()}`}
              readOnly={true}
              handleClickSave={this.props.handleClickSave}
              handleClickCancel={this.props.handleClickCancel}
              editorState={this.state.editorState}
            />

            {files_info}
          </Card.Body>
        </Collapse>
      </Card>
    );
  }
}

export default Message;

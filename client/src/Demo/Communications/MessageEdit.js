import React, { Component } from 'react';
import {
  Card,
  Spinner,
  Button,
  Modal,
  Row,
  Col,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import { RiCloseFill } from 'react-icons/ri';

// import Output from 'editorjs-react-renderer';
import EditorSimple from '../../components/EditorJs/EditorSimple';
import { stringAvatar, convertDate } from '../Utils/contants';
import { Avatar } from '@mui/material';

class MessageEdit extends Component {
  state = {
    editorState: null,
    message_id: '',
    deleteMessageModalShow: false
  };

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
    this.setState({ deleteMessageModalShow: false });
    this.props.onDeleteSingleMessage(e, this.state.message_id);
  };

  handleEditorChange = (content) => {
    this.setState((state) => ({
      ...state,
      editorState: content
    }));
  };

  renderTooltip = (props) => (
    <Tooltip id="tooltip-disabled" {...props}>
      Please write some text to improve the communication and understanding.
    </Tooltip>
  );
  render() {
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (!this.props.editorState) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    return (
      <>
        <Card border="primary" className="mb-2 mx-0">
          <Card.Header
            as="h5"
            aria-controls={'accordion' + this.props.idx}
            className="ps-2 py-2 pe-0 "
          >
            <Row className="my-0">
              <Col
                md={1}
                className="px-1  pe-0 "
                style={{ height: '10%', width: '10%' }}
              >
                <Avatar {...stringAvatar(this.props.full_name)} />
              </Col>
              <Col className="ps-2 mx-2 mt-2">
                <p>
                  <b style={{ cursor: 'pointer' }} className="ps-0 my-1">
                    {this.props.full_name}
                  </b>
                  <span style={{ float: 'right' }}>
                    {convertDate(this.props.message.createdAt)}
                    {this.props.editable && (
                      <>
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
                      </>
                    )}
                  </span>
                </p>
              </Col>
            </Row>
          </Card.Header>
          {/* <Card.Body> */}
          <Row style={{ textDecoration: 'none' }}>
            <Col className="my-0 mx-0">
              <Card border="dark">
                <Card.Body border="dark">
                  <EditorSimple
                    holder={`${this.props.message._id.toString()}`}
                    readOnly={false}
                    imageEnable={false}
                    editorState={this.props.editorState}
                    handleEditorChange={this.handleEditorChange}
                    defaultHeight={0}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="my-0 mx-0">
              {!this.state.editorState?.blocks ||
              this.state.editorState?.blocks.length === 0 ||
              this.props.buttonDisabled ? (
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={this.renderTooltip}
                >
                  <span className="d-inline-block">
                    <Button disabled={true} style={{ pointerEvents: 'none' }}>
                      Save
                    </Button>
                  </span>
                </OverlayTrigger>
              ) : (
                <Button
                  onClick={(e) =>
                    this.props.handleClickSave(
                      e,
                      this.state.editorState,
                      this.props.message._id.toString()
                    )
                  }
                >
                  Save
                </Button>
              )}
              <Button
                variant="danger"
                onClick={(e) => this.props.handleCancelEdit(e)}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Card>
        {/* TODOL consider to move it to the parent! It render many time! as message increase */}
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
            <Button onClick={this.onHidedeleteMessageModalShow} variant="light">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default MessageEdit;

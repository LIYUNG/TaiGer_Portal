import React, { Component } from 'react';
import { Card, Spinner, Row, Col } from 'react-bootstrap';
import { BASE_URL } from '../../../api/request';
import { FileIcon, defaultStyles } from 'react-file-icon';

class FileItem extends Component {
  state = {
    editorState: null,
    ConvertedContent: '',
    message_id: '',
    isLoaded: false,
    deleteMessageModalShow: false
  };
  componentDidMount() {
    this.setState((state) => ({
      ...state,
      isLoaded: this.props.isLoaded,
      deleteMessageModalShow: false
    }));
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.message.message !== this.props.message.message) {
      this.setState((state) => ({
        ...state,
        isLoaded: this.props.isLoaded,
        deleteMessageModalShow: false
      }));
    }
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
      <Card key={i} className="my-0">
        <Card.Body className="py-2 px-0">
          <Row>
            <Col>
              <span>
                <a
                  href={`${BASE_URL}/api/document-threads/${
                    this.props.documentsthreadId
                  }/${this.props.message._id.toString()}/${
                    file.path.replace(/\\/g, '/').split('/')[2]
                  }`}
                  target="_blank"
                >
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-2"
                  >
                    <FileIcon
                      extension={file.name.split('.').pop()}
                      {...defaultStyles[file.name.split('.').pop()]}
                    />
                  </svg>
                  {file.name}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m7 10 4.86 4.86c.08.08.2.08.28 0L17 10"
                      stroke="#000"
                      strokeWidth="2"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                </a>
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    ));

    return <>{files_info}</>;
  }
}

export default FileItem;

import React from 'react';

import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../components/DraftEditor.css';

// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { updateChecklistDocument } from '../../api';

class CheckListItemsEditor extends React.Component {
  state = {
    editorState: null
  };
  componentDidMount() {
    this.setState((state) => ({
      ...state,
      editorState: this.props.editorState
    }));
  }

  handleEditorChange = (newstate) => {
    this.setState((state) => ({ ...state, editorState: newstate }));
  };

  render() {
    return (
      <>
        <Row style={{ textDecoration: 'none' }}>
          <Col className="my-0 mx-0">
            <Editor
              // toolbarOnFocus
              // toolbarHidden
              spellCheck={true}
              // onFocus={onClick={this.handle}}
              placeholder={'Write comments'}
              editorState={this.state.editorState}
              onEditorStateChange={this.handleEditorChange}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
              toolbar={{
                // options: [
                //   'inline',
                //   'fontSize',
                //   'fontFamily',
                //   'list',
                //   'textAlign',
                //   // "colorPicker",
                //   'link',
                //   'image'
                //   // "file",
                // ],
                link: {
                  defaultTargetOption: '_blank',
                  popupClassName: 'mail-editor-link'
                },
                image: {
                  urlEnabled: true,
                  uploadEnabled: true,
                  uploadCallback: this.uploadImageCallBack,
                  alignmentEnabled: true,
                  defaultSize: {
                    height: 'auto',
                    width: 'auto'
                  },
                  inputAccept:
                    'application/pdf,text/plain,application/vnd.openxmlformatsofficedocument.wordprocessingml.document,application/msword,application/vnd.ms-excel'
                }
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col className="my-0 mx-4">
            <Button
              onClick={(e) =>
                this.props.handleClickSave(e, this.state.editorState)
              }
            >
              Save
            </Button>
            <Button
              onClick={(e) =>
                this.props.handleClickCancel(e, this.state.editorState)
              }
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default CheckListItemsEditor;

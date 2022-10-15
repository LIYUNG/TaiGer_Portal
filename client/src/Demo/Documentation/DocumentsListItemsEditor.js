import React, { useEffect, useState } from 'react';

import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import {
  convertToRaw,
  convertFromRaw,
  ContentState,
  EditorState,
  convertFromHTML
} from 'draft-js';
// const { contentBlocks, entityMap } = convertFromHTML(
//   this.getInputValue() || ''
// );
// const contentState = ContentState.createFromBlockArray(
//   contentBlocks,
//   entityMap
// );
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../components/DraftEditor.css';

// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { updateChecklistDocument, uploadImage } from '../../api';

function DocumentsListItemsEditor(props) {
  let [statedata, setStatedata] = useState({
    editorState: null
  });

  useEffect(() => {
    setStatedata((state) => ({
      ...state,
      editorState: props.editorState
    }));
  }, []);

  const handleEditorChange = (newstate) => {
    setStatedata((state) => ({
      ...state,
      editorState: newstate
      // editorState: AtomicBlockUtils.insertAtomicBlock(newstate, entityKey, ' ')
    }));
  };

  const uploadImageCallBack = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return new Promise((resolve, reject) => {
      console.log('Uploading image...');
      uploadImage(formData)
        .then((res) => {
          resolve({ data: { link: res.data.data } });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const myBlockRenderer = (contentBlock) => {
    const type = contentBlock.getType();

    // Convert image type to mediaComponent
    if (type === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
        props: {
          foo: 'bar'
        }
      };
    }
  };
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
            editorState={statedata.editorState}
            // editorState={this.state.editorState}
            onEditorStateChange={handleEditorChange}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            toolbar={{
              options: [
                'inline',
                'fontSize',
                'fontFamily',
                'list',
                'textAlign',
                'colorPicker',
                'link',
                'emoji',
                'image',
                'remove',
                'history'
                // "file",
              ],
              inline: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: [
                  'bold',
                  'italic',
                  'underline',
                  'strikethrough',
                  'monospace',
                  'superscript',
                  'subscript'
                ],
                // bold: { icon: bold, className: undefined },
                // italic: { icon: italic, className: undefined },
                // underline: { icon: underline, className: undefined },
                // strikethrough: { icon: strikethrough, className: undefined },
                // monospace: { icon: monospace, className: undefined },
                // superscript: { icon: superscript, className: undefined },
                // subscript: { icon: subscript, className: undefined }
              },
              link: {
                defaultTargetOption: '_blank',
                popupClassName: 'mail-editor-link'
              },
              image: {
                urlEnabled: true,
                uploadEnabled: true,
                uploadCallback: uploadImageCallBack,
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
            onClick={(e) => props.handleClickSave(e, statedata.editorState)}
          >
            Save
          </Button>
          <Button
            onClick={(e) => props.handleClickCancel(e, statedata.editorState)}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default DocumentsListItemsEditor;

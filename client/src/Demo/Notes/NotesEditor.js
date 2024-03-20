import React, { useEffect, useState } from 'react';
import { Button, Tooltip, Card } from '@mui/material';
import { useTranslation } from 'react-i18next';

import EditorSimple from '../../components/EditorJs/EditorSimple';

function NotesEditor(props) {
  const { t } = useTranslation();
  let [statedata, setStatedata] = useState({
    editorState: props.editorState,
    buttonDisabled: true
  });
  useEffect(() => {
    setStatedata((state) => ({
      ...state,
      editorState: props.editorState
    }));
  }, [props.editorState]);
  const handleEditorChange = (content) => {
    setStatedata((state) => ({
      ...state,
      editorState: content,
      buttonDisabled: false
    }));
  };

  const handleClickSave = (e, editorState) => {
    setStatedata((state) => ({
      ...state,
      buttonDisabled: true
    }));
    props.handleClickSave(e, editorState);
  };

  return (
    <>
      <Card sx={{ padding: 4, mb: 2, minHeight: 200 }}>
        <EditorSimple
          holder={`${props.notes_id}`}
          thread={props.thread}
          defaultHeight={0}
          readOnly={props.readOnly}
          handleEditorChange={handleEditorChange}
          editorState={props.editorState}
          setStatedata={setStatedata}
        />
      </Card>
      {!props.readOnly &&
        (!statedata.editorState.blocks ||
        statedata.editorState.blocks.length === 0 ||
        statedata.buttonDisabled ||
        props.buttonDisabled ? (
          <Tooltip title="Please write some text to improve the communication and understanding.">
            <span>
              <Button
                fullWidth
                variant="outlined"
                disabled={true}
                // style={{ pointerEvents: 'none' }}
              >
                {t('Save', { ns: 'common' })}
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Tooltip title="Please write some text to improve the communication and understanding.">
            <span>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={(e) => handleClickSave(e, statedata.editorState)}
              >
                {t('Save', { ns: 'common' })}
              </Button>
            </span>
          </Tooltip>
        ))}
    </>
  );
}

export default NotesEditor;

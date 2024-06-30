import React from 'react';
import { Button, Tooltip, Card } from '@mui/material';
import { useTranslation } from 'react-i18next';

import EditorNote from '../../components/EditorJs/EditorNote';

function DescriptionEditor(props) {
  const { t } = useTranslation();
  return (
    <>
      <Card sx={{ padding: 4, mb: 2, minHeight: 200 }}>
        <EditorNote
          holder={`${props.notes_id}`}
          thread={props.thread}
          defaultHeight={0}
          readOnly={props.readOnly}
          handleEditorChange={props.handleEditorChange}
          editorState={props.editorState}
        />
      </Card>
      {!props.readOnly &&
        (props.buttonDisabled ? (
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
                onClick={(e) => props.handleClickSave(e, props.editorState)}
              >
                {t('Save', { ns: 'common' })}
              </Button>
            </span>
          </Tooltip>
        ))}
    </>
  );
}

export default DescriptionEditor;

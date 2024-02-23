import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import SendIcon from '@mui/icons-material/Send';

import EditorSimple from '../../../components/EditorJs/EditorSimple';
import { Button, Grid, Card, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

function DocThreadEditor(props) {
  const { t } = useTranslation();
  let [statedata, setStatedata] = useState({
    editorState: props.editorState
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
      editorState: content
    }));
  };

  const renderTooltip = (props) => (
    <Tooltip id="tooltip-disabled" {...props}>
      Please write some text to improve the communication and understanding.
    </Tooltip>
  );

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ px: 4, pt: 2, minHeight: 200 }}>
            <EditorSimple
              holder={'editorjs'}
              thread={props.thread}
              defaultHeight={0}
              readOnly={false}
              imageEnable={true}
              handleEditorChange={handleEditorChange}
              handleClickSave={props.handleClickSave}
              editorState={props.editorState}
              setStatedata={setStatedata}
            />
          </Card>
        </Grid>
        <Grid item xs={12}>
          {/* <Input
            fullWidth
            inputComponent="input"
            inputProps={{ multiple: true }}
            type="file"
            onChange={(e) => props.onFileChange(e)}
            // inputRef={this.fileInputRef}
          /> */}
          {/* <Button type="submit" variant="contained" color="primary">
              Submit
            </Button> */}
          <TextField
            fullWidth
            size="small"
            type="file"
            // multiple
            inputProps={{
              multiple: true
            }}
            onChange={(e) => props.onFileChange(e)}
          />
          {/* <Form.Group controlId="formFile">
            <Form.Control
              type="file"
              multiple
              onChange={(e) => props.onFileChange(e)}
            />
          </Form.Group> */}
        </Grid>
        <Grid item xs={12}>
          (Choose max. 3 files with different extensions: .pdf, .docx, .jgp, and
          overall 2MB!)
        </Grid>
        <Grid item xs={12}>
          {!statedata.editorState.blocks ||
          statedata.editorState.blocks.length === 0 ||
          props.buttonDisabled ? (
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <span className="d-inline-block">
                <Button
                  color="primary"
                  variant="contained"
                  disabled={true}
                  style={{ pointerEvents: 'none' }}
                  startIcon={<SendIcon />}
                >
                  {t('Send')}
                </Button>
              </span>
            </OverlayTrigger>
          ) : (
            <Button
              color="primary"
              variant="contained"
              onClick={(e) => props.handleClickSave(e, statedata.editorState)}
              startIcon={<SendIcon />}
            >
              {t('Send')}
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default DocThreadEditor;

import React, { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { is_TaiGer_role } from '@taiger-common/core';

import EditorSimple from '../EditorJs/EditorSimple';
import {
  Button,
  Grid,
  Card,
  TextField,
  Tooltip,
  Typography,
  Box
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CVMLRL_DOC_PRECHECK_STATUS_E } from '../../Demo/Utils/contants';
import { useAuth } from '../AuthProvider';

function DocThreadEditor(props) {
  const { t } = useTranslation();
  const { user } = useAuth();
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
              editorState={props.editorState}
              setStatedata={setStatedata}
            />
          </Card>
        </Grid>
        {/* TODO: show checking result: 
        1. contain student name for each file, 
        2. CV: no gap
         */}
        {is_TaiGer_role(user) && (
          <Grid item xs={12}>
            {props.file?.map((fl, i) => (
              <Box key={`${fl.name}${i}`}>
                <Typography>{fl.name} :</Typography>
                {props.checkResult?.length &&
                  Object.keys(props.checkResult[i]).map((ky) => (
                    <Typography
                      key={props.checkResult[i][ky].text}
                      sx={{ ml: 2 }}
                    >
                      {props.checkResult[i][ky].value === undefined
                        ? CVMLRL_DOC_PRECHECK_STATUS_E.WARNING_SYMBOK
                        : props.checkResult[i][ky].value
                        ? CVMLRL_DOC_PRECHECK_STATUS_E.OK_SYMBOL
                        : CVMLRL_DOC_PRECHECK_STATUS_E.NOT_OK_SYMBOL}
                      {props.checkResult[i][ky].text}
                      {props.checkResult[i][ky].hasMetadata &&
                        props.checkResult[i][ky].metaData}
                    </Typography>
                  ))}
              </Box>
            ))}
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            type="file"
            inputProps={{
              multiple: true
            }}
            onChange={(e) => props.onFileChange(e)}
          />
        </Grid>

        <Grid item xs={12}>
          (Choose max. 3 files with different extensions: .pdf, .docx, .jgp, and
          overall 2MB!)
        </Grid>
        <Grid item xs={12}>
          {!statedata.editorState.blocks ||
          statedata.editorState.blocks.length === 0 ||
          props.buttonDisabled ? (
            <Tooltip
              title={t(
                'Please write some text to improve the communication and understanding.'
              )}
              placement="top"
            >
              <Button
                color="secondary"
                variant="outlined"
                startIcon={<SendIcon />}
              >
                {t('Send', { ns: 'common' })}
              </Button>
            </Tooltip>
          ) : (
            <Button
              color="primary"
              variant="contained"
              onClick={(e) => props.handleClickSave(e, statedata.editorState)}
              startIcon={<SendIcon />}
            >
              {t('Send', { ns: 'common' })}
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default DocThreadEditor;

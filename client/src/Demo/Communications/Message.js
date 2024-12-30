import React, { useEffect, useState } from 'react';
import {
  Button,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  useTheme,
  useMediaQuery,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Card,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  CircularProgress,
  AvatarGroup,
  Stack,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { is_TaiGer_AdminAgent, is_TaiGer_Student } from '@taiger-common/core';
import { FileIcon, defaultStyles } from 'react-file-icon';

import EditorSimple from '../../components/EditorJs/EditorSimple';
import { stringAvatar, convertDate } from '../Utils/contants';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { IgnoreMessage } from '../../api/index';
import { BASE_URL } from '../../api/request';
import FilePreview from '../../components/FilePreview/FilePreview';
import { appConfig } from '../../config';

function Message(props) {
  // const onlyWidth = useWindowWidth();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [messageState, setMessageState] = useState({
    editorState: null,
    message_id: '',
    isLoaded: false,
    filePath: '',
    previewModalShow: false,
    deleteMessageModalShow: false,
    ignoredMessageBy: props.message.ignoredMessageBy,
    ignoredMessageUpdatedAt: props.message.ignoredMessageUpdatedAt,
    ignore_message:
      props.message.ignore_message === false ||
      props.message.ignore_message === undefined
        ? false
        : props.message.ignore_message
  });
  const theme = useTheme();
  const ismobile = useMediaQuery(theme.breakpoints.down('md'));
  useEffect(() => {
    var initialEditorState = null;
    if (props.message.message && props.message.message !== '{}') {
      try {
        initialEditorState = JSON.parse(props.message.message);
      } catch (e) {
        initialEditorState = { time: new Date(), blocks: [] };
      }
    } else {
      initialEditorState = { time: new Date(), blocks: [] };
    }
    setMessageState((prevState) => ({
      ...prevState,
      editorState: initialEditorState,
      isLoaded: props.isLoaded,
      deleteMessageModalShow: false
    }));
  }, [props.message.message]);

  const onOpendeleteMessageModalShow = (e, message_id, createdAt) => {
    setMessageState((prevState) => ({
      ...prevState,
      message_id,
      deleteMessageModalShow: true,
      createdAt
    }));
  };

  const onHidedeleteMessageModalShow = () => {
    setMessageState((prevState) => ({
      ...prevState,
      message_id: '',
      createdAt: '',
      deleteMessageModalShow: false
    }));
  };

  const onDeleteSingleMessage = (e) => {
    e.preventDefault();
    setMessageState((prevState) => ({
      ...prevState,
      deleteMessageModalShow: false
    }));
    props.onDeleteSingleMessage(e, messageState.message_id);
  };

  const closePreviewWindow = () => {
    setMessageState((prevState) => ({
      ...prevState,
      previewModalShow: false
    }));
  };

  const handleClick = (filePath, fileName) => {
    setMessageState((prevState) => ({
      ...prevState,
      filePath,
      fileName,
      previewModalShow: true
    }));
  };

  const handleCheckboxChange = async () => {
    const ignoreMessageState = !messageState.ignore_message;
    setMessageState((prevState) => ({
      ...prevState,
      ignore_message: ignoreMessageState,
      ignoredMessageBy: user,
      ignoredMessageUpdatedAt: new Date()
    }));
    const message = props.message;
    const updateIgnoreMessage = async () => {
      const resp = await IgnoreMessage(
        message.student_id._id.toString(),
        message._id,
        message.message,
        ignoreMessageState
      );
      if (resp) {
        console.log('nice');
      }
    };
    await updateIgnoreMessage();
  };

  if (!messageState.isLoaded && !messageState.editorState) {
    return <Loading />;
  }
  let firstname = props.message.user_id
    ? props.message.user_id.firstname
    : 'Staff';
  let lastname = props.message.user_id
    ? props.message.user_id.lastname
    : appConfig.companyName;
  const editable = props.message.user_id
    ? props.message.user_id._id.toString() === user._id.toString()
      ? true
      : false
    : false;
  const full_name = `${firstname} ${lastname}`;

  return (
    <>
      <Accordion
        defaultExpanded={props.accordionKeys[props.idx] === props.idx}
        disableGutters
        sx={{
          borderRadius: 2,
          overflowWrap: 'break-word', // Add this line
          ...(props.isTaiGerView &&
            !ismobile && {
              width: '100%', // Make Drawer full width on small screens
              maxWidth: '100vw'
            }),
          marginTop: '1px',
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1
          }
        }}
      >
        <AccordionSummary
          id={`${props.idx}`}
          aria-controls={'accordion' + props.idx}
          expandIcon={<ExpandMoreIcon />}
        >
          <Avatar {...stringAvatar(full_name)} />
          <Box style={{ marginLeft: '10px', flex: 1 }}>
            <b style={{ cursor: 'pointer' }}>{full_name}</b>
            <span style={{ display: 'flex', float: 'right' }}>
              {convertDate(props.message.createdAt)}
              {editable && (
                <>
                  <IconButton onClick={() => props.onEditMode()}>
                    <EditIcon
                      title="Edit this message"
                      fontSize="small"
                      style={{ cursor: 'pointer' }}
                    />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={(e) =>
                      onOpendeleteMessageModalShow(
                        e,
                        props.message._id.toString(),
                        props.message.createdAt
                      )
                    }
                  >
                    <CloseIcon
                      fontSize="small"
                      title="Delete this message and file"
                      style={{ cursor: 'pointer' }}
                    />
                  </IconButton>
                </>
              )}
            </span>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              overflowWrap: 'break-word', // Ensures long words wrap
              wordBreak: 'break-word', // Breaks the word to avoid overflow
              maxWidth: '100%', // Ensures content does not exceed parent width
              flex: 1 // Makes Box flexible within its container
            }}
          >
            <EditorSimple
              holder={`${props.message._id.toString()}`}
              readOnly={true}
              imageEnable={false}
              handleClickSave={props.handleClickSave}
              editorState={messageState.editorState}
              defaultHeight={0}
            />
            {props.message?.files.map((file, i) => (
              <Card key={i} sx={{ p: 1 }}>
                <span>
                  <Typography
                    onClick={() =>
                      handleClick(
                        `/api/communications/${props.message?.student_id?._id.toString()}/chat/${
                          file.name
                        }`,
                        file.name
                      )
                    }
                    underline="hover"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
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
                  </Typography>
                </span>
              </Card>
            ))}
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {is_TaiGer_AdminAgent(user) && (
              <AvatarGroup>
                {props.message?.readBy
                  ?.filter(
                    (usr) =>
                      (props.message.student_id?._id?.toString() !==
                        props.message.user_id?._id?.toString() &&
                        usr._id?.toString() !== user._id.toString()) ||
                      (props.message.student_id?._id?.toString() ===
                        props.message.user_id?._id?.toString() &&
                        usr._id?.toString() !==
                          props.message.student_id?._id.toString())
                  )
                  .map((usr) => (
                    <Tooltip
                      title={`Read by ${usr?.firstname} ${usr?.lastname} at ${convertDate(props.message.timeStampReadBy?.[usr._id?.toString()])}`}
                      key={user._id?.toString()}
                    >
                      <Avatar
                        {...stringAvatar(`${usr?.firstname} ${usr?.lastname}`)}
                        sx={{
                          ...stringAvatar(`${usr?.firstname} ${usr?.lastname}`)
                            .sx,
                          width: 8,
                          height: 8 // Override the size
                        }}
                        size="small"
                      />
                    </Tooltip>
                  ))}
              </AvatarGroup>
            )}
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              {!is_TaiGer_Student(user) &&
                is_TaiGer_Student(props.message.user_id) && (
                  <>
                    {messageState.ignore_message && (
                      <Avatar
                        key={user._id?.toString()}
                        {...stringAvatar(
                          `${messageState.ignoredMessageBy?.firstname} ${messageState.ignoredMessageBy?.lastname}`
                        )}
                        sx={{
                          ...stringAvatar(
                            `${messageState.ignoredMessageBy?.firstname} ${messageState.ignoredMessageBy?.lastname}`
                          ).sx,
                          width: 8,
                          height: 8 // Override the size
                        }}
                        size="small"
                        title={`Ignored by ${messageState.ignoredMessageBy?.firstname} ${messageState.ignoredMessageBy?.lastname} at ${convertDate(messageState.ignoredMessageUpdatedAt)}`}
                      />
                    )}
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={messageState.ignore_message}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="no need to reply"
                        labelPlacement="start"
                      />
                    </FormGroup>
                  </>
                )}
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
      {/* TODOL consider to move it to the parent! It render many time! as message increase */}
      <Dialog
        open={messageState.deleteMessageModalShow}
        onClose={onHidedeleteMessageModalShow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you wan to delete this message on{' '}
            {convertDate(messageState.createdAt)}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!props.isLoaded}
            variant="contained"
            onClick={onDeleteSingleMessage}
          >
            {props.isLoaded
              ? t('Delete', { ns: 'common' })
              : t('Pending', { ns: 'common' })}
          </Button>
          <Button variant="outlined" onClick={onHidedeleteMessageModalShow}>
            {t('Cancel', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth={'xl'}
        open={messageState.previewModalShow}
        onClose={closePreviewWindow}
        aria-labelledby="contained-modal-title-vcenter2"
      >
        <DialogTitle>{messageState.filePath}</DialogTitle>
        <FilePreview
          apiFilePath={messageState.filePath}
          path={messageState.fileName}
        />
        <DialogContent>
          {props.path && props.path.split('.')[1] !== 'pdf' && (
            <a
              href={`${BASE_URL}}${messageState.filePath}`}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                color="primary"
                variant="contained"
                size="small"
                title="Download"
                startIcon={<FileDownloadIcon />}
              >
                {t('Download', { ns: 'common' })}
              </Button>
            </a>
          )}
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="outlined" onClick={closePreviewWindow}>
            {!messageState.isLoaded ? (
              <CircularProgress size={24} />
            ) : (
              t('Close', { ns: 'common' })
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Message;

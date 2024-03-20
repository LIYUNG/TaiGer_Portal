import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link as LinkDom } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Link,
  Typography
} from '@mui/material';
import { RiCloseFill } from 'react-icons/ri';
import { FileIcon, defaultStyles } from 'react-file-icon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { BASE_URL } from '../../../api/request';
import EditorSimple from '../../../components/EditorJs/EditorSimple';
// import Output from 'editorjs-react-renderer';
import { stringAvatar, convertDate } from '../../Utils/contants';
import { useAuth } from '../../../components/AuthProvider';
import ModalNew from '../../../components/Modal';
import { useTranslation } from 'react-i18next';
import Loading from '../../../components/Loading/Loading';

function Message(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [messageState, setMessageState] = useState({
    editorState: null,
    ConvertedContent: '',
    message_id: '',
    isLoaded: false,
    deleteMessageModalShow: false
  });
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
      ConvertedContent: initialEditorState,
      isLoaded: props.isLoaded,
      deleteMessageModalShow: false
    }));
  }, [props.message.message]);

  const onOpendeleteMessageModalShow = (e, message_id, createdAt) => {
    e.stopPropagation();
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

  if (!messageState.isLoaded && !messageState.editorState) {
    return <Loading />;
  }
  let firstname = props.message.user_id
    ? props.message.user_id.firstname
    : 'Staff';
  let lastname = props.message.user_id
    ? props.message.user_id.lastname
    : 'TaiGer';
  const editable = props.message.user_id
    ? props.message.user_id._id.toString() === user._id.toString()
      ? true
      : false
    : false;
  const full_name = `${firstname} ${lastname}`;
  const files_info = props.message.file.map((file, i) => (
    <Card key={i} className="my-0">
      <Card.Body className="py-2 px-0">
        <span>
          {/* /api/document-threads/${documentsthreadId}/${messageId}/${file_key} */}
          <Link
            underline="hover"
            to={`${BASE_URL}/api/document-threads/${
              props.documentsthreadId
            }/${props.message._id.toString()}/${
              file.path.replace(/\\/g, '/').split('/')[2]
            }`}
            component={LinkDom}
            target="_blank"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
          </Link>
        </span>
      </Card.Body>
    </Card>
  ));

  return (
    <>
      <Accordion
        disableGutters
        expanded={props.accordionKeys[props.idx] === props.idx}
        sx={{
          overflowWrap: 'break-word', // Add this line
          maxWidth: window.innerWidth - 64,
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
          onClick={() => props.singleExpandtHandler(props.idx)}
        >
          <Avatar {...stringAvatar(full_name)} />
          <Typography style={{ marginLeft: '10px', flex: 1 }}>
            <b style={{ cursor: 'pointer' }}>{full_name}</b>
            <span style={{ display: 'flex', float: 'right' }}>
              {convertDate(props.message.createdAt)}
              {editable && (
                <RiCloseFill
                  className="mx-0"
                  color="red"
                  title="Delete this message and file"
                  size={20}
                  onClick={(e) =>
                    onOpendeleteMessageModalShow(
                      e,
                      props.message._id.toString(),
                      props.message.createdAt
                    )
                  }
                  style={{ cursor: 'pointer' }}
                />
              )}
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails in={props.accordionKeys[props.idx] === props.idx}>
          <Card.Body>
            {/* {JSON.stringify(messageState.editorState)} */}
            {/* <section>
              <Output data={messageState.editorState} />
            </section> */}
            <EditorSimple
              holder={`${props.message._id.toString()}`}
              readOnly={true}
              imageEnable={true}
              handleClickSave={props.handleClickSave}
              editorState={messageState.editorState}
              defaultHeight={0}
            />
            {files_info}
          </Card.Body>
        </AccordionDetails>
      </Accordion>
      <ModalNew
        open={messageState.deleteMessageModalShow}
        onClose={onHidedeleteMessageModalShow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Box>
          <Typography variant="h6">Warning</Typography>
          <Typography variant="string">
            Do you wan to delete this message on{' '}
            <b>{convertDate(messageState.createdAt)}?</b>
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              disabled={!props.isLoaded}
              variant="contained"
              color="primary"
              onClick={onDeleteSingleMessage}
            >
              {props.isLoaded
                ? t('Delete', { ns: 'common' })
                : t('Pending', { ns: 'common' })}
            </Button>
            <Button onClick={onHidedeleteMessageModalShow} variant="light">
              {t('Cancel', { ns: 'common' })}
            </Button>
          </Box>
        </Box>
      </ModalNew>
    </>
  );
}

export default Message;

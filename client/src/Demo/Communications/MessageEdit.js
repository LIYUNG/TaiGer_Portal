import React, { useState } from 'react';
import {
  Button,
  Tooltip,
  AccordionDetails,
  AccordionSummary,
  Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import { RiCloseFill } from 'react-icons/ri';
import { Accordion, Avatar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

// import Output from 'editorjs-react-renderer';
import EditorSimple from '../../components/EditorJs/EditorSimple';
import { stringAvatar, convertDate } from '../Utils/contants';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';

function MessageEdit(props) {
  const { t } = useTranslation();
  const [messageEditState, setMessageEditState] = useState({
    editorState: null,
    message_id: '',
    deleteMessageModalShow: false
  });

  const onOpendeleteMessageModalShow = (e, message_id, createdAt) => {
    setMessageEditState((prevState) => ({
      ...prevState,
      message_id,
      deleteMessageModalShow: true,
      createdAt
    }));
  };

  const onHidedeleteMessageModalShow = () => {
    setMessageEditState((prevState) => ({
      ...prevState,
      message_id: '',
      createdAt: '',
      deleteMessageModalShow: false
    }));
  };

  const onDeleteSingleMessage = (e) => {
    e.preventDefault();
    setMessageEditState((prevState) => ({
      ...prevState,
      deleteMessageModalShow: false
    }));
    props.onDeleteSingleMessage(e, messageEditState.message_id);
  };

  const handleEditorChange = (content) => {
    setMessageEditState((prevState) => ({
      ...prevState,
      editorState: content
    }));
  };

  if (!props.editorState) {
    return <Loading />;
  }

  return (
    <>
      <Accordion
        expanded={true}
        disableGutters
        sx={{
          p: 2,
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
        >
          <Avatar {...stringAvatar(props.full_name)} />
          <Typography style={{ marginLeft: '10px', flex: 1 }}>
            <b style={{ cursor: 'pointer' }} className="ps-0 my-1">
              {props.full_name}
            </b>
            <span style={{ float: 'right' }}>
              {convertDate(props.message.createdAt)}
              {props.editable && (
                <>
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
                </>
              )}
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <EditorSimple
            holder={`${props.message._id.toString()}`}
            readOnly={false}
            imageEnable={false}
            editorState={props.editorState}
            handleEditorChange={handleEditorChange}
            defaultHeight={0}
          />
        </AccordionDetails>

        {!messageEditState.editorState?.blocks ||
        messageEditState.editorState?.blocks.length === 0 ||
        props.buttonDisabled ? (
          <Tooltip
            title={t(
              'Please write some text to improve the communication and understanding.'
            )}
            placement="top"
          >
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<SendIcon />}
            >
              {t('Save')}
            </Button>
          </Tooltip>
        ) : (
          <Button
            color="primary"
            variant="contained"
            onClick={(e) =>
              props.handleClickSave(
                e,
                messageEditState.editorState,
                props.message._id.toString()
              )
            }
            startIcon={<SendIcon />}
          >
            {t('Save', { ns: 'common' })}
          </Button>
        )}
        <Button
          color="secondary"
          variant="outlined"
          onClick={(e) => props.handleCancelEdit(e)}
        >
          {t('Cancel')}
        </Button>
      </Accordion>
      {/* TODOL consider to move it to the parent! It render many time! as message increase */}
      <ModalNew
        open={messageEditState.deleteMessageModalShow}
        onClose={onHidedeleteMessageModalShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography>{t('Warning')}</Typography>
        <Typography>
          Do you wan to delete this message on{' '}
          <b>{convertDate(messageEditState.createdAt)}?</b>
        </Typography>
        <Typography>
          <Button
            disabled={!props.isLoaded}
            variant="danger"
            onClick={onDeleteSingleMessage}
          >
            {props.isLoaded
              ? t('Delete', { ns: 'common' })
              : t('Pending', { ns: 'common' })}
          </Button>
          <Button onClick={onHidedeleteMessageModalShow} variant="light">
            {t('Cancel', { ns: 'common' })}
          </Button>
        </Typography>
      </ModalNew>
    </>
  );
}

export default MessageEdit;

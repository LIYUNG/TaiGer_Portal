import React, { useEffect, useState } from 'react';
import {
  Button,
  Avatar,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RiCloseFill } from 'react-icons/ri';
import { AiFillEdit } from 'react-icons/ai';

// import Output from 'editorjs-react-renderer';
import EditorSimple from '../../components/EditorJs/EditorSimple';
import { stringAvatar, convertDate } from '../Utils/contants';
import { useAuth } from '../../components/AuthProvider';
import ModalNew from '../../components/Modal';
import Loading from '../../components/Loading/Loading';
// import { useWindowWidth } from '@react-hook/window-size';

function Message(props) {
  // const onlyWidth = useWindowWidth();
  const { user } = useAuth();
  const [messageState, setMessageState] = useState({
    editorState: null,
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
  return (
    <>
      <Accordion
        defaultExpanded={props.accordionKeys[props.idx] === props.idx}
        disableGutters
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
        >
          <Avatar {...stringAvatar(full_name)} />
          <Box style={{ marginLeft: '10px', flex: 1 }}>
            <b style={{ cursor: 'pointer' }}>{full_name}</b>
            <span style={{ display: 'flex', float: 'right' }}>
              {convertDate(props.message.createdAt)}
              {editable && (
                <>
                  <AiFillEdit
                    className="mx-1"
                    color="blue"
                    title="Delete this message and file"
                    size={20}
                    onClick={() =>
                      props
                        .onEditMode
                        // e,
                        // props.message._id.toString()
                        ()
                    }
                    style={{ cursor: 'pointer' }}
                  />
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
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <EditorSimple
            holder={`${props.message._id.toString()}`}
            readOnly={true}
            imageEnable={false}
            handleClickSave={props.handleClickSave}
            editorState={messageState.editorState}
            defaultHeight={0}
          />
        </AccordionDetails>
      </Accordion>
      {/* TODOL consider to move it to the parent! It render many time! as message increase */}
      <ModalNew
        open={messageState.deleteMessageModalShow}
        onClose={onHidedeleteMessageModalShow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">Warning</Typography>
        <Typography>Do you wan to delete this message on </Typography>
        <Typography fontWeight="bold">
          {convertDate(messageState.createdAt)}?
        </Typography>
        <Button
          disabled={!props.isLoaded}
          variant="contained"
          onClick={onDeleteSingleMessage}
        >
          {props.isLoaded ? 'Delete' : 'Pending'}
        </Button>
        <Button variant="outlined" onClick={onHidedeleteMessageModalShow}>
          Cancel
        </Button>
      </ModalNew>
    </>
  );
}

export default Message;

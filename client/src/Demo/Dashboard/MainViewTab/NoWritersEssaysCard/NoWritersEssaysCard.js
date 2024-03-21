import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Link,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';

import EditEssayWritersSubpage from '../StudDocsOverview/EditEssayWritersSubpage';
import { is_TaiGer_role } from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';

function NoWritersEssaysCard(props) {
  const { user } = useAuth();
  const [noEditorsStudentsCardState, setNoEditorsStudentsCardState] = useState({
    showEditorPage: false
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const setEditorModalhide = () => {
    setNoEditorsStudentsCardState((prevState) => ({
      ...prevState,
      showEditorPage: false
    }));
  };

  const startEditingEditor = () => {
    setNoEditorsStudentsCardState((prevState) => ({
      ...prevState,
      subpage: 2,
      showEditorPage: true
    }));
  };

  const submitUpdateEssayWriterlist = (
    e,
    updateEssayWriterList,
    essayDocumentThread_id
  ) => {
    e.preventDefault();
    setEditorModalhide();
    props.submitUpdateEssayWriterlist(
      e,
      updateEssayWriterList,
      essayDocumentThread_id
    );
  };

  if (
    props.essayDocumentThread.outsourced_user_id === undefined ||
    props.essayDocumentThread.outsourced_user_id.length === 0
  ) {
    return (
      <>
        <TableRow>
          {is_TaiGer_role(user) && !props.isArchivPage && (
            <TableCell>
              <Button
                size="small"
                id="basic-button"
                variant="contained"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                {t('Option')}
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button'
                }}
              >
                <MenuItem onClick={() => startEditingEditor()}>
                  Edit Essay Writer
                </MenuItem>
              </Menu>
            </TableCell>
          )}
          <TableCell>
            <Link
              component={LinkDom}
              to={`${DEMO.DOCUMENT_MODIFICATION_LINK(
                props.essayDocumentThread?._id?.toString()
              )}`}
            >
              {props.essayDocumentThread?.file_type}
              {props.essayDocumentThread?.program_id?.school}
              {props.essayDocumentThread?.program_id?.program_name}
              {props.essayDocumentThread?.program_id?.degree}
              {props.essayDocumentThread?.program_id?.semester}
            </Link>
          </TableCell>
          <TableCell>
            <Link
              component={LinkDom}
              to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                props.essayDocumentThread.student_id?._id.toString(),
                DEMO.PROFILE
              )}`}
            >
              {props.essayDocumentThread.student_id?.firstname},{' '}
              {props.essayDocumentThread.student_id?.lastname}
            </Link>
          </TableCell>
          <TableCell>{props.essayDocumentThread.student_id?.email}</TableCell>
          <TableCell>
            {/* TODO: adjust condition and backend returned data: message !== 0 && no outsourcer */}
            {props.essayDocumentThread.outsourced_user_id === undefined ||
            props.essayDocumentThread.outsourced_user_id.length === 0 ? (
              <Typography fontWeight="bold">Ready to Assign</Typography>
            ) : (
              '-'
            )}
          </TableCell>
          <TableCell>
            {props.essayDocumentThread.student_id?.application_preference
              .expected_application_date || <Typography>TBD</Typography>}
          </TableCell>
          <TableCell>
            {!props.essayDocumentThread.student_id?.agents ||
            props.essayDocumentThread.student_id?.agents.length === 0 ? (
              <Typography fontWeight="bold">No Agent</Typography>
            ) : (
              props.essayDocumentThread.student_id?.agents.map((agent, i) => (
                <Typography key={i}>{`${agent.firstname}`}</Typography>
              ))
            )}
          </TableCell>
        </TableRow>
        {is_TaiGer_role(user) && noEditorsStudentsCardState.showEditorPage && (
          <EditEssayWritersSubpage
            show={noEditorsStudentsCardState.showEditorPage}
            onHide={setEditorModalhide}
            setmodalhide={setEditorModalhide}
            submitUpdateEssayWriterlist={submitUpdateEssayWriterlist}
            essayDocumentThread={props.essayDocumentThread}
          />
        )}
      </>
    );
  } else {
    return <></>;
  }
}

export default NoWritersEssaysCard;

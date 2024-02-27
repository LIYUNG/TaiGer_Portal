import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  // Link,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  // Typography
} from '@mui/material';
// import { Link as LinkDom } from 'react-router-dom';

import EditEssayWritersSubpage from '../StudDocsOverview/EditEssayWritersSubpage';
import { is_TaiGer_role } from '../../../Utils/checking-functions';
// import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';

function NoWritersEssaysCard(props) {
  // <NoWritersEssaysCard
  //     key={i}
  //     essays={essays}
  //     submitUpdateEditorlist={props.submitUpdateEditorlist}
  //   />
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

  const submitUpdateEditorlist = (e, updateEditorList, essayDocumentThread_id) => {
    e.preventDefault();
    setEditorModalhide();
    props.submitUpdateEditorlist(e, updateEditorList, essayDocumentThread_id);
  };

  // console.log('outsource:', props.essayDocumentThread_id.outsourced_user_id)
  console.log('essayDocumentThread in noWriterEssaysCard', props.essayDocumentThread)
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
          {/* <TableCell>
            <Link
              component={LinkDom}
              to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                props.student._id.toString(),
                DEMO.PROFILE
              )}`}
            >
              {props.student.firstname}, {props.student.lastname}
            </Link>
          </TableCell>
          <TableCell>{props.student.email}</TableCell>
          <TableCell>
            {props.student.needEditor ? (
              <Typography fontWeight="bold">Ready to Assign</Typography>
            ) : (
              '-'
            )}
          </TableCell>
          <TableCell>
            {props.student.application_preference.expected_application_date || (
              <Typography>TBD</Typography>
            )}
          </TableCell>
          <TableCell>
            {!props.student.agents || props.student.agents.length === 0 ? (
              <Typography fontWeight="bold">No Agent</Typography>
            ) : (
              props.student.agents.map((agent, i) => (
                <Typography key={i}>{`${agent.firstname}`}</Typography>
              ))
            )}
          </TableCell> */}
        </TableRow>
        {is_TaiGer_role(user) && noEditorsStudentsCardState.showEditorPage && (
          <EditEssayWritersSubpage
            // student={props.student}
            show={noEditorsStudentsCardState.showEditorPage}
            onHide={setEditorModalhide}
            setmodalhide={setEditorModalhide}
            submitUpdateEditorlist={submitUpdateEditorlist}
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

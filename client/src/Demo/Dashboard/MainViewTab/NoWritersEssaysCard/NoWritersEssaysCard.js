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

  const submitUpdateEditorlist = (e, updateEditorList, essayDocumentThread_id) => {
    e.preventDefault();
    setEditorModalhide();
    props.submitUpdateEditorlist(e, updateEditorList, essayDocumentThread_id);
  };

  const findStudentsWithDocumentthread = (students, essayDocumentThread) => {
    const studentsWithDocumentthread = students.filter(student => {
      return student?._id?.toString() === essayDocumentThread?.student_id?.toString();
    });
    return studentsWithDocumentthread[0];
  };
  const student = findStudentsWithDocumentthread(props.students, props.essayDocumentThread)
  console.log('student in card', student)
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
            </Link>
          </TableCell>
          <TableCell>
            <Link
              component={LinkDom}
              to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                student?._id.toString(),
                DEMO.PROFILE
              )}`}
            >
              {student?.firstname}, {student?.lastname}
            </Link>
          </TableCell>
          <TableCell>{student?.email}</TableCell>
          <TableCell>
            {(props.essayDocumentThread.outsourced_user_id === undefined ||
    props.essayDocumentThread.outsourced_user_id.length === 0) ? (
              <Typography fontWeight="bold">Ready to Assign</Typography>
            ) : (
              '-'
            )}
          </TableCell>
          <TableCell>
            {student?.application_preference.expected_application_date || (
              <Typography>TBD</Typography>
            )}
          </TableCell>
          <TableCell>
            {!student?.agents || student?.agents.length === 0 ? (
              <Typography fontWeight="bold">No Agent</Typography>
            ) : (
              student?.agents.map((agent, i) => (
                <Typography key={i}>{`${agent.firstname}`}</Typography>
              ))
            )}
          </TableCell>
        </TableRow>
        {is_TaiGer_role(user) && noEditorsStudentsCardState.showEditorPage && (
          <EditEssayWritersSubpage
            student={student}
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

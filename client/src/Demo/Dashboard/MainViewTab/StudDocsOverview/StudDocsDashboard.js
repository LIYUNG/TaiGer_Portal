import React, { useState } from 'react';
import {
  Link,
  Typography,
  TableCell,
  TableRow,
  Box,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';

function StudDocsDashboard(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const updateStudentArchivStatus = (studentId, isArchived) => {
    setAnchorEl(null);
    props.updateStudentArchivStatus(studentId, isArchived);
  };

  let studentsAgent;
  let studentsEditor;
  if (props.student.agents === undefined || props.student.agents.length === 0) {
    studentsAgent = <Typography>{t('No Agent assigned')}</Typography>;
  } else {
    studentsAgent = props.student.agents.map((agent) => (
      <Box key={agent._id}>
        <Typography>
          <Link
            to={`${DEMO.TEAM_AGENT_LINK(agent._id.toString())}`}
            component={LinkDom}
          >
            {agent.firstname}
          </Link>
        </Typography>
        <Typography variant="body2">{agent.email}</Typography>
      </Box>
    ));
  }
  if (
    props.student.editors === undefined ||
    props.student.editors.length === 0
  ) {
    studentsEditor = <Typography>{t('No Editor assigned')}</Typography>;
  } else {
    studentsEditor = props.student.editors.map((editor) => (
      <Box key={editor._id}>
        <Typography>
          <Link
            to={`${DEMO.TEAM_EDITOR_LINK(editor._id.toString())}`}
            component={LinkDom}
          >
            {editor.firstname}
          </Link>
        </Typography>
        <Typography variant="body2">{editor.email}</Typography>
      </Box>
    ));
  }
  const target_application_field = props.student.application_preference
    ? props.student.application_preference.target_application_field || (
        <Box className="text-danger">TBD</Box>
      )
    : '';
  return (
    <>
      <TableRow
        style={{
          backgroundColor: props.student.archiv === true ? '#1de9b6' : ''
        }}
        title={props.student.archiv === true ? 'Closed' : 'Open'}
      >
        <TableCell align="left">
          {user.role !== 'Editor' && (
            <>
              <Button
                id="basic-button"
                variant="contained"
                size="small"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                {t('Option')}
              </Button>
              <Menu
                id={`dropdown-variants-${props.student._id}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button'
                }}
              >
                <MenuItem
                  onClick={() =>
                    updateStudentArchivStatus(
                      props.student._id,
                      props.isDashboard || false
                    )
                  }
                >
                  {props.isDashboard
                    ? t('Move to Archiv')
                    : t('Move to Active')}
                </MenuItem>
              </Menu>
            </>
          )}
        </TableCell>
        <TableCell align="left">
          <Link
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              props.student._id,
              '/background'
            )}`}
            component={LinkDom}
          >
            <b>
              {props.student.firstname}, {props.student.lastname}
              {' | '}
              {props.student.lastname_chinese}
              {props.student.firstname_chinese}
            </b>
          </Link>
          <br />
          {props.student.email}
        </TableCell>
        <TableCell align="left">{studentsAgent}</TableCell>
        <TableCell align="left">{studentsEditor}</TableCell>
        <TableCell align="left">
          {props.student.application_preference.expected_application_date || (
            <Typography>TBD</Typography>
          )}
        </TableCell>
        <TableCell align="left">
          {props.student.application_preference
            .expected_application_semester || (
            <Box className="text-danger">TBD</Box>
          )}
        </TableCell>
        <TableCell align="left">
          {props.student.application_preference.target_degree || (
            <Typography>TBD</Typography>
          )}
        </TableCell>
        <TableCell align="left">
          <b>
            {props.student.academic_background.university
              .attended_university || <Box>TBD</Box>}
          </b>
          <br />
          {props.student.academic_background.university
            .attended_university_program || <Typography>TBD</Typography>}
        </TableCell>
        <TableCell align="left">{target_application_field}</TableCell>
        <TableCell align="left">
          {props.student.academic_background.language.english_certificate || (
            <Typography>TBD</Typography>
          )}
          <br />
          {props.student.academic_background.language.german_certificate}
        </TableCell>
        <TableCell align="left">
          {props.student.academic_background.language.english_score}
          <br />
          {props.student.academic_background.language.german_score}
        </TableCell>
        <TableCell align="left">
          {props.student.academic_background.language.english_isPassed ===
            'X' && props.student.academic_background.language.english_test_date}
          <br />
          {props.student.academic_background.language.german_isPassed === 'X' &&
            props.student.academic_background.language.german_test_date}
        </TableCell>
      </TableRow>
    </>
  );
}

export default StudDocsDashboard;

import React, { Fragment, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  Link,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';

import EditAgentsSubpage from '../StudDocsOverview/EditAgentsSubpage';
import EditEditorsSubpage from '../StudDocsOverview/EditEditorsSubpage';
import {
  is_TaiGer_Editor,
  is_TaiGer_role
} from '../../../Utils/checking-functions';
import { is_TaiGer_Student } from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';
import EditAttributesSubpage from '../StudDocsOverview/EditAttributesSubpage';
import { COLORS } from '../../../Utils/contants';

function StudentsAgentEditor(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [studentsAgentEditor, setStudentsAgentEditor] = useState({
    showAgentPage: false,
    showEditorPage: false,
    showAttributesPage: false
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateStudentArchivStatus = (student_id, archiv) => {
    setAnchorEl(null);
    props.updateStudentArchivStatus(student_id, archiv);
  };

  const setAgentModalhide = () => {
    setStudentsAgentEditor((prevState) => ({
      ...prevState,
      showAgentPage: false
    }));
  };

  const startEditingAgent = () => {
    setAnchorEl(null);
    setStudentsAgentEditor((prevState) => ({
      ...prevState,
      subpage: 1,
      showAgentPage: true
    }));
  };

  const setEditorModalhide = () => {
    setStudentsAgentEditor((prevState) => ({
      ...prevState,
      showEditorPage: false
    }));
  };

  const setAttributeModalhide = () => {
    setStudentsAgentEditor((prevState) => ({
      ...prevState,
      showAttributesPage: false
    }));
  };

  const startEditingEditor = () => {
    setAnchorEl(null);
    setStudentsAgentEditor((prevState) => ({
      ...prevState,
      subpage: 2,
      showEditorPage: true
    }));
  };

  const startEditingAttributes = () => {
    setAnchorEl(null);
    setStudentsAgentEditor((prevState) => ({
      ...prevState,
      subpage: 3,
      showAttributesPage: true
    }));
  };

  const submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    setAgentModalhide();
    props.submitUpdateAgentlist(e, updateAgentList, student_id);
  };

  const submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    setEditorModalhide();
    props.submitUpdateEditorlist(e, updateEditorList, student_id);
  };

  const submitUpdateAttributeslist = (e, updateAttributesList, student_id) => {
    setAttributeModalhide();
    props.submitUpdateAttributeslist(e, updateAttributesList, student_id);
  };

  let studentsAgent;
  let studentsEditor;
  if (props.student.agents === undefined || props.student.agents.length === 0) {
    studentsAgent = <Typography>{t('No Agent assigned')}</Typography>;
  } else {
    studentsAgent = props.student.agents.map((agent) => (
      <Fragment key={agent._id}>
        <Typography variant="string">
          <Link
            to={`${DEMO.TEAM_AGENT_LINK(agent._id.toString())}`}
            component={LinkDom}
          >
            {agent.firstname}
          </Link>
        </Typography>
        &nbsp;
        {/* <br />
        <Typography variant="string">{agent.email}</Typography> */}
      </Fragment>
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
        <Typography variant="string">
          <Link
            to={`${DEMO.TEAM_EDITOR_LINK(editor._id.toString())}`}
            component={LinkDom}
          >
            {`${editor.firstname}`}
          </Link>
        </Typography>
        &nbsp;
        {/* <br />
        <Typography variant="string">{editor.email}</Typography> */}
      </Box>
    ));
  }
  const target_application_field = props.student.application_preference
    ? props.student.application_preference.target_application_field || (
        <span>TBD</span>
      )
    : '';
  return (
    <>
      <TableRow>
        <TableCell>
          {is_TaiGer_role(user) && !props.isArchivPage && (
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
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button'
                }}
              >
                <MenuItem onClick={() => startEditingAgent()}>
                  {t('Edit Agent')}
                </MenuItem>
                <MenuItem onClick={() => startEditingEditor()}>
                  {t('Edit Editor')}
                </MenuItem>
                {!is_TaiGer_Editor(user) && (
                  <MenuItem onClick={() => startEditingAttributes()}>
                    {t('Configure Attribute')}
                  </MenuItem>
                )}
                {props.isDashboard && !is_TaiGer_Editor(user) && (
                  <MenuItem
                    onClick={() =>
                      updateStudentArchivStatus(props.student._id, true)
                    }
                  >
                    {t('Move to Archiv')}
                  </MenuItem>
                )}
                {props.isArchivPage && !is_TaiGer_Editor(user) && (
                  <MenuItem
                    onClick={() =>
                      updateStudentArchivStatus(props.student._id, false)
                    }
                  >
                    {t('Move to Active')}
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </TableCell>
        {!is_TaiGer_Student(user) ? (
          <TableCell>
            <Typography className="mb-0">
              <Link
                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                  props.student._id,
                  '/background'
                )}`}
                component={LinkDom}
              >
                {props.student.firstname}, {props.student.lastname} {' | '}
                {props.student.lastname_chinese}
                {props.student.firstname_chinese}
              </Link>
            </Typography>
            <span className="mb-0 text-secondary">{props.student.email}</span>
            {is_TaiGer_role(user) &&
              props.student.attributes?.map((attribute) => (
                <Chip
                  size="small"
                  label={attribute.name}
                  key={attribute._id}
                  color={COLORS[attribute.value]}
                />
              ))}
          </TableCell>
        ) : (
          <></>
        )}
        <TableCell>{studentsAgent}</TableCell>
        <TableCell>{studentsEditor}</TableCell>
        <TableCell>
          {props.student.application_preference.expected_application_date || (
            <Typography>TBD</Typography>
          )}
        </TableCell>
        <TableCell>
          {props.student.application_preference
            .expected_application_semester || <Typography>TBD</Typography>}
        </TableCell>
        <TableCell>
          {props.student.application_preference.target_degree || (
            <Typography>TBD</Typography>
          )}
        </TableCell>
        <TableCell>
          <Typography fontWeight="bold">
            {props.student.academic_background.university.attended_university ||
              'TBD'}
          </Typography>
          <Typography>
            {props.student.academic_background.university
              .attended_university_program || 'TBD'}
          </Typography>
        </TableCell>
        <TableCell>{target_application_field}</TableCell>
        <TableCell>
          {props.student.academic_background.language.english_certificate || (
            <Typography>TBD</Typography>
          )}
          {props.student.academic_background.language.german_certificate || (
            <Typography>TBD</Typography>
          )}
        </TableCell>
        <TableCell>
          {props.student.academic_background.language.english_score || (
            <span>TBD</span>
          )}
          {props.student.academic_background.language.german_score || (
            <span>TBD</span>
          )}
        </TableCell>
        <TableCell>
          {(props.student.academic_background.language.english_isPassed ===
            'X' &&
            props.student.academic_background.language.english_test_date) || (
            <span>TBD</span>
          )}
          {(props.student.academic_background.language.german_isPassed ===
            'X' &&
            props.student.academic_background.language.german_test_date) || (
            <span>TBD</span>
          )}
        </TableCell>
      </TableRow>
      {is_TaiGer_role(user) && (
        <>
          {studentsAgentEditor.showAgentPage && (
            <EditAgentsSubpage
              student={props.student}
              show={studentsAgentEditor.showAgentPage}
              onHide={setAgentModalhide}
              submitUpdateAgentlist={submitUpdateAgentlist}
            />
          )}
          {studentsAgentEditor.showEditorPage && (
            <EditEditorsSubpage
              student={props.student}
              show={studentsAgentEditor.showEditorPage}
              onHide={setEditorModalhide}
              submitUpdateEditorlist={submitUpdateEditorlist}
            />
          )}
          {studentsAgentEditor.showAttributesPage && (
            <EditAttributesSubpage
              student={props.student}
              show={studentsAgentEditor.showAttributesPage}
              onHide={setAttributeModalhide}
              submitUpdateAttributeslist={submitUpdateAttributeslist}
            />
          )}
        </>
      )}
    </>
  );
}

export default StudentsAgentEditor;

import React, { Fragment, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  Checkbox,
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
  is_TaiGer_role,
  is_User_Archived
} from '../../../Utils/checking-functions';
import { is_TaiGer_Student } from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';
import EditAttributesSubpage from '../StudDocsOverview/EditAttributesSubpage';
import { COLORS } from '../../../Utils/contants';
import ModalNew from '../../../../components/Modal';

function StudentsAgentEditor(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [studentsAgentEditor, setStudentsAgentEditor] = useState({
    showAgentPage: false,
    showEditorPage: false,
    showAttributesPage: false,
    showArchivModalPage: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [shouldInform, setShouldInform] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateStudentArchivStatus = (student_id, archiv, shouldInform) => {
    setAnchorEl(null);
    setIsLoading(true);
    props.updateStudentArchivStatus(student_id, archiv, shouldInform);
    setArchivModalhide();
    setIsLoading(false);
    setShouldInform(false);
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

  const setArchivModalOpen = () => {
    setAnchorEl(null);
    setStudentsAgentEditor((prevState) => ({
      ...prevState,
      subpage: 4,
      showArchivModalPage: true
    }));
  };

  const setArchivModalhide = () => {
    setStudentsAgentEditor((prevState) => ({
      ...prevState,
      showArchivModalPage: false
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
    props.submitUpdateAgentlist(e, updateAgentList, student_id);
    setAgentModalhide();
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
    studentsAgent = t('No Agent assigned');
  } else {
    studentsAgent = props.student.agents.map((agent) => (
      <Fragment key={agent._id}>
        <Link
          to={`${DEMO.TEAM_AGENT_LINK(agent._id.toString())}`}
          component={LinkDom}
        >
          {agent.firstname}
        </Link>
        &nbsp;
      </Fragment>
    ));
  }
  if (
    props.student.editors === undefined ||
    props.student.editors.length === 0
  ) {
    studentsEditor = t('No Editor assigned');
  } else {
    studentsEditor = props.student.editors.map((editor) => (
      <Fragment key={editor._id}>
        <Link
          to={`${DEMO.TEAM_EDITOR_LINK(editor._id.toString())}`}
          component={LinkDom}
        >
          {`${editor.firstname}`}
        </Link>
        &nbsp;
      </Fragment>
    ));
  }

  return (
    <>
      <TableRow
        style={{
          backgroundColor: props.student.archiv === true ? '#1de9b6' : ''
        }}
        title={props.student.archiv === true ? 'Closed' : 'Open'}
      >
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
                {t('Option', { ns: 'common' })}
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
                  {t('Edit Agent', { ns: 'dashboard' })}
                </MenuItem>
                <MenuItem onClick={() => startEditingEditor()}>
                  {t('Edit Editor', { ns: 'dashboard' })}
                </MenuItem>
                {!is_TaiGer_Editor(user) && (
                  <MenuItem onClick={() => startEditingAttributes()}>
                    {t('Configure Attribute', { ns: 'dashboard' })}
                  </MenuItem>
                )}
                {!is_TaiGer_Editor(user) && (
                  <MenuItem onClick={() => setArchivModalOpen()}>
                    {is_User_Archived(props.student)
                      ? t('Move to Active', { ns: 'common' })
                      : t('Move to Archive', { ns: 'common' })}
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </TableCell>
        {!is_TaiGer_Student(user) ? (
          <TableCell>
            <Typography variant="body2" fontWeight="bold">
              <Link
                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                  props.student._id,
                  DEMO.PROFILE_HASH
                )}`}
                component={LinkDom}
              >
                {props.student.firstname}, {props.student.lastname} {' | '}
                {props.student.lastname_chinese}
                {props.student.firstname_chinese}
              </Link>
            </Typography>
            <Typography variant="body2">{props.student.email}</Typography>
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
        <TableCell>
          <Typography variant="body2">{studentsAgent}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{studentsEditor}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            {props.student.application_preference.expected_application_date ||
              'TBD'}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            {props.student.application_preference
              .expected_application_semester || 'TBD'}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            {props.student.application_preference.target_degree || 'TBD'}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography fontWeight="bold" variant="body2">
            {props.student.academic_background.university.attended_university ||
              'TBD'}
          </Typography>
          <Typography variant="body2">
            {props.student.academic_background.university
              .attended_university_program || 'TBD'}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            {props.student?.application_preference?.target_application_field ||
              'TBD'}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            {props.student.academic_background.language.english_certificate ||
              'TBD'}
          </Typography>
          <Typography variant="body2">
            {props.student.academic_background.language.german_certificate ||
              'TBD'}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            {props.student.academic_background.language.english_score || 'TBD'}
          </Typography>
          <Typography variant="body2">
            {props.student.academic_background.language.german_score || 'TBD'}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            {(props.student.academic_background.language.english_isPassed ===
              'X' &&
              props.student.academic_background.language.english_test_date) ||
              'TBD'}
          </Typography>
          <Typography variant="body2">
            {(props.student.academic_background.language.german_isPassed ===
              'X' &&
              props.student.academic_background.language.german_test_date) ||
              'TBD'}
          </Typography>
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
          {studentsAgentEditor.showArchivModalPage && (
            <ModalNew
              open={studentsAgentEditor.showArchivModalPage}
              size="sm"
              onClose={setArchivModalhide}
              aria-labelledby="contained-modal-title-vcenter"
            >
              <Typography sx={{ mb: 2 }}>
                Do you want to move {props.student.firstname}{' '}
                {props.student.lastname} to{' '}
                {is_User_Archived(props.student)
                  ? t('Active')
                  : t('Archiv', { ns: 'common' })}
              </Typography>
              <FormControlLabel
                label={t('Inform student for archive', { ns: 'common' })}
                control={
                  <Checkbox
                    id={`Inform student`}
                    checked={shouldInform}
                    onChange={() => setShouldInform(!shouldInform)}
                  />
                }
              />
              <br />
              <Button
                color="primary"
                variant="contained"
                onClick={() =>
                  updateStudentArchivStatus(
                    props.student._id,
                    !is_User_Archived(props.student),
                    shouldInform
                  )
                }
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  t('Submit', { ns: 'common' })
                )}
              </Button>
              <Button onClick={setArchivModalhide}>
                {t('Cancel', { ns: 'common' })}
              </Button>
            </ModalNew>
          )}
        </>
      )}
    </>
  );
}

export default StudentsAgentEditor;

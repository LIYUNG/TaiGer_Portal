import React, { useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Link,
  Typography,
  Avatar,
  Tooltip,
  Grid,
  ButtonBase,
  Stack,
  IconButton
} from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import EditAgentsSubpage from '../StudDocsOverview/EditAgentsSubpage';
import EditEditorsSubpage from '../StudDocsOverview/EditEditorsSubpage';
import {
  is_TaiGer_Editor,
  is_TaiGer_role,
  is_User_Archived
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';
import EditAttributesSubpage from '../StudDocsOverview/EditAttributesSubpage';
import { COLORS, stringAvatar } from '../../../Utils/contants';
import ModalNew from '../../../../components/Modal';

function StudentBriefOverview(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [studentBriefOverviewState, setStudentBriefOverviewState] = useState({
    showAgentPage: false,
    showEditorPage: false,
    showAttributesPage: false,
    showArchivModalPage: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [shouldInform, setShouldInform] = useState(false);

  const updateStudentArchivStatus = (student_id, archiv, shouldInform) => {
    setIsLoading(true);
    props.updateStudentArchivStatus(student_id, archiv, shouldInform);
    setArchivModalhide();
    setIsLoading(false);
    setShouldInform(false);
  };

  const setAgentModalhide = () => {
    setStudentBriefOverviewState((prevState) => ({
      ...prevState,
      showAgentPage: false
    }));
  };

  const startEditingAgent = () => {
    setStudentBriefOverviewState((prevState) => ({
      ...prevState,
      subpage: 1,
      showAgentPage: true
    }));
  };

  const setEditorModalhide = () => {
    setStudentBriefOverviewState((prevState) => ({
      ...prevState,
      showEditorPage: false
    }));
  };

  const setAttributeModalhide = () => {
    setStudentBriefOverviewState((prevState) => ({
      ...prevState,
      showAttributesPage: false
    }));
  };

  const setArchivModalOpen = () => {
    setStudentBriefOverviewState((prevState) => ({
      ...prevState,
      subpage: 4,
      showArchivModalPage: true
    }));
  };

  const setArchivModalhide = () => {
    setStudentBriefOverviewState((prevState) => ({
      ...prevState,
      showArchivModalPage: false
    }));
  };

  const startEditingEditor = () => {
    setStudentBriefOverviewState((prevState) => ({
      ...prevState,
      subpage: 2,
      showEditorPage: true
    }));
  };

  const startEditingAttributes = () => {
    setStudentBriefOverviewState((prevState) => ({
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

  const StudentsAgentAvartar = ({ student }) => {
    return (
      student.agents?.map((agent) => (
        <Tooltip
          title={`${agent.firstname} ${agent.lastname}`}
          placement="bottom-start"
          key={agent._id}
        >
          <Link
            to={`${DEMO.TEAM_AGENT_LINK(agent._id.toString())}`}
            component={LinkDom}
            underline="none"
          >
            <Avatar
              {...stringAvatar(`${agent.firstname} ${agent.lastname}`)}
            ></Avatar>
          </Link>
        </Tooltip>
      )) || <></>
    );
  };

  const StudentsEditorAvartar = ({ student }) => {
    return (
      student.editors?.map((editor) => (
        <Tooltip
          title={`${editor.firstname} ${editor.lastname}`}
          placement="bottom-start"
          key={editor._id}
        >
          <Link
            to={`${DEMO.TEAM_EDITOR_LINK(editor._id.toString())}`}
            component={LinkDom}
            underline="none"
          >
            <Avatar
              {...stringAvatar(`${editor.firstname} ${editor.lastname}`)}
            ></Avatar>
          </Link>
        </Tooltip>
      )) || <></>
    );
  };

  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              {!is_TaiGer_Editor(user) && (
                <Box sx={{ display: 'flex' }}>
                  <Tooltip
                    title={
                      is_User_Archived(props.student)
                        ? t('Activate', { ns: 'common' })
                        : t('Archive', { ns: 'common' })
                    }
                    placement="bottom-start"
                  >
                    <IconButton onClick={setArchivModalOpen}>
                      {is_User_Archived(props.student) ? (
                        <UnarchiveIcon />
                      ) : (
                        <ArchiveIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              <Box>
                <Typography variant="body2" color="textSecondary">
                  {props.student.application_preference
                    .expected_application_date || 'TBD'}{' '}
                  {props.student.application_preference
                    .expected_application_semester || 'TBD'}{' '}
                  {props.student.application_preference.target_degree || 'TBD'}{' '}
                  ({props.student.applying_program_count})
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {props.student.firstname}, {props.student.lastname} {' | '}
                  {props.student.lastname_chinese}
                  {props.student.firstname_chinese}
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
                <ButtonBase
                  onClick={() => startEditingAttributes()}
                  sx={{
                    borderRadius: '50%',
                    overflow: 'hidden'
                  }}
                >
                  <Avatar sx={{ bgcolor: '000000', width: 24, height: 24 }}>
                    +
                  </Avatar>
                </ButtonBase>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={1}
            >
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Agents
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <StudentsAgentAvartar student={props.student} />
                  <ButtonBase
                    onClick={startEditingAgent}
                    sx={{
                      borderRadius: '50%',
                      overflow: 'hidden'
                    }}
                  >
                    <Avatar sx={{ bgcolor: '000000' }}>+</Avatar>
                  </ButtonBase>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Editors
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <StudentsEditorAvartar student={props.student} />
                  <ButtonBase
                    onClick={startEditingEditor}
                    sx={{
                      borderRadius: '50%',
                      overflow: 'hidden'
                    }}
                  >
                    <Avatar
                      onClick={() => startEditingEditor()}
                      sx={{ bgcolor: '000000' }}
                    >
                      +
                    </Avatar>
                  </ButtonBase>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      {is_TaiGer_role(user) && (
        <>
          {studentBriefOverviewState.showAgentPage && (
            <EditAgentsSubpage
              student={props.student}
              show={studentBriefOverviewState.showAgentPage}
              onHide={setAgentModalhide}
              submitUpdateAgentlist={submitUpdateAgentlist}
            />
          )}
          {studentBriefOverviewState.showEditorPage && (
            <EditEditorsSubpage
              student={props.student}
              show={studentBriefOverviewState.showEditorPage}
              onHide={setEditorModalhide}
              submitUpdateEditorlist={submitUpdateEditorlist}
            />
          )}
          {studentBriefOverviewState.showAttributesPage && (
            <EditAttributesSubpage
              student={props.student}
              show={studentBriefOverviewState.showAttributesPage}
              onHide={setAttributeModalhide}
              submitUpdateAttributeslist={submitUpdateAttributeslist}
            />
          )}
          {studentBriefOverviewState.showArchivModalPage && (
            <ModalNew
              open={studentBriefOverviewState.showArchivModalPage}
              size="sm"
              onClose={setArchivModalhide}
              aria-labelledby="contained-modal-title-vcenter"
            >
              <Typography sx={{ mb: 2 }}>
                {t('Move to archive statement', {
                  ns: 'common',
                  studentName: `${props.student.firstname} ${props.student.lastname}`,
                  status: `${
                    is_User_Archived(props.student)
                      ? t('Active')
                      : t('Archive', { ns: 'common' })
                  }`
                })}
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

export default StudentBriefOverview;

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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { is_TaiGer_Editor, is_TaiGer_role } from '@taiger-common/core';

import InventoryIcon from '@mui/icons-material/Inventory';
import ReplayIcon from '@mui/icons-material/Replay';
import EditAgentsSubpage from '../StudDocsOverview/EditAgentsSubpage';
import EditEditorsSubpage from '../StudDocsOverview/EditEditorsSubpage';
import { is_User_Archived } from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';
import EditAttributesSubpage from '../StudDocsOverview/EditAttributesSubpage';
import { COLORS, stringAvatar } from '../../../../utils/contants';

const StudentsAgentAvartar = ({ student }) => {
    return (
        student.agents?.map((agent) => (
            <Tooltip
                key={agent._id}
                placement="bottom-start"
                title={`${agent.firstname} ${agent.lastname}`}
            >
                <Link
                    component={LinkDom}
                    to={`${DEMO.TEAM_AGENT_LINK(agent._id.toString())}`}
                    underline="none"
                >
                    <Avatar
                        {...stringAvatar(
                            `${agent.firstname} ${agent.lastname}`
                        )}
                    />
                </Link>
            </Tooltip>
        )) || null
    );
};

const StudentsEditorAvartar = ({ student }) => {
    return (
        student.editors?.map((editor) => (
            <Tooltip
                key={editor._id}
                placement="bottom-start"
                title={`${editor.firstname} ${editor.lastname}`}
            >
                <Link
                    component={LinkDom}
                    to={`${DEMO.TEAM_EDITOR_LINK(editor._id.toString())}`}
                    underline="none"
                >
                    <Avatar
                        {...stringAvatar(
                            `${editor.firstname} ${editor.lastname}`
                        )}
                    />
                </Link>
            </Tooltip>
        )) || null
    );
};

const StudentBriefOverview = (props) => {
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

    const submitUpdateAttributeslist = (
        e,
        updateAttributesList,
        student_id
    ) => {
        setAttributeModalhide();
        props.submitUpdateAttributeslist(e, updateAttributesList, student_id);
    };

    return (
        <>
            <Box>
                <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                        <Stack alignItems="center" direction="row" spacing={1}>
                            {!is_TaiGer_Editor(user) ? (
                                <Box sx={{ display: 'flex' }}>
                                    <Tooltip
                                        placement="bottom-start"
                                        title={
                                            is_User_Archived(props.student)
                                                ? t('Activate', {
                                                      ns: 'common'
                                                  })
                                                : t('Archive', { ns: 'common' })
                                        }
                                    >
                                        <IconButton
                                            onClick={setArchivModalOpen}
                                        >
                                            {is_User_Archived(props.student) ? (
                                                <ReplayIcon />
                                            ) : (
                                                <InventoryIcon />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            ) : null}
                            <Box>
                                <Typography
                                    color="textSecondary"
                                    variant="body2"
                                >
                                    {props.student.application_preference
                                        .expected_application_date ||
                                        'TBD'}{' '}
                                    {props.student.application_preference
                                        .expected_application_semester ||
                                        'TBD'}{' '}
                                    {props.student.application_preference
                                        .target_degree || 'TBD'}{' '}
                                    ({props.student.applying_program_count})
                                </Typography>
                                <Typography fontWeight="bold" variant="body1">
                                    {props.student.firstname},{' '}
                                    {props.student.lastname} {' | '}
                                    {props.student.lastname_chinese}
                                    {props.student.firstname_chinese}
                                </Typography>
                                <Typography variant="body2">
                                    {props.student.email}
                                </Typography>
                                {is_TaiGer_role(user)
                                    ? props.student.attributes?.map(
                                          (attribute) => (
                                              <Chip
                                                  color={
                                                      COLORS[attribute.value]
                                                  }
                                                  key={attribute._id}
                                                  label={attribute.name}
                                                  size="small"
                                              />
                                          )
                                      )
                                    : null}
                                <ButtonBase
                                    onClick={() => startEditingAttributes()}
                                    sx={{
                                        borderRadius: '50%',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: '000000',
                                            width: 24,
                                            height: 24
                                        }}
                                    >
                                        +
                                    </Avatar>
                                </ButtonBase>
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Stack
                            alignItems="center"
                            direction="row"
                            justifyContent="flex-end"
                            spacing={1}
                        >
                            <Box>
                                <Typography
                                    color="textSecondary"
                                    variant="body2"
                                >
                                    Agents
                                </Typography>
                                <Box alignItems="center" display="flex" mt={1}>
                                    <StudentsAgentAvartar
                                        student={props.student}
                                    />
                                    <ButtonBase
                                        onClick={startEditingAgent}
                                        sx={{
                                            borderRadius: '50%',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: '000000' }}>
                                            +
                                        </Avatar>
                                    </ButtonBase>
                                </Box>
                            </Box>
                            <Box>
                                <Typography
                                    color="textSecondary"
                                    variant="body2"
                                >
                                    Editors
                                </Typography>
                                <Box alignItems="center" display="flex" mt={1}>
                                    <StudentsEditorAvartar
                                        student={props.student}
                                    />
                                    <ButtonBase
                                        onClick={startEditingEditor}
                                        sx={{
                                            borderRadius: '50%',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: '000000' }}>
                                            +
                                        </Avatar>
                                    </ButtonBase>
                                </Box>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
            {is_TaiGer_role(user) ? (
                <>
                    {studentBriefOverviewState.showAgentPage ? (
                        <EditAgentsSubpage
                            onHide={setAgentModalhide}
                            show={studentBriefOverviewState.showAgentPage}
                            student={props.student}
                            submitUpdateAgentlist={submitUpdateAgentlist}
                        />
                    ) : null}
                    {studentBriefOverviewState.showEditorPage ? (
                        <EditEditorsSubpage
                            onHide={setEditorModalhide}
                            show={studentBriefOverviewState.showEditorPage}
                            student={props.student}
                            submitUpdateEditorlist={submitUpdateEditorlist}
                        />
                    ) : null}
                    {studentBriefOverviewState.showAttributesPage ? (
                        <EditAttributesSubpage
                            onHide={setAttributeModalhide}
                            show={studentBriefOverviewState.showAttributesPage}
                            student={props.student}
                            submitUpdateAttributeslist={
                                submitUpdateAttributeslist
                            }
                        />
                    ) : null}
                    {studentBriefOverviewState.showArchivModalPage ? (
                        <Dialog
                            onClose={setArchivModalhide}
                            open={studentBriefOverviewState.showArchivModalPage}
                        >
                            <DialogTitle>
                                {t('Move to archive statement', {
                                    ns: 'common',
                                    studentName: `${props.student.firstname} ${props.student.lastname}`,
                                    status: `${
                                        is_User_Archived(props.student)
                                            ? t('Active')
                                            : t('Archive', { ns: 'common' })
                                    }`
                                })}
                            </DialogTitle>
                            <DialogContent>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={shouldInform}
                                            id="Inform student"
                                            onChange={() =>
                                                setShouldInform(!shouldInform)
                                            }
                                        />
                                    }
                                    label={t('Inform student for archive', {
                                        ns: 'common'
                                    })}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    color="primary"
                                    disabled={isLoading}
                                    onClick={() =>
                                        updateStudentArchivStatus(
                                            props.student._id,
                                            !is_User_Archived(props.student),
                                            shouldInform
                                        )
                                    }
                                    variant="contained"
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
                            </DialogActions>
                        </Dialog>
                    ) : null}
                </>
            ) : null}
        </>
    );
};

export default StudentBriefOverview;

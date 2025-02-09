import React, { useState } from 'react';
import { Link as LinkDom, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TimezoneSelect from 'react-timezone-select';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    List,
    ListItemText,
    ListItemIcon,
    ListItemButton,
    Box,
    Link,
    Button,
    Grid,
    Typography,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { is_TaiGer_role } from '@taiger-common/core';

import { LinkableNewlineText } from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import {
    addInterviewTrainingDateTime,
    getEditors,
    updateInterview
} from '../../api';
import NotesEditor from '../Notes/NotesEditor';
import { useAuth } from '../../components/AuthProvider';
import {
    INTERVIEW_STATUS_E,
    NoonNightLabel,
    convertDate,
    isInTheFuture,
    showTimezoneOffset
} from '../../utils/contants';
import ModalMain from '../Utils/ModalHandler/ModalMain';

const InterviewItems = (props) => {
    const { t } = useTranslation();
    const [isCollapse, setIsCollapse] = useState(props.expanded);
    const [showModal, setShowModal] = useState(false);
    const [interview, setiInterview] = useState({
        ...props.interview,
        interview_description:
            props.interview?.interview_description &&
            props.interview?.interview_description !== '{}'
                ? JSON.parse(props.interview.interview_description)
                : { time: new Date(), blocks: [] }
    });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [editors, setEditors] = useState([]);
    const [interviewTrainingTimeChange, setInterviewTrainingTimeChange] =
        useState(false);
    const [trainerId, setTrainerId] = useState(
        new Set(interview.trainer_id?.map((t_id) => t_id._id.toString()))
    );
    const [utcTime, setUtcTime] = React.useState(
        dayjs(props.interview.event_id?.start || '')
    );
    const [interviewItemsState, setInterviewItemsState] = useState({
        res_modal_message: '',
        res_modal_status: 0
    });
    const { user } = useAuth();
    const [timezone, setTimezone] = useState(
        user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsCollapse(!isCollapse);
    };

    const handleChangeInterviewTrainingTime = (newValue) => {
        setUtcTime(newValue);
        setInterviewTrainingTimeChange(true);
    };

    const toggleModal = () => {
        setTrainerId(
            new Set(interview.trainer_id.map((t_id) => t_id._id.toString()))
        );
        setShowModal(!showModal);
    };

    const openModal = async () => {
        setShowModal(true);
        getEditor();
    };

    const onClickToInterviewSurveyHandler = () => {
        navigate(
            DEMO.INTERVIEW_SINGLE_SURVEY_LINK(props.interview._id.toString())
        );
    };

    const modifyTrainer = (new_trainerId, isActive) => {
        if (isActive) {
            const temp_0 = [...trainerId];
            const temp = new Set(temp_0);
            temp.delete(new_trainerId);
            setTrainerId(new Set(temp));
        } else {
            const temp_0 = [...trainerId];
            const temp = new Set(temp_0);
            temp.add(new_trainerId);
            setTrainerId(new Set(temp));
        }
    };

    const getEditor = async () => {
        const { data } = await getEditors();
        const { data: editors_a } = data;
        setEditors(editors_a);
    };

    const updateTrainer = async () => {
        const temp_trainer_id_array = Array.from(trainerId);
        const resp = await updateInterview(interview._id.toString(), {
            trainer_id: temp_trainer_id_array
        });
        const { data: interview_updated, success } = resp.data;
        if (success) {
            setiInterview(interview_updated);
            setShowModal(false);
        } else {
            const { message } = resp.data;
            setInterviewItemsState((prevState) => ({
                ...prevState,
                res_modal_message: message,
                res_modal_status: resp.status
            }));
        }
    };
    const handleChange_UpdateInterview = (e) => {
        setButtonDisabled(false);
        setiInterview((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleEditorChange = (editorState) => {
        setButtonDisabled(false);
        setiInterview((prevState) => ({
            ...prevState,
            interview_description: editorState
        }));
    };

    const handleClickSave = async (e, editorState) => {
        e.preventDefault();
        var notes = JSON.stringify(editorState);
        const { data, status } = await updateInterview(
            interview._id.toString(),
            {
                interviewer: interview.interviewer,
                interview_date: interview.interview_date,
                interview_description: notes
            }
        );
        const { data: interview_updated, success } = data;
        if (success) {
            setiInterview(interview_updated);
            setButtonDisabled(true);
        } else {
            const { message } = data;
            setInterviewItemsState({
                res_modal_message: message,
                res_modal_status: status
            });
        }
    };

    const handleSendInterviewInvitation = async (e) => {
        e.preventDefault();
        try {
            const end_date = new Date(utcTime);
            end_date.setMinutes(end_date.getMinutes() + 60);
            const interviewTrainingEvent = {
                _id: interview.event_id?._id,
                requester_id: [interview.student_id],
                receiver_id: [...interview.trainer_id],
                title: `${interview.student_id.firstname} ${interview.student_id.lastname} - ${interview.program_id.school} - ${interview.program_id.program_name} ${interview.program_id.degree} interview training`,
                description:
                    'This is the interview training. Please prepare and practice',
                event_type: 'Interview',
                start: new Date(utcTime),
                end: end_date
            };
            const resp = await addInterviewTrainingDateTime(
                interview._id.toString(),
                interviewTrainingEvent
            );
            const { success } = resp.data;
            if (success) {
                setInterviewTrainingTimeChange(false);
            } else {
                const { message } = resp.data;
                setInterviewItemsState((prevState) => ({
                    ...prevState,
                    res_modal_message: message,
                    res_modal_status: resp.status
                }));
            }
        } catch (error) {
            // Handle error here
            // Extract the response message from the error object
            let errorMessage =
                'An error occurred while sending the interview invitation. Please try again later.';
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            console.error('Error sending interview invitation:', error);

            // Optionally set error state to display in the UI
            setInterviewItemsState((prevState) => ({
                ...prevState,
                res_modal_message: errorMessage,
                res_modal_status: 500
            }));
        }
    };

    const interviewStatus = (interview) => {
        if (interview.status === 'Unscheduled') {
            return INTERVIEW_STATUS_E.UNSCHEDULED_SYMBOL;
        } else if (interview.status === 'Scheduled') {
            return INTERVIEW_STATUS_E.SCHEDULED_SYMBOL;
        } else {
            return INTERVIEW_STATUS_E.SCHEDULED_SYMBOL;
        }
    };

    const ConfirmError = () => {
        setInterviewItemsState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    return (
        <>
            <Accordion disableGutters expanded={isCollapse}>
                <AccordionSummary onClick={handleToggle}>
                    <Typography variant="body1">
                        {interviewStatus(interview)}
                        &nbsp;
                        {interview.status}
                        &nbsp;
                        {props.interview.event_id?.start ? (
                            <>
                                {`${convertDate(utcTime)} ${NoonNightLabel(utcTime)} ${
                                    Intl.DateTimeFormat().resolvedOptions()
                                        .timeZone
                                }`}
                                {showTimezoneOffset()}
                                &nbsp;
                            </>
                        ) : null}
                        <b>{` ${interview.student_id.firstname} - ${interview.student_id.lastname}`}</b>
                    </Typography>
                    <span style={{ float: 'right', cursor: 'pointer' }}>
                        {is_TaiGer_role(user) ? (
                            <Button
                                color="error"
                                onClick={(e) =>
                                    props.openDeleteDocModalWindow(e, interview)
                                }
                                size="small"
                                startIcon={<DeleteIcon />}
                                title="Delete"
                                variant="contained"
                            >
                                {t('Delete', { ns: 'common' })}
                            </Button>
                        ) : null}
                    </span>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item md={4} xs={12}>
                            <Typography fontWeight="bold" variant="body1">
                                {t('Student', { ns: 'common' })}:{' '}
                            </Typography>
                            <Link
                                component={LinkDom}
                                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                    interview.student_id._id.toString(),
                                    DEMO.PROFILE_HASH
                                )}`}
                                underline="hover"
                            >
                                <Typography fontWeight="bold">{` ${interview.student_id.firstname} - ${interview.student_id.lastname}`}</Typography>
                            </Link>
                            <Typography
                                fontWeight="bold"
                                sx={{ mt: 2 }}
                                variant="body1"
                            >
                                {t('Trainer')}
                            </Typography>{' '}
                            {interview.trainer_id &&
                            interview.trainer_id?.length !== 0 ? (
                                <>
                                    {interview.trainer_id.map((t_id, idx) => (
                                        <Box
                                            key={idx}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {t_id.firstname} {t_id.lastname}{' '}
                                            -&nbsp;
                                            <LinkableNewlineText
                                                text={t_id.email}
                                            />
                                        </Box>
                                    ))}
                                    {is_TaiGer_role(user) && !props.readOnly ? (
                                        <Button
                                            color="secondary"
                                            onClick={openModal}
                                            size="small"
                                            variant="contained"
                                        >
                                            {t('Change Trainer')}
                                        </Button>
                                    ) : null}
                                </>
                            ) : (
                                <>
                                    <Typography>
                                        {t('No Trainer Assigned')}
                                    </Typography>
                                    {is_TaiGer_role(user) && !props.readOnly ? (
                                        <Button
                                            color="primary"
                                            onClick={openModal}
                                            size="small"
                                            variant="contained"
                                        >
                                            {t('Assign Trainer')}
                                        </Button>
                                    ) : null}
                                </>
                            )}
                            <Typography
                                fontWeight="bold"
                                sx={{ mt: 2 }}
                                variant="body1"
                            >
                                {t('Interview Training Time', {
                                    ns: 'interviews'
                                })}
                                :&nbsp;
                            </Typography>
                            {is_TaiGer_role(user) ? (
                                interview.trainer_id?.length !== 0 ? (
                                    <>
                                        <TimezoneSelect
                                            displayValue="UTC"
                                            isDisabled={true}
                                            onChange={(e) =>
                                                setTimezone(e.value)
                                            }
                                            value={timezone}
                                        />
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                        >
                                            <DesktopDateTimePicker
                                                onChange={(newValue) =>
                                                    handleChangeInterviewTrainingTime(
                                                        newValue
                                                    )
                                                }
                                                value={utcTime}
                                            />
                                        </LocalizationProvider>
                                        <Button
                                            color="primary"
                                            disabled={
                                                !interviewTrainingTimeChange
                                            }
                                            fullWidth
                                            onClick={(e) =>
                                                handleSendInterviewInvitation(e)
                                            }
                                            sx={{ mt: 1 }}
                                            variant="contained"
                                        >
                                            {t('Send Invitation')}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {t(
                                            'Please assign Interview Trainer first.'
                                        )}
                                    </>
                                )
                            ) : null}
                            {!is_TaiGer_role(user) ? (
                                props.interview.event_id?.start ? (
                                    <Typography>
                                        {`${convertDate(utcTime)} ${NoonNightLabel(utcTime)} ${
                                            Intl.DateTimeFormat().resolvedOptions()
                                                .timeZone
                                        }`}
                                        {showTimezoneOffset()}
                                    </Typography>
                                ) : (
                                    <Typography variant="body1">
                                        To be announced
                                    </Typography>
                                )
                            ) : null}
                            <Typography
                                fontWeight="bold"
                                sx={{ mt: 2 }}
                                variant="body1"
                            >
                                {t('Interview Training Meeting Link', {
                                    ns: 'interviews'
                                })}
                                :&nbsp;
                            </Typography>
                            {props.interview.event_id ? (
                                <Link
                                    component={LinkDom}
                                    target="_blank"
                                    to={props.interview.event_id.meetingLink}
                                    underline="hover"
                                >
                                    {props.interview.event_id.meetingLink}
                                </Link>
                            ) : (
                                <Typography variant="body1">
                                    To be announced
                                </Typography>
                            )}
                            <Typography
                                fontWeight="bold"
                                sx={{ mt: 2 }}
                                variant="body1"
                            >
                                {t('Interview Training Survey', {
                                    ns: 'interviews'
                                })}
                                :&nbsp;
                            </Typography>
                            <Button
                                color="primary"
                                disabled={isInTheFuture(
                                    props.interview.interview_date
                                )}
                                fullWidth
                                onClick={onClickToInterviewSurveyHandler}
                                size="small"
                                variant="contained"
                            >
                                {t('Survey', { ns: 'common' })}
                            </Button>
                        </Grid>
                        <Grid item md={8} xs={12}>
                            <Typography fontWeight="bold" variant="body1">
                                {t('Interview Program')}:&nbsp;
                            </Typography>
                            <Link
                                component={LinkDom}
                                target="_blank"
                                to={`${DEMO.SINGLE_PROGRAM_LINK(
                                    interview.program_id._id.toString()
                                )}`}
                                underline="hover"
                            >
                                {`${interview.program_id.school} - ${interview.program_id.program_name} ${interview.program_id.degree}`}
                            </Link>
                            {is_TaiGer_role(user) ? (
                                <Typography variant="body1">
                                    {t('Previous questions records:')}&nbsp;
                                    <Button size="small" variant="outlined">
                                        {props.questionsNum}
                                    </Button>
                                </Typography>
                            ) : null}
                            <Typography
                                fontWeight="bold"
                                sx={{ mt: 2 }}
                                variant="body1"
                            >
                                {t('Interviewer', { ns: 'interviews' })}:&nbsp;
                            </Typography>
                            <Typography variant="body1">
                                <TextField
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    fullWidth
                                    id="interviewer"
                                    name="interviewer"
                                    onChange={(e) =>
                                        handleChange_UpdateInterview(e)
                                    }
                                    placeholder="Prof. Sebastian"
                                    required
                                    size="small"
                                    type="text"
                                    value={interview.interviewer}
                                    // label={`${t('Interviewer', { ns: 'interviews' })}`}
                                />
                            </Typography>
                            <Typography
                                fontWeight="bold"
                                sx={{ mt: 2 }}
                                variant="body1"
                            >
                                {t('Interview Time')} (
                                {t('Your timezone local time')}{' '}
                                {`${
                                    Intl.DateTimeFormat().resolvedOptions()
                                        .timeZone
                                } ${showTimezoneOffset()}`}
                                ):&nbsp;
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDateTimePicker
                                    fullWidth
                                    id="interview_date"
                                    onChange={(newValue) => {
                                        const interviewData_temp = {
                                            ...interview
                                        };
                                        interviewData_temp.interview_date =
                                            newValue;
                                        setButtonDisabled(false);
                                        setiInterview(interviewData_temp);
                                    }}
                                    required
                                    size="small"
                                    value={dayjs(
                                        interview.interview_date || ''
                                    )}
                                />
                            </LocalizationProvider>
                            <Typography
                                fontWeight="bold"
                                sx={{ mt: 2 }}
                                variant="body1"
                            >
                                {t('Description', { ns: 'common' })}
                            </Typography>{' '}
                            <NotesEditor
                                buttonDisabled={buttonDisabled}
                                editorState={interview.interview_description}
                                handleClickSave={handleClickSave}
                                handleEditorChange={handleEditorChange}
                                notes_id={`${props.interview._id.toString()}-description`}
                                readOnly={props.readOnly}
                                thread={null}
                                unique_id={`${props.interview._id.toString()}-description`}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Dialog
                centered
                onClose={toggleModal}
                open={showModal}
                size="small"
            >
                <DialogTitle>{t('Assign Trainer')}</DialogTitle>
                <DialogContent>
                    <List>
                        {editors?.map((editor, i) => (
                            <ListItemButton
                                dense
                                key={i}
                                onClick={() =>
                                    modifyTrainer(
                                        editor._id.toString(),
                                        trainerId.has(editor._id.toString())
                                    )
                                }
                                role={undefined}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={trainerId.has(
                                            editor._id.toString()
                                        )}
                                        disableRipple
                                        edge="start"
                                        tabIndex={-1}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${editor.firstname} ${editor.lastname}`}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={updateTrainer}
                        variant="contained"
                    >
                        {t('Assign', { ns: 'common' })}
                    </Button>
                    <Button
                        color="secondary"
                        onClick={toggleModal}
                        variant="contained"
                    >
                        {t('Close', { ns: 'common' })}
                    </Button>
                </DialogActions>
            </Dialog>
            {interviewItemsState.res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={interviewItemsState.res_modal_message}
                    res_modal_status={interviewItemsState.res_modal_status}
                />
            ) : null}
        </>
    );
};

export default InterviewItems;

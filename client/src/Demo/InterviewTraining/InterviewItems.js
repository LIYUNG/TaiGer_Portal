import React, { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography
} from '@mui/material';
import {
  AiFillCheckCircle,
  AiFillQuestionCircle,
  AiOutlineDelete,
  AiOutlineEdit
} from 'react-icons/ai';

import {
  LinkableNewlineText,
  is_TaiGer_AdminAgent,
  is_TaiGer_role
} from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import { getEditors, updateInterview } from '../../api';
import NotesEditor from '../Notes/NotesEditor';
import EventDateComponent from '../../components/DateComponent';
import { useAuth } from '../../components/AuthProvider';
import ModalNew from '../../components/Modal';

function InterviewItems(props) {
  const { t } = useTranslation();
  const [isCollapse, setIsCollapse] = useState(props.expanded);
  const [showModal, setShowModal] = useState(false);
  const [interview, setiInterview] = useState(props.interview);
  const [editors, setEditors] = useState([]);
  const [trainerId, setTrainerId] = useState(
    new Set(interview.trainer_id?.map((t_id) => t_id._id.toString()))
  );
  const { user } = useAuth();

  const handleToggle = () => {
    setIsCollapse(!isCollapse);
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
    const { data } = await updateInterview(interview._id.toString(), {
      trainer_id: temp_trainer_id_array
    });
    const { data: interview_updated, success } = data;
    if (success) {
      setiInterview(interview_updated);
      setShowModal(false);
    }
  };

  const handleClickInterviewDescriptionSave = async (e, editorState) => {
    e.preventDefault();
    var notes = JSON.stringify(editorState);
    const { data } = await updateInterview(interview._id.toString(), {
      interview_description: notes
    });
    const { data: interview_updated, success } = data;
    if (success) {
      setiInterview(interview_updated);
    }
  };

  const handleClickInterviewNotesSave = async (e, editorState) => {
    e.preventDefault();
    var notes = JSON.stringify(editorState);
    const { data } = await updateInterview(interview._id.toString(), {
      interview_notes: notes
    });
    const { data: interview_updated, success } = data;
    if (success) {
      setiInterview(interview_updated);
    }
  };

  return (
    <>
      <Accordion expanded={isCollapse} disableGutters>
        <AccordionSummary onClick={handleToggle}>
          <Typography variant="body1">
            {interview.status !== 'Unscheduled' ? (
              <AiFillCheckCircle
                color="limegreen"
                size={24}
                title="Confirmed"
              />
            ) : (
              <AiFillQuestionCircle color="grey" size={24} />
            )}
            &nbsp;
            {interview.status}
            &nbsp;
            <b>{` ${interview.student_id.firstname} - ${interview.student_id.lastname}`}</b>
          </Typography>
          <span style={{ float: 'right', cursor: 'pointer' }}>
            {is_TaiGer_AdminAgent(user) && !props.readOnly && (
              <Button
                color="error"
                variant="contained"
                size="small"
                title="Delete"
                onClick={(e) => props.openDeleteDocModalWindow(e, interview)}
              >
                <AiOutlineDelete size={16} />
                &nbsp; Delete
              </Button>
            )}
            {props.readOnly && (
              <Link
                to={`${DEMO.INTERVIEW_SINGLE_LINK(interview._id.toString())}`}
              >
                <Button
                  color="secondary"
                  variant="contained"
                  size="small"
                  title="Delete"
                >
                  <AiOutlineEdit size={16} />
                  &nbsp; Edit
                </Button>
              </Link>
            )}
          </span>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">{t('Student')}: </Typography>
              <Link
                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                  interview.student_id._id.toString(),
                  DEMO.PROFILE
                )}`}
              >
                <Typography fontWeight="bold">{` ${interview.student_id.firstname} - ${interview.student_id.lastname}`}</Typography>
              </Link>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <LinkableNewlineText text={interview.student_id.email} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                {t('Interview Program')}:&nbsp;
              </Typography>
              <Link
                to={`${DEMO.SINGLE_PROGRAM_LINK(
                  interview.program_id._id.toString()
                )}`}
                target="_blank"
              >
                {`${interview.program_id.school} - ${interview.program_id.program_name} ${interview.program_id.degree}`}
              </Link>
              <Typography variant="body1">
                {t('Interview Date')}:&nbsp;
                {`${interview.interview_date} - ${interview.interview_time}`}
              </Typography>
              <Typography variant="body1">
                {t('Interviewer')}:&nbsp;
                {`${interview.interviewer}`}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">{t('Description')}</Typography>{' '}
          </Grid>
          <Grid item xs={12}>
            <NotesEditor
              thread={null}
              notes_id={`${props.interview._id.toString()}-description`}
              // buttonDisabled={this.state.buttonDisabled}
              editorState={
                interview.interview_description &&
                interview.interview_description !== '{}'
                  ? JSON.parse(interview.interview_description)
                  : { time: new Date(), blocks: [] }
              }
              unique_id={`${props.interview._id.toString()}-description`}
              handleClickSave={handleClickInterviewDescriptionSave}
              readOnly={props.readOnly}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">{t('Trainer')}</Typography>{' '}
          </Grid>
          <Grid item xs={12}>
            {interview.trainer_id && interview.trainer_id?.length !== 0 ? (
              <>
                {interview.trainer_id.map((t_id, idx) => (
                  <Box
                    key={idx}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    {t_id.firstname} {t_id.lastname} -&nbsp;
                    <LinkableNewlineText text={t_id.email} />
                  </Box>
                ))}
                {is_TaiGer_role(user) && !props.readOnly && (
                  <Button
                    color="secondary"
                    variant="contained"
                    size="small"
                    onClick={openModal}
                  >
                    {t('Change Trainer')}
                  </Button>
                )}
              </>
            ) : (
              <>
                <Typography>{t('No Trainer Assigned')}</Typography>
                {is_TaiGer_role(user) && !props.readOnly && (
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={openModal}
                  >
                    {t('Assign Trainer')}
                  </Button>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              {t('Interview Training Time')}:&nbsp;
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {`${interview.interview_training_time || 'Unscheduled'}`}
            {is_TaiGer_role(user) && !props.readOnly && (
              <Button color="secondary" variant="contained" size="small">
                {t('Make Training Time Available')}
              </Button>
            )}
            <EventDateComponent eventDate={new Date('2024-01-01')} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">{t('Notes')}</Typography>{' '}
          </Grid>
          <Grid item xs={12}>
            <NotesEditor
              thread={null}
              notes_id={`${props.interview._id.toString()}-notes`}
              // buttonDisabled={this.state.buttonDisabled}
              editorState={
                interview.interview_notes && interview.interview_notes !== '{}'
                  ? JSON.parse(interview.interview_notes)
                  : { time: new Date(), blocks: [] }
              }
              unique_id={`${props.interview._id.toString()}-notes`}
              handleClickSave={handleClickInterviewNotesSave}
              readOnly={props.readOnly}
            />
          </Grid>
        </AccordionDetails>
      </Accordion>
      <ModalNew open={showModal} size="small" centered onClose={toggleModal}>
        <Typography>Assign Trainer</Typography>
        {editors?.map((editor, i) => (
          <ListGroup as="ul" key={i}>
            <ListGroup.Item
              as="li"
              active={trainerId.has(editor._id.toString())}
              action
              onClick={() =>
                modifyTrainer(
                  editor._id.toString(),
                  trainerId.has(editor._id.toString())
                )
              }
            >
              {editor.firstname} {editor.lastname}
            </ListGroup.Item>
          </ListGroup>
        ))}
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={updateTrainer}
        >
          {t('Assign')}
        </Button>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={toggleModal}
        >
          {t('Close')}
        </Button>
      </ModalNew>
    </>
  );
}

export default InterviewItems;

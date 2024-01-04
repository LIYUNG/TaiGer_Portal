import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Collapse,
  ListGroup,
  Modal,
  Row
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  is_TaiGer_AdminAgent,
  is_TaiGer_role
} from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import {
  AiFillCheckCircle,
  AiFillQuestionCircle,
  AiOutlineDelete,
  AiOutlineEdit
} from 'react-icons/ai';
import { getEditors, updateInterview } from '../../api';
import EditorSimple from '../../components/EditorJs/EditorSimple';
import NotesEditor from '../Notes/NotesEditor';

function InterviewItems(props) {
  const { t, i18n } = useTranslation();
  const [isCollapse, setIsCollapse] = useState(props.expanded);
  const [showModal, setShowModal] = useState(false);
  const [interview, setiInterview] = useState(props.interview);
  const [editors, setEditors] = useState([]);
  const [trainerId, setTrainerId] = useState(
    new Set(interview.trainer_id?.map((t_id) => t_id._id.toString()))
  );

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
    const { data: editors_a, success } = data;
    setEditors(editors_a);
  };

  const updateTrainer = async () => {
    const temp_trainer_id_array = Array.from(trainerId);
    console.log(temp_trainer_id_array);
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
      <Card className="my-2">
        <Card.Header onClick={handleToggle} style={{ cursor: 'pointer' }}>
          <Card.Title>
            <h5>
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
            </h5>
            <span style={{ float: 'right', cursor: 'pointer' }}>
              {is_TaiGer_AdminAgent(props.user) && !props.readOnly && (
                <Button
                  variant="danger"
                  size="sm"
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
                  <Button variant="secondary" size="sm" title="Delete">
                    <AiOutlineEdit size={16} />
                    &nbsp; Edit
                  </Button>
                </Link>
              )}
            </span>
          </Card.Title>
        </Card.Header>
        <Collapse in={isCollapse}>
          <Card.Body>
            <Row>
              <Col>
                <h5>
                  <i className="feather icon-user-check me-1" />
                  {t('Student')} :
                  <Link
                    to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                      interview.student_id._id.toString(),
                      DEMO.PROFILE
                    )}`}
                  >
                    <b>{` ${interview.student_id.firstname} - ${interview.student_id.lastname}`}</b>
                  </Link>
                </h5>
                <p>{`Email: ${interview.student_id.email}`}</p>
              </Col>
              <Col>
                <h5>
                  <Link
                    to={`${DEMO.SINGLE_PROGRAM_LINK(
                      interview.program_id._id.toString()
                    )}`}
                    target="_blank"
                  >
                    <i className="feather icon-star me-1" />
                    {t('Interview Program')}:&nbsp;
                    {`${interview.program_id.school} - ${interview.program_id.program_name} ${interview.program_id.degree}`}
                    <br />
                  </Link>
                </h5>
                <br />
                <h5>
                  <i className="feather icon-calendar me-1" />
                  {t('Interview Date')}:&nbsp;
                  {`${interview.interview_date} - ${interview.interview_time}`}
                </h5>
                <br />
                <h5>
                  <i className="feather icon-user me-1" />
                  {t('Interviewer')}:&nbsp;
                  {`${interview.interviewer}`}
                </h5>
              </Col>
            </Row>
            <br />
            <Row>
              <h5>
                <i className="feather icon-book me-1" />
                {t('Description')}
              </h5>{' '}
            </Row>
            <Row>
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
            </Row>
            <br />
            <Row>
              <h5>
                <i className="feather icon-headphones me-1" />
                {t('Trainer')}
              </h5>{' '}
            </Row>
            <Row>
              {interview.trainer_id && interview.trainer_id?.length !== 0 ? (
                <>
                  {interview.trainer_id.map((t_id, idx) => (
                    <p>
                      {t_id.firstname} {t_id.lastname}
                    </p>
                  ))}
                  {is_TaiGer_role(props.user) && !props.readOnly && (
                    <Button size="sm" variant="secondary" onClick={openModal}>
                      {t('Change Trainer')}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {is_TaiGer_role(props.user) && !props.readOnly && (
                    <Button size="sm" onClick={openModal}>
                      {t('Assign Trainer')}
                    </Button>
                  )}
                </>
              )}
            </Row>
            <br />
            <Row>
              <h5>
                <i className="feather icon-calendar me-1" />
                {t('Interview Training Time')}:&nbsp;
              </h5>
            </Row>
            <Row>
              {`${interview.interview_training_time || 'Unscheduled'}`}
              {is_TaiGer_role(props.user) && !props.readOnly && (
                <Button size="sm">{t('Make Training Time Available')}</Button>
              )}
            </Row>
            <br />
            <Row>
              <h5>
                <i className="feather icon-book me-1" />
                {t('Notes')}
              </h5>{' '}
            </Row>
            <Row>
              <NotesEditor
                thread={null}
                notes_id={`${props.interview._id.toString()}-notes`}
                // buttonDisabled={this.state.buttonDisabled}
                editorState={
                  interview.interview_notes &&
                  interview.interview_notes !== '{}'
                    ? JSON.parse(interview.interview_notes)
                    : { time: new Date(), blocks: [] }
                }
                unique_id={`${props.interview._id.toString()}-notes`}
                handleClickSave={handleClickInterviewNotesSave}
                readOnly={props.readOnly}
              />
            </Row>
          </Card.Body>
        </Collapse>
        <Modal show={showModal} size="sm" centered onHide={toggleModal}>
          <Modal.Header>Assign Trainer</Modal.Header>
          <Modal.Body>
            <Row>
              <h5>
                <i className="feather icon-users me-1" />
                {t('Trainer')}
              </h5>
            </Row>
            <Row>
              {editors?.map((editor, i) => (
                <>
                  <ListGroup as="ul">
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
                      <Row>
                        {editor.firstname} {editor.lastname}
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="primary" onClick={updateTrainer}>
              Assign
            </Button>
            <Button size="sm" variant="secondary" onClick={toggleModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </>
  );
}

export default InterviewItems;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Collapse,
  ProgressBar,
  Button,
  Modal,
  Spinner
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import {
  application_deadline_calculator,
  progressBarCounter
} from '../../Demo/Utils/checking-functions';
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiOutlineFieldTime,
  AiOutlineStop,
  AiOutlineUndo
} from 'react-icons/ai';
import ApplicationProgressCardBody from './ApplicationProgressCardBody';
import { FiExternalLink } from 'react-icons/fi';
import { updateStudentApplicationResult } from '../../api';
import { spinner_style2 } from '../../Demo/Utils/contants';
import DEMO from '../../store/constant';

export default function ApplicationProgressCard(props) {
  const [isCollapse, setIsCollapse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [application, setApplication] = useState(props.application);
  const [resultState, setResultState] = useState('-');
  const [showUndoModal, setShowUndoModal] = useState(false);
  const [showSetResultModal, setShowSetResultModal] = useState(false);
  const { t, i18n } = useTranslation();

  const handleToggle = () => {
    setIsCollapse(!isCollapse);
  };

  const openUndoModal = (e) => {
    e.stopPropagation();
    setShowUndoModal(true);
  };
  const closeUndoModal = () => {
    setShowUndoModal(false);
  };
  const openSetResultModal = (e, result) => {
    e.stopPropagation();
    setShowSetResultModal(true);
    setResultState(result);
  };
  const closeSetResultModal = () => {
    setShowSetResultModal(false);
  };
  const handleUpdateResult = (e, result) => {
    e.stopPropagation();
    setIsLoading(true);
    updateStudentApplicationResult(
      props.student._id.toString(),
      application._id.toString(),
      result
    ).then(
      (res) => {
        const { success } = res.data;
        if (success) {
          const application_tmep = { ...application };
          application_tmep.admission = result;
          setApplication(application_tmep);
          setShowUndoModal(false);
          setShowSetResultModal(false);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      },
      (error) => {}
    );
  };
  return (
    <Card className="my-0 mx-0">
      <Card.Header onClick={handleToggle} style={{ cursor: 'pointer' }}>
        <Card.Title>
          <p>
            {application_deadline_calculator(props.student, application) ===
            'CLOSE' ? (
              <>
                {application.admission === '-' && (
                  <>
                    <AiFillCheckCircle color="limegreen" size={16} />
                    &nbsp;
                    {t('Submitted')}
                  </>
                )}
                {application.admission === 'O' && (
                  <>
                    <AiFillCheckCircle color="lightblue" size={16} />
                    &nbsp;
                    {t('Admitted')}
                  </>
                )}
                {application.admission === 'X' && (
                  <>
                    <AiFillCloseCircle color="red" size={16} />
                    &nbsp;
                    {t('Rejected')}
                  </>
                )}
              </>
            ) : application_deadline_calculator(props.student, application) ===
              'WITHDRAW' ? (
              <span title="Deadline">
                <AiOutlineStop size={16} />{' '}
                {application_deadline_calculator(props.student, application)}
              </span>
            ) : (
              <span title="Deadline">
                <AiOutlineFieldTime size={16} />{' '}
                {application_deadline_calculator(props.student, application)}
              </span>
            )}
          </p>
          <p className="mb-0">
            <img
              src={`/assets/logo/country_logo/svg/${application?.programId.country}.svg`}
              alt="Logo"
              style={{ maxWidth: '20px', maxHeight: '20px' }}
            />{' '}
            <b>{application?.programId?.school}</b>
          </p>
          <p>
            {application?.programId?.degree}{' '}
            {application?.programId?.program_name}{' '}
            {application?.programId?.semester}{' '}
            <Link
              to={`${DEMO.SINGLE_PROGRAM_LINK(
                application?.programId?._id?.toString()
              )}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink />
            </Link>
          </p>
          {application_deadline_calculator(props.student, application) ===
            'CLOSE' &&
            application.admission === '-' && (
              <>
                <p>
                  {t(
                    'Have you received the interview invitation from this program?'
                  )}
                </p>
                <p>
                  <Button
                    variant="primary"
                    disabled
                    size="sm"
                    onClick={(e) => console.log('Book clicked')}
                  >
                    Coming soon
                  </Button>
                </p>
              </>
            )}
          {application_deadline_calculator(props.student, application) ===
            'CLOSE' &&
            (application.admission === '-' ? (
              <p>{t('Tell me about your result')} : </p>
            ) : (
              <Button
                variant="outline-secondary"
                size="sm"
                title="Undo"
                onClick={(e) => openUndoModal(e)}
              >
                <AiOutlineUndo size={16} />
                &nbsp;
                {t('Change your result')}
              </Button>
            ))}

          <p>
            {application_deadline_calculator(props.student, application) ===
            'CLOSE' ? (
              <>
                {application.admission === '-' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => openSetResultModal(e, 'O')}
                    >
                      {t('Admitted')}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => openSetResultModal(e, 'X')}
                    >
                      {t('Rejected')}
                    </Button>
                  </>
                )}
              </>
            ) : (
              ''
            )}
          </p>
          <p style={{ display: 'flex', alignItems: 'center' }}>
            <ProgressBar
              now={
                application_deadline_calculator(props.student, application) ===
                'CLOSE'
                  ? 100
                  : progressBarCounter(props.student, application)
              }
              style={{ flex: 1, marginRight: '10px' }}
              className="custom-progress-bar-container" // Apply your specific class here
            />
            <span>
              {`${
                application_deadline_calculator(props.student, application) ===
                'CLOSE'
                  ? 100
                  : progressBarCounter(props.student, application)
              }%`}
            </span>
          </p>
        </Card.Title>
      </Card.Header>
      <Collapse in={isCollapse}>
        <Card.Body>
          <ApplicationProgressCardBody
            student={props.student}
            application={application}
          />
        </Card.Body>
      </Collapse>
      <Modal show={showUndoModal} onHide={closeUndoModal} centered size="sm">
        <Modal.Header>Attention</Modal.Header>
        <Modal.Body>
          Do you want to <b>undo</b> the result of{' '}
          <b>{`${application.programId.school}-${application.programId.degree}-${application.programId.program_name}`}</b>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            disabled={isLoading}
            size="sm"
            title="Undo"
            onClick={(e) => handleUpdateResult(e, '-')}
          >
            {isLoading ? (
              <div style={spinner_style2}>
                <Spinner animation="border" size="sm" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            ) : (
              t('Confirm')
            )}
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            title="Undo"
            onClick={closeUndoModal}
          >
            {t('Cancel')}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showSetResultModal}
        onHide={closeSetResultModal}
        centered
        size="sm"
      >
        <Modal.Header>Attention</Modal.Header>
        <Modal.Body>
          Do you want to set the application of{' '}
          <b>{`${application.programId.school}-${application.programId.degree}-${application.programId.program_name}`}</b>{' '}
          as <b>{resultState === 'O' ? t('Admitted') : t('Rejected')}</b>?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={resultState === 'O' ? 'primary' : 'danger'}
            disabled={isLoading}
            size="sm"
            onClick={(e) => handleUpdateResult(e, resultState)}
          >
            {isLoading ? (
              <div style={spinner_style2}>
                <Spinner animation="border" size="sm" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            ) : resultState === 'O' ? (
              t('Admitted')
            ) : (
              t('Rejected')
            )}
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            title="Undo"
            onClick={closeSetResultModal}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

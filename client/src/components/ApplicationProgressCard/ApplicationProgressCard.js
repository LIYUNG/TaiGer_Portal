import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Collapse, ProgressBar, Button, Modal } from 'react-bootstrap';
import {
  application_deadline_calculator,
  progressBarCounter
} from '../../Demo/Utils/checking-functions';
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiOutlineFieldTime,
  AiOutlineUndo
} from 'react-icons/ai';
import ApplicationProgressCardBody from './ApplicationProgressCardBody';
import { FiExternalLink } from 'react-icons/fi';
import { updateStudentApplicationResult } from '../../api';

export default function ApplicationProgressCard(props) {
  const [isCollapse, setIsCollapse] = useState(false);
  const [application, setApplication] = useState(props.application);
  const [resultState, setResultState] = useState('-');
  const [showUndoModal, setShowUndoModal] = useState(false);
  const [showSetResultModal, setShowSetResultModal] = useState(false);

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
        } else {
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
                    <AiFillCheckCircle color="limegreen" size={16} /> Submitted
                  </>
                )}
                {application.admission === 'O' && (
                  <>
                    <AiFillCheckCircle color="lightblue" size={16} /> Admitted
                  </>
                )}
                {application.admission === 'X' && (
                  <>
                    <AiFillCloseCircle color="red" size={16} /> Rejected
                  </>
                )}
              </>
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
              to={`/programs/${application?.programId?._id?.toString()}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink />
            </Link>
          </p>
          <p>
            {application_deadline_calculator(props.student, application) ===
            'CLOSE' ? (
              <>
                Tell me about your result?{' '}
                {application.admission === '-' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => openSetResultModal(e, 'O')}
                    >
                      Admitted
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => openSetResultModal(e, 'X')}
                    >
                      Rejected
                    </Button>
                  </>
                )}
                {application.admission === 'O' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled
                      onClick={(e) => e.stopPropagation()}
                    >
                      Admitted
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      title="Undo"
                      onClick={(e) => openUndoModal(e)}
                    >
                      <AiOutlineUndo size={16} />
                    </Button>
                  </>
                )}
                {application.admission === 'X' && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled
                      onClick={(e) => stopPropagation()}
                    >
                      Rejected
                    </Button>
                    <Button
                      variant="outline-secondary"
                      title="Undo"
                      size="sm"
                      onClick={(e) => openUndoModal(e)}
                    >
                      <AiOutlineUndo size={16} />
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
            size="sm"
            title="Undo"
            onClick={(e) => handleUpdateResult(e, '-')}
          >
            Confirm
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            title="Undo"
            onClick={closeUndoModal}
          >
            Cancel
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
          as <b>{resultState === 'O' ? 'Admitted' : 'Rejected'}</b>?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={resultState === 'O' ? 'primary' : 'danger'}
            size="sm"
            onClick={(e) => handleUpdateResult(e, resultState)}
          >
            {resultState === 'O' ? 'Admitted' : 'Rejected'}
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

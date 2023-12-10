import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Collapse, ProgressBar, Button } from 'react-bootstrap';
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

export default function ApplicationProgressCard(props) {
  const [isCollapse, setIsCollapse] = useState(false);

  const handleToggle = () => {
    setIsCollapse(!isCollapse);
  };
  return (
    <Card className="my-0 mx-0">
      <Card.Header onClick={handleToggle} style={{ cursor: 'pointer' }}>
        <Card.Title>
          <p>
            {application_deadline_calculator(
              props.student,
              props.application
            ) === 'CLOSE' ? (
              <>
                {props.application.admission === '-' && (
                  <>
                    <AiFillCheckCircle color="limegreen" size={16} /> Submitted
                  </>
                )}
                {props.application.admission === 'O' && (
                  <>
                    <AiFillCheckCircle color="lightblue" size={16} /> Admitted
                  </>
                )}
                {props.application.admission === 'X' && (
                  <>
                    <AiFillCloseCircle color="red" size={16} /> Rejected
                  </>
                )}
              </>
            ) : (
              <span title="Deadline">
                <AiOutlineFieldTime size={16} />{' '}
                {application_deadline_calculator(
                  props.student,
                  props.application
                )}
              </span>
            )}
          </p>
          <p className="mb-0">
            <img
              src={`/assets/logo/country_logo/svg/${props.application?.programId.country}.svg`}
              alt="Logo"
              style={{ maxWidth: '20px', maxHeight: '20px' }}
            />{' '}
            <b>{props.application?.programId?.school}</b>
          </p>
          <p>
            {props.application?.programId?.degree}{' '}
            {props.application?.programId?.program_name}{' '}
            {props.application?.programId?.semester}{' '}
            <Link
              to={`/programs/${props.application?.programId?._id?.toString()}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink />
            </Link>
          </p>
          <p>
            {application_deadline_calculator(
              props.student,
              props.application
            ) === 'CLOSE' ? (
              <>
                Tell me about your result?{' '}
                {props.application.admission === '-' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Admitted
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Rejected
                    </Button>
                  </>
                )}
                {props.application.admission === 'O' && (
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AiOutlineUndo size={16} />
                    </Button>
                  </>
                )}
                {props.application.admission === 'X' && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled
                      onClick={(e) => e.stopPropagation()}
                    >
                      Rejected
                    </Button>
                    <Button
                      variant="outline-secondary"
                      title="Undo"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
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
                application_deadline_calculator(
                  props.student,
                  props.application
                ) === 'CLOSE'
                  ? 100
                  : progressBarCounter(props.student, props.application)
              }
              style={{ flex: 1, marginRight: '10px' }}
              className="custom-progress-bar-container" // Apply your specific class here
            />
            <span>
              {`${
                application_deadline_calculator(
                  props.student,
                  props.application
                ) === 'CLOSE'
                  ? 100
                  : progressBarCounter(props.student, props.application)
              }%`}
            </span>
          </p>
        </Card.Title>
      </Card.Header>
      <Collapse in={isCollapse}>
        <Card.Body>
          <ApplicationProgressCardBody
            student={props.student}
            application={props.application}
          />
        </Card.Body>
      </Collapse>
    </Card>
  );
}

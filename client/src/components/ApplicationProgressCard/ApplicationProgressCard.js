import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Card, Collapse, ProgressBar, Button } from 'react-bootstrap';
import {
  application_deadline_calculator,
  progressBarCounter
} from '../../Demo/Utils/checking-functions';
import { AiFillCheckCircle, AiOutlineFieldTime } from 'react-icons/ai';
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
                <AiFillCheckCircle color="limegreen" size={16} /> Submitted
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
          {/* {application_deadline_calculator(props.student, props.application) ===
            'CLOSE' && (
            <p>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={(e) => e.stopPropagation()}
              >
                Offer
              </Button>
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={(e) => e.stopPropagation()}
              >
                Reject
              </Button>
            </p>
          )} */}
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

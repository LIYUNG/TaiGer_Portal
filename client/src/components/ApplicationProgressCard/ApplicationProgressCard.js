import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Collapse,
  ProgressBar,
  ListGroup
} from 'react-bootstrap';
import { application_deadline_calculator } from '../../Demo/Utils/checking-functions';
import {
  AiFillCheckCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime
} from 'react-icons/ai';
import DEMO from '../../store/constant';

export default function ApplicationProgressCard(props) {
  const [isCollapse, setIsCollapse] = useState(true);

  const handleToggle = () => {
    setIsCollapse(!isCollapse);
  };
  return (
    <Card className="my-1 mx-0">
      <Card.Header onClick={handleToggle} style={{ cursor: 'pointer' }}>
        <Card.Title as="h5">
          <p>
            {application_deadline_calculator(
              props.student,
              props.application
            ) === 'CLOSE' ? (
              <>
                <AiFillCheckCircle color="limegreen" size={16} /> Close
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
            {props.application?.programId?.program_name}{' '}
            {props.application?.programId?.semester}
          </p>
          <p>
            <ProgressBar now={60} label={`${60}%`} />
          </p>{' '}
        </Card.Title>
      </Card.Header>
      <Collapse in={isCollapse}>
        <Card.Body>
          <ListGroup variant="flush">
            {props.student?.generaldocs_threads?.map((thread, idx) => (
              <ListGroup.Item>
                <Link
                  to={`/document-modification/${thread.doc_thread_id._id.toString()}`}
                >
                  {thread.isFinalVersion ? (
                    <AiFillCheckCircle color="limegreen" size={16} />
                  ) : (
                    <AiFillQuestionCircle color="grey" size={16} />
                  )}{' '}
                  {thread.doc_thread_id?.file_type}
                </Link>
              </ListGroup.Item>
            ))}
            {props.application?.doc_modification_thread?.map((thread, idx) => (
              <ListGroup.Item>
                <Link
                  to={`/document-modification/${thread.doc_thread_id._id.toString()}`}
                >
                  {' '}
                  {thread.isFinalVersion ? (
                    <AiFillCheckCircle color="limegreen" size={16} />
                  ) : (
                    <AiFillQuestionCircle color="grey" size={16} />
                  )}{' '}
                  {thread.doc_thread_id?.file_type}
                </Link>
              </ListGroup.Item>
            ))}

            {props.application?.programId?.uni_assist?.includes('VPD') ? (
              <ListGroup.Item>
                <Link to={`${DEMO.UNI_ASSIST_LINK}`}>
                  <AiFillQuestionCircle color="grey" size={16} />
                  Uni-Assist VPD
                </Link>
              </ListGroup.Item>
            ) : (
              <></>
            )}

            <ListGroup.Item>
              <AiFillQuestionCircle color="grey" size={16} /> Submit
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Collapse>
    </Card>
  );
}

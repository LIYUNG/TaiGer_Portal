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
import { BsExclamationTriangle, BsX } from 'react-icons/bs';
import { application_deadline_calculator } from '../../Demo/Utils/checking-functions';
import { AiFillCheckCircle, AiFillQuestionCircle } from 'react-icons/ai';

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
            {application_deadline_calculator(props.student, props.application)}
          </p>
          <p>
            {props.application?.programId?.school}
            {' - '}
            {props.application?.programId?.program_name}{' '}
            {props.application?.programId?.semester}
          </p>
          <p>
            <ProgressBar now={100} label={`${60}%`} />
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
                <AiFillQuestionCircle color="grey" size={16} />
                Uni-Assist VPD
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

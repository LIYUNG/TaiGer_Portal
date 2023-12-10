import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';

import { AiFillCheckCircle, AiFillQuestionCircle } from 'react-icons/ai';
import DEMO from '../../store/constant';

export default function ApplicationProgressCardBody(props) {
  return (
    <>
      <ListGroup variant="flush">
        {props.student?.generaldocs_threads?.map((thread, idx) => (
          <ListGroup.Item key={idx}>
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
        {/* TODO: debug: checking english score with certificate */}
        {props.application?.programId?.ielts ||
        props.application?.programId?.toefl ? (
          props.student?.academic_background?.language?.english_isPassed ===
          'O' ? (
            <ListGroup.Item>
              <Link to={`/survey`}>
                <AiFillCheckCircle color="limegreen" size={16} /> English
              </Link>
            </ListGroup.Item>
          ) : (
            <ListGroup.Item>
              <Link to={`/survey`}>
                <AiFillQuestionCircle color="grey" size={16} /> English
              </Link>
            </ListGroup.Item>
          )
        ) : (
          <></>
        )}
        {props.application?.programId?.testdaf &&
          (props.application?.programId?.testdaf === '-' ? (
            <></>
          ) : props.student?.academic_background?.language?.german_isPassed ===
            'O' ? (
            <ListGroup.Item>
              <Link to={`/survey`}>
                <AiFillCheckCircle color="limegreen" size={16} /> German
              </Link>
            </ListGroup.Item>
          ) : (
            <ListGroup.Item>
              <Link to={`/survey`}>
                <AiFillQuestionCircle color="grey" size={16} /> German
              </Link>
            </ListGroup.Item>
          ))}
        {props.application?.programId?.gre &&
          (props.application?.programId?.gre === '-' ? (
            <></>
          ) : props.student?.academic_background?.language?.gre_isPassed ===
            'O' ? (
            <ListGroup.Item>
              <Link to={`/survey`}>
                <AiFillCheckCircle color="limegreen" size={16} /> GRE
              </Link>
            </ListGroup.Item>
          ) : (
            <ListGroup.Item>
              <Link to={`/survey`}>
                <AiFillQuestionCircle color="grey" size={16} /> GRE
              </Link>
            </ListGroup.Item>
          ))}
        {props.application?.programId?.gmat &&
          (props.application?.programId?.gmat === '-' ? (
            <></>
          ) : props.student?.academic_background?.language?.gmat_isPassed ===
            'O' ? (
            <ListGroup.Item>
              <Link to={`/survey`}>
                <AiFillCheckCircle color="limegreen" size={16} /> GMAT
              </Link>
            </ListGroup.Item>
          ) : (
            <ListGroup.Item>
              <Link to={`/survey`}>
                <AiFillQuestionCircle color="grey" size={16} /> GMAT
              </Link>
            </ListGroup.Item>
          ))}
        {(props.application?.programId?.application_portal_a ||
          props.application?.programId?.application_portal_b) && (
          <ListGroup.Item>
            <Link to={`/portal-informations/${props.student._id.toString()}`}>
              {(props.application?.programId?.application_portal_a &&
                !props.application.credential_a_filled) ||
              (props.application?.programId?.application_portal_b &&
                !props.application.credential_b_filled) ? (
                <AiFillQuestionCircle color="grey" size={16} />
              ) : (
                <AiFillCheckCircle color="limegreen" size={16} />
              )}{' '}
              Register University Portal
            </Link>
          </ListGroup.Item>
        )}
        {props.application?.doc_modification_thread?.map((thread, idx) => (
          <ListGroup.Item key={idx}>
            <Link
              to={`/document-modification/${thread.doc_thread_id._id.toString()}`}
            >
              {' '}
              {thread.isFinalVersion ? (
                <AiFillCheckCircle color="limegreen" size={16} />
              ) : (
                <AiFillQuestionCircle color="grey" size={16} />
              )}{' '}
              {thread.doc_thread_id?.file_type.replace(/_/g, ' ')}
            </Link>
          </ListGroup.Item>
        ))}

        {props.application?.programId?.uni_assist?.includes('VPD') && (
          <ListGroup.Item>
            <Link to={`${DEMO.UNI_ASSIST_LINK}`}>
              {props.application?.uni_assist?.status === 'notstarted' ? (
                <AiFillQuestionCircle color="grey" size={16} />
              ) : (
                <AiFillCheckCircle color="limegreen" size={16} />
              )}{' '}
              Uni-Assist VPD
            </Link>
          </ListGroup.Item>
        )}

        <ListGroup.Item>
          <Link to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(props.student._id.toString())}`}>
            {props.application?.closed === 'O' ? (
              <AiFillCheckCircle color="limegreen" size={16} />
            ) : (
              <AiFillQuestionCircle color="grey" size={16} />
            )}
            Submit
          </Link>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}

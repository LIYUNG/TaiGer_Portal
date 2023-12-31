import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';

import {
  AiFillCheckCircle,
  AiFillQuestionCircle,
  AiFillWarning
} from 'react-icons/ai';
import DEMO from '../../store/constant';
import { isEnglishOK } from '../../Demo/Utils/checking-functions';

const DocumentOkIcon = () => {
  return <AiFillCheckCircle color="limegreen" size={16} />;
};
const DocumentMissingIcon = () => {
  return <AiFillQuestionCircle color="grey" size={16} />;
};

export default function ApplicationProgressCardBody(props) {
  return (
    <>
      <ListGroup variant="flush">
        {props.student?.generaldocs_threads?.map((thread, idx) => (
          <ListGroup.Item key={idx}>
            <Link
              to={DEMO.DOCUMENT_MODIFICATION_LINK(
                thread.doc_thread_id._id.toString()
              )}
            >
              {thread.isFinalVersion ? (
                <DocumentOkIcon />
              ) : (
                <DocumentMissingIcon />
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
            isEnglishOK(props.application?.programId, props.student) ? (
              <ListGroup.Item>
                <Link to={`${DEMO.SURVEY_LINK}`}>
                  <DocumentOkIcon /> English
                </Link>
              </ListGroup.Item>
            ) : (
              <ListGroup.Item title="English Requirements not met with your input in My Survey">
                <Link to={`${DEMO.SURVEY_LINK}`}>
                  <AiFillWarning color="red" size={16} /> English
                </Link>
              </ListGroup.Item>
            )
          ) : (
            <ListGroup.Item>
              <Link to={`${DEMO.SURVEY_LINK}`}>
                <DocumentMissingIcon /> English
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
              <Link to={`${DEMO.SURVEY_LINK}`}>
                <DocumentOkIcon /> German
              </Link>
            </ListGroup.Item>
          ) : (
            <ListGroup.Item>
              <Link to={`${DEMO.SURVEY_LINK}`}>
                <DocumentMissingIcon /> German
              </Link>
            </ListGroup.Item>
          ))}
        {props.application?.programId?.gre &&
          (props.application?.programId?.gre === '-' ? (
            <></>
          ) : props.student?.academic_background?.language?.gre_isPassed ===
            'O' ? (
            <ListGroup.Item>
              <Link to={`${DEMO.SURVEY_LINK}`}>
                <DocumentOkIcon /> GRE
              </Link>
            </ListGroup.Item>
          ) : (
            <ListGroup.Item>
              <Link to={`${DEMO.SURVEY_LINK}`}>
                <DocumentMissingIcon /> GRE
              </Link>
            </ListGroup.Item>
          ))}
        {props.application?.programId?.gmat &&
          (props.application?.programId?.gmat === '-' ? (
            <></>
          ) : props.student?.academic_background?.language?.gmat_isPassed ===
            'O' ? (
            <ListGroup.Item>
              <Link to={`${DEMO.SURVEY_LINK}`}>
                <DocumentOkIcon /> GMAT
              </Link>
            </ListGroup.Item>
          ) : (
            <ListGroup.Item>
              <Link to={`${DEMO.SURVEY_LINK}`}>
                <DocumentMissingIcon /> GMAT
              </Link>
            </ListGroup.Item>
          ))}
        {(props.application?.programId?.application_portal_a ||
          props.application?.programId?.application_portal_b) && (
          <ListGroup.Item>
            <Link
              to={`${DEMO.PORTALS_MANAGEMENT_STUDENTID_LINK(
                props.student._id.toString()
              )}`}
            >
              {(props.application?.programId?.application_portal_a &&
                !props.application.credential_a_filled) ||
              (props.application?.programId?.application_portal_b &&
                !props.application.credential_b_filled) ? (
                <DocumentMissingIcon />
              ) : (
                <DocumentOkIcon />
              )}{' '}
              Register University Portal
            </Link>
          </ListGroup.Item>
        )}
        {props.application?.doc_modification_thread?.map((thread, idx) => (
          <ListGroup.Item key={idx}>
            <Link
              to={DEMO.DOCUMENT_MODIFICATION_LINK(
                thread.doc_thread_id._id.toString()
              )}
            >
              {' '}
              {thread.isFinalVersion ? (
                <DocumentOkIcon />
              ) : (
                <DocumentMissingIcon />
              )}{' '}
              {thread.doc_thread_id?.file_type.replace(/_/g, ' ')}
            </Link>
          </ListGroup.Item>
        ))}

        {props.application?.programId?.uni_assist?.includes('VPD') && (
          <ListGroup.Item>
            <Link to={`${DEMO.UNI_ASSIST_LINK}`}>
              {props.application?.uni_assist?.status === 'notstarted' ? (
                <DocumentMissingIcon />
              ) : (
                <DocumentOkIcon />
              )}{' '}
              Uni-Assist VPD
            </Link>
          </ListGroup.Item>
        )}

        <ListGroup.Item>
          <Link
            to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(
              props.student._id.toString()
            )}`}
          >
            {props.application?.closed === 'O' ? (
              <DocumentOkIcon />
            ) : (
              <DocumentMissingIcon />
            )}
            Submit
          </Link>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}

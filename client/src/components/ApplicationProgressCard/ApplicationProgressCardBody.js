import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, List, ListItem } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

import DEMO from '../../store/constant';
import { isEnglishOK } from '../../Demo/Utils/checking-functions';
import { FILE_MISSING_SYMBOL, FILE_OK_SYMBOL } from '../../Demo/Utils/contants';
import { red } from '@mui/material/colors';

const DocumentOkIcon = () => {
  return FILE_OK_SYMBOL;
};
const DocumentMissingIcon = () => {
  return FILE_MISSING_SYMBOL;
};

export default function ApplicationProgressCardBody(props) {
  return (
    <>
      <List variant="flush">
        {props.student?.generaldocs_threads?.map((thread, idx) => (
          <ListItem key={idx}>
            <Link
              underline="hover"
              color="inherit"
              component={LinkDom}
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
          </ListItem>
        ))}
        {/* TODO: debug: checking english score with certificate */}
        {props.application?.programId?.ielts ||
        props.application?.programId?.toefl ? (
          props.student?.academic_background?.language?.english_isPassed ===
          'O' ? (
            isEnglishOK(props.application?.programId, props.student) ? (
              <ListItem>
                <Link
                  underline="hover"
                  color="inherit"
                  component={LinkDom}
                  to={`${DEMO.SURVEY_LINK}`}
                >
                  <DocumentOkIcon /> English
                </Link>
              </ListItem>
            ) : (
              <ListItem title="English Requirements not met with your input in Profile">
                <Link
                  underline="hover"
                  color="inherit"
                  component={LinkDom}
                  to={`${DEMO.SURVEY_LINK}`}
                >
                  <WarningIcon color={red[700]} fontSize="small" /> English
                </Link>
              </ListItem>
            )
          ) : (
            <ListItem>
              <Link
                underline="hover"
                color="inherit"
                component={LinkDom}
                to={`${DEMO.SURVEY_LINK}`}
              >
                <DocumentMissingIcon /> English
              </Link>
            </ListItem>
          )
        ) : (
          <></>
        )}
        {props.application?.programId?.testdaf &&
          (props.application?.programId?.testdaf === '-' ? (
            <></>
          ) : props.student?.academic_background?.language?.german_isPassed ===
            'O' ? (
            <ListItem>
              <Link
                underline="hover"
                color="inherit"
                component={LinkDom}
                to={`${DEMO.SURVEY_LINK}`}
              >
                <DocumentOkIcon /> German
              </Link>
            </ListItem>
          ) : (
            <ListItem>
              <Link
                underline="hover"
                color="inherit"
                component={LinkDom}
                to={`${DEMO.SURVEY_LINK}`}
              >
                <DocumentMissingIcon /> German
              </Link>
            </ListItem>
          ))}
        {props.application?.programId?.gre &&
          (props.application?.programId?.gre === '-' ? (
            <></>
          ) : props.student?.academic_background?.language?.gre_isPassed ===
            'O' ? (
            <ListItem>
              <Link
                underline="hover"
                color="inherit"
                component={LinkDom}
                to={`${DEMO.SURVEY_LINK}`}
              >
                <DocumentOkIcon /> GRE
              </Link>
            </ListItem>
          ) : (
            <ListItem>
              <Link
                underline="hover"
                color="inherit"
                component={LinkDom}
                to={`${DEMO.SURVEY_LINK}`}
              >
                <DocumentMissingIcon /> GRE
              </Link>
            </ListItem>
          ))}
        {props.application?.programId?.gmat &&
          (props.application?.programId?.gmat === '-' ? (
            <></>
          ) : props.student?.academic_background?.language?.gmat_isPassed ===
            'O' ? (
            <ListItem>
              <Link
                underline="hover"
                color="inherit"
                component={LinkDom}
                to={`${DEMO.SURVEY_LINK}`}
              >
                <DocumentOkIcon /> GMAT
              </Link>
            </ListItem>
          ) : (
            <ListItem>
              <Link
                underline="hover"
                color="inherit"
                component={LinkDom}
                to={`${DEMO.SURVEY_LINK}`}
              >
                <DocumentMissingIcon /> GMAT
              </Link>
            </ListItem>
          ))}
        {(props.application?.programId?.application_portal_a ||
          props.application?.programId?.application_portal_b) && (
          <ListItem>
            <Link
              underline="hover"
              color="inherit"
              component={LinkDom}
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
          </ListItem>
        )}
        {props.application?.doc_modification_thread?.map((thread, idx) => (
          <ListItem key={idx}>
            <Link
              underline="hover"
              color="inherit"
              component={LinkDom}
              to={DEMO.DOCUMENT_MODIFICATION_LINK(
                thread.doc_thread_id._id.toString()
              )}
            >
              {thread.isFinalVersion ? (
                <DocumentOkIcon />
              ) : (
                <DocumentMissingIcon />
              )}{' '}
              {thread.doc_thread_id?.file_type.replace(/_/g, ' ')}
            </Link>
          </ListItem>
        ))}

        {props.application?.programId?.uni_assist?.includes('VPD') && (
          <ListItem>
            <Link
              underline="hover"
              color="inherit"
              component={LinkDom}
              to={`${DEMO.UNI_ASSIST_LINK}`}
            >
              {props.application?.uni_assist?.status === 'notstarted' ? (
                <DocumentMissingIcon />
              ) : (
                <DocumentOkIcon />
              )}{' '}
              Uni-Assist VPD
            </Link>
          </ListItem>
        )}

        <ListItem>
          <Link
            underline="hover"
            color="inherit"
            component={LinkDom}
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
        </ListItem>
      </List>
    </>
  );
}

import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { IconButton, Link, List, ListItem, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

import DEMO from '../../store/constant';
import { isEnglishOK } from '../../Demo/Utils/checking-functions';
import {
  FILE_MISSING_SYMBOL,
  FILE_OK_SYMBOL,
  convertDate_ux_friendly
} from '../../Demo/Utils/contants';
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
            <Typography>
              <Link
                underline="hover"
                color="inherit"
                component={LinkDom}
                to={DEMO.DOCUMENT_MODIFICATION_LINK(
                  thread.doc_thread_id._id.toString()
                )}
              >
                {thread.isFinalVersion ? (
                  <IconButton>
                    <DocumentOkIcon />
                  </IconButton>
                ) : (
                  <IconButton>
                    <DocumentMissingIcon />
                  </IconButton>
                )}{' '}
                {thread.doc_thread_id?.file_type}
              </Link>
              {' - '} {convertDate_ux_friendly(thread.doc_thread_id?.updatedAt)}
            </Typography>
          </ListItem>
        ))}
        {/* TODO: debug: checking english score with certificate */}
        {props.application?.programId?.ielts ||
        props.application?.programId?.toefl ? (
          props.student?.academic_background?.language?.english_isPassed ===
          'O' ? (
            isEnglishOK(props.application?.programId, props.student) ? (
              <ListItem>
                <Typography>
                  <Link
                    underline="hover"
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.SURVEY_LINK}`}
                  >
                    <IconButton>
                      <DocumentOkIcon />
                    </IconButton>{' '}
                    English{' '}
                  </Link>
                  {' - '}
                  {
                    props.student.academic_background.language
                      .english_certificate
                  }
                  {' - '}
                  {props.student.academic_background?.language?.english_score}
                </Typography>
              </ListItem>
            ) : (
              <ListItem title="English Requirements not met with your input in Profile">
                <Typography>
                  <Link
                    underline="hover"
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.SURVEY_LINK}`}
                  >
                    <IconButton>
                      <WarningIcon color={red[700]} fontSize="small" />
                    </IconButton>{' '}
                    English
                  </Link>
                  {' - '}
                  {
                    props.student.academic_background.language
                      .english_certificate
                  }
                  {' - '}
                  {props.student.academic_background?.language?.english_score}
                </Typography>
              </ListItem>
            )
          ) : (
            <ListItem>
              <Typography>
                <Link
                  underline="hover"
                  color="inherit"
                  component={LinkDom}
                  to={`${DEMO.SURVEY_LINK}`}
                >
                  <IconButton>
                    <DocumentMissingIcon />
                  </IconButton>{' '}
                  English
                </Link>
                {' - '}{' '}
                {props.student.academic_background?.language?.english_test_date}
              </Typography>
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
              <Typography>
                <Link
                  underline="hover"
                  color="inherit"
                  component={LinkDom}
                  to={`${DEMO.SURVEY_LINK}`}
                >
                  <IconButton>
                    <DocumentOkIcon />
                  </IconButton>{' '}
                  German
                </Link>
              </Typography>
            </ListItem>
          ) : (
            <ListItem>
              <Typography>
                <Link
                  underline="hover"
                  color="inherit"
                  component={LinkDom}
                  to={`${DEMO.SURVEY_LINK}`}
                >
                  <IconButton>
                    <DocumentMissingIcon />
                  </IconButton>{' '}
                  German
                </Link>
              </Typography>
            </ListItem>
          ))}
        {props.application?.programId?.gre &&
          (props.application?.programId?.gre === '-' ? (
            <></>
          ) : props.student?.academic_background?.language?.gre_isPassed ===
            'O' ? (
            <ListItem>
              <Typography>
                <Link
                  underline="hover"
                  color="inherit"
                  component={LinkDom}
                  to={`${DEMO.SURVEY_LINK}`}
                >
                  <IconButton>
                    <DocumentOkIcon />
                  </IconButton>
                  GRE
                </Link>
              </Typography>
            </ListItem>
          ) : (
            <ListItem>
              <Typography>
                <Link
                  underline="hover"
                  color="inherit"
                  component={LinkDom}
                  to={`${DEMO.SURVEY_LINK}`}
                >
                  <IconButton>
                    <DocumentMissingIcon />
                  </IconButton>{' '}
                  GRE
                </Link>
              </Typography>
            </ListItem>
          ))}
        {props.application?.programId?.gmat &&
          (props.application?.programId?.gmat === '-' ? (
            <></>
          ) : props.student?.academic_background?.language?.gmat_isPassed ===
            'O' ? (
            <ListItem>
              <Typography>
                <Link
                  underline="hover"
                  color="inherit"
                  component={LinkDom}
                  to={`${DEMO.SURVEY_LINK}`}
                >
                  <IconButton>
                    <DocumentOkIcon />
                  </IconButton>{' '}
                  GMAT
                </Link>
              </Typography>
            </ListItem>
          ) : (
            <ListItem>
              <Typography>
                <Link
                  underline="hover"
                  color="inherit"
                  component={LinkDom}
                  to={`${DEMO.SURVEY_LINK}`}
                >
                  <IconButton>
                    <DocumentMissingIcon />
                  </IconButton>{' '}
                  GMAT
                </Link>
              </Typography>
            </ListItem>
          ))}
        {(props.application?.programId?.application_portal_a ||
          props.application?.programId?.application_portal_b) && (
          <ListItem>
            <Typography>
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
                  <IconButton>
                    <DocumentMissingIcon />
                  </IconButton>
                ) : (
                  <IconButton>
                    <DocumentOkIcon />
                  </IconButton>
                )}{' '}
                Register University Portal
              </Link>
            </Typography>
          </ListItem>
        )}
        {props.application?.doc_modification_thread?.map((thread, idx) => (
          <ListItem key={idx}>
            <Typography>
              <Link
                underline="hover"
                color="inherit"
                component={LinkDom}
                to={DEMO.DOCUMENT_MODIFICATION_LINK(
                  thread.doc_thread_id._id.toString()
                )}
              >
                {thread.isFinalVersion ? (
                  <IconButton>
                    <DocumentOkIcon />
                  </IconButton>
                ) : (
                  <IconButton>
                    <DocumentMissingIcon />
                  </IconButton>
                )}{' '}
                {thread.doc_thread_id?.file_type.replace(/_/g, ' ')}
              </Link>
              {' - '}
              {convertDate_ux_friendly(thread.doc_thread_id?.updatedAt)}
            </Typography>
          </ListItem>
        ))}

        {props.application?.programId?.uni_assist?.includes('VPD') && (
          <ListItem>
            <Typography>
              <Link
                underline="hover"
                color="inherit"
                component={LinkDom}
                to={`${DEMO.UNI_ASSIST_LINK}`}
              >
                {props.application?.uni_assist?.status === 'notstarted' ? (
                  <IconButton>
                    <DocumentMissingIcon />
                  </IconButton>
                ) : (
                  <IconButton>
                    <DocumentOkIcon />
                  </IconButton>
                )}{' '}
                Uni-Assist VPD
                {' - '}{' '}
                {convertDate_ux_friendly(
                  props.application?.uni_assist?.updatedAt
                )}
              </Link>
            </Typography>
          </ListItem>
        )}

        <ListItem>
          <Typography>
            <Link
              underline="hover"
              color="inherit"
              component={LinkDom}
              to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(
                props.student._id.toString()
              )}`}
            >
              {props.application?.closed === 'O' ? (
                <IconButton>
                  <DocumentOkIcon />
                </IconButton>
              ) : (
                <IconButton>
                  <DocumentMissingIcon />
                </IconButton>
              )}
              Submit
            </Link>
          </Typography>
        </ListItem>
      </List>
    </>
  );
}

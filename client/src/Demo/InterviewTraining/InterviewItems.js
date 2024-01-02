import React, { useState } from 'react';
import { Button, Card, Col, Collapse, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HiX } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

import { is_TaiGer_AdminAgent } from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import {
  AiFillCheckCircle,
  AiFillQuestionCircle,
  AiOutlineDelete
} from 'react-icons/ai';

function InterviewItems(props) {
  const { t, i18n } = useTranslation();
  const [isCollapse, setIsCollapse] = useState(false);

  const handleToggle = () => {
    setIsCollapse(!isCollapse);
  };
  return (
    <>
      <Card>
        <Card.Header onClick={handleToggle} style={{ cursor: 'pointer' }}>
          <Card.Title>
            <h5>
              {props.interview.status !== 'Unscheduled' ? (
                <AiFillCheckCircle
                  color="limegreen"
                  size={24}
                  title="Confirmed"
                />
              ) : (
                <AiFillQuestionCircle color="grey" size={24} />
              )}
              &nbsp;
              {props.interview.status}
              <Link
                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                  props.interview.student_id._id.toString(),
                  DEMO.PROFILE
                )}`}
              >
                <b>{` ${props.interview.student_id.firstname} - ${props.interview.student_id.lastname}`}</b>
              </Link>
            </h5>
            <span style={{ float: 'right', cursor: 'pointer' }}>
              {is_TaiGer_AdminAgent(props.user) && (
                <Button
                  variant="danger"
                  size="sm"
                  title="Delete"
                  onClick={() =>
                    props.openDeleteDocModalWindow(props.interview)
                  }
                >
                  <AiOutlineDelete size={16} />
                  &nbsp; Delete
                </Button>
              )}
            </span>
          </Card.Title>
        </Card.Header>
        <Collapse in={isCollapse}>
          <Card.Body>
            <Row>
              <Col>
                <h4>
                  <i className="feather icon-user-check me-1" />
                  {t('Student')} :
                  <Link
                    to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                      props.interview.student_id._id.toString(),
                      DEMO.PROFILE
                    )}`}
                  >
                    <b>{` ${props.interview.student_id.firstname} - ${props.interview.student_id.lastname}`}</b>
                  </Link>
                </h4>
                <p>{`Email: ${props.interview.student_id.email}`}</p>
              </Col>
              <Col>
                <h4>
                  <Link
                    to={`${DEMO.INTERVIEW_SINGLE_LINK(
                      props.interview._id.toString()
                    )}`}
                  >
                    <i className="feather icon-star me-1" />
                    {t('Interview Program')}:&nbsp;
                    {`${props.interview.program_id.school} - ${props.interview.program_id.program_name} ${props.interview.program_id.degree}`}
                    <br />
                  </Link>
                </h4>
                <h4>
                  <Link
                    to={`${DEMO.INTERVIEW_SINGLE_LINK(
                      props.interview._id.toString()
                    )}`}
                  >
                    <i className="feather icon-calendar me-1" />
                    {t('Interview Date')}:&nbsp;
                    {`${props.interview.interview_date} - ${props.interview.interview_time}`}
                  </Link>
                </h4>
                <h4>
                  <Link
                    to={`${DEMO.INTERVIEW_SINGLE_LINK(
                      props.interview._id.toString()
                    )}`}
                  >
                    <i className="feather icon-user me-1" />
                    {t('Interviewer')}:&nbsp;
                    {`${props.interview.interviewer}`}
                  </Link>
                </h4>
              </Col>
            </Row>
            <Row>
              <h4>
                <i className="feather icon-book me-1" />
                {t('Description')}
              </h4>{' '}
            </Row>
            <Row>{`${props.interview.interview_description}`}</Row>
            <Row>
              <h4>
                <i className="feather icon-headphones me-1" />
                {t('Trainer')}
              </h4>{' '}
            </Row>
            <Row>
              {props.interview.interview_trainer_id ? (
                <>
                  {`${props.interview.interview_trainer_id?.firstname}`}
                  <Button variant="secondary">{t('Change Trainer')}</Button>
                </>
              ) : (
                <>
                  <Button>{t('Assign Trainer')}</Button>
                </>
              )}
            </Row>
            <Row>
              <h4>
                <Link
                  to={`${DEMO.INTERVIEW_SINGLE_LINK(
                    props.interview._id.toString()
                  )}`}
                >
                  <i className="feather icon-calendar me-1" />
                  {t('Interview Training Time')}:&nbsp;
                </Link>
              </h4>
            </Row>
            <Row>
              <h4>
                {`${props.interview.interview_training_time}`}
                <Button>{t('Make Training Time Available')}</Button>
              </h4>
            </Row>
            <Row>
              <h4>
                <i className="feather icon-book me-1" />
                {t('Notes')}
              </h4>{' '}
            </Row>
            <Row>{`${props.interview.interview_notes}`}</Row>
          </Card.Body>
        </Collapse>
      </Card>
    </>
  );
}

export default InterviewItems;

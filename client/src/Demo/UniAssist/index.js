import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import UniAssistListCard from './UniAssistListCard';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getStudentUniAssist } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { FiExternalLink } from 'react-icons/fi';
import { check_uni_assist_needed } from '../Utils/checking-functions';

function UniAssistList(props) {
  const [uniAssistListState, setUniAssistListState] = useState({
    error: '',
    isLoaded: false,
    student: null,
    deleteVPDFileWarningModel: false,
    res_status: 0
  });
  const { t, i18n } = useTranslation();
  useEffect(() => {
    getStudentUniAssist(props.user._id.toString()).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setUniAssistListState({
            ...uniAssistListState,
            isLoaded: true,
            student: data,
            success: success,
            res_status: status
          });
        } else {
          setUniAssistListState({
            ...uniAssistListState,
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        setUniAssistListState({
          ...uniAssistListState,
          isLoaded: true,
          error,
          res_status: 500
        });
      }
    );
  }, []);

  if (props.user.role !== 'Student') {
    return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle('Uni-Assist & VPD');
  const { res_status, isLoaded } = uniAssistListState;

  if (!isLoaded && !uniAssistListState.student) {
    return (
      <div style={spinner_style}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      </div>
    );
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  return (
    <>
      <Row>
        <Col>
          <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
            <Card.Header>
              <Card.Title className="my-0 mx-0 text-light">
                Uni-Assist Tasks & VPD
              </Card.Title>
            </Card.Header>
          </Card>
        </Col>
      </Row>

      {check_uni_assist_needed(uniAssistListState.student) ? (
        <Fragment>
          <Row>
            <Col>
              <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
                <Card.Body className="my-0 mx-0 text-light">
                  {t('Instructions: Follow the documentations in')}:{` `}
                  <Link
                    to={`${DEMO.UNI_ASSIST_DOCS_LINK}`}
                    className="text-info"
                  >
                    Uni-Assist{' '}
                    <FiExternalLink
                      className="mx-1 mb-1"
                      style={{ cursor: 'pointer' }}
                    />
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <UniAssistListCard
            student={uniAssistListState.student}
            role={props.user.role}
            user={props.user}
          />
        </Fragment>
      ) : (
        <Card>
          <Card.Body>
            {t('Based on the applications, Uni-Assist is NOT needed')}
          </Card.Body>
        </Card>
      )}
    </>
  );
}
export default UniAssistList;

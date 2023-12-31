import React from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  is_TaiGer_AdminAgent,
  is_TaiGer_role,
  LinkableNewlineText
} from '../Utils/checking-functions';
import {
  convertDate,
  COUNTRIES_MAPPING,
  program_fields
} from '../Utils/contants';
import Banner from '../../components/Banner/Banner';
import DEMO from '../../store/constant';
import ProgramReport from './ProgramReport';
import { appConfig } from '../../config';

function SingleProgramView(props) {
  const { t, i18n } = useTranslation();
  const lng = navigator.language;
  return (
    <>
      <h1>{t('Welcome to React')}</h1>
      <h2>{lng}</h2>
      <Row>
        <Col>
          <Banner
            ReadOnlyMode={true}
            bg={'primary'}
            to={`${DEMO.BASE_DOCUMENTS_LINK}`}
            title={'Info:'}
            text={`${appConfig.companyName} Portal 網站上的學程資訊主要為管理申請進度為主，學校學程詳細資訊仍以學校網站為主。`}
            link_name={''}
            removeBanner={() => {}}
            notification_key={''}
          />
        </Col>
      </Row>
      <Row>
        <Col md={is_TaiGer_role(props.user) ? 8 : 12}>
          <Card>
            <Card.Body>
              {program_fields.map((program_field, i) =>
                program_field.prop.includes('ielts') ||
                program_field.prop.includes('toefl') ? (
                  <Row>
                    <Col md={4}>
                      <p className="my-0">
                        <b>{program_field.name}</b>
                      </p>
                    </Col>
                    <Col md={2}>
                      <b>{props.program[program_field.prop]}</b>
                    </Col>
                    <Col md={6}>
                      {props.program[`${program_field.prop}_reading`] && (
                        <b>
                          R: {props.program[`${program_field.prop}_reading`]}
                        </b>
                      )}{' '}
                      {props.program[`${program_field.prop}_listening`] && (
                        <b>
                          L: {props.program[`${program_field.prop}_listening`]}
                        </b>
                      )}{' '}
                      {props.program[`${program_field.prop}_speaking`] && (
                        <b>
                          S: {props.program[`${program_field.prop}_speaking`]}
                        </b>
                      )}{' '}
                      {props.program[`${program_field.prop}_writing`] && (
                        <b>
                          W: {props.program[`${program_field.prop}_writing`]}
                        </b>
                      )}
                    </Col>
                  </Row>
                ) : program_field.prop.includes('uni_assist') ? (
                  appConfig.vpdEnable && (
                    <Row>
                      <Col md={4}>
                        <p className="my-0">
                          <b>{program_field.name}</b>
                        </p>
                      </Col>
                      <Col md={8}>
                        <LinkableNewlineText
                          text={props.program[program_field.prop]}
                        />
                      </Col>
                    </Row>
                  )
                ) : program_field.prop.includes('country') ? (
                  <Row>
                    <Col md={4}>
                      <p className="my-0">
                        <b>{program_field.name}</b>
                      </p>
                    </Col>
                    <Col md={8}>
                      <span>
                        <img
                          src={`/assets/logo/country_logo/svg/${
                            props.program[program_field.prop]
                          }.svg`}
                          alt="Logo"
                          style={{ maxWidth: '20px', maxHeight: '20px' }}
                          title={
                            COUNTRIES_MAPPING[props.program[program_field.prop]]
                          }
                        />
                      </span>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col md={4}>
                      <p className="my-0">
                        <b>{program_field.name}</b>
                      </p>
                    </Col>
                    <Col md={8}>
                      <LinkableNewlineText
                        text={props.program[program_field.prop]}
                      />
                    </Col>
                  </Row>
                )
              )}
              {props.program.application_portal_a && (
                <>
                  <Row>
                    <Col md={4}>
                      <p className="my-0">
                        <b>Portal Link 1</b>
                      </p>
                    </Col>
                    <Col md={8}>
                      <a
                        className="my-0"
                        href={props.program.application_portal_a}
                        target="_blank"
                      >
                        Portal Link 1
                      </a>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <p className="my-0">
                        <b>Portal Instructions 1</b>
                      </p>
                    </Col>
                    <Col md={8}>
                      <a
                        className="my-0"
                        href={props.program.application_portal_a_instructions}
                        target="_blank"
                      >
                        Portal Instructions 1
                      </a>
                    </Col>
                  </Row>
                </>
              )}
              {props.program.application_portal_b && (
                <>
                  <Row>
                    <Col md={4}>
                      <p className="my-0">
                        <b>Portal Link 2</b>
                      </p>
                    </Col>
                    <Col md={8}>
                      <a
                        className="my-0"
                        href={props.program.application_portal_b}
                        target="_blank"
                      >
                        Portal Link 2
                      </a>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <p className="my-0">
                        <b>Portal Instructions 2</b>
                      </p>
                    </Col>
                    <Col md={8}>
                      <a
                        className="my-0"
                        href={props.program.application_portal_b_instructions}
                        target="_blank"
                      >
                        Portal Instructions 2
                      </a>
                    </Col>
                  </Row>
                </>
              )}
              <Row>
                <Col md={4}>
                  <p className="my-0">
                    <b>Website</b>
                  </p>
                </Col>
                <Col md={8}>
                  <p className="my-0"></p>
                  <a
                    className="my-0"
                    href={props.program.website}
                    target="_blank"
                  >
                    website
                  </a>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <p className="my-0">
                    <b>Last Update</b>
                  </p>
                </Col>
                <Col md={4}>
                  <p className="my-0">
                    <b>{convertDate(props.program.updatedAt)}</b>
                  </p>
                </Col>
              </Row>
              {is_TaiGer_AdminAgent(props.user) && (
                <>
                  <Row>
                    <Col md={4}>
                      <p className="my-0">Updated by</p>
                    </Col>
                    <Col md={6}>
                      <p className="my-0">{props.program.whoupdated}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <p className="my-0">Group</p>
                    </Col>
                    <Col md={6}>
                      <p className="my-0">{props.program.study_group_flag}</p>
                    </Col>
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        {is_TaiGer_role(props.user) && (
          <Col md={4}>
            <Card className="mx-0 card-with-scroll">
              <Card.Header>
                <Card.Title>Who has applied this?</Card.Title>
              </Card.Header>
              <Card.Body className="card-scrollable-body">
                <Table className="px-0 my-0 mx-0" size="sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Year</th>
                      <th>Admission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.students.map((student, i) => (
                      <tr key={i}>
                        <td>
                          <Link
                            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                              student._id.toString(),
                              DEMO.PROFILE
                            )}`}
                          >
                            {student.firstname} {student.lastname}
                          </Link>
                        </td>
                        <td>
                          {student.application_preference
                            ? student.application_preference
                                .expected_application_date
                            : '-'}
                        </td>
                        <td>
                          {student.applications.find(
                            (application) =>
                              application.programId.toString() ===
                              props.programId
                          )
                            ? student.applications.find(
                                (application) =>
                                  application.programId.toString() ===
                                  props.programId
                              ).admission
                            : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <br></br>
                O: admitted, X: rejected, -: not confirmed
              </Card.Body>
            </Card>
            <Card className="card-with-scroll">
              <Card.Body className="card-scrollable-body">
                <ProgramReport
                  uni_name={props.program.school}
                  program_name={props.program.program_name}
                  program_id={props.program._id.toString()}
                />
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>
                  {appConfig.companyName} Program Assistant
                </Card.Title>
                <Card.Body>
                  <Button onClick={props.programListAssistant}>Fetch</Button>
                </Card.Body>
              </Card.Header>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
}
export default SingleProgramView;

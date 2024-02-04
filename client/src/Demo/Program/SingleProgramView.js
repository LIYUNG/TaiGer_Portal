import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

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
import { useAuth } from '../../components/AuthProvider';

function SingleProgramView(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  return (
    <>
      <Box>
        <Banner
          ReadOnlyMode={true}
          bg={'primary'}
          to={`${DEMO.BASE_DOCUMENTS_LINK}`}
          title={'info'}
          text={`${appConfig.companyName} Portal 網站上的學程資訊主要為管理申請進度為主，學校學程詳細資訊仍以學校網站為主。`}
          link_name={''}
          removeBanner={() => {}}
          notification_key={undefined}
        />
      </Box>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={is_TaiGer_role(user) ? 8 : 12}>
            <Card sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {program_fields.map((program_field, i) =>
                  program_field.prop.includes('ielts') ||
                  program_field.prop.includes('toefl') ? (
                    <Fragment key={i}>
                      <Grid item xs={12} md={4}>
                        <Typography fontWeight="bold">
                          {t(`${program_field.name}`)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography fontWeight="bold">
                          {props.program[program_field.prop]}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {props.program[`${program_field.prop}_reading`] && (
                          <Typography fontWeight="bold">
                            R: {props.program[`${program_field.prop}_reading`]}
                          </Typography>
                        )}{' '}
                        {props.program[`${program_field.prop}_listening`] && (
                          <Typography fontWeight="bold">
                            L:{' '}
                            {props.program[`${program_field.prop}_listening`]}
                          </Typography>
                        )}{' '}
                        {props.program[`${program_field.prop}_speaking`] && (
                          <Typography fontWeight="bold">
                            S: {props.program[`${program_field.prop}_speaking`]}
                          </Typography>
                        )}{' '}
                        {props.program[`${program_field.prop}_writing`] && (
                          <Typography fontWeight="bold">
                            W: {props.program[`${program_field.prop}_writing`]}
                          </Typography>
                        )}
                      </Grid>
                    </Fragment>
                  ) : program_field.prop.includes('uni_assist') ? (
                    appConfig.vpdEnable && (
                      <Fragment key={i}>
                        <Grid item xs={12} md={4}>
                          <Typography fontWeight="bold">
                            {t(`${program_field.name}`)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <LinkableNewlineText
                            text={props.program[program_field.prop]}
                          />
                        </Grid>
                      </Fragment>
                    )
                  ) : program_field.prop.includes('country') ? (
                    <Fragment key={i}>
                      <Grid item xs={12} md={4}>
                        <Typography fontWeight="bold">
                          {t(`${program_field.name}`)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <span>
                          <img
                            src={`/assets/logo/country_logo/svg/${
                              props.program[program_field.prop]
                            }.svg`}
                            alt="Logo"
                            style={{ maxWidth: '20px', maxHeight: '20px' }}
                            title={
                              COUNTRIES_MAPPING[
                                props.program[program_field.prop]
                              ]
                            }
                          />
                        </span>
                      </Grid>
                    </Fragment>
                  ) : (
                    <Fragment key={i}>
                      <Grid item xs={12} md={4}>
                        <Typography fontWeight="bold">
                          {t(`${program_field.name}`)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <LinkableNewlineText
                          text={props.program[program_field.prop]}
                        />
                      </Grid>
                    </Fragment>
                  )
                )}
                {props.program.application_portal_a && (
                  <>
                    <Grid item xs={12} md={4}>
                      <Typography fontWeight="bold">Portal Link 1</Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <LinkableNewlineText
                        text={props.program.application_portal_a}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography fontWeight="bold">
                        Portal Instructions 1
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <LinkableNewlineText
                        text={props.program.application_portal_a_instructions}
                      />
                    </Grid>
                  </>
                )}
                {props.program.application_portal_b && (
                  <>
                    <Grid item xs={12} md={4}>
                      <Typography fontWeight="bold">Portal Link 2</Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <LinkableNewlineText
                        text={props.program.application_portal_b}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography fontWeight="bold">
                        Portal Instructions 2
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <LinkableNewlineText
                        text={props.program.application_portal_b_instructions}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} md={4}>
                  <Typography fontWeight="bold">{t('Website')}</Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <a href={props.program.website} target="_blank" rel="noreferrer">
                    <LinkableNewlineText text={props.program.website} />
                  </a>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography fontWeight="bold">{t('Last update')}</Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography fontWeight="bold">
                    {convertDate(props.program.updatedAt)}
                  </Typography>
                </Grid>
                {is_TaiGer_AdminAgent(user) && (
                  <>
                    <Grid item xs={12} md={4}>
                      <Typography>{t('Updated by')}</Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Typography>{props.program.whoupdated}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography>{t('Group')}</Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Typography>{props.program.study_group_flag}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            {is_TaiGer_role(user) && (
              <>
                <Card className="card-with-scroll" sx={{ p: 2 }}>
                  <Typography variant="string">
                    Who has applied this?
                  </Typography>
                  <div className="card-scrollable-body">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('Name')}</TableCell>
                          <TableCell>{t('Year')}</TableCell>
                          <TableCell>{t('Admission')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {props.students.map((student, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Link
                                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                  student._id.toString(),
                                  DEMO.PROFILE
                                )}`}
                              >
                                {student.firstname} {student.lastname}
                              </Link>
                            </TableCell>
                            <TableCell>
                              {student.application_preference
                                ? student.application_preference
                                    .expected_application_date
                                : '-'}
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Typography variant="string" sx={{ mt: 2 }}>
                      O: admitted, X: rejected, -: not confirmed{' '}
                    </Typography>
                  </div>
                </Card>
                <Card className="card-with-scroll">
                  <div className="card-scrollable-body">
                    <ProgramReport
                      uni_name={props.program.school}
                      program_name={props.program.program_name}
                      program_id={props.program._id.toString()}
                    />
                  </div>
                </Card>
                <Card>
                  <Typography>
                    {appConfig.companyName} {t('Program Assistant')}
                  </Typography>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={props.programListAssistant}
                  >
                    {t('Fetch')}
                  </Button>
                </Card>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
export default SingleProgramView;

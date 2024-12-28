import React, { Fragment, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Compare as CompareIcon,
  OpenInNew as OpenInNewIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
  Breadcrumbs
} from '@mui/material';
import {
  is_TaiGer_Admin,
  is_TaiGer_AdminAgent,
  is_TaiGer_role
} from '@taiger-common/core';
import { is_TaiGer_External } from '@taiger-common/core';

import {
  isProgramWithdraw,
  isApplicationOpen,
  LinkableNewlineText
} from '../Utils/checking-functions';
import {
  IS_DEV,
  convertDate,
  COUNTRIES_MAPPING,
  english_test_hand_after,
  german_test_hand_after,
  program_fields_application_dates,
  program_fields_english_languages_test,
  program_fields_other_test,
  program_fields_others,
  program_fields_overview,
  program_fields_special_documents,
  program_fields_special_notes,
  programField2Label
} from '../Utils/contants';
import { HighlightTextDiff } from '../Utils/diffChecker';
import Banner from '../../components/Banner/Banner';
import DEMO from '../../store/constant';
import ProgramReport from './ProgramReport';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import { a11yProps, CustomTabPanel } from '../../components/Tabs';

function SingleProgramView(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [studentsTabValue, setStudentsTabValue] = useState(0);
  const versions = props?.versions || {};

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleStudentsTabChange = (event, newValue) => {
    setStudentsTabValue(newValue);
  };

  const convertToText = (value) => {
    if (!value) return ''; // undefined or null
    if (typeof value === 'string') return value;
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ');
  };

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        {is_TaiGer_role(user) ? (
          <Link
            underline="hover"
            color="inherit"
            component={LinkDom}
            to={`${DEMO.PROGRAMS}`}
          >
            {t('Program List', { ns: 'common' })}
          </Link>
        ) : (
          <Link
            underline="hover"
            color="inherit"
            component={LinkDom}
            to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(user._id.toString())}`}
          >
            {t('Applications')}
          </Link>
        )}
        <Typography color="text.primary">
          {`${props.program.school}-${props.program.program_name}`}
        </Typography>
      </Breadcrumbs>
      <Box sx={{ my: 1 }}>
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

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="basic tabs example"
            >
              <Tab label={t('Overview')} {...a11yProps(0)} />
              <Tab
                label={t('Application Deadline', { ns: 'common' })}
                {...a11yProps(1)}
              />
              <Tab
                label={t('Specific Requirements', { ns: 'common' })}
                {...a11yProps(2)}
              />
              <Tab
                label={t('Special Documents', { ns: 'common' })}
                {...a11yProps(3)}
              />
              <Tab label={t('Others')} {...a11yProps(4)} />
              {versions?.changes?.length > 0 && (
                <Tab
                  label={t('Edit History', { ns: 'common' })}
                  {...a11yProps(5)}
                />
              )}
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Card>
              <Grid container spacing={2} sx={{ p: 2 }}>
                {program_fields_overview.map((program_field, i) => (
                  <Fragment key={i}>
                    <Grid item xs={12} md={4}>
                      <Typography fontWeight="bold">
                        {t(`${program_field.name}`, { ns: 'common' })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <LinkableNewlineText
                        text={props.program[program_field.prop]?.toString()}
                      />
                    </Grid>
                  </Fragment>
                ))}
              </Grid>
            </Card>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Card>
              <Grid container spacing={2} sx={{ p: 2 }}>
                {program_fields_application_dates.map((program_field, i) => (
                  <Fragment key={i}>
                    <Grid item xs={12} md={4}>
                      <Typography fontWeight="bold">
                        {t(`${program_field.name}`, { ns: 'common' })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <LinkableNewlineText
                        text={props.program[program_field.prop]}
                      />
                    </Grid>
                  </Fragment>
                ))}
              </Grid>
            </Card>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Card>
              <Grid container spacing={2} sx={{ p: 2 }}>
                {[...english_test_hand_after].map((program_field, i) => (
                  <Fragment key={i}>
                    <Grid item xs={6} md={4}>
                      <Typography fontWeight="bold">
                        {t(`${program_field.name}`, { ns: 'common' })}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={8}>
                      <LinkableNewlineText
                        text={props.program[program_field.prop]?.toString()}
                      />
                    </Grid>
                  </Fragment>
                ))}
                {program_fields_english_languages_test.map(
                  (program_field, i) => (
                    <Fragment key={i}>
                      <Grid item xs={6} md={2}>
                        <Typography fontWeight="bold">
                          {t(`${program_field.name}`, { ns: 'common' })}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <LinkableNewlineText
                          text={props.program[program_field.prop]}
                        />
                      </Grid>
                      <Grid item xs={3} md={2}>
                        {props.program[`${program_field.prop}_reading`] && (
                          <Typography fontWeight="bold">
                            {t('Reading', { ns: 'common' })}:{' '}
                            {props.program[`${program_field.prop}_reading`]}
                          </Typography>
                        )}{' '}
                      </Grid>
                      <Grid item xs={3} md={2}>
                        {props.program[`${program_field.prop}_listening`] && (
                          <Typography fontWeight="bold">
                            {t('Listening', { ns: 'common' })}:{' '}
                            {props.program[`${program_field.prop}_listening`]}
                          </Typography>
                        )}{' '}
                      </Grid>
                      <Grid item xs={3} md={2}>
                        {props.program[`${program_field.prop}_speaking`] && (
                          <Typography fontWeight="bold">
                            {t('Speaking', { ns: 'common' })}:{' '}
                            {props.program[`${program_field.prop}_speaking`]}
                          </Typography>
                        )}{' '}
                      </Grid>
                      <Grid item xs={3} md={2}>
                        {props.program[`${program_field.prop}_writing`] && (
                          <Typography fontWeight="bold">
                            {t('Writing', { ns: 'common' })}:{' '}
                            {props.program[`${program_field.prop}_writing`]}
                          </Typography>
                        )}
                      </Grid>
                    </Fragment>
                  )
                )}
                {[
                  ...german_test_hand_after,
                  ...program_fields_other_test,
                  ...program_fields_special_notes
                ].map((program_field, i) => (
                  <Fragment key={i}>
                    <Grid item xs={12} md={4}>
                      <Typography fontWeight="bold">
                        {t(`${program_field.name}`, { ns: 'common' })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <LinkableNewlineText
                        text={props.program[program_field.prop]?.toString()}
                      />
                    </Grid>
                  </Fragment>
                ))}
              </Grid>
            </Card>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <Card>
              <Grid container spacing={2} sx={{ p: 2 }}>
                {program_fields_special_documents.map((program_field, i) => (
                  <Fragment key={i}>
                    <Grid item xs={12} md={4}>
                      <Typography fontWeight="bold">
                        {t(`${program_field.name}`, { ns: 'common' })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <LinkableNewlineText
                        text={convertToText(props.program[program_field.prop])}
                      />
                    </Grid>
                  </Fragment>
                ))}
              </Grid>
            </Card>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <Card>
              <Grid container spacing={2} sx={{ p: 2 }}>
                {program_fields_others.map((program_field, i) => (
                  <Fragment key={i}>
                    <Grid item xs={12} md={4}>
                      <Typography fontWeight="bold">
                        {t(`${program_field.name}`, { ns: 'common' })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <LinkableNewlineText
                        text={props.program[program_field.prop]}
                      />
                    </Grid>
                  </Fragment>
                ))}
                <Grid item xs={12} md={4}>
                  <Typography fontWeight="bold">
                    {t(`Country`, { ns: 'common' })}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <span>
                    <img
                      src={`/assets/logo/country_logo/svg/${props.program.country}.svg`}
                      alt="Logo"
                      style={{ maxWidth: '32px', maxHeight: '32px' }}
                      title={COUNTRIES_MAPPING[props.program.country]}
                    />
                  </span>
                </Grid>
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
                  <Typography fontWeight="bold">
                    {t('Last update', { ns: 'common' })}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography fontWeight="bold">
                    {convertDate(props.program.updatedAt)}
                  </Typography>
                </Grid>
                {is_TaiGer_AdminAgent(user) && (
                  <>
                    <Grid item xs={12} md={4}>
                      <Typography>
                        {t('Updated by', { ns: 'common' })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Typography>{props.program.whoupdated}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography>{t('Group', { ns: 'common' })}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Card>
          </CustomTabPanel>
          {versions?.changes?.length > 0 && (
            <CustomTabPanel
              value={value}
              index={5}
              style={{ width: '100%', overflowY: 'auto' }}
            >
              {IS_DEV && (
                <Button onClick={() => props.setDiffModalShow()}>
                  <CompareIcon fontSize="small" /> Incoming changes - Compare
                </Button>
              )}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>{t('#', { ns: 'common' })}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{t('Changed By', { ns: 'common' })}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{t('Field', { ns: 'common' })}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{t('Content', { ns: 'common' })}</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {versions.changes
                    .slice()
                    .reverse()
                    .map((change, index) => {
                      const reverseIndex = versions.changes.length
                        ? versions.changes.length - index
                        : index;
                      const keys = Object.keys({
                        ...change.originalValues,
                        ...change.updatedValues
                      });
                      return (
                        <Fragment key={index}>
                          <TableRow></TableRow>
                          <TableRow>
                            <TableCell rowSpan={(keys?.length || 0) + 1}>
                              <Typography>
                                {reverseIndex}{' '}
                                {change?.changeRequest && (
                                  <div
                                    title={`from change request ${change?.changeRequest}`}
                                  >
                                    <InfoIcon fontSize="small" />
                                  </div>
                                )}
                              </Typography>
                            </TableCell>
                            <TableCell rowSpan={(keys?.length || 0) + 1}>
                              <div>{change.changedBy}</div>
                              <div>{convertDate(change.changedAt)}</div>
                            </TableCell>
                          </TableRow>
                          {keys.map((key, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                {t(programField2Label?.[key] || key, {
                                  ns: 'common'
                                })}
                              </TableCell>
                              <TableCell>
                                <HighlightTextDiff
                                  original={change?.originalValues?.[key]}
                                  updated={change?.updatedValues?.[key]}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </Fragment>
                      );
                    })}
                </TableBody>
              </Table>
            </CustomTabPanel>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {(is_TaiGer_AdminAgent(user) || is_TaiGer_External(user)) && (
            <Grid container spacing={1} alignItems="center">
              {is_TaiGer_AdminAgent(user) && (
                <Grid item>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => props.setModalShowAssignWindow(true)}
                  >
                    {t('Assign', { ns: 'common' })}
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Button
                  color="info"
                  variant="contained"
                  component={LinkDom}
                  to={DEMO.PROGRAM_EDIT(props.program._id?.toString())}
                >
                  {t('Edit', { ns: 'common' })}
                </Button>
              </Grid>

              {is_TaiGer_Admin(user) && (
                <Grid item>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => props.setDeleteProgramWarningOpen(true)}
                  >
                    {t('Delete', { ns: 'common' })}
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
          <Box sx={{ my: 2 }}>
            <Link
              component={LinkDom}
              to={`https://www.google.com/search?q=${props.program.school?.replace(
                '&',
                'and'
              )}+${props.program.program_name?.replace('&', 'and')}+${
                props.program.degree
              }`}
              target="_blank"
            >
              <Button
                fullWidth
                color="primary"
                variant="contained"
                endIcon={<OpenInNewIcon />}
              >
                {t('Find in Google', { ns: 'programList' })}
              </Button>
            </Link>
          </Box>
          {is_TaiGer_role(user) && (
            <>
              <Card className="card-with-scroll" sx={{ p: 2 }}>
                <div className="card-scrollable-body">
                  <Tabs
                    value={studentsTabValue}
                    onChange={handleStudentsTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="basic tabs example"
                  >
                    <Tab label="In Progress" {...a11yProps(0)} />
                    <Tab label="Closed" {...a11yProps(1)} />
                  </Tabs>
                  <CustomTabPanel value={studentsTabValue} index={0}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('Name', { ns: 'common' })}</TableCell>
                          <TableCell>{t('Agent', { ns: 'common' })}</TableCell>
                          <TableCell>{t('Editor', { ns: 'common' })}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {props.students
                          ?.filter((student) =>
                            isApplicationOpen(student.application)
                          )

                          .map((student, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <Link
                                  to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                    student._id?.toString(),
                                    DEMO.PROFILE_HASH
                                  )}`}
                                  component={LinkDom}
                                >
                                  {student.firstname} {student.lastname}
                                </Link>
                              </TableCell>
                              <TableCell>
                                {student.agents?.map((agent) => (
                                  <Link
                                    to={`${DEMO.TEAM_AGENT_LINK(
                                      agent._id?.toString()
                                    )}`}
                                    component={LinkDom}
                                    key={agent._id}
                                    sx={{ mr: 1 }}
                                  >
                                    {agent.firstname}
                                  </Link>
                                ))}
                              </TableCell>
                              <TableCell>
                                {student.editors?.map((editor) => (
                                  <Link
                                    to={`${DEMO.TEAM_EDITOR_LINK(
                                      editor._id?.toString()
                                    )}`}
                                    component={LinkDom}
                                    key={editor._id}
                                    sx={{ mr: 1 }}
                                  >
                                    {editor.firstname}
                                  </Link>
                                ))}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CustomTabPanel>
                  <CustomTabPanel value={studentsTabValue} index={1}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('Name', { ns: 'common' })}</TableCell>
                          <TableCell>{t('Year', { ns: 'common' })}</TableCell>
                          <TableCell>
                            {t('Admission', { ns: 'admissions' })}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {props.students
                          ?.filter(
                            (student) => !isApplicationOpen(student.application)
                          )

                          .map((student, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <Link
                                  to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                    student._id?.toString(),
                                    DEMO.PROFILE_HASH
                                  )}`}
                                  component={LinkDom}
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
                                {isProgramWithdraw(student.application)
                                  ? 'WITHDREW'
                                  : student.application.admission}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <Typography variant="string" sx={{ mt: 2 }}>
                      O: admitted, X: rejected, -: not confirmed{' '}
                    </Typography>
                  </CustomTabPanel>
                </div>
              </Card>
              <Card>
                <CardContent>
                  <Typography>
                    {appConfig.companyName}{' '}
                    {t('Program Assistant', { ns: 'programList' })}
                  </Typography>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={props.programListAssistant}
                  >
                    {t('Fetch', { ns: 'common' })}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
          <Card className="card-with-scroll">
            <CardContent className="card-scrollable-body">
              <Typography>
                {t('Provide Feedback', { ns: 'programList' })}
              </Typography>
              <ProgramReport
                uni_name={props.program.school}
                program_name={props.program.program_name}
                program_id={props.program._id?.toString()}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
export default SingleProgramView;

import React, { useState, useEffect, Fragment } from 'react';
import { Link as LinkDom } from 'react-router-dom';
// import 'react-datasheet-grid/dist/style.css';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Divider,
  Grid,
  Box,
  Breadcrumbs,
  Card,
  Link,
  Typography,
  TextField
} from '@mui/material';

import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { getPortalCredentials, postPortalCredentials } from '../../api';
import Banner from '../../components/Banner/Banner';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';
import { isProgramDecided } from '../Utils/checking-functions';

export default function PortalCredentialsCard(props) {
  const { t } = useTranslation();
  let [statedata, setStatedata] = useState({
    error: '',
    isLoaded: false,
    isUpdateLoaded: {},
    isChanged: {},
    applications: [],
    confirmModalWindowOpen: false,
    success: false,
    student: null,
    credentials: {},
    isUpdating: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  useEffect(() => {
    getPortalCredentials(props.student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let credentials_temp = {};
          let isUpdateLoaded_temp = {};
          let isChanged_temp = {};
          if (data.applications) {
            for (const application of data.applications) {
              const programId = application.programId._id.toString();
              isUpdateLoaded_temp[programId] = true;
              isChanged_temp[programId] = false;
              const portalCredentials = application.portal_credentials;
              credentials_temp[programId] = {
                account_portal_a: portalCredentials
                  ? portalCredentials.application_portal_a.account
                  : '',
                account_portal_b: portalCredentials
                  ? portalCredentials.application_portal_b.account
                  : '',
                password_portal_a: portalCredentials
                  ? portalCredentials.application_portal_a.password
                  : '',
                password_portal_b: portalCredentials
                  ? portalCredentials.application_portal_b.password
                  : ''
              };
            }
          }

          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            applications: data.applications, // populated
            student: data.student, // populated
            credentials: credentials_temp,
            isUpdateLoaded: isUpdateLoaded_temp,
            success: success,
            res_status: status
          }));
        } else {
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [props.student_id]);

  const onChange = (e) => {
    e.persist();
    const event_id = e.target.id;
    const program_id = event_id.split('_')[0];
    if (event_id.includes('account')) {
      if (event_id.includes('application_portal_a')) {
        setStatedata((state) => ({
          ...state,
          isChanged: { ...state.isChanged, [program_id]: true },
          credentials: {
            ...state.credentials,
            [program_id]: {
              ...state.credentials[program_id],
              account_portal_a: e.target.value
            }
          }
        }));
      }
      if (event_id.includes('application_portal_b')) {
        setStatedata((state) => ({
          ...state,
          isChanged: { ...state.isChanged, [program_id]: true },
          credentials: {
            ...state.credentials,
            [program_id]: {
              ...state.credentials[program_id],
              account_portal_b: e.target.value
            }
          }
        }));
      }
    }
    if (event_id.includes('password')) {
      if (event_id.includes('application_portal_a')) {
        setStatedata((state) => ({
          ...state,
          isChanged: { ...state.isChanged, [program_id]: true },
          credentials: {
            ...state.credentials,
            [program_id]: {
              ...state.credentials[program_id],
              password_portal_a: e.target.value
            }
          }
        }));
      }
      if (event_id.includes('application_portal_b')) {
        setStatedata((state) => ({
          ...state,
          isChanged: { ...state.isChanged, [program_id]: true },
          credentials: {
            ...state.credentials,
            [program_id]: {
              ...state.credentials[program_id],
              password_portal_b: e.target.value
            }
          }
        }));
      }
    }
  };

  const onSubmit = (student_id, program_id, credentials) => {
    setStatedata((state) => ({
      ...state,
      isUpdateLoaded: { ...state.isUpdateLoaded, [program_id]: false }
    }));
    postPortalCredentials(student_id, program_id, credentials).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            confirmModalWindowOpen: true,
            isChanged: { ...state.isChanged, [program_id]: false },
            isUpdateLoaded: { ...state.isUpdateLoaded, [program_id]: true },
            success: success,
            isUpdating: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            isUpdating: false,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          isUpdating: false,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
        alert('Course Update failed. Please try later.');
      }
    );
  };

  const ConfirmError = () => {
    setStatedata((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const closeModal = () => {
    setStatedata((state) => ({
      ...state,
      confirmModalWindowOpen: false
    }));
  };

  if (!statedata.isLoaded) {
    return <Loading />;
  }

  TabTitle(
    `Student ${statedata.student?.firstname} ${statedata.student?.lastname} || Portal Credentials`
  );

  if (statedata.res_status >= 400) {
    return <ErrorPage res_status={statedata.res_status} />;
  }

  return (
    <Box>
      {statedata.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={statedata.res_modal_status}
          res_modal_message={statedata.res_modal_message}
        />
      )}
      {!props.showTitle && (
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            component={LinkDom}
            to={`${DEMO.DASHBOARD_LINK}`}
          >
            {appConfig.companyName}
          </Link>
          <Typography color="text.primary">Portal Credentials</Typography>
        </Breadcrumbs>
      )}

      <Card sx={{ padding: 2 }}>
        <Typography>
          請到下列各學校網站 [<b>{t('Link', { ns: 'common' })}</b>]{' '}
          申請該校的申請平台帳號密碼，並在此頁面提供帳號密碼，方便日後Agent為您登入檢查上傳文件正確性。若有
          [<b>{t('Instructions')}</b>]{' '}
          連結，請點入連結，依照裡面教學完成。填完帳號密碼，請務必點擊{' '}
          <Button color="primary" variant="contained" size="small">
            {t('Update', { ns: 'common' })}
          </Button>
          儲存。
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Please share your universities&apos; application portals credentials
          here. Your agent(s) can help you review your applications in
          universities&apos; application portals, when you are blocked.
        </Typography>

        {statedata.applications.map((application, i) => (
          <Fragment key={i}>
            {isProgramDecided(application) && (
              <>
                <Divider></Divider>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography sx={{ marginLeft: 2, marginTop: 1 }}>
                      <Link
                        underline="hover"
                        href={`/programs/${application.programId._id.toString()}`}
                        target="_blank"
                      >
                        <b>
                          {`${application.programId.school} - ${application.programId.program_name} - ${application.programId.semester} - ${application.programId.degree}`}
                        </b>
                      </Link>{' '}
                      {(application.programId.application_portal_a ||
                        application.programId.application_portal_b) && (
                        <Button
                          color="primary"
                          variant="contained"
                          size="small"
                          onClick={() =>
                            onSubmit(
                              statedata.student._id.toString(),
                              application.programId._id.toString(),
                              statedata.credentials[
                                application.programId._id.toString()
                              ]
                            )
                          }
                          disabled={
                            !statedata.isUpdateLoaded[
                              application.programId._id.toString()
                            ] ||
                            !statedata.isChanged[
                              application.programId._id.toString()
                            ]
                          }
                        >
                          {!statedata.isUpdateLoaded[
                            application.programId._id.toString()
                          ]
                            ? t('Updating')
                            : t('Update', { ns: 'common' })}
                        </Button>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
                {(application.programId.application_portal_a ||
                  application.programId.application_portal_b) && (
                  <>
                    {((application.programId.application_portal_a &&
                      (!statedata.credentials[
                        application.programId._id.toString()
                      ].account_portal_a ||
                        !statedata.credentials[
                          application.programId._id.toString()
                        ].password_portal_a)) ||
                      (application.programId.application_portal_b &&
                        (!statedata.credentials[
                          application.programId._id.toString()
                        ].account_portal_b ||
                          !statedata.credentials[
                            application.programId._id.toString()
                          ].password_portal_b))) && (
                      <div>
                        <Banner
                          ReadOnlyMode={true}
                          bg={'danger'}
                          title={'warning'}
                          path={'/'}
                          text={t('Please register and provide credentials')}
                          link_name={''}
                          // removeBanner={this.removeBanner}
                          notification_key={undefined}
                        ></Banner>
                      </div>
                    )}
                    <Grid
                      container
                      spacing={2}
                      sx={{ marginLeft: 0, marginTop: 0 }}
                    >
                      <Grid item xs={3}>
                        <b>{t('Account', { ns: 'common' })}</b>
                      </Grid>
                      <Grid item xs={3}>
                        <b>{t('Password', { ns: 'common' })}</b>
                      </Grid>
                      <Grid item xs={3}>
                        <b>{t('Link', { ns: 'common' })}</b>
                      </Grid>
                      <Grid item xs={3}>
                        <b>{t('Instructions')}</b>
                      </Grid>
                    </Grid>
                    {application.programId.application_portal_a && (
                      <Grid container spacing={2} sx={{ marginLeft: 0 }}>
                        <Grid item xs={3}>
                          <TextField
                            type="text"
                            size="small"
                            id={`${application.programId._id.toString()}_application_portal_a_account`}
                            placeholder="account"
                            onChange={(e) => onChange(e)}
                            value={
                              statedata.credentials[
                                application.programId._id.toString()
                              ].account_portal_a
                            }
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            type="text"
                            size="small"
                            id={`${application.programId._id.toString()}_application_portal_a_password`}
                            placeholder="password"
                            onChange={(e) => onChange(e)}
                            value={
                              statedata.credentials[
                                application.programId._id.toString()
                              ].password_portal_a
                            }
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Typography sx={{ wordBreak: 'break-all' }}>
                            <Link
                              underline="hover"
                              to={`${application.programId.application_portal_a}`}
                              component={LinkDom}
                              target="_blank"
                            >
                              {application.programId.application_portal_a}
                            </Link>
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography sx={{ wordBreak: 'break-all' }}>
                            <Link
                              underline="hover"
                              to={`${application.programId.application_portal_a_instructions}`}
                              component={LinkDom}
                              target="_blank"
                            >
                              {
                                application.programId
                                  .application_portal_a_instructions
                              }
                            </Link>
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                    {application.programId.application_portal_b && (
                      <Grid container spacing={2} sx={{ marginLeft: 0 }}>
                        <Grid item xs={3}>
                          <TextField
                            type="text"
                            size="small"
                            id={`${application.programId._id.toString()}_application_portal_b_account`}
                            placeholder="account"
                            onChange={(e) => onChange(e)}
                            defaultValue={
                              statedata.credentials[
                                application.programId._id.toString()
                              ].account_portal_b
                            }
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            type="text"
                            size="small"
                            id={`${application.programId._id.toString()}_application_portal_b_password`}
                            placeholder="password"
                            onChange={(e) => onChange(e)}
                            defaultValue={
                              statedata.credentials[
                                application.programId._id.toString()
                              ].password_portal_b
                            }
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Typography sx={{ wordBreak: 'break-all' }}>
                            <Link
                              underline="hover"
                              to={`${application.programId.application_portal_b}`}
                              component={LinkDom}
                              target="_blank"
                            >
                              {application.programId.application_portal_b}
                            </Link>
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography sx={{ wordBreak: 'break-all' }}>
                            <Link
                              underline="hover"
                              to={`${application.programId.application_portal_b_instructions}`}
                              component={LinkDom}
                              target="_blank"
                            >
                              {
                                application.programId
                                  .application_portal_b_instructions
                              }
                            </Link>
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                  </>
                )}
              </>
            )}
          </Fragment>
        ))}
      </Card>
      <ModalNew
        open={statedata.confirmModalWindowOpen}
        onClose={closeModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography variant="h5">
          {t('Confirmation', { ns: 'common' })}
        </Typography>
        <Typography>
          {t('Update portal credentials successfully', {
            ns: 'portalManagement'
          })}
        </Typography>
        <Button color="primary" variant="outlined" onClick={closeModal}>
          {t('Close', { ns: 'common' })}
        </Button>
      </ModalNew>
    </Box>
  );
}

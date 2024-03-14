import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography
} from '@mui/material';
import { Link as LinkDom, useParams } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import TimezoneSelect from 'react-timezone-select';
import { useTranslation } from 'react-i18next';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

import { time_slots } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { updatePersonalData, updateOfficehours, getUser } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import {
  is_TaiGer_Agent,
  is_personal_data_filled
} from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import ModalNew from '../../components/Modal';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';

function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { user_id } = useParams();
  const [profileState, setProfileState] = useState({
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    user: {},
    officehoursModifed: false,
    selectedTimezone:
      user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    changed_personaldata: false,
    officehours: is_TaiGer_Agent(user) ? user.officehours : {},
    personaldata: user_id
      ? {
          firstname: '',
          firstname_chinese: '',
          lastname: '',
          lastname_chinese: '',
          birthday: '',
          email: ''
        }
      : {
          firstname: user.firstname,
          firstname_chinese: user.firstname_chinese,
          lastname: user.lastname,
          lastname_chinese: user.lastname_chinese,
          birthday: user.birthday,
          role: user.role,
          email: user.email
        },
    updateconfirmed: false,
    updateOfficeHoursConfirmed: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    getUser_function();
  }, [user_id]);

  const getUser_function = () => {
    if (user_id) {
      getUser(user_id).then(
        (resp) => {
          const { success, data } = resp.data;
          const { status } = resp;
          if (success) {
            setProfileState((prevState) => ({
              ...prevState,
              success,
              isLoaded: true,
              officehours: data.officehours,
              personaldata: {
                firstname: data.firstname,
                firstname_chinese: data.firstname_chinese,
                lastname: data.lastname,
                lastname_chinese: data.lastname_chinese,
                birthday: data.birthday,
                role: data.role,
                email: data.email
              },
              user_id: user_id ? user_id : user._id.toString(),
              res_status: status
            }));
          } else {
            setProfileState((prevState) => ({
              ...prevState,
              isLoaded: true,
              res_status: status
            }));
          }
        },
        (error) => {
          setProfileState((prevState) => ({
            ...prevState,
            isLoaded: true,
            error,
            res_status: 500
          }));
        }
      );
    } else {
      setProfileState((prevState) => ({
        ...prevState,
        isLoaded: true,
        success: true
      }));
    }
  };

  const handleChange_PersonalData = (e) => {
    var personaldata_temp = { ...profileState.personaldata };
    personaldata_temp[e.target.id] = e.target.value;
    setProfileState((prevState) => ({
      ...prevState,
      changed_personaldata: true,
      personaldata: personaldata_temp
    }));
  };

  const handleSubmit_PersonalData = (e, personaldata) => {
    updatePersonalData(
      user_id ? profileState.user_id : user._id.toString(),
      personaldata
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setProfileState((prevState) => ({
            ...prevState,
            isLoaded: true,
            personaldata: data,
            success: success,
            changed_personaldata: false,
            updateconfirmed: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setProfileState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setProfileState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const setmodalhide = () => {
    window.location.reload(true);
  };

  const onHideOfficeHoursConfirmed = () => {
    setProfileState((prevState) => ({
      ...prevState,
      updateOfficeHoursConfirmed: false
    }));
    window.location.reload(true);
  };

  const setSelectedTimezone = (e) => {
    setProfileState((prevState) => ({
      ...prevState,
      selectedTimezone: e.value,
      officehoursModifed: true
    }));
  };

  const handleToggleChange = (e, day) => {
    setProfileState((prevState) => ({
      ...prevState,
      officehours: {
        ...prevState.officehours,
        [day]: {
          ...prevState.officehours[day],
          active: e.target.checked
        }
      },
      officehoursModifed: true
    }));
  };

  const onTimeStartChange2 = (e, newValues, day) => {
    setProfileState((prevState) => ({
      ...prevState,
      officehours: {
        ...prevState.officehours,
        [day]: {
          ...prevState.officehours[day],
          time_slots: newValues
        }
      },
      officehoursModifed: true
    }));
  };

  const handleSubmit_Officehours = () => {
    updateOfficehours(
      user._id.toString(),
      profileState.officehours,
      profileState.selectedTimezone
    ).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          setProfileState((prevState) => ({
            ...prevState,
            isLoaded: true,
            success: success,
            officehoursModifed: false,
            updateOfficeHoursConfirmed: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setProfileState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setProfileState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const ConfirmError = () => {
    setProfileState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const { res_status, isLoaded, res_modal_status, res_modal_message } =
    profileState;
  if (!isLoaded) {
    return <Loading />;
  }
  TabTitle(
    `${profileState.personaldata.firstname} ${
      profileState.personaldata.lastname
    } |${
      profileState.personaldata.firstname_chinese
        ? profileState.personaldata.firstname_chinese
        : ' '
    }${
      profileState.personaldata.lastname_chinese
        ? profileState.personaldata.lastname_chinese
        : ' '
    }Profile`
  );
  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }
  return (
    <Box>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        {user_id && (
          <Link
            underline="hover"
            color="inherit"
            component={LinkDom}
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              user_id,
              DEMO.PROFILE
            )}`}
          >
            {`${profileState.personaldata.firstname} ${
              profileState.personaldata.lastname
            } |${
              profileState.personaldata.firstname_chinese
                ? profileState.personaldata.firstname_chinese
                : ' '
            }${
              profileState.personaldata.lastname_chinese
                ? profileState.personaldata.lastname_chinese
                : ' '
            }`}
          </Link>
        )}

        <Typography color="text.primary">{t('Personal Data')}</Typography>
      </Breadcrumbs>
      <Box component="form" noValidate sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {!is_personal_data_filled(profileState.personaldata) && (
              <Accordion
                disableGutters
                defaultExpanded
                sx={{ backgroundColor: '#FF0000' }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <ReportProblemIcon size={18} />
                  <b className="mx-2">{t('Reminder')}:</b> Please fill your
                </AccordionSummary>
                <AccordionDetails>
                  <p
                    className="text-light my-3 mx-3"
                    style={{ textAlign: 'left' }}
                  >
                    <ul>
                      {!profileState.personaldata.firstname && (
                        <li>First Name(English)</li>
                      )}
                      {!profileState.personaldata.lastname && (
                        <li>Last Name(English)</li>
                      )}
                      {!profileState.personaldata.firstname_chinese && (
                        <li>名 (中文)</li>
                      )}
                      {!profileState.personaldata.lastname_chinese && (
                        <li>姓 (中文)</li>
                      )}
                      {!profileState.personaldata.birthday && (
                        <li>{t('Birthday')}</li>
                      )}
                    </ul>
                  </p>
                </AccordionDetails>
              </Accordion>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="firstname"
              name="firstname"
              required
              fullWidth
              id="firstname"
              label={`${t('First Name')} (English)`}
              value={profileState.personaldata.firstname}
              onChange={(e) => handleChange_PersonalData(e)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="lastname"
              name="lastname"
              required
              fullWidth
              id="lastname"
              label={`${t('Last Name')} (English)`}
              value={profileState.personaldata.lastname}
              onChange={(e) => handleChange_PersonalData(e)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="firstname_chinese"
              name="firstname_chinese"
              required
              fullWidth
              id="firstname_chinese"
              label={`${t('First Name')} (中文)`}
              value={profileState.personaldata.firstname_chinese}
              onChange={(e) => handleChange_PersonalData(e)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="lastname_chinese"
              name="lastname_chinese"
              required
              fullWidth
              id="lastname_chinese"
              label={`${t('Last Name')} (中文)`}
              value={profileState.personaldata.lastname_chinese}
              onChange={(e) => handleChange_PersonalData(e)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="birthday"
              name="birthday"
              type="date"
              required
              fullWidth
              id="birthday"
              label={`${t('Birthday')}`}
              InputLabelProps={{
                shrink: true
              }}
              value={profileState.personaldata.birthday}
              onChange={(e) => handleChange_PersonalData(e)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Email: {profileState.personaldata.email}</Typography>
          </Grid>
        </Grid>
        <Button
          color="primary"
          fullWidth
          variant="contained"
          disabled={
            profileState.personaldata.firstname === '' ||
            profileState.personaldata.firstname_chinese === '' ||
            profileState.personaldata.lastname === '' ||
            profileState.personaldata.lastname_chinese === '' ||
            !profileState.changed_personaldata
          }
          onClick={(e) =>
            handleSubmit_PersonalData(e, profileState.personaldata)
          }
          sx={{ mt: 3, mb: 2 }}
        >
          {t('Update')}
        </Button>
      </Box>
      {!user_id && is_TaiGer_Agent(user) && (
        <>
          <Card sx={{ padding: 2, mb: 2 }}>
            <Typography>{t('Profile')}</Typography>

            <h5 className="text-light">{t('Introduction')}</h5>
            {user.selfIntroduction}
          </Card>
          {is_TaiGer_Agent(profileState.personaldata) && (
            <Card sx={{ padding: 2, mb: 2 }}>
              <Typography variant="h6">{t('Office Hours')}</Typography>
              <Typography variant="h6">{t('Time zone')}</Typography>
              <TimezoneSelect
                value={profileState.selectedTimezone}
                onChange={setSelectedTimezone}
                displayValue="UTC"
                isDisabled={false}
              />
              <br />
              {[
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
              ].map((day, i) => (
                <Box key={i} sx={{ display: 'flex', textAlign: 'right' }}>
                  <FormControlLabel
                    label={`${day}`}
                    control={
                      <Checkbox
                        checked={profileState.officehours[day]?.active}
                        onChange={(e) => handleToggleChange(e, day)}
                      />
                    }
                  />
                  {profileState.officehours &&
                  profileState.officehours[day]?.active ? (
                    <>
                      {/* <span>Timeslots</span> */}
                      <Autocomplete
                        multiple
                        id={`${day}`}
                        options={time_slots}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.label}
                        value={profileState.officehours[day].time_slots}
                        onChange={(e, newValue) =>
                          onTimeStartChange2(e, newValue, day)
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.label}
                          </li>
                        )}
                        style={{ width: 500 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Timeslots"
                            placeholder="Timeslots"
                          />
                        )}
                      />
                    </>
                  ) : (
                    <span>{t('Close', { ns: 'common' })}</span>
                  )}
                </Box>
              ))}
              <Button
                variant="contained"
                color="primary"
                disabled={!profileState.officehoursModifed}
                onClick={handleSubmit_Officehours}
              >
                {t('Update')}
              </Button>
            </Card>
          )}
        </>
      )}
      <ModalNew
        open={profileState.updateconfirmed}
        onClose={setmodalhide}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">Update Successfully</Typography>
        <Typography>Personal Data is updated successfully!</Typography>
        <br />
        <div style={{ marginTop: 'auto', textAlign: 'right' }}>
          <Button color="primary" variant="contained" onClick={setmodalhide}>
            {t('Close', { ns: 'common' })}
          </Button>
        </div>
      </ModalNew>
      <ModalNew
        open={profileState.updateOfficeHoursConfirmed}
        onClose={onHideOfficeHoursConfirmed}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">Update Successfully</Typography>
        <Typography>Office Hours time slots updated Successfully</Typography>
        <br />
        <div style={{ marginTop: 'auto', textAlign: 'right' }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => onHideOfficeHoursConfirmed()}
          >
            {t('Close', { ns: 'common' })}
          </Button>
        </div>
      </ModalNew>
    </Box>
  );
}

export default Profile;

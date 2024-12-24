import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Breadcrumbs,
  Link,
  Typography,
  Select,
  MenuItem,
  TableContainer,
  TableBody,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom, useNavigate, useParams } from 'react-router-dom';
import 'react-datasheet-grid/dist/style.css';
import { is_TaiGer_role } from '@taiger-common/core';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlagIcon from '@mui/icons-material/Flag';

import { convertDate } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { WidgetanalyzedFileDownload } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';
import { green } from '@mui/material/colors';

export const CourseAnalysisComponent = ({ sheet }) => {
  const sortedCourses = sheet.sorted;
  const suggestedCourses = sheet.suggestion;

  return (
    <>
      {Object.keys(sortedCourses).map((category, i) => (
        <Paper key={i} sx={{ p: 2, m: 2 }}>
          <Box display="flex" alignItems="center">
            {sortedCourses[category][sortedCourses[category].length - 1]
              .credits <
            sortedCourses[category][sortedCourses[category].length - 1]
              .requiredECTS ? (
              <>
                <WarningIcon style={{ color: 'red', marginRight: '8px' }} />
                <Typography variant="h5" fontWeight="bold">
                  {category}
                </Typography>
              </>
            ) : (
              <>
                <CheckCircleIcon
                  style={{ color: green[500], marginRight: '8px' }}
                />
                <Typography variant="h5" fontWeight="bold">
                  {category}
                </Typography>
              </>
            )}
          </Box>

          {/* Sorted Courses */}
          {sortedCourses[category].length > 0 && (
            <Box display="flex" flexDirection="column" gap={2} sx={{ mb: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body1">
                    ECTS credits conversion Factor: 1.5x
                  </Typography>
                </Box>
                <Box sx={{ mr: 2 }}>
                  <Box display="flex" alignItems="center">
                    <FlagIcon style={{ marginRight: '8px' }} />
                    <Typography
                      style={{ fontWeight: 'normal', color: 'inherit' }}
                    >
                      Required ECTS:{' '}
                      {
                        sortedCourses[category][
                          sortedCourses[category].length - 1
                        ].requiredECTS
                      }
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    {sortedCourses[category][sortedCourses[category].length - 1]
                      .credits <
                    sortedCourses[category][sortedCourses[category].length - 1]
                      .requiredECTS ? (
                      <>
                        <WarningIcon
                          style={{ color: 'red', marginRight: '8px' }}
                        />
                        <Typography
                          style={{ fontWeight: 'bold', color: 'red' }}
                        >
                          You acquired ECTS:{' '}
                          {
                            sortedCourses[category][
                              sortedCourses[category].length - 1
                            ].credits
                          }
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon
                          style={{ color: green[500], marginRight: '8px' }}
                        />
                        <Typography
                          style={{ fontWeight: 'normal', color: 'inherit' }}
                        >
                          You acquired ECTS:{' '}
                          {
                            sortedCourses[category][
                              sortedCourses[category].length - 1
                            ].credits
                          }
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>

              <TableContainer style={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Course</TableCell>
                      <TableCell>Credits</TableCell>
                      <TableCell>Grades</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedCourses[category]
                      ?.slice(0, -1)
                      .map((course, index) => (
                        <TableRow key={index}>
                          <TableCell>{course[category]}</TableCell>
                          <TableCell>{course.credits}</TableCell>
                          <TableCell>{course.grades}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Suggested Courses */}
          {suggestedCourses[category] &&
            suggestedCourses[category].length > 0 && (
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6">Suggested Courses</Typography>
                <Typography variant="body1">
                  {suggestedCourses[category]
                    .map((sug) => sug['建議修課'])
                    .filter((sug) => sug)
                    .join('， ')}
                </Typography>
              </Box>
            )}
        </Paper>
      ))}
    </>
  );
};
export default function CourseAnalysisV2() {
  const { admin_id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const [sheetName, setSheetName] = useState('General');
  let [statedata, setStatedata] = useState({
    error: '',
    isLoaded: false,
    sheets: {},
    sheetNames: [],
    success: false,
    student: null,
    excel_file: {},
    studentId: '',
    file: '',
    isDownloading: false,
    LastModified: '',
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });
  useEffect(() => {
    WidgetanalyzedFileDownload(user._id.toString()).then(
      (resp) => {
        const { success, json } = resp.data;
        if (success) {
          console.log(json);
          const timestamp = json['timestamp'];
          delete json['timestamp'];
          setStatedata((prevState) => ({
            ...prevState,
            sheetNames: Object.keys(json),
            sheets: json,
            isLoaded: true,
            timestamp
          }));
          setSheetName('General');
        } else {
          const { statusText } = resp;
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: statusText
          }));
        }
      },
      (error) => {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  }, []);

  const handleChange = (event) => {
    const selectedIndex = event.target.value;
    setValue(selectedIndex);
    const selectedSheetName = statedata.sheetNames[selectedIndex];
    setSheetName(selectedSheetName);
  };

  const onDownload = () => {
    setStatedata((state) => ({
      ...state,
      isDownloading: true
    }));
    // TODO: timeout? success?
    if (statedata.excel_file !== {}) {
      const blob = statedata.excel_file;
      if (blob.size === 0) return;

      const url = window.URL.createObjectURL(new Blob([blob]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${statedata.file_name}`);
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      // Clean up and remove the link
      link.parentNode.removeChild(link);
      setStatedata((state) => ({
        ...state,
        isDownloading: false
      }));
    } else {
      setStatedata((state) => ({
        ...state,
        isLoaded: true,
        res_modal_status: 500,
        res_modal_message: 'Please try it later',
        isDownloading: false
      }));
    }
  };

  const ConfirmError = () => {
    setStatedata((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  if (!statedata?.isLoaded) {
    return <Loading />;
  }
  TabTitle(`Student ${statedata.student_name} || Courses Analysis`);
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
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        {is_TaiGer_role(user) && (
          <Link
            underline="hover"
            color="inherit"
            component={LinkDom}
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              statedata.studentId,
              DEMO.PROFILE_HASH
            )}`}
          >
            {statedata.student_name}
          </Link>
        )}
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={
            !admin_id
              ? `${DEMO.COURSES_INPUT_LINK(statedata.studentId)}`
              : '/internal/widgets/course-analyser'
          }
        >
          {t('My Courses')}
        </Link>
        <Typography color="text.primary">{t('Courses Analysis')}</Typography>
      </Breadcrumbs>
      <Typography variant="body1" sx={{ pt: 2 }}>
        {t('Course Analysis banner', { ns: 'courses' })}
      </Typography>
      <Typography variant="body1" sx={{ py: 2 }}>
        {t('Course Analysis description', { ns: 'courses' })}
      </Typography>
      <Button
        size="small"
        color="primary"
        variant="contained"
        onClick={() => navigate(DEMO.COURSES_ANALYSIS_EXPLANATION_LINK)}
        sx={{ mr: 2 }}
      >
        {t('Course Analysis explanation button')}
      </Button>
      <Button
        size="small"
        color="secondary"
        variant="contained"
        onClick={() => onDownload()}
      >
        {t('Download', { ns: 'common' })} Report
      </Button>
      <Typography variant="body1" sx={{ pt: 2, pb: 1 }}>
        {t('Programs')}:
      </Typography>
      <Select
        fullWidth
        size="small"
        value={value}
        onChange={handleChange}
        aria-label="course analysis tabs"
        sx={{ mb: 2 }}
      >
        {statedata.sheetNames.map((sn, i) => (
          <MenuItem key={sn} value={i} name={sn}>
            {sn}
          </MenuItem>
        ))}
      </Select>
      {sheetName !== 'General' && (
        <CourseAnalysisComponent sheet={statedata.sheets?.[sheetName]} />
      )}
      {t('Last update', { ns: 'common' })} {convertDate(statedata.timestamp)}
    </Box>
  );
}

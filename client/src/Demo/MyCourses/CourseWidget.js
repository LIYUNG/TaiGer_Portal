import React, { useState, useEffect } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Card,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';
import { Navigate, Link as LinkDom, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'react-datasheet-grid/dist/style.css';

import { study_group } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { is_TaiGer_role } from '../Utils/checking-functions';
import {
  WidgetanalyzedFileDownload,
  WidgetTranscriptanalyser
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';
import ModalNew from '../../components/Modal';

export default function CourseWidget() {
  const { user } = useAuth();
  const { student_id } = useParams();
  const { t } = useTranslation();
  let [statedata, setStatedata] = useState({
    error: '',
    isLoaded: true,
    coursesdata: [
      {
        course_chinese: '電子學',
        course_english: 'Electronics',
        credits: '3',
        grades: 'B'
      }
    ],
    analysis: {},
    analysisSuccessModalWindowOpen: false,
    success: false,
    student: null,
    file: '',
    study_group: '',
    analysis_language: '',
    analyzed_course: '',
    expand: true,
    isAnalysing: false,
    isUpdating: false,
    isDownloading: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  useEffect(() => {}, []);

  const onChange = (new_data) => {
    setStatedata((state) => ({
      ...state,
      coursesdata: new_data
    }));
  };

  const handleChange_study_group = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setStatedata((state) => ({
      ...state,
      study_group: value
    }));
  };

  const handleChange_analysis_language = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setStatedata((state) => ({
      ...state,
      analysis_language: value
    }));
  };

  const ConfirmError = () => {
    setStatedata((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const onAnalyse = () => {
    if (statedata.study_group === '') {
      alert('Please select study group');
      return;
    }
    setStatedata((state) => ({
      ...state,
      isAnalysing: true
    }));
    WidgetTranscriptanalyser(
      statedata.study_group,
      statedata.analysis_language,
      statedata.coursesdata,
      []
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            analysis: data,
            analysisSuccessModalWindowOpen: true,
            success: success,
            isAnalysing: false,
            res_modal_status: status
          }));
        } else {
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            isAnalysing: false,
            res_modal_status: status,
            res_modal_message:
              'Make sure that you updated your courses and select the right target group and language!'
          }));
        }
      },
      (error) => {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          isAnalysing: false,
          error,
          res_modal_status: 500,
          res_modal_message:
            'Make sure that you updated your courses and select the right target group and language!'
        }));
      }
    );
  };

  const onDownload = () => {
    setStatedata((state) => ({
      ...state,
      isDownloading: true
    }));
    WidgetanalyzedFileDownload(user._id.toString()).then(
      (resp) => {
        // TODO: timeout? success?
        const { status } = resp;
        if (status < 300) {
          const actualFileName = decodeURIComponent(
            resp.headers['content-disposition'].split('"')[1]
          ); //  檔名中文亂碼 solved
          const { data: blob } = resp;
          if (blob.size === 0) return;

          var filetype = actualFileName.split('.'); //split file name
          filetype = filetype.pop(); //get the file type

          if (filetype === 'pdf') {
            const url = window.URL.createObjectURL(
              new Blob([blob], { type: 'application/pdf' })
            );

            //Open the URL on new Window
            window.open(url); //TODO: having a reasonable file name, pdf viewer
          } else {
            //if not pdf, download instead.

            const url = window.URL.createObjectURL(new Blob([blob]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', actualFileName);
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
          }
        } else {
          const { statusText } = resp;
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: statusText,
            isDownloading: false
          }));
        }
      },
      (error) => {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: '',
          isDownloading: false
        }));
      }
    );
  };

  const closeanalysisSuccessModal = () => {
    setStatedata((state) => ({
      ...state,
      analysisSuccessModalWindowOpen: false
    }));
  };
  const columns = [
    {
      ...keyColumn('course_chinese', textColumn),
      title: 'Courses Name Chinese'
    },
    {
      ...keyColumn('course_english', textColumn),
      title: 'Courses Name English'
    },
    {
      ...keyColumn('credits', textColumn),
      title: 'Credits'
    },
    { ...keyColumn('grades', textColumn), title: 'Grades' }
  ];

  if (!statedata.isLoaded) {
    return <Loading />;
  }
  if (!student_id) {
    if (!is_TaiGer_role(user)) {
      return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
  }

  if (statedata.res_status >= 400) {
    return <ErrorPage res_status={statedata.res_status} />;
  }
  TabTitle(`Course Analyser`);

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
        <Typography color="text.primary">
          Pre-Customer Course Analyser
        </Typography>
      </Breadcrumbs>
      <Card>
        <Typography sx={{ px: 2, pt: 2 }}>
          1. Please fill the courses.
        </Typography>
        <Typography sx={{ px: 2 }}>2. Select study group</Typography>
        <Typography sx={{ px: 2 }}>
          3. Select language. <b>Chinese</b> is more accurate.
        </Typography>
        <br />
        <DataSheetGrid
          height={6000}
          style={{ minWidth: '450px' }}
          disableContextMenu={true}
          disableExpandSelection={false}
          headerRowHeight={30}
          rowHeight={25}
          value={statedata.coursesdata}
          autoAddRow={true}
          onChange={onChange}
          columns={columns}
        />
        <br />
        <FormControl fullWidth>
          <InputLabel id="select-target-group">
            {t('Select Target Group', { ns: 'courses' })}
          </InputLabel>
          <Select
            labelId="study_group"
            label="Select target group"
            name="study_group"
            id="study_group"
            onChange={(e) => handleChange_study_group(e)}
          >
            <MenuItem value={''}>Select Study Group</MenuItem>
            {study_group.map((cat, i) => (
              <MenuItem value={cat.key} key={i}>
                {cat.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <br />
        <FormControl fullWidth>
          <InputLabel id="select-language">
            {t('Select language', { ns: 'courses' })}
          </InputLabel>
          <Select
            labelId="analysis_language"
            label={t('Select language', { ns: 'courses' })}
            name="analysis_language"
            id="analysis_language"
            onChange={(e) => handleChange_analysis_language(e)}
          >
            <MenuItem value={''}>{t('Select language')}</MenuItem>
            <MenuItem value={'zh'}>中文</MenuItem>
            <MenuItem value={'en'}>English (Beta Version)</MenuItem>
          </Select>
        </FormControl>
        <br />
        <br />
        <Button
          color="primary"
          variant="contained"
          onClick={onAnalyse}
          disabled={
            statedata.isAnalysing ||
            statedata.study_group === '' ||
            statedata.analysis_language === ''
          }
          endIcon={
            statedata.isAnalysing ? <CircularProgress size={24} /> : <></>
          }
        >
          {statedata.isAnalysing ? t('Analysing') : t('Analyse')}
        </Button>
        <br />
        <br />
        <Typography>
          {statedata.analysis && statedata.analysis.isAnalysed ? (
            <>
              <Button onClick={onDownload} disabled={statedata.isDownloading}>
                {t('Download')}
              </Button>
              <Link
                to={`${DEMO.INTERNAL_WIDGET_LINK(user._id.toString())}`}
                target="_blank"
                component={LinkDom}
              >
                {t('View Online', { ns: 'courses' })}
              </Link>
            </>
          ) : (
            t('No analysis yet', { ns: 'courses' })
          )}
        </Typography>
      </Card>
      <ModalNew
        open={statedata.analysisSuccessModalWindowOpen}
        onClose={closeanalysisSuccessModal}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">{t('Success', { ns: 'common' })}</Typography>
        <Typography>{t('Transcript analysed successfully!')}</Typography>
        <Button
          color="primary"
          variant="contained"
          onClick={closeanalysisSuccessModal}
        >
          {t('Close', { ns: 'common' })}
        </Button>
      </ModalNew>
    </Box>
  );
}

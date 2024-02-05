import React, { useState, useEffect } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Form } from 'react-bootstrap';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';
import { Navigate, Link as LinkDom, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'react-datasheet-grid/dist/style.css';

import { convertDate, study_group } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
  is_TaiGer_AdminAgent,
  is_TaiGer_Guest,
  is_TaiGer_role
} from '../Utils/checking-functions';

import {
  getMycourses,
  postMycourses,
  analyzedFileDownload_test,
  transcriptanalyser_test,
  putMycourses
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';

export default function MyCourses() {
  const { student_id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  let [statedata, setStatedata] = useState({
    error: '',
    isLoaded: false,
    coursesdata: {},
    table_data_string_locked: false,
    coursesdata_taiger_guided: [
      {
        course_chinese: '',
        course_english: '',
        credits: '',
        grades: ''
      }
    ],
    analysis: {},
    confirmModalWindowOpen: false,
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

  useEffect(() => {
    const studentId = student_id || user._id.toString();
    //TODO: what if student_id not found : handle status 500
    getMycourses(studentId).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const course_from_database = data.table_data_string
            ? JSON.parse(data.table_data_string)
            : {};
          const course_taiger_guided_from_database =
            data.table_data_string_taiger_guided
              ? JSON.parse(data.table_data_string_taiger_guided)
              : {};
          setStatedata((prevState) => ({
            ...prevState,
            isLoaded: true,
            updatedAt: data.updatedAt,
            coursesdata: course_from_database,
            table_data_string_locked: data.table_data_string_locked,
            coursesdata_taiger_guided: course_taiger_guided_from_database,
            analysis: data.analysis,
            student: data.student_id, // populated
            success: success,
            res_status: status
          }));
        } else {
          setStatedata((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setStatedata((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  const onChange = (new_data) => {
    setStatedata((prevState) => ({
      ...prevState,
      coursesdata: new_data
    }));
  };

  const onChange_ReadOnly = () => {
    setStatedata((prevState) => ({
      ...prevState,
      res_modal_status: 423,
      res_modal_message: (
        <>
          <Typography>
            <b>表格一</b>已鎖，請更新新的課程至<b>表格二</b>
          </Typography>
          <Typography>
            This table is locked. Please update new courses in <b>Table 2</b>
          </Typography>
        </>
      )
    }));
  };

  const onChange_taiger_guided = (new_data) => {
    setStatedata((prevState) => ({
      ...prevState,
      coursesdata_taiger_guided: new_data
    }));
  };

  const handleChange_study_group = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setStatedata((prevState) => ({
      ...prevState,
      study_group: value
    }));
  };

  const handleChange_analysis_language = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setStatedata((prevState) => ({
      ...prevState,
      analysis_language: value
    }));
  };
  const handleLockTable = (e) => {
    e.preventDefault();
    const table_data_string_locked_temp = statedata.table_data_string_locked;
    // setStatedata((prevState) => ({
    //   ...prevState,
    //   table_data_string_locked: !table_data_string_locked_temp
    // }));
    putMycourses(statedata.student._id.toString(), {
      table_data_string_locked: !table_data_string_locked_temp
    }).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (!success) {
          setStatedata((prevState) => ({
            ...prevState,
            isLoaded: true,
            table_data_string_locked: table_data_string_locked_temp,
            res_modal_status: status
          }));
        } else {
          setStatedata((prevState) => ({
            ...prevState,
            table_data_string_locked: !table_data_string_locked_temp
          }));
        }
      },
      (error) => {
        setStatedata((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: '',
          isUpdating: false
        }));
        alert('Locked Update failed. Please try it later.');
      }
    );
  };

  const onSubmit = () => {
    const coursesdata_string = JSON.stringify(statedata.coursesdata);
    const coursesdata_taiger_guided_string = JSON.stringify(
      statedata.coursesdata_taiger_guided
    );
    setStatedata((prevState) => ({
      ...prevState,
      isUpdating: true
    }));
    postMycourses(statedata.student._id.toString(), {
      student_id: statedata.student._id.toString(),
      name: statedata.student.firstname,
      table_data_string: coursesdata_string,
      table_data_string_taiger_guided: coursesdata_taiger_guided_string
    }).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const course_from_database = JSON.parse(data.table_data_string);
          setStatedata((prevState) => ({
            ...prevState,
            isLoaded: true,
            updatedAt: data.updatedAt,
            coursesdata: course_from_database,
            confirmModalWindowOpen: true,
            success: success,
            isUpdating: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setStatedata((prevState) => ({
            ...prevState,
            isLoaded: true,
            isUpdating: false,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setStatedata((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: '',
          isUpdating: false
        }));
        alert('Course Update failed. Please try later.');
      }
    );
  };

  const ConfirmError = () => {
    setStatedata((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const onAnalyse = () => {
    if (statedata.study_group === '') {
      alert('Please select study group');
      return;
    }
    setStatedata((prevState) => ({
      ...prevState,
      isAnalysing: true
    }));
    transcriptanalyser_test(
      statedata.student._id.toString(),
      statedata.study_group,
      statedata.analysis_language
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStatedata((prevState) => ({
            ...prevState,
            isLoaded: true,
            analysis: data,
            analysisSuccessModalWindowOpen: true,
            success: success,
            isAnalysing: false,
            res_modal_status: status
          }));
        } else {
          setStatedata((prevState) => ({
            ...prevState,
            isLoaded: true,
            isAnalysing: false,
            res_modal_status: status,
            res_modal_message:
              'Make sure that you updated your courses and select the right target group and language!'
          }));
        }
      },
      (error) => {
        setStatedata((prevState) => ({
          ...prevState,
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
    setStatedata((prevState) => ({
      ...prevState,
      isDownloading: true
    }));
    analyzedFileDownload_test(statedata.student._id.toString()).then(
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
        setStatedata((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: '',
          isDownloading: false
        }));
      }
    );
  };

  const closeModal = () => {
    setStatedata((prevState) => ({
      ...prevState,
      confirmModalWindowOpen: false
    }));
  };

  const closeanalysisSuccessModal = () => {
    setStatedata((prevState) => ({
      ...prevState,
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
    if (is_TaiGer_role(user)) {
      return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
  }

  if (statedata.res_status >= 400) {
    return <ErrorPage res_status={statedata.res_status} />;
  }
  TabTitle(
    `Student ${statedata.student.firstname} - ${statedata.student.lastname} || Courses List`
  );

  return (
    <Box data-testid="student_course_view">
      {statedata.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={statedata.res_modal_status}
          res_modal_message={statedata.res_modal_message}
        />
      )}
      {statedata.student.archiv && (
        <Box className="sticky-top">
          <Card>
            <Typography variant="h6">
              Status: <b>Close</b>
            </Typography>
          </Card>
        </Box>
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
              statedata.student._id.toString(),
              '/profile'
            )}`}
          >
            {statedata.student.firstname} {statedata.student.lastname}
          </Link>
        )}
        <Typography color="text.primary">My Courses</Typography>
      </Breadcrumbs>
      <Card sx={{ mt: 2, padding: 2, minWidth: '450px' }}>
        <Typography variant="h6">
          請把大學及碩士成績單 上面出現的所有課程填入這個表單內
        </Typography>
        <Box>
          <Typography variant="h6">
            Please fill <b>all your courses in the Bachelor&apos;s study</b> in
            this table
          </Typography>
          <List>
            <ListItem>
              <Typography variant="body1">
                若您仍是高中生、申請大學部者，請忽略此表格
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                若有交換，請填入交換時的修過的課
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                若有在大學部時期修過的碩士課程也可以放上去
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                若有同名課程(如微積分一、微積分二)，請各自獨立一行，不能自行疊加在一行
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                若你已就讀碩士或仍然是碩士班在學，請將碩士班課程標記&quot;碩士&quot;在，Grades那行。
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                若目前尚未畢業，請每學期選完課確定下學課表後更新這個表單
              </Typography>
            </ListItem>
          </List>
        </Box>
        <Typography variant="h6">
          <b>表格一</b>：請放 {appConfig.companyName} 服務開始<b>前</b>
          已經修過的課程
        </Typography>
        <Typography sx={{ my: 1 }}>
          您只需在 {appConfig.companyName} 服務開始初期更新一次
          <b>表格一</b>
          ，往後新的學期，新課程請更新在
          <b>表格二</b>
        </Typography>
        <Typography sx={{ mb: 1 }}>
          若您已畢業，只需更新<b>表格一</b>即可。
        </Typography>
        <DataSheetGrid
          id={1}
          style={{ minWidth: '450px' }}
          height={6000}
          readOnly={true}
          disableContextMenu={false}
          disableExpandSelection={false}
          headerRowHeight={30}
          rowHeight={25}
          value={statedata.coursesdata}
          autoAddRow={true}
          onChange={
            statedata.table_data_string_locked ? onChange_ReadOnly : onChange
          }
          columns={columns}
        />
        <Card sx={{ mt: 2, backgroundColor: '#e3e3e3' }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            <b>表格二</b>：請放 {appConfig.companyName} 服務開始<b>後</b>
            所選的修課程
          </Typography>
          <Typography sx={{ px: 2, pb: 2 }}>
            如此一來顧問才能了解哪些課程是 {appConfig.companyName}
            服務開始後要求修的課程。到畢業前所有新修的課程， 只需更新
            <b>表格二</b>。
          </Typography>
          <DataSheetGrid
            id={2}
            style={{ minWidth: '450px' }}
            height={6000}
            disableContextMenu={true}
            disableExpandSelection={false}
            headerRowHeight={30}
            rowHeight={25}
            value={statedata.coursesdata_taiger_guided}
            autoAddRow={true}
            onChange={onChange_taiger_guided}
            columns={columns}
          />
        </Card>
        {is_TaiGer_AdminAgent(user) && (
          <Box sx={{ mt: 2 }}>
            <Form>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  className="text-default"
                  label={`Lock Table 1 preventing student modifying it.`}
                  value={'is locked'}
                  checked={statedata.table_data_string_locked}
                  onChange={(e) => handleLockTable(e)}
                />
              </Form.Group>
            </Form>
          </Box>
        )}
        <Typography variant="body2" sx={{ my: 2 }}>
          {t('Last update')}&nbsp;
          {convertDate(statedata.updatedAt)}
        </Typography>
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={onSubmit}
          disabled={statedata.isUpdating}
          sx={{ mb: 2 }}
        >
          {statedata.isUpdating ? <CircularProgress size={16} /> : t('Update')}
        </Button>
        <Typography variant="body2">
          {t(
            'After you updated the course table, please contact your agent for your course analysis.'
          )}
        </Typography>
      </Card>
      {is_TaiGer_Guest(user) && (
        <Card sx={{ mt: 2 }}>
          <Typography>
            Do you want to see result? Contact our consultant!
          </Typography>
          <br />
        </Card>
      )}

      <Card sx={{ mt: 2, p: 2 }}>
        {is_TaiGer_AdminAgent(user) && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ marginX: 2 }}>
                <Typography variant="h6">{t('Courses Analysis')}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ marginX: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="select-target-group">
                    {t('Select Target Group')}
                  </InputLabel>
                  <Select
                    labelId="select-label"
                    id="study_group"
                    value={statedata.study_group}
                    label="Select target group"
                    onChange={handleChange_study_group}
                  >
                    <MenuItem value={''}>Select Study Group</MenuItem>
                    {study_group.map((cat, i) => (
                      <MenuItem value={cat.key} key={i}>
                        {cat.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ marginX: 2 }}>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel id="demo-simple-select-label">
                    {t('Select Language')}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="analysis_language"
                    value={statedata.analysis_language}
                    label="Select language"
                    onChange={handleChange_analysis_language}
                  >
                    <MenuItem value={''}>Select Study Group</MenuItem>
                    <MenuItem value={'zh'}>中文</MenuItem>
                    <MenuItem value={'en'}>English (Beta Version)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ marginX: 2 }}>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={onAnalyse}
                  disabled={
                    statedata.isAnalysing ||
                    statedata.study_group === '' ||
                    statedata.analysis_language === ''
                  }
                >
                  {statedata.isAnalysing ? t('Analysing') : t('Analyse')}
                </Button>
              </Grid>
            </Grid>
          </>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">{t('Courses Analysis')}</Typography>
          </Grid>
          <Grid item xs={12}>
            {statedata.analysis && statedata.analysis.isAnalysed ? (
              <>
                <Typography>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={onDownload}
                    disabled={statedata.isDownloading}
                    startIcon={<DownloadIcon />}
                    sx={{ marginRight: 2 }}
                  >
                    {t('Download')}
                  </Button>
                  <LinkDom
                    to={`${DEMO.COURSES_ANALYSIS_RESULT_LINK(
                      statedata.student._id.toString()
                    )}`}
                    target="_blank"
                  >
                    <Button color="secondary" variant="contained" size="small">
                      {t('View Online')}
                    </Button>
                  </LinkDom>
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  {t('Last analysis at')}:{' '}
                  {statedata.analysis
                    ? convertDate(statedata.analysis.updatedAt)
                    : ''}
                </Typography>
              </>
            ) : (
              <Typography>{t('No analysis yet')}</Typography>
            )}
          </Grid>
        </Grid>
      </Card>
      <ModalNew
        open={statedata.confirmModalWindowOpen}
        onClose={closeModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography>{t('Confirmation')}</Typography>
        <Typography>
          {t(
            'Update transcript successfully! Your agent will be notified and will analyse your courses as soon as possible.'
          )}
        </Typography>
        <Typography>
          <Button color="primary" variant="contained" onClick={closeModal}>
            Close
          </Button>
        </Typography>
      </ModalNew>
      <ModalNew
        open={statedata.analysisSuccessModalWindowOpen}
        onClose={closeanalysisSuccessModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography>{t('Success')}</Typography>
        <Typography>
          {t('Courses analysed successfully!')}
          <b>
            {t(
              'The student will receive an email notification and the analysed course URL link.'
            )}
          </b>{' '}
          {t('Student should access the analysed page in their course page.')}
        </Typography>
        <Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={closeanalysisSuccessModal}
          >
            {t('Ok')}
          </Button>
        </Typography>
      </ModalNew>
    </Box>
  );
}

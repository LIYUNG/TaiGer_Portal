import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Button, Card, Modal, Form } from 'react-bootstrap';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';
import { Redirect, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Aux from '../../hoc/_Aux';
import { convertDate, spinner_style, study_group } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
  is_TaiGer_AdminAgent,
  is_TaiGer_role
} from '../Utils/checking-functions';
import 'react-datasheet-grid/dist/style.css';

import {
  getMycourses,
  postMycourses,
  analyzedFileDownload_test,
  transcriptanalyser_test,
  putMycourses
} from '../../api';
import { TopBar } from '../../components/TopBar/TopBar';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { BsMessenger } from 'react-icons/bs';
import { appConfig } from '../../config';

export default function MyCourses(props) {
  const { t, i18n } = useTranslation();
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
    const student_id = props.match.params.student_id
      ? props.match.params.student_id
      : props.user._id.toString();
    //TODO: what if student_id not found : handle status 500
    getMycourses(student_id).then(
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
          setStatedata((state) => ({
            ...state,
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
  }, []);

  const onChange = (new_data) => {
    setStatedata((state) => ({
      ...state,
      coursesdata: new_data
    }));
  };

  const onChange_ReadOnly = (new_data) => {
    setStatedata((state) => ({
      ...state,
      res_modal_status: 423,
      res_modal_message: (
        <>
          <p>
            <b>表格一</b>已鎖，請更新新的課程至<b>表格二</b>
          </p>
          <p>
            This table is locked. Please update new courses in <b>Table 2</b>
          </p>
        </>
      )
    }));
  };

  const onChange_taiger_guided = (new_data) => {
    setStatedata((state) => ({
      ...state,
      coursesdata_taiger_guided: new_data
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
  const handleLockTable = (e) => {
    e.preventDefault();
    const table_data_string_locked_temp = statedata.table_data_string_locked;
    // setStatedata((state) => ({
    //   ...state,
    //   table_data_string_locked: !table_data_string_locked_temp
    // }));
    putMycourses(statedata.student._id.toString(), {
      table_data_string_locked: !table_data_string_locked_temp
    }).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (!success) {
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            table_data_string_locked: table_data_string_locked_temp,
            res_modal_status: status
          }));
        } else {
          setStatedata((state) => ({
            ...state,
            table_data_string_locked: !table_data_string_locked_temp
          }));
        }
      },
      (error) => {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: message,
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
    setStatedata((state) => ({
      ...state,
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
          setStatedata((state) => ({
            ...state,
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
          error,
          res_modal_status: 500,
          res_modal_message: message,
          isUpdating: false
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

  const onAnalyse = () => {
    if (statedata.study_group === '') {
      alert('Please select study group');
      return;
    }
    setStatedata((state) => ({
      ...state,
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
          const { message } = resp.data;
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
        const statusText = error.message;
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
        const { statusText } = resp;
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText,
          isDownloading: false
        }));
      }
    );
  };

  const closeModal = () => {
    setStatedata((state) => ({
      ...state,
      confirmModalWindowOpen: false
    }));
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
    return (
      <div style={spinner_style}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      </div>
    );
  }
  if (!props.match.params.student_id) {
    if (is_TaiGer_role(props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
  }

  if (statedata.res_status >= 400) {
    return <ErrorPage res_status={statedata.res_status} />;
  }
  TabTitle(
    `Student ${statedata.student.firstname} - ${statedata.student.lastname} || Courses List`
  );

  return (
    <Aux>
      {statedata.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={statedata.res_modal_status}
          res_modal_message={statedata.res_modal_message}
        />
      )}
      {statedata.student.archiv && (
        <Row className="sticky-top">
          <Col>
            <Card className="mb-2 mx-0" bg={'success'} text={'white'}>
              <Card.Header>
                <Card.Title as="h5" className="text-light">
                  Status: <b>Close</b>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
      )}
      <TopBar>
        <Link
          className="text-warning"
          to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
            statedata.student._id.toString(),
            DEMO.PROFILE
          )}`}
        >
          {statedata.student.firstname} {statedata.student.lastname}{' '}
        </Link>
        Courses
        <Link
          to={`${DEMO.COMMUNICATIONS_LINK(statedata.student._id.toString())}`}
          style={{ textDecoration: 'none' }}
          className="mx-1"
        >
          <Button size="sm" className="ms-2 ">
            <BsMessenger color="white" size={16} /> <b>Message</b>
          </Button>
        </Link>
      </TopBar>
      <Row>
        <Col sm={12}>
          <Card className="mb-2 mx-0">
            {/* <Card.Header>
                <Card.Title></Card.Title>
              </Card.Header> */}
            <Card.Body>
              <Row>
                <Col>
                  <h4>
                    請把<b>大學及碩士成績單</b>
                    上面出現的所有課程填入這個表單內
                  </h4>
                  <h4>
                    Please fill <b>all your courses in the Bachelor's study</b>{' '}
                    in this table
                  </h4>
                  <li>若您仍是高中生、申請大學部者，請忽略此表格</li>
                  <li>若有交換，請填入交換時的修過的課</li>
                  <li>若有在大學部時期修過的碩士課程也可以放上去</li>
                  <li>
                    若有同名課程(如微積分一、微積分二)，請各自獨立一行，不能自行疊加在一行
                  </li>
                  <li>
                    <b>
                      若你已就讀碩士或仍然是碩士班在學，請將碩士班課程標記"碩士"在，Grades那行。
                    </b>
                  </li>
                  <li>
                    若目前尚未畢業，請每學期選完課確定下學課表後更新這個表單
                  </li>
                </Col>
              </Row>
              <Card className="my-2 py-2 mx-0 px-2">
                <h4>
                  <b>表格一</b>：請放 {appConfig.companyName} 服務開始<b>前</b>
                  已經修過的課程
                </h4>
                <li>
                  您只需在 {appConfig.companyName} 服務開始初期更新一次
                  <b>表格一</b>
                  ，往後新的學期，新課程請更新在
                  <b>表格二</b>
                </li>
                <li>
                  若您已畢業，只需更新<b>表格一</b>即可。
                </li>
                <DataSheetGrid
                  id={1}
                  height={6000}
                  readOnly={true}
                  disableContextMenu={false}
                  disableExpandSelection={false}
                  headerRowHeight={30}
                  rowHeight={25}
                  value={statedata.coursesdata}
                  autoAddRow={true}
                  onChange={
                    statedata.table_data_string_locked
                      ? onChange_ReadOnly
                      : onChange
                  }
                  columns={columns}
                />
              </Card>
              <br />
              <Card className="mt-0 py-2 mx-0 px-2" bg="info">
                <h4>
                  <b>表格二</b>：請放 {appConfig.companyName} 服務開始<b>後</b>
                  所選的修課程
                </h4>
                <span>
                  如此一來顧問才能了解哪些課程是 {appConfig.companyName}
                  服務開始後要求修的課程。到畢業前所有新修的課程， 只需更新
                  <b>表格二</b>。
                </span>
                <DataSheetGrid
                  id={2}
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
              <Row>
                {is_TaiGer_AdminAgent(props.user) && (
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
                )}
              </Row>
              <Row className="my-2">
                <Col>
                  {t('Last update')}&nbsp;
                  {convertDate(statedata.updatedAt)}
                </Col>
              </Row>
              <Row className="mx-1">
                <Button onClick={onSubmit} disabled={statedata.isUpdating}>
                  {statedata.isUpdating ? (
                    <>
                      <div>
                        <Spinner
                          animation="border"
                          size="sm"
                          role="status"
                          variant="light"
                        >
                          <span className="visually-hidden"></span>
                        </Spinner>
                        <span className="text-light">
                          &nbsp;{t('Updating')}{' '}
                        </span>
                      </div>
                    </>
                  ) : (
                    t('Update')
                  )}
                </Button>
                {/* )} */}
              </Row>
              <br></br>
              <p>
                {t(
                  'After you updated the course table, please contact your agent for your course analysis.'
                )}
              </p>
            </Card.Body>
          </Card>
          {props.user.role === 'Guest' && (
            <Card className="mb-2 mx-0">
              <Card.Body>
                <Row>Do you want to see result? Contact our consultant!</Row>
                <br />
              </Card.Body>
            </Card>
          )}

          <Card className="mb-2 mx-0">
            <Card.Body>
              <Row>
                <Col>
                  <h4>Courses Analysis</h4>
                </Col>
              </Row>
              <br />
              {is_TaiGer_AdminAgent(props.user) && (
                <>
                  <Row>
                    <Col>
                      <Form.Group controlId="study_group">
                        <Form.Label>Select target group</Form.Label>
                        <Form.Control
                          as="select"
                          onChange={(e) => handleChange_study_group(e)}
                        >
                          <option value={''}>Select Study Group</option>
                          {study_group.map((cat, i) => (
                            <option value={cat.key} key={i}>
                              {cat.value}
                            </option>
                          ))}
                          {/* <option value={'X'}>No</option>
                            <option value={'O'}>Yes</option> */}
                        </Form.Control>
                      </Form.Group>
                      <br />
                      <Form.Group controlId="analysis_language">
                        <Form.Label>Select language</Form.Label>
                        <Form.Control
                          as="select"
                          onChange={(e) => handleChange_analysis_language(e)}
                        >
                          <option value={''}>Select Study Group</option>
                          <option value={'zh'}>中文</option>
                          <option value={'en'}>English (Beta Version)</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row className="mx-1">
                    <Button
                      onClick={onAnalyse}
                      disabled={
                        statedata.isAnalysing ||
                        statedata.study_group === '' ||
                        statedata.analysis_language === ''
                      }
                    >
                      {statedata.isAnalysing ? 'Analysing' : 'Analyse'}
                    </Button>
                  </Row>
                </>
              )}
              <Row className="my-2"></Row>
              <Row>
                <Col>
                  <p>
                    {statedata.analysis && statedata.analysis.isAnalysed ? (
                      <>
                        <Row>
                          <Col>
                            <Button
                              onClick={onDownload}
                              disabled={statedata.isDownloading}
                            >
                              {t('Download')}
                            </Button>
                            <Link
                              to={`${DEMO.COURSES_ANALYSIS_RESULT_LINK(
                                statedata.student._id.toString()
                              )}`}
                              target="_blank"
                            >
                              <Button variant="secondary">
                                {t('View Online')}
                              </Button>
                            </Link>
                            <p className="my-2">
                              Last analysis at:{' '}
                              {statedata.analysis
                                ? convertDate(statedata.analysis.updatedAt)
                                : ''}
                            </p>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      'No analysis yet'
                    )}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal
        show={statedata.confirmModalWindowOpen}
        onHide={closeModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Update transcript successfully! Your agent will be notified and will
          analyse your courses as soon as possible.
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={statedata.analysisSuccessModalWindowOpen}
        onHide={closeanalysisSuccessModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('Courses analysed successfully!')}
          <b>
            {t(
              'The student will receive an email notification and the analysed course URL link.'
            )}
          </b>{' '}
          {t('Student should access the analysed page in their course page.')}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeanalysisSuccessModal}>Ok</Button>
        </Modal.Footer>
      </Modal>
    </Aux>
  );
}

import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Button, Card, Modal, Form } from 'react-bootstrap';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';
import { Link } from 'react-router-dom';
import Aux from '../../hoc/_Aux';
import { convertDate, spinner_style, study_group } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { showButtonIfMyStudentB } from '../Utils/checking-functions';
import 'react-datasheet-grid/dist/style.css';

import {
  getMycourses,
  postMycourses,
  analyzedFileDownload_test,
  transcriptanalyser_test
} from '../../api';

export default function MyCourses(props) {
  let [statedata, setStatedata] = useState({
    error: '',
    isLoaded: false,
    coursesdata: {},
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
  // if (props.user.role !== 'Student' && props.user.role !== 'Guest') {
  //   return <Redirect to="/dashboard/default" />;
  // }
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
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            updatedAt: data.updatedAt,
            coursesdata: course_from_database,
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

  const [coursesdata, setSoursesdata] = useState([
    {
      course_chinese: '電子學',
      course_english: 'Electronics',
      credits: '3',
      grades: 'B'
    },
    {
      course_chinese: '資料結構',
      course_english: 'Data structure',
      credits: '3',
      grades: 'A'
    }
  ]);
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

  const onSubmit = () => {
    const coursesdata_string = JSON.stringify(statedata.coursesdata);
    setStatedata((state) => ({
      ...state,
      isUpdating: true
    }));
    postMycourses(statedata.student._id.toString(), {
      student_id: statedata.student._id.toString(),
      name: statedata.student.firstname,
      table_data_string: coursesdata_string
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
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          isAnalysing: false
        }));
        alert(
          'Make sure that you updated your courses and your credits are number!'
        );
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

  if (statedata.res_status >= 400) {
    return <ErrorPage res_status={statedata.res_status} />;
  }

  return (
    <Aux>
      {statedata.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={statedata.res_modal_status}
          res_modal_message={statedata.res_modal_message}
        />
      )}
      <Row className="sticky-top ">
        <Col>
          <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
            <Card.Header text={'dark'}>
              <Card.Title>
                <Row>
                  <Col className="my-0 mx-0 text-light">
                    {statedata.student.firstname} {statedata.student.lastname}{' '}
                    Courses
                  </Col>
                </Row>
              </Card.Title>
            </Card.Header>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Card className="mb-2 mx-0">
            {/* <Card.Header>
                <Card.Title></Card.Title>
              </Card.Header> */}
            <Card.Body>
              <Row>
                <Col>
                  <p>
                    Please fill the courses you have taken. (Ignore if you are
                    high school student)
                  </p>
                  <p>
                    <b>Only Bachelor's courses </b>are considered in this table.
                  </p>
                </Col>
              </Row>
              <br />
              <DataSheetGrid
                height={6000}
                disableContextMenu={true}
                disableExpandSelection={false}
                headerRowHeight={30}
                rowHeight={25}
                value={statedata.coursesdata}
                autoAddRow={true}
                onChange={onChange}
                columns={columns}
              />
              <Row className="my-2">
                <Col>Last update at: {convertDate(statedata.updatedAt)}</Col>
              </Row>
              <Row className="mx-1">
                {showButtonIfMyStudentB(props.user, statedata.student) && (
                  <Button onClick={onSubmit} disabled={statedata.isUpdating}>
                    {statedata.isUpdating ? 'Updating' : 'Update'}
                  </Button>
                )}
              </Row>
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
          {(props.user.role === 'Admin' || props.user.role === 'Agent') && (
            <Card className="mb-2 mx-0">
              <Card.Body>
                <Row>
                  <Col>
                    <h4>Analyser</h4>
                  </Col>
                </Row>
                <br />
                {showButtonIfMyStudentB(props.user, statedata.student) && (
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
                  <Col md={2}>
                    <p>
                      {statedata.analysis && statedata.analysis.isAnalysed ? (
                        <>
                          <Button
                            onClick={onDownload}
                            disabled={statedata.isDownloading}
                          >
                            Download
                          </Button>
                          <Link
                            to={`/my-courses/analysis/${statedata.student._id.toString()}`}
                            target="_blank"
                          >
                            View Online
                          </Link>
                        </>
                      ) : (
                        'No analysis yet'
                      )}
                    </p>
                  </Col>
                  <Col>
                    <p className="my-2">
                      Last analysis at:{' '}
                      {statedata.analysis
                        ? convertDate(statedata.analysis.updatedAt)
                        : ''}
                    </p>
                  </Col>
                </Row>
                <br />
              </Card.Body>
            </Card>
          )}
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
        <Modal.Body>Update transcript successfully</Modal.Body>
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
        <Modal.Body>Transcript analysed successfully!</Modal.Body>
        <Modal.Footer>
          <Button onClick={closeanalysisSuccessModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Aux>
  );
}

import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Button, Card, Modal } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import {
  getMycourses,
  postMycourses,
  transcriptanalyser_test
} from '../../api';
import { convertDate } from '../Utils/contants';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
export default function MyCourses(props) {
  let [statedata, setStatedata] = useState({
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    isLoaded: false,
    coursesdata: {},
    confirmModalWindowOpen: false,
    success: false,
    student: null,
    file: '',
    analyzed_course: '',
    expand: true
  });
  // state = {
  //   error: null,
  //   timeouterror: null,
  //   unauthorizederror: null,
  //   isLoaded: false,
  //   data: null,
  //   success: false,
  //   student: null,
  //   checklists: [],
  //   file: '',
  //   expand: true
  // };
  useEffect(() => {
    const student_id = props.match.params.student_id
      ? props.match.params.student_id
      : props.user._id.toString();
    getMycourses(student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        // console.log(data);

        if (success) {
          const course_from_database = data.table_data_string
            ? JSON.parse(data.table_data_string)
            : {};
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            updatedAt: data.updatedAt,
            coursesdata: course_from_database,
            student: data.student_id, // populated
            success: success
          }));
        } else {
          if (resp.status === 401 || resp.status === 500) {
            setStatedata((state) => ({
              ...state,
              isLoaded: true,
              timeouterror: true
            }));
          } else if (resp.status === 403) {
            setStatedata((state) => ({
              ...state,
              isLoaded: true,
              unauthorizederror: true
            }));
          }
        }
      },
      (error) => {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          error: true
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
    // console.log(new_data);
    setStatedata((state) => ({
      ...state,
      coursesdata: new_data
    }));
  };

  const onSubmit = () => {
    const coursesdata_string = JSON.stringify(statedata.coursesdata);
    postMycourses(statedata.student._id.toString(), {
      student_id: statedata.student._id.toString(),
      name: statedata.student.firstname,
      table_data_string: coursesdata_string
    }).then((resp) => {
      const { data, success } = resp.data;
      const course_from_database = JSON.parse(data.table_data_string);
      if (success) {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          updatedAt: data.updatedAt,
          coursesdata: course_from_database,
          confirmModalWindowOpen: true,
          success: success
        }));
      } else {
        if (resp.status === 401 || resp.status === 500) {
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            timeouterror: true
          }));
        } else if (resp.status === 403) {
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            unauthorizederror: true
          }));
        }
      }
    });
  };

  const onAnalyse = () => {
    const coursesdata_string = JSON.stringify(statedata.coursesdata);
    transcriptanalyser_test(statedata.student._id.toString(), 'ee').then(
      (resp) => {
        const { data, success } = resp.data;
        const course_from_database = JSON.parse(data.table_data_string);
        if (success) {
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            // updatedAt: data.updatedAt,
            analyzed_course: data,
            confirmModalWindowOpen: true,
            success: success
          }));
        } else {
          if (resp.status === 401 || resp.status === 500) {
            setStatedata((state) => ({
              ...state,
              isLoaded: true,
              timeouterror: true
            }));
          } else if (resp.status === 403) {
            setStatedata((state) => ({
              ...state,
              isLoaded: true,
              unauthorizederror: true
            }));
          }
        }
      }
    );
  };

  const closeModal = () => {
    setStatedata((state) => ({
      ...state,
      confirmModalWindowOpen: false
    }));
  };
  const columns = [
    { ...keyColumn('course_chinese', textColumn), title: 'Courses Name Chinese' },
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

  const style = {
    position: 'fixed',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };
  if (statedata.timeouterror) {
    return (
      <div>
        <TimeOutErrors />
      </div>
    );
  }
  if (statedata.unauthorizederror) {
    return (
      <div>
        <UnauthorizedError />
      </div>
    );
  }
  if (!statedata.isLoaded) {
    return (
      <div style={style}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      </div>
    );
  }

  return (
    <Aux>
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
              <Row>
                <Button onClick={onSubmit}>Update</Button>
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
                    <p>Analyser</p>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col>
                    <p>{statedata.analyzed_course}</p>
                  </Col>
                </Row>
                <br />
                <Row className="my-2">
                  <Col>
                    Last analysis at: {convertDate(statedata.updatedAt)}
                  </Col>
                </Row>
                <Row>
                  <Button onClick={onAnalyse}>Analyse</Button>
                </Row>
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
    </Aux>
  );
}
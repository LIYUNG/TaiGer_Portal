import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Button, Card } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { getChecklists, updateChecklistStatus } from '../../api';
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
export default function MyCourses(props) {
  let [statedata, setStatedata] = useState({
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    isLoaded: false,
    data: null,
    success: false,
    student: null,
    checklists: [],
    file: '',
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
    getChecklists().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            checklists: data,
            student: props.user,
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

  const [data, setData] = useState([
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

  const columns = [
    { ...keyColumn('course_chinese', textColumn), title: 'Courses Chinese' },
    {
      ...keyColumn('course_english', textColumn),
      title: 'Courses English'
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
                  <Col className="my-0 mx-0 text-light">My Courses</Col>
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
                <Col>Please fill the courses</Col>
              </Row>
              <br />
              <DataSheetGrid
                value={data}
                onChange={setData}
                columns={columns}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Aux>
  );
}

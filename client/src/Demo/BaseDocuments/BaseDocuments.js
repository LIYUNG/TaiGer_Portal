import React, { useEffect, useState } from 'react';
import { Row, Spinner, Table, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Aux from '../../hoc/_Aux';
import StudentBaseDocumentsStatus from './StudentBaseDocumentsStatus';
import BaseDocument_StudentView from './BaseDocument_StudentView';
import {
  SYMBOL_EXPLANATION,
  split_header,
  spinner_style,
  profile_list
} from '../Utils/contants';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import ErrorPage from '../Utils/ErrorPage';
import { is_TaiGer_role } from '../Utils/checking-functions';

import { getStudentsAndDocLinks } from '../../api';
import { TabTitle } from '../Utils/TabTitle';

function BaseDocuments(props) {
  const { t, i18n } = useTranslation();
  const [baseDocumentsState, setBaseDocumentsState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    base_docs_link: null,
    success: false,
    students: null,
    file: '',
    student_id: '',
    status: '', //reject, accept... etc
    category: '',
    feedback: '',
    expand: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  useEffect(() => {
    getStudentsAndDocLinks().then(
      (resp) => {
        const { base_docs_link, data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setBaseDocumentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            base_docs_link,
            success: success,
            res_status: status
          }));
        } else {
          setBaseDocumentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setBaseDocumentsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  const {
    res_status,
    base_docs_link,
    isLoaded,
    res_modal_status,
    res_modal_message
  } = baseDocumentsState;

  TabTitle('Base Documents');

  if (!isLoaded && !baseDocumentsState.students) {
    return (
      <div style={spinner_style}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      </div>
    );
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  let profile_list_keys = Object.values(profile_list);

  const student_profile = baseDocumentsState.students.map((student, i) => (
    <StudentBaseDocumentsStatus
      key={i}
      idx={i}
      student={student}
      role={props.user.role}
      user={props.user}
      SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
      isLoaded={isLoaded}
    />
  ));

  const student_profile_student_view = baseDocumentsState.students.map(
    (student, i) => (
      <Card className="mb-2 mx-0" bg={'dark'} text={'light'} key={i}>
        <Card.Header>
          <Card.Title className="my-0 mx-0 text-light">
            {student.firstname}
            {' ,'}
            {student.lastname}
          </Card.Title>
        </Card.Header>
        <BaseDocument_StudentView
          base_docs_link={base_docs_link}
          student={student}
          user={props.user}
          SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
        />
      </Card>
    )
  );

  return (
    <Aux>
      <Row className="pt-0">
        {is_TaiGer_role(props.user) ? (
          <Card className="mb-0 mx-0" bg={'dark'} text={'light'}>
            <Card.Header>
              <Card.Title className="my-0 mx-0 text-light">
                {t('Base Documents')}
              </Card.Title>
            </Card.Header>
            <Table size="sm" responsive hover text="light">
              <thead>
                <tr
                  className="my-0 mx-0 text-light"
                  style={{
                    color: 'white'
                  }}
                >
                  <th
                    className="headcol"
                    style={{
                      background: 'black',
                      color: 'white'
                    }}
                  >
                    First-, Last <br /> Name
                  </th>
                  <th
                    style={{
                      background: 'black'
                    }}
                  ></th>
                  {profile_list_keys.map((doc_name, index) => (
                    <th
                      style={{
                        background: 'black',
                        color: 'white'
                      }}
                      key={index}
                    >
                      {split_header(doc_name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{student_profile}</tbody>
            </Table>
          </Card>
        ) : (
          <>{student_profile_student_view}</>
        )}
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
      </Row>
    </Aux>
  );
}

export default BaseDocuments;

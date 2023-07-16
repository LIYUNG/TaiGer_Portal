import React, { useState } from 'react';
import { Button, Collapse, Modal, Table } from 'react-bootstrap';
import { IoCheckmarkCircle } from 'react-icons/io5';
import {
  convertDate,
  convertDate_ux_friendly
} from '../../Demo/Utils/contants';
import { Link } from 'react-router-dom';

export function ExtendableTable({ data }) {
  const [selectedRows, setSelectedRows] = useState([
    new Array(data.length)
      .fill()
      .map((x, i) => (i === data.length - 1 ? i : -1))
  ]);
  const [readinessModalShow, setReadinessModalShow] = useState(false);
  const [singleStudent, setSingleStudent] = useState({});

  const toggleRow = (index) => {
    let selectedRows_temp = { ...selectedRows };
    selectedRows_temp[index] = selectedRows_temp[index] !== index ? index : -1;
    setSelectedRows(selectedRows_temp);
  };
  const closeModal = () => {
    setReadinessModalShow(false);
  };
  const openModal = (student) => {
    setSingleStudent(student);
    setReadinessModalShow(true);
  };
  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th># Applications</th>
            <th># Transactions</th>
            <th>Income</th>
            <th>Payment Readiness</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student, index) => (
            <React.Fragment key={index}>
              <tr className="bg-light text-dark">
                <td>
                  <b
                    onClick={() => toggleRow(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {selectedRows[index] === index ? '🔽 ' : '▶️ '}
                    {student.firstname}
                    {student.lastname}
                  </b>
                </td>
                <td>{student.applying_program_count}</td>
                <td>{student.expenses.length}</td>
                <td>
                  {student.expenses.length > 0
                    ? student.expenses.reduce(
                        (acc, expense) => acc + expense.amount,
                        0
                      )
                    : 0}
                </td>
                <td>
                  <Button
                    className="my-0 py-0"
                    size="sm"
                    onClick={() => openModal(student)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
              <Collapse in={selectedRows[index] === index}>
                <tr>
                  <td colSpan="4">
                    <Table>
                      <thead>
                        <tr>
                          <th>Amount</th>
                          <th>Currency</th>
                          <th>Status</th>
                          <th>Description</th>
                          <th>UpdateAt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {student.expenses.length > 0 ? (
                          student.expenses.map((expense, idx) => (
                            <tr key={idx}>
                              <td>{expense.amount} </td>
                              <td>{expense.currency}</td>
                              <td>{expense.status}</td>
                              <td>{expense.description}</td>
                              <td>{expense.updatedAt}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td>0</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </td>
                </tr>
              </Collapse>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
      <Modal centered size="xl" show={readinessModalShow} onHide={closeModal}>
        <Modal.Body>
          <Table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Document Name</th>
                <th>Last Update</th>
              </tr>
            </thead>
            <tbody>
              {singleStudent.generaldocs_threads &&
                singleStudent.generaldocs_threads.map((thread, i) => (
                  <tr key={i}>
                    <th>
                      <IoCheckmarkCircle
                        size={24}
                        color={
                          thread.isFinalVersion ? 'limegreen' : 'lightgray'
                        }
                        title={
                          thread.isFinalVersion ? 'Finished' : 'Not finished'
                        }
                      />
                    </th>
                    <th>
                      <Link
                        to={`/document-modification/${thread.doc_thread_id?._id.toString()}`}
                      >
                        {thread.doc_thread_id.file_type}
                      </Link>
                    </th>
                    <th>{`${convertDate(thread.updatedAt)}`}</th>
                  </tr>
                ))}
              {singleStudent.applications &&
                singleStudent.applications.map((application, i) =>
                  application.doc_modification_thread.map((thread, x) => (
                    <tr>
                      <th>
                        <IoCheckmarkCircle
                          size={24}
                          color={
                            thread.isFinalVersion ? 'limegreen' : 'lightgray'
                          }
                          title={
                            thread.isFinalVersion ? 'Finished' : 'Not finished'
                          }
                        />
                      </th>
                      <th>
                        <Link
                          to={`/document-modification/${thread.doc_thread_id?._id.toString()}`}
                        >
                          {`${thread.doc_thread_id.file_type} - ${application.programId.school} ${application.programId.program_name}`}
                        </Link>
                      </th>
                      <th>{`${convertDate(thread.updatedAt)}`}</th>
                    </tr>
                  ))
                )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
}

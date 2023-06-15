import React, { useState } from 'react';
import { Collapse, Table } from 'react-bootstrap';
import { IoCheckmarkCircle } from 'react-icons/io5';

export function ExtendableTable({ data }) {
  const [selectedRows, setSelectedRows] = useState([
    new Array(data.length)
      .fill()
      .map((x, i) => (i === data.length - 1 ? i : -1))
  ]);
  const toggleRow = (index) => {
    let selectedRows_temp = { ...selectedRows };
    selectedRows_temp[index] = selectedRows_temp[index] !== index ? index : -1;
    setSelectedRows(selectedRows_temp);
  };
  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th># Applications</th>
          <th>Income</th>
          <th>Payment Readiness</th>
        </tr>
      </thead>
      <tbody>
        {data.map((student, index) => (
          <React.Fragment key={index}>
            <tr className="bg-light text-dark" onClick={() => toggleRow(index)}>
              <td>
                <b>
                  {selectedRows[index] === index ? '🔽 ' : '▶️ '}
                  {student.firstname}
                  {student.lastname}
                </b>
              </td>
              <td>{student.applying_program_count}</td>
              <td>{student.expenses}</td>
              <td>{student.isPaid}</td>
            </tr>
            <Collapse in={selectedRows[index] === index}>
              <tr>
                <td colSpan="4">
                  <Table>
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Document Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.generaldocs_threads.map((thread, i) => (
                        <tr>
                          <th>
                            <IoCheckmarkCircle
                              size={24}
                              color={
                                thread.isFinalVersion
                                  ? 'limegreen'
                                  : 'lightgray'
                              }
                              title={
                                thread.isFinalVersion
                                  ? 'Finished'
                                  : 'Not finished'
                              }
                            />
                          </th>
                          <th>{thread.doc_thread_id.file_type}</th>
                        </tr>
                      ))}
                      {student.applications.map((application, i) =>
                        application.doc_modification_thread.map(
                          (thread, x) =>
                            application.decided === 'O' && (
                              <tr>
                                <th>
                                  <IoCheckmarkCircle
                                    size={24}
                                    color={
                                      thread.isFinalVersion
                                        ? 'limegreen'
                                        : 'lightgray'
                                    }
                                    title={
                                      thread.isFinalVersion
                                        ? 'Finished'
                                        : 'Not finished'
                                    }
                                  />
                                </th>
                                <th>{`${thread.doc_thread_id.file_type} - ${application.programId.school} ${application.programId.program_name}`}</th>
                              </tr>
                            )
                        )
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
  );
}

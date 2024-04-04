import React, { useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Accordion,
  Collapse,
  AccordionDetails,
  AccordionSummary,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

import { convertDate } from '../../Demo/Utils/contants';
import DEMO from '../../store/constant';
import ModalNew from '../Modal';

export function ExtendableTable({ data }) {
  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState([
    new Array(data.length)
      .fill()
      .map((x, i) => (i === data.length - 1 ? i : -1))
  ]);
  const [readinessModalShow, setReadinessModalShow] = useState(false);
  const [singleStudent, setSingleStudent] = useState({});

  const toggleRow = (index) => {
    let selectedRows_temp = [...selectedRows];
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
      {data.map((student, index) => (
        <Accordion key={index} disableGutters>
          <AccordionSummary>
            <TableRow>
              <TableCell>
                <b
                  onClick={() => toggleRow(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {selectedRows[index] === index ? '🔽 ' : '▶️ '}
                  {student.firstname}
                  {student.lastname}
                </b>
              </TableCell>
              <TableCell>{student.applying_program_count}</TableCell>
              <TableCell>{student.expenses.length}</TableCell>
              <TableCell>
                {student.expenses.length > 0
                  ? student.expenses.reduce(
                      (acc, expense) => acc + expense.amount,
                      0
                    )
                  : 0}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  className="my-0 py-0"
                  size="sm"
                  onClick={() => openModal(student)}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          </AccordionSummary>
          <AccordionDetails>
            <TableRow>
              <TableCell colSpan="4">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('Amount')}</TableCell>
                      <TableCell>{t('Currency')}</TableCell>
                      <TableCell>{t('Status')}</TableCell>
                      <TableCell>{t('Description', { ns: 'common' })}</TableCell>
                      <TableCell>{t('UpdateAt')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {student.expenses.length > 0 ? (
                      student.expenses.map((expense, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{expense.amount} </TableCell>
                          <TableCell>{expense.currency}</TableCell>
                          <TableCell>{expense.status}</TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell>{expense.updatedAt}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>0</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
          </AccordionDetails>
        </Accordion>
      ))}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('Name')}</TableCell>
            <TableCell># {t('Applications')}</TableCell>
            <TableCell># {t('Transactions')}</TableCell>
            <TableCell>{t('Income')}</TableCell>
            <TableCell>{t('Payment Readiness')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((student, index) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell>
                  <b
                    onClick={() => toggleRow(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {selectedRows[index] === index ? '🔽 ' : '▶️ '}
                    {student.firstname}
                    {student.lastname}
                  </b>
                </TableCell>
                <TableCell>{student.applying_program_count}</TableCell>
                <TableCell>{student.expenses.length}</TableCell>
                <TableCell>
                  {student.expenses.length > 0
                    ? student.expenses.reduce(
                        (acc, expense) => acc + expense.amount,
                        0
                      )
                    : 0}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    className="my-0 py-0"
                    size="sm"
                    onClick={() => openModal(student)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
              <Collapse in={selectedRows[index] === index}>
                <TableRow>
                  <TableCell colSpan="4">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Amount</TableCell>
                          <TableCell>Currency</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>UpdateAt</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {student.expenses.length > 0 ? (
                          student.expenses.map((expense, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{expense.amount} </TableCell>
                              <TableCell>{expense.currency}</TableCell>
                              <TableCell>{expense.status}</TableCell>
                              <TableCell>{expense.description}</TableCell>
                              <TableCell>{expense.updatedAt}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell>0</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              </Collapse>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <ModalNew
        centered
        size="xl"
        open={readinessModalShow}
        onClose={closeModal}
      >
        <Typography id="sTableCell-name">
          {singleStudent.firstname}
          {singleStudent.lastname}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Document Name</TableCell>
              <TableCell>Last Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {singleStudent.generaldocs_threads &&
              singleStudent.generaldocs_threads.map((thread, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <IoCheckmarkCircle
                      size={24}
                      color={thread.isFinalVersion ? 'limegreen' : 'lightgray'}
                      title={
                        thread.isFinalVersion ? 'Finished' : 'Not finished'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      to={DEMO.DOCUMENT_MODIFICATION_LINK(
                        thread.doc_thread_id?._id.toString()
                      )}
                      component={LinkDom}
                    >
                      {thread.doc_thread_id.file_type}
                    </Link>
                  </TableCell>
                  <TableCell>{`${convertDate(thread.updatedAt)}`}</TableCell>
                </TableRow>
              ))}
            {singleStudent.applications &&
              singleStudent.applications.map((application, i) =>
                application.doc_modification_thread.map((thread, x) => (
                  <TableRow key={10000 * i + x}>
                    <TableCell>
                      <IoCheckmarkCircle
                        size={24}
                        color={
                          thread.isFinalVersion ? 'limegreen' : 'lightgray'
                        }
                        title={
                          thread.isFinalVersion ? 'Finished' : 'Not finished'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        to={DEMO.DOCUMENT_MODIFICATION_LINK(
                          thread.doc_thread_id?._id.toString()
                        )}
                        component={LinkDom}
                      >
                        {`${thread.doc_thread_id.file_type} - ${application.programId.school} ${application.programId.program_name}`}
                      </Link>
                    </TableCell>
                    <TableCell>{`${convertDate(thread.updatedAt)}`}</TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </Table>
      </ModalNew>
    </>
  );
}

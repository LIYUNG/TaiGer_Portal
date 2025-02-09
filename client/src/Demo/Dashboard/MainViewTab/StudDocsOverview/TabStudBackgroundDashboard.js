import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

import { academic_background_header } from '../../../../utils/contants';
import { useTranslation } from 'react-i18next';
import StudentsAgentEditor from '../StudentsAgentEditor/StudentsAgentEditor';

const TabStudBackgroundDashboard = (props) => {
    const { t } = useTranslation();
    const stdlist = (
        <TableBody>
            {props.students.map((student, i) => (
                <StudentsAgentEditor
                    key={i}
                    student={student}
                    submitUpdateAgentlist={props.submitUpdateAgentlist}
                    submitUpdateAttributeslist={
                        props.submitUpdateAttributeslist
                    }
                    submitUpdateEditorlist={props.submitUpdateEditorlist}
                    updateStudentArchivStatus={props.updateStudentArchivStatus}
                />
            ))}
        </TableBody>
    );
    let header = Object.values(academic_background_header);
    return (
        <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        {header.map((name, index) => (
                            <TableCell align="left" key={index}>
                                {t(`${name}`, { ns: 'common' })}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                {stdlist}
            </Table>
        </TableContainer>
    );
};

export default TabStudBackgroundDashboard;

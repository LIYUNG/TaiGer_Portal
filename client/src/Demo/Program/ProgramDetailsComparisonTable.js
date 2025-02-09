import React from 'react';
import {
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper
} from '@mui/material';
import { program_fields } from '../../utils/contants';
import { LinkableNewlineText } from '../Utils/checking-functions';

const ProgramDetailsComparisonTable = ({ applications }) => {
    return (
        <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
            <Table aria-label="comparison table" size="small">
                <TableHead />
                <TableBody>
                    {[
                        ...program_fields,
                        { name: 'Country', prop: 'country' }
                    ].map((feature) => (
                        <TableRow key={feature.name}>
                            <TableCell component="th" scope="row">
                                {feature.name}
                            </TableCell>
                            {applications.map((application) => (
                                <TableCell key={application._id}>
                                    <LinkableNewlineText
                                        text={application.programId[
                                            feature.prop
                                        ]?.toString()}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProgramDetailsComparisonTable;

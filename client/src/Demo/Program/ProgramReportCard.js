import React from 'react';
import {
    Alert,
    Box,
    Card,
    CircularProgress,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';

import DEMO from '../../store/constant';
import { useTranslation } from 'react-i18next';
import { getProgramTicketsQuery } from '../../api/query';
import { useQuery } from '@tanstack/react-query';

const ProgramReportCard = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useQuery({
        ...getProgramTicketsQuery({ type: 'program', status: 'open' })
    });
    if (isLoading) {
        return (
            <Card style={{ height: '40vh', position: 'relative' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                    }}
                >
                    <CircularProgress />
                </Box>
            </Card>
        );
    }
    const tickets = data?.data || [];

    const Tickets = () =>
        tickets.map((ticket, i) => (
            <TableRow key={i}>
                <TableCell>
                    <Link
                        component={LinkDom}
                        to={`${DEMO.SINGLE_PROGRAM_LINK(ticket.program_id?._id.toString())}`}
                    >
                        {i + 1}.
                    </Link>
                </TableCell>
                <TableCell>
                    <Link
                        component={LinkDom}
                        title={`${ticket.program_id?.school} - ${ticket.program_id?.program_name}`}
                        to={`${DEMO.SINGLE_PROGRAM_LINK(ticket.program_id?._id.toString())}`}
                    >
                        {`${ticket.program_id?.school} - ${ticket.program_id?.program_name}`.substring(
                            0,
                            30
                        )}
                        ...
                    </Link>
                </TableCell>
                <TableCell>
                    <Link
                        component={LinkDom}
                        title={ticket.description}
                        to={`${DEMO.SINGLE_PROGRAM_LINK(ticket.program_id?._id.toString())}`}
                    >
                        {`${ticket.description}`.substring(0, 50)}
                        {ticket.description?.length > 50 ? ` ...` : ''}
                    </Link>
                </TableCell>
            </TableRow>
        ));
    return (
        <Card style={{ height: '40vh', overflow: 'auto' }}>
            <Alert severity="error">
                <Typography>
                    {t('Program Update Request', { ns: 'common' })}:
                </Typography>
            </Alert>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>idx</TableCell>
                        <TableCell>{t('Program', { ns: 'common' })}</TableCell>
                        <TableCell>
                            {t('Description', { ns: 'common' })}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <Tickets />
                </TableBody>
            </Table>
        </Card>
    );
};
export default ProgramReportCard;

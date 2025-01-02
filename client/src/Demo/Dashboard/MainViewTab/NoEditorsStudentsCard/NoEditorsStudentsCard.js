import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Button,
    Link,
    Menu,
    MenuItem,
    TableCell,
    TableRow,
    Typography
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import { is_TaiGer_role } from '@taiger-common/core';

import EditEditorsSubpage from '../StudDocsOverview/EditEditorsSubpage';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';

function NoEditorsStudentsCard(props) {
    const { user } = useAuth();
    const [noEditorsStudentsCardState, setNoEditorsStudentsCardState] =
        useState({
            showEditorPage: false
        });

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { t } = useTranslation();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const setEditorModalhide = () => {
        setNoEditorsStudentsCardState((prevState) => ({
            ...prevState,
            showEditorPage: false
        }));
    };

    const startEditingEditor = () => {
        setNoEditorsStudentsCardState((prevState) => ({
            ...prevState,
            subpage: 2,
            showEditorPage: true
        }));
    };

    const submitUpdateEditorlist = (e, updateEditorList, student_id) => {
        e.preventDefault();
        setEditorModalhide();
        props.submitUpdateEditorlist(e, updateEditorList, student_id);
    };

    if (
        props.student.editors === undefined ||
        props.student.editors.length === 0
    ) {
        return (
            <>
                <TableRow>
                    {is_TaiGer_role(user) && !props.isArchivPage && (
                        <TableCell>
                            <Button
                                size="small"
                                id="basic-button"
                                variant="contained"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                {t('Option', { ns: 'common' })}
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button'
                                }}
                            >
                                <MenuItem onClick={() => startEditingEditor()}>
                                    Edit Editor
                                </MenuItem>
                            </Menu>
                        </TableCell>
                    )}
                    <TableCell>
                        <Link
                            component={LinkDom}
                            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                props.student._id.toString(),
                                DEMO.PROFILE_HASH
                            )}`}
                        >
                            {props.student.firstname}, {props.student.lastname}
                        </Link>
                    </TableCell>
                    <TableCell>{props.student.email}</TableCell>
                    <TableCell>
                        <Typography fontWeight="bold">
                            {props.student.needEditor ? 'Ready to Assign' : '-'}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            {props.student.application_preference
                                .target_program_language || 'TBD'}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            {props.student.application_preference
                                .expected_application_date || 'TBD'}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        {!props.student.agents ||
                        props.student.agents.length === 0 ? (
                            <Typography fontWeight="bold">No Agent</Typography>
                        ) : (
                            props.student.agents.map((agent, i) => (
                                <Typography
                                    key={i}
                                >{`${agent.firstname}`}</Typography>
                            ))
                        )}
                    </TableCell>
                </TableRow>
                {is_TaiGer_role(user) &&
                    noEditorsStudentsCardState.showEditorPage && (
                        <EditEditorsSubpage
                            student={props.student}
                            show={noEditorsStudentsCardState.showEditorPage}
                            onHide={setEditorModalhide}
                            setmodalhide={setEditorModalhide}
                            submitUpdateEditorlist={submitUpdateEditorlist}
                        />
                    )}
            </>
        );
    } else {
        return <></>;
    }
}

export default NoEditorsStudentsCard;

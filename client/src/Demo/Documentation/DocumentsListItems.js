import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { Link, Box } from '@mui/material';
import { is_TaiGer_Admin } from '@taiger-common/core';

import { useAuth } from '../../components/AuthProvider';

const DocumentsListItems = (props) => {
    const { user } = useAuth();
    return (
        <Box sx={{ mx: 2, my: 1 }}>
            {is_TaiGer_Admin(user) ? (
                <CloseIcon
                    fontSize="small"
                    onClick={() =>
                        props.openDeleteDocModalWindow(props.document)
                    }
                    style={{ cursor: 'pointer' }}
                    title="Delete"
                />
            ) : null}
            {props.idx}
            {'. '}
            <Link
                component={LinkDom}
                to={`${props.path}/${props.document._id}`}
            >
                {props.document.title}
            </Link>
        </Box>
    );
};

export default DocumentsListItems;

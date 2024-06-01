import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { Link, Box } from '@mui/material';

import { is_TaiGer_AdminAgent } from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';

function DocumentsListItems(props) {
  const { user } = useAuth();
  return (
    <Box sx={{ mx: 2, my: 1 }}>
      {is_TaiGer_AdminAgent(user) && (
        <CloseIcon
          fontSize="small"
          title="Delete"
          style={{ cursor: 'pointer' }}
          onClick={() => props.openDeleteDocModalWindow(props.document)}
        />
      )}
      {props.idx}
      {'. '}
      <Link to={`${props.path}/${props.document._id}`} component={LinkDom}>
        {props.document.title}
      </Link>
    </Box>
  );
}

export default DocumentsListItems;

import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { HiX } from 'react-icons/hi';
import { Link } from '@mui/material';

import { is_TaiGer_AdminAgent } from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';
import { Box } from '@mui/material';

function DocumentsListItems(props) {
  const { user } = useAuth;
  return (
    <Box sx={{ mx: 2, my: 1 }}>
      {is_TaiGer_AdminAgent(user) && (
        <HiX
          size={24}
          color="red"
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

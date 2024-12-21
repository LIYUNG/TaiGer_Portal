import React from 'react';
import {
  Avatar,
  Box,
  Divider,
  Grid,
  MenuItem,
  Typography,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {
  convertDate_ux_friendly,
  menuWidth,
  stringAvatar
} from '../../../../Demo/Utils/contants';
import DEMO from '../../../../store/constant';
import { truncateText } from '../../../../Demo/Utils/checking-functions';
import { useAuth } from '../../../AuthProvider';
import { useTranslation } from 'react-i18next';

const Friend = (props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const parsedObject = JSON.parse(
    props.data.latestCommunication?.message || '{}'
  );
  const lastReply = props.data.latestCommunication?.user_id;

  // Access the first text content
  const firstText =
    parsedObject?.blocks?.length > 0
      ? parsedObject?.blocks
          .map((block) => (block?.type === 'paragraph' ? block.data?.text : ''))
          ?.join('')
          .replace(/<\/?[^>]+(>|$)|&[^;]+;?/g, '') || ''
      : '';

  const handleToChat = () => {
    props.handleCloseChat();
    navigate(
      `${DEMO.COMMUNICATIONS_TAIGER_MODE_LINK(props.data?._id?.toString())}`
    );
  };

  return (
    <MenuItem
      onClick={handleToChat}
      sx={{
        width: menuWidth,
        backgroundColor: props.data?.latestCommunication?.readBy?.includes(
          props.activeId
        )
          ? theme.palette.background.secondary
          : theme.palette.info.main // Set your desired background color
      }}
      title={`${
        props.data.lastname_chinese ? props.data.lastname_chinese : ''
      }${props.data.firstname_chinese ? props.data.firstname_chinese : ''} ${
        props.data.firstname
      } ${props.data.lastname}`}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={`${props.data.firstname} ${props.data.lastname}`}
            {...stringAvatar(`${props.data.firstname} ${props.data.lastname}`)}
          />
          <Box
            style={{
              marginLeft: '10px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '1px' // Adjust the gap between name and caption
            }}
          >
            <Typography variant="body1" fontWeight="bold" color="text.primary">
              {truncateText(
                `${
                  props.data.lastname_chinese ? props.data.lastname_chinese : ''
                }${
                  props.data.firstname_chinese
                    ? props.data.firstname_chinese
                    : ''
                } ${props.data.firstname} ${props.data.lastname}`,
                30
              )}
            </Typography>
            <Typography variant="caption">
              {`${
                user._id.toString() === lastReply
                  ? `${t('You', { ns: 'common' })}: `
                  : ''
              }${truncateText(firstText, 26)} ${
                props.data?.latestCommunication?.createdAt &&
                `• ${convertDate_ux_friendly(
                  props.data.latestCommunication.createdAt
                )}`
              }`}
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box
            style={{
              textAlign: 'right',
              padding: '8px 8px'
            }}
          >
            <Typography variant="body2">
              {props.data?.latestCommunication?.user_id ===
                props.data?.latestCommunication?.student_id &&
                props.data?.latestCommunication?.ignore_message !== true && (
                  <FiberManualRecordIcon
                    fontSize="small"
                    title="Not Reply Yet"
                    style={{ marginLeft: '4px' }}
                  />
                )}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Divider />
    </MenuItem>
  );
};

export default Friend;

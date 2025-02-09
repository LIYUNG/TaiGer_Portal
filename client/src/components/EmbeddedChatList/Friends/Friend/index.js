import React from 'react';
import { Link as LinkDom, useParams } from 'react-router-dom';
import {
    Avatar,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
    useTheme
} from '@mui/material';

import {
    convertDateUXFriendly,
    stringAvatar
} from '../../../../utils/contants';
import DEMO from '../../../../store/constant';
import { truncateText } from '../../../../Demo/Utils/checking-functions';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useAuth } from '../../../AuthProvider';
import { useTranslation } from 'react-i18next';

const Friend = (props) => {
    const { student_id } = useParams();
    const { user } = useAuth();
    const { t } = useTranslation();
    const theme = useTheme();
    // Parse the JSON string into an object
    const parsedObject = JSON.parse(
        props.data.latestCommunication?.message || '{}'
    );
    const lastReply = props.data.latestCommunication?.user_id;

    // Access the first text content
    const firstText =
        parsedObject?.blocks?.length > 0
            ? parsedObject?.blocks
                  .map((block) =>
                      block?.type === 'paragraph' ? block.data?.text : ''
                  )
                  ?.join('')
                  .replace(/<\/?[^>]+(>|$)|&[^;]+;?/g, '') || ''
            : '';
    const backgroundColor =
        props.data?.latestCommunication?.readBy?.includes(props.activeId) ||
        props.data?.latestCommunication?.user_id?.toString() ===
            user._id?.toString()
            ? theme.palette.background.default
            : theme.palette.action.disabled; // Set your desired background color
    return (
        <ListItem
            disablePadding
            key={props.data?._id?.toString()}
            sx={{
                backgroundColor: backgroundColor,
                '&:hover': {
                    backgroundColor: theme.palette.action.hover // Set a different color on hover if needed
                },
                transition: 'background-color 0.3s ease-in-out', // Smooth color transitions
                color:
                    props.data?.latestCommunication?.readBy?.includes(
                        props.activeId
                    ) ||
                    props.data?.latestCommunication?.user_id?.toString() ===
                        user._id?.toString()
                        ? theme.palette.text.primary // Regular text for read messages
                        : theme.palette.text.secondary // Secondary text color for unread messages
            }}
        >
            <ListItemButton
                component={LinkDom}
                selected={props.data?._id?.toString() === student_id}
                title={`${
                    props.data.lastname_chinese
                        ? props.data.lastname_chinese
                        : ''
                }${props.data.firstname_chinese ? props.data.firstname_chinese : ''}${
                    props.data.firstname
                } ${props.data.lastname}`}
                to={`${DEMO.COMMUNICATIONS_TAIGER_MODE_LINK(
                    props.data?._id?.toString()
                )}`}
            >
                <ListItemIcon>
                    <IconButton edge="start">
                        <Avatar
                            alt={`${props.data.firstname} ${props.data.lastname}`}
                            {...stringAvatar(
                                `${props.data.firstname} ${props.data.lastname}`
                            )}
                            // src={props.data.profilePicture} // Add the path to the profile picture
                        />
                    </IconButton>
                    <ListItemText
                        primary={
                            <Typography style={{ fontWeight: 'bold' }}>
                                {truncateText(
                                    `${
                                        props.data.lastname_chinese
                                            ? props.data.lastname_chinese
                                            : ''
                                    }${
                                        props.data.firstname_chinese
                                            ? props.data.firstname_chinese
                                            : ''
                                    } ${props.data.firstname} ${props.data.lastname}`,
                                    21
                                )}
                            </Typography>
                        }
                        secondary={`${
                            user._id.toString() === lastReply
                                ? `${t('You', { ns: 'common' })}: `
                                : ''
                        }${truncateText(firstText, 14)} • ${convertDateUXFriendly(
                            props.data?.latestCommunication?.createdAt
                        )}`}
                        style={{
                            marginLeft: '10px',
                            flex: 1
                        }}
                    />
                    <ListItemSecondaryAction>
                        <IconButton edge="end">
                            {props.data?.latestCommunication?.user_id ===
                                props.data?.latestCommunication?.student_id &&
                            props.data?.latestCommunication?.ignore_message !==
                                true ? (
                                <FiberManualRecordIcon
                                    fontSize="small"
                                    style={{ marginLeft: '4px' }}
                                    title="Not Reply Yet"
                                />
                            ) : null}
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItemIcon>
            </ListItemButton>
        </ListItem>
    );
};

export default Friend;

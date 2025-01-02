import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Card, CircularProgress, Link } from '@mui/material';
import { FileIcon, defaultStyles } from 'react-file-icon';

import { BASE_URL } from '../../../api/request';

function FileItem(props) {
    const [fileItemState, setFileItemState] = useState({
        editorState: null,
        ConvertedContent: '',
        message_id: '',
        isLoaded: false,
        deleteMessageModalShow: false
    });

    useEffect(() => {
        setFileItemState((prevState) => ({
            ...prevState,
            isLoaded: props.isLoaded,
            deleteMessageModalShow: false
        }));
    }, [props.message.message]);

    if (!fileItemState.isLoaded) {
        return <CircularProgress />;
    }

    const files_info = props.message?.file.map((file, i) => (
        <Card key={i} sx={{ p: 1 }}>
            <span>
                <Link
                    underline="hover"
                    to={`${BASE_URL}/api/document-threads/${
                        props.documentsthreadId
                    }/${props.message._id.toString()}/${
                        file.path.replace(/\\/g, '/').split('/')[2]
                    }`}
                    component={LinkDom}
                    target="_blank"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-2"
                    >
                        <FileIcon
                            extension={file.name.split('.').pop()}
                            {...defaultStyles[file.name.split('.').pop()]}
                        />
                    </svg>
                    {file.name}
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="m7 10 4.86 4.86c.08.08.2.08.28 0L17 10"
                            stroke="#000"
                            strokeWidth="2"
                            strokeLinecap="round"
                        ></path>
                    </svg>
                </Link>
                by {props.message.user_id.firstname}{' '}
                {props.message.user_id.lastname}
            </span>
        </Card>
    ));

    return <>{files_info}</>;
}

export default FileItem;

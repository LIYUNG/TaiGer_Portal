import React, { useState, useRef } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import { Button, Tooltip } from '@mui/material';

const OverlayButton = ({ text }) => {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    return (
        <Tooltip title={text}>
            <Button onClick={() => setShow(!show)} ref={target}>
                <LockIcon />
            </Button>
        </Tooltip>
    );
};

export default OverlayButton;

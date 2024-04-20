import React, { useState, useRef } from 'react';
import { AiFillLock } from 'react-icons/ai';
import { Button, Tooltip } from '@mui/material';

export default function OverlayButton(props) {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  return (
    <>
      <Tooltip title={props.text} {...props}>
        <Button ref={target} onClick={() => setShow(!show)}>
          <AiFillLock />
        </Button>
      </Tooltip>
    </>
  );
}

// export default OverlayButton;

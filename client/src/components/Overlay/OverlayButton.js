import React, { useState, useRef } from 'react';
import { AiFillLock } from 'react-icons/ai';
import { Button } from '@mui/material';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

export default function OverlayButton(props) {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const text = props.text;
  return (
    <>
      <Button ref={target} onClick={() => setShow(!show)}>
        <AiFillLock />
      </Button>
      <Overlay target={target.current} show={show} placement="top">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            {text}
          </Tooltip>
        )}
      </Overlay>
    </>
  );
}

// export default OverlayButton;

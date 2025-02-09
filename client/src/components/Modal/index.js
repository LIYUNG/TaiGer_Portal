import React from 'react';
import { Box, Modal } from '@mui/material';

export default function ModalNew(props) {
    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            onClose={props.onClose}
            open={props.open}
            size={props.size}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px'
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: props.width || '60%', // Adjust the width as needed
                    maxWidth: '80%', // Set a maximum width if desired
                    maxHeight: props.height || '80vh', // Set a maximum height
                    overflow: 'auto', // Enable scrolling
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4
                }}
            >
                {props.children}
            </Box>
        </Modal>
    );
}

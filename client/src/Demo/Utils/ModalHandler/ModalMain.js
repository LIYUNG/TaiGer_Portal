import React from 'react';
import {
    Button,
    Box,
    Typography,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { appConfig } from '../../../config';

const ModalMain = (props) => {
    const { t } = useTranslation();
    const modalMainState = {
        res_modal_status: props.res_modal_status,
        res_modal_message: props.res_modal_message
    };

    const { res_modal_status, res_modal_message } = modalMainState;
    return (
        <>
            <Dialog
                onClose={props.ConfirmError}
                open={[400, 401, 409, 423, 429, 500].includes(res_modal_status)}
            >
                <DialogTitle>{t('Error')}</DialogTitle>
                <DialogContent>{res_modal_message}</DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={props.ConfirmError}
                        variant="contained"
                    >
                        {t('Ok')}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                onClose={props.ConfirmError}
                open={[403, 404, 413, 415].includes(res_modal_status)}
            >
                <DialogTitle>{t('Error')}</DialogTitle>
                <DialogContent>
                    <Box>
                        {res_modal_status === 403 ? (
                            <>
                                <Typography>
                                    Operation forbidden. Please contact{' '}
                                    {appConfig.companyName} for more detail.
                                </Typography>
                                <Typography>{res_modal_message}</Typography>
                            </>
                        ) : null}
                        {res_modal_status === 404 ? (
                            <>404: {res_modal_message}</>
                        ) : null}
                        {res_modal_status === 413 ? (
                            <>
                                <Typography>{res_modal_message}</Typography>
                                Please use third party WebApp like{' '}
                                <a
                                    href="https://www.ilovepdf.com/compress_pdf"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    <b>PDF Compressor</b>
                                </a>{' '}
                                or{' '}
                                <a
                                    href="https://www.adobe.com/de/acrobat/online/compress-pdf.html"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    <b>Adobe WebApp</b>
                                </a>
                                to compress your file!
                            </>
                        ) : null}
                        {res_modal_status === 415 ? (
                            <>
                                <Typography>{res_modal_message}</Typography>
                                <Typography>
                                    請確認您的檔案格式。壓縮過後的檔案仍然需要是上述格式。
                                </Typography>
                            </>
                        ) : null}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={props.ConfirmError}
                        variant="contained"
                    >
                        {t('Ok')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ModalMain;

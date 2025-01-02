import React from 'react';
import {
    Table,
    Button,
    TableBody,
    TableRow,
    TableCell,
    CircularProgress,
    TextField,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { DocumentStatusType, is_TaiGer_Admin } from '@taiger-common/core';

import { BASE_URL } from '../../api/request';
import { templatelist } from '../../utils/contants';
import { useAuth } from '../../components/AuthProvider';

const EditDownloadFiles = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const submitFile = (e, prop) => {
        e.preventDefault();
        props.submitFile(e, prop);
    };

    let object_init = {};
    for (let i = 0; i < templatelist.length; i++) {
        object_init[templatelist[i].prop] = DocumentStatusType.Missing;
    }
    for (let i = 0; i < props.templates.length; i++) {
        object_init[props.templates[i].category_name] = 'uploaded';
    }
    let templatelist2;
    templatelist2 = templatelist.map((template, i) => {
        return (
            <TableRow key={i + 1}>
                <TableCell>{template.name}</TableCell>
                <TableCell>
                    {is_TaiGer_Admin(user) && (
                        <Box>
                            {object_init[template.prop] === 'uploaded' ? (
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    type="submit"
                                    title="Delete"
                                    disabled={!props.areLoaded[template.prop]}
                                    onClick={(e) =>
                                        props.onDeleteTemplateFile(
                                            e,
                                            template.prop
                                        )
                                    }
                                    startIcon={<DeleteIcon />}
                                >
                                    {t('Delete', { ns: 'common' })}
                                </Button>
                            ) : (
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="file"
                                    inputProps={{
                                        multiple: false
                                    }}
                                    onChange={(e) => props.onFileChange(e)}
                                />
                            )}
                        </Box>
                    )}
                </TableCell>
                <TableCell>
                    {object_init[template.prop] === 'uploaded' ? (
                        <Box>
                            <a
                                href={`${BASE_URL}/api/account/files/template/${template.prop}`}
                                target="_blank"
                                className="text-info"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    color="primary"
                                    variant="contained"
                                    size="small"
                                >
                                    {t('Download', { ns: 'common' })}
                                </Button>
                            </a>
                        </Box>
                    ) : is_TaiGer_Admin(user) ? (
                        <Button
                            size="small"
                            disabled={!props.areLoaded[template.prop]}
                            type="submit"
                            onClick={(e) => submitFile(e, template.prop)}
                        >
                            {!props.areLoaded[template.prop] ? (
                                <CircularProgress size={16} />
                            ) : (
                                'Upload'
                            )}
                        </Button>
                    ) : (
                        t('Unavailable')
                    )}
                </TableCell>
            </TableRow>
        );
    });

    return (
        <Table size="small">
            <TableBody>{templatelist2}</TableBody>
        </Table>
    );
};

export default EditDownloadFiles;

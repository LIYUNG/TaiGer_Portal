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
import { DocumentStatusType, is_TaiGer_Admin } from '@taiger-common/core';
import i18next from 'i18next';

import { BASE_URL } from '../../api/request';
import { templatelist } from '../../utils/contants';

const EditDownloadFiles = (props) => {
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
                    {is_TaiGer_Admin(props.user) ? (
                        <Box>
                            {object_init[template.prop] === 'uploaded' ? (
                                <Button
                                    color="error"
                                    disabled={!props.areLoaded[template.prop]}
                                    onClick={(e) =>
                                        props.onDeleteTemplateFile(
                                            e,
                                            template.prop
                                        )
                                    }
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    title="Delete"
                                    type="submit"
                                    variant="contained"
                                >
                                    {i18next.t('Delete', { ns: 'common' })}
                                </Button>
                            ) : (
                                <TextField
                                    fullWidth
                                    inputProps={{
                                        multiple: false
                                    }}
                                    onChange={(e) => props.onFileChange(e)}
                                    size="small"
                                    type="file"
                                />
                            )}
                        </Box>
                    ) : null}
                </TableCell>
                <TableCell>
                    {object_init[template.prop] === 'uploaded' ? (
                        <Box>
                            <a
                                className="text-info"
                                href={`${BASE_URL}/api/account/files/template/${template.prop}`}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <Button
                                    color="primary"
                                    size="small"
                                    variant="contained"
                                >
                                    {i18next.t('Download', { ns: 'common' })}
                                </Button>
                            </a>
                        </Box>
                    ) : is_TaiGer_Admin(props.user) ? (
                        <Button
                            disabled={!props.areLoaded[template.prop]}
                            onClick={(e) => submitFile(e, template.prop)}
                            size="small"
                            type="submit"
                        >
                            {!props.areLoaded[template.prop] ? (
                                <CircularProgress size={16} />
                            ) : (
                                'Upload'
                            )}
                        </Button>
                    ) : (
                        i18next.t('Unavailable')
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

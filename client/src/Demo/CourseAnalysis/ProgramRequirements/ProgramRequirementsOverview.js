import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { Link as LinkDom, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import React, { useState } from 'react';
import DEMO from '../../../store/constant';
import { useTranslation } from 'react-i18next';
import { deleteProgramRequirement } from '../../../api';

const ProgramRequirementsOverview = ({ programRequirements }) => {
    const { t } = useTranslation();
    const [programRequirementsState, setProgramRequirementsState] =
        useState(programRequirements);
    const [openRow, setOpenRow] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [requirementIdToBeDeleted, setRequirementIdToBeDeleted] =
        useState('');
    const navigate = useNavigate();

    const handleRowClick = (index) => {
        setOpenRow(openRow === index ? null : index); // Toggle open/close
    };

    const handleRequirementEdit = (requirementId) => {
        navigate(DEMO.EDIT_PROGRAM_ANALYSIS(requirementId));
    };

    const handleDeleteModal = (requirementId) => {
        setDeleteModalOpen(!deleteModalOpen);
        setRequirementIdToBeDeleted(requirementId);
    };
    const handleRequirementDelete = async () => {
        setIsDeleting(true);
        const resp = await deleteProgramRequirement(requirementIdToBeDeleted);
        const { success } = resp.data;
        if (!success) {
            alert('Failed!');
            setIsDeleting(false);
        } else {
            setProgramRequirementsState(
                programRequirementsState.filter(
                    (r) => r._id !== requirementIdToBeDeleted
                )
            );
            setRequirementIdToBeDeleted('');
            setIsDeleting(false);
            setDeleteModalOpen(false);
        }
    };
    return (
        <>
            <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
                sx={{ my: 1 }}
            >
                <Typography variant="h6">
                    {t('Program Analysis Collection', { ns: 'common' })}
                </Typography>
                <Box>
                    <Button
                        color="primary"
                        component={LinkDom}
                        sx={{ mr: 2 }}
                        to={`${DEMO.KEYWORDS_EDIT}`}
                        variant="outlined"
                    >
                        {t('Edit Keywords', { ns: 'common' })}
                    </Button>
                    <Button
                        color="primary"
                        component={LinkDom}
                        target="_blank"
                        to={`${DEMO.CREATE_NEW_PROGRAM_ANALYSIS}`}
                        variant="contained"
                    >
                        {t('Create New Analysis', { ns: 'common' })}
                    </Button>
                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="program table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>School</TableCell>
                            <TableCell>Program Name</TableCell>
                            <TableCell>Degree</TableCell>
                            <TableCell>Language</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {programRequirementsState?.map((item, index) => (
                            <React.Fragment key={item._id}>
                                <TableRow>
                                    <TableCell>
                                        <IconButton
                                            aria-label="expand row"
                                            onClick={() =>
                                                handleRowClick(index)
                                            }
                                            size="small"
                                        >
                                            {openRow === index ? (
                                                <KeyboardArrowUp />
                                            ) : (
                                                <KeyboardArrowDown />
                                            )}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        {item.programId[0].school}
                                    </TableCell>
                                    <TableCell>
                                        {item.programId[0].program_name}
                                    </TableCell>
                                    <TableCell>
                                        {item.programId[0].degree}
                                    </TableCell>
                                    <TableCell>
                                        {item.programId[0].lang}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() =>
                                                handleRequirementEdit(item._id)
                                            }
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() =>
                                                handleDeleteModal(item._id)
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>

                                {/* Collapsible row for program categories */}
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        style={{
                                            paddingBottom: 0,
                                            paddingTop: 0
                                        }}
                                    >
                                        <Collapse
                                            in={openRow === index}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <Box margin={2}>
                                                <Typography
                                                    gutterBottom
                                                    variant="h6"
                                                >
                                                    Program Categories
                                                </Typography>
                                                <Table
                                                    aria-label="program categories"
                                                    size="small"
                                                >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>
                                                                Category Name
                                                            </TableCell>
                                                            <TableCell>
                                                                Required ECTS
                                                            </TableCell>
                                                            <TableCell>
                                                                Keywords (EN)
                                                            </TableCell>
                                                            <TableCell>
                                                                Keywords (ZH)
                                                            </TableCell>
                                                            <TableCell>
                                                                Anti-Keywords
                                                                (EN)
                                                            </TableCell>
                                                            <TableCell>
                                                                Anti-Keywords
                                                                (ZH)
                                                            </TableCell>
                                                            <TableCell>
                                                                Description
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {item.program_categories.map(
                                                            (category) => (
                                                                <TableRow
                                                                    key={
                                                                        category._id
                                                                    }
                                                                >
                                                                    <TableCell>
                                                                        {
                                                                            category.program_category
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            category.requiredECTS
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {category.keywordSets?.map(
                                                                            (
                                                                                keywordSet
                                                                            ) =>
                                                                                keywordSet.keywords.en.join(
                                                                                    ', '
                                                                                )
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {category.keywordSets?.map(
                                                                            (
                                                                                keywordSet
                                                                            ) =>
                                                                                keywordSet.keywords.zh.join(
                                                                                    ', '
                                                                                )
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {category.keywordSets?.map(
                                                                            (
                                                                                keywordSet
                                                                            ) =>
                                                                                keywordSet.antiKeywords.en.join(
                                                                                    ', '
                                                                                )
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {category.keywordSets?.map(
                                                                            (
                                                                                keywordSet
                                                                            ) =>
                                                                                keywordSet.antiKeywords.zh.join(
                                                                                    ', '
                                                                                )
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {category.keywordSets?.map(
                                                                            (
                                                                                keywordSet,
                                                                                i
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        keywordSet.description
                                                                                    }
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                onClose={() => setDeleteModalOpen(false)}
                open={deleteModalOpen}
                size="small"
            >
                <DialogTitle>{t('Attention', { ns: 'common' })}</DialogTitle>
                <DialogContent>
                    <Typography id="modal-modal-description" sx={{ my: 2 }}>
                        {t('Do you want to delete')}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        disabled={isDeleting}
                        onClick={() => handleRequirementDelete()}
                        sx={{ mr: 1 }}
                        title="Undo"
                        variant="contained"
                    >
                        {isDeleting ? (
                            <CircularProgress size="small" />
                        ) : (
                            t('Confirm', { ns: 'common' })
                        )}
                    </Button>
                    <Button
                        color="secondary"
                        onClick={() => setDeleteModalOpen(false)}
                        title="Undo"
                        variant="outlined"
                    >
                        {t('Cancel', { ns: 'common' })}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProgramRequirementsOverview;

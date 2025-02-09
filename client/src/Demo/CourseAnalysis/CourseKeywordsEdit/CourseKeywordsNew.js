import React, { useState } from 'react';
import {
    Box,
    Breadcrumbs,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Link,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { Link as LinkDom, useNavigate } from 'react-router-dom';
import i18next from 'i18next';

import { postKeywordSet } from '../../../api';
import DEMO from '../../../store/constant';
import { appConfig } from '../../../config';

const EditCard = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState({
        categoryName: '',
        description: '',
        keywords: {
            zh: [],
            en: []
        },
        antiKeywords: {
            zh: [],
            en: []
        }
    });
    const [keywordsZH, setKeywordsZH] = useState('');
    const [antiKeywordsZH, setAntiKeywordsZH] = useState('');
    const [keywordsEN, setKeywordsEN] = useState('');
    const [antiKeywordsEN, setAntiKeywordsEN] = useState('');
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const handleAddCourseKeyword = (lang, keyword) => {
        if (selectedCategory.keywords[lang]?.includes(keywordsZH)) {
            setErrorMessage('This keyword already exists in the list.');
            setIsErrorDialogOpen(true); // Open error dialog
            return;
        }
        if (keyword.trim()) {
            setSelectedCategory((prevCategory) => ({
                ...prevCategory,
                keywords: {
                    ...prevCategory.keywords,
                    [lang]: [...(prevCategory.keywords[lang] || []), keyword]
                }
            }));
            if (lang === 'zh') {
                setKeywordsZH('');
            }
            if (lang === 'en') {
                setKeywordsEN('');
            }
        }
    };

    const handleAddCourseAntiKeyword = (lang, keyword) => {
        if (selectedCategory.antiKeywords[lang]?.includes(antiKeywordsZH)) {
            setErrorMessage('This keyword already exists in the list.');
            setIsErrorDialogOpen(true); // Open error dialog
            return;
        }
        if (keyword.trim()) {
            setSelectedCategory((prevCategory) => ({
                ...prevCategory,
                antiKeywords: {
                    ...prevCategory.antiKeywords,
                    [lang]: [
                        ...(prevCategory.antiKeywords[lang] || []),
                        keyword
                    ]
                }
            }));
            if (lang === 'zh') {
                setAntiKeywordsZH('');
            }
            if (lang === 'en') {
                setAntiKeywordsEN('');
            }
        }
    };

    const handleDeleteCourseKeyword = (lang, type, keywordToDelete) => {
        setSelectedCategory((prevCategory) => ({
            ...prevCategory,
            [type]: {
                ...prevCategory[type],
                [lang]: prevCategory[type][lang]?.filter(
                    (keyword) => keyword !== keywordToDelete
                )
            }
        }));
    };

    const handleCategoryNameAndDescription = (e) => {
        setSelectedCategory((prevCategory) => ({
            ...prevCategory,
            [e.target.id]: e.target.value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const resp = await postKeywordSet(selectedCategory);
        const { success } = resp.data;
        if (!success) {
            alert(resp.data?.message);
            return;
        }
        navigate(DEMO.KEYWORDS_EDIT);
    };
    const isDisabled =
        selectedCategory.description === '' ||
        selectedCategory.categoryName === '' ||
        selectedCategory.keywords.zh.length === 0 ||
        selectedCategory.antiKeywords.zh.length === 0 ||
        selectedCategory.keywords.en.length === 0 ||
        selectedCategory.antiKeywords.en.length === 0;
    return (
        <Box>
            <form onSubmit={(e) => handleSave(e)}>
                <div style={{ marginBottom: '16px' }}>
                    <Typography variant="body1">
                        {i18next.t('Category Name', { ns: 'common' })}:
                    </Typography>
                    <TextField
                        fullWidth
                        id="categoryName"
                        onChange={(e) => handleCategoryNameAndDescription(e)}
                        size="small"
                        value={selectedCategory.categoryName}
                        variant="outlined"
                    />
                </div>
                {/* Editable description */}
                <div style={{ marginBottom: '16px' }}>
                    <Typography color="textSecondary" variant="body2">
                        {i18next.t('Description', { ns: 'common' })}:
                    </Typography>
                    <TextField
                        fullWidth
                        id="description"
                        multiline
                        onChange={(e) => handleCategoryNameAndDescription(e)}
                        rows={3}
                        size="small"
                        value={selectedCategory.description}
                        variant="outlined"
                    />
                </div>
                <Box sx={{ width: '100%' }}>
                    {/* Add Keywords ZH */}
                    <Typography variant="body1">
                        {i18next.t('Course Keywords (ZH)', { ns: 'common' })}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Add course keyword here..."
                            onChange={(e) => {
                                e.preventDefault();
                                setKeywordsZH(e.target.value);
                            }}
                            size="small"
                            value={keywordsZH}
                            variant="outlined"
                        />
                        <Button
                            color="primary"
                            onClick={() =>
                                handleAddCourseKeyword('zh', keywordsZH)
                            }
                            size="small"
                            sx={{ ml: 2 }}
                            variant="contained"
                        >
                            + Add (ZH)
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedCategory?.keywords?.zh?.map(
                            (keyword, index) => (
                                <Chip
                                    color="primary"
                                    key={index}
                                    label={keyword}
                                    onDelete={() =>
                                        handleDeleteCourseKeyword(
                                            'zh',
                                            'keywords',
                                            keyword
                                        )
                                    }
                                />
                            )
                        )}
                    </Box>

                    {/* Add Anti-Keywords ZH */}
                    <Typography variant="body1">
                        {i18next.t('Anti-Keywords (ZH)', { ns: 'common' })}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Add course anti-keyword here..."
                            onChange={(e) => setAntiKeywordsZH(e.target.value)}
                            size="small"
                            value={antiKeywordsZH}
                            variant="outlined"
                        />
                        <Button
                            color="primary"
                            onClick={() =>
                                handleAddCourseAntiKeyword('zh', antiKeywordsZH)
                            }
                            size="small"
                            sx={{ ml: 2 }}
                            variant="contained"
                        >
                            + Add (ZH)
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedCategory?.antiKeywords?.zh?.map(
                            (keyword, index) => (
                                <Chip
                                    color="secondary"
                                    key={index}
                                    label={keyword}
                                    onDelete={() =>
                                        handleDeleteCourseKeyword(
                                            'zh',
                                            'antiKeywords',
                                            keyword
                                        )
                                    }
                                />
                            )
                        )}
                    </Box>
                    {/* Add Keywords EN */}
                    <Typography variant="body1">
                        {i18next.t('Course Keywords (EN)', { ns: 'common' })}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Add course keyword here..."
                            onChange={(e) => setKeywordsEN(e.target.value)}
                            size="small"
                            value={keywordsEN}
                            variant="outlined"
                        />
                        <Button
                            color="primary"
                            onClick={() =>
                                handleAddCourseKeyword('en', keywordsEN)
                            }
                            size="small"
                            sx={{ ml: 2 }}
                            variant="contained"
                        >
                            + Add (EN)
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedCategory?.keywords?.en?.map(
                            (keyword, index) => (
                                <Chip
                                    color="primary"
                                    key={index}
                                    label={keyword}
                                    onDelete={() =>
                                        handleDeleteCourseKeyword(
                                            'en',
                                            'keywords',
                                            keyword
                                        )
                                    }
                                />
                            )
                        )}
                    </Box>

                    {/* Add Anti-Keywords EN */}
                    <Typography variant="body1">
                        {i18next.t('Anti-Keywords (EN)', { ns: 'common' })}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Add course anti-keyword here..."
                            onChange={(e) => setAntiKeywordsEN(e.target.value)}
                            size="small"
                            value={antiKeywordsEN}
                            variant="outlined"
                        />
                        <Button
                            color="primary"
                            onClick={() =>
                                handleAddCourseAntiKeyword('en', antiKeywordsEN)
                            }
                            size="small"
                            sx={{ ml: 2 }}
                            variant="contained"
                        >
                            + Add (EN)
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            mb: 1
                        }}
                    >
                        {selectedCategory?.antiKeywords?.en?.map(
                            (keyword, index) => (
                                <Chip
                                    color="secondary"
                                    key={index}
                                    label={keyword}
                                    onDelete={() =>
                                        handleDeleteCourseKeyword(
                                            'en',
                                            'antiKeywords',
                                            keyword
                                        )
                                    }
                                />
                            )
                        )}
                    </Box>
                    <Box display="flex" gap={2} justifyContent="flex-end">
                        <Button
                            color="secondary"
                            component={LinkDom}
                            to={DEMO.KEYWORDS_EDIT}
                            variant="outlined"
                        >
                            {i18next.t('Cancel', { ns: 'common' })}
                        </Button>
                        <Button
                            color="primary"
                            disabled={isDisabled}
                            type="submit"
                            variant="contained"
                        >
                            {i18next.t('Create', { ns: 'common' })}
                        </Button>
                    </Box>
                </Box>
            </form>
            <Dialog
                aria-describedby="error-dialog-description"
                aria-labelledby="error-dialog-title"
                onClose={() => setIsErrorDialogOpen(false)}
                open={isErrorDialogOpen}
            >
                <DialogTitle id="error-dialog-title">
                    Duplicate Keyword
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="error-dialog-description">
                        {errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => setIsErrorDialogOpen(false)}
                    >
                        {i18next.t('OK', { ns: 'common' })}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const CourseKeywordsOverviewNew = () => {
    return (
        <Box data-testid="course-keywords-new-component">
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.DASHBOARD_LINK}`}
                    underline="hover"
                >
                    {appConfig.companyName}
                </Link>
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.PROGRAMS}`}
                    underline="hover"
                >
                    {i18next.t('Program List', { ns: 'common' })}
                </Link>
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.KEYWORDS_EDIT}`}
                    underline="hover"
                >
                    {i18next.t('Keywords', { ns: 'common' })}
                </Link>
                <Typography color="text.primary">
                    {i18next.t('Create', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <Box>
                <Typography variant="h6">
                    {i18next.t('Categories', { ns: 'common' })}
                </Typography>
            </Box>
            <Paper style={{ padding: 16 }}>
                <EditCard />
            </Paper>
        </Box>
    );
};

export default CourseKeywordsOverviewNew;

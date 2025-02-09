import React, { useMemo, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Drawer,
    Grid,
    IconButton,
    Paper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link as LinkDom } from 'react-router-dom';
import { deleteKeywordSet, putKeywordSet } from '../../../api';
import ExampleWithLocalizationProvider from '../../../components/MaterialReactTable';
import { col_keywords } from '../../../utils/contants';
import DEMO from '../../../store/constant';
import i18next from 'i18next';

const EditCard = (props) => {
    const [selectedCategory, setSelectedCategory] = useState(props.data);
    const [isEditMode, setIsEditMode] = useState(false);
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

    const handleEditClick = () => {
        setIsEditMode(!isEditMode);
    };

    const handleCancel = () => {
        setIsEditMode(!isEditMode);
        setSelectedCategory(props.data);
    };

    const handleSave = async () => {
        props.setCourseKeywordSetsState((prevState) => {
            // Check if the keywordSet object already exists in the state based on a unique key (e.g., id)
            const index = prevState.findIndex(
                (item) => item._id === selectedCategory._id
            );

            if (index !== -1) {
                // If found, update the existing object
                return prevState.map((item, i) =>
                    i === index
                        ? {
                              ...item,
                              ...selectedCategory,
                              keywords_zh:
                                  selectedCategory.keywords?.zh?.join(', '),
                              keywords_en:
                                  selectedCategory.keywords?.en?.join(', '),
                              antiKeywords_zh:
                                  selectedCategory.antiKeywords?.zh?.join(', '),
                              antiKeywords_en:
                                  selectedCategory.antiKeywords?.en?.join(', ')
                          }
                        : item
                );
            } else {
                // If not found, add the new object to the array
                return [
                    ...prevState,
                    {
                        ...selectedCategory,
                        keywords_zh: selectedCategory.keywords?.zh?.join(', '),
                        keywords_en: selectedCategory.keywords?.en?.join(', '),
                        antiKeywords_zh:
                            selectedCategory.antiKeywords?.zh?.join(', '),
                        antiKeywords_en:
                            selectedCategory.antiKeywords?.en?.join(', ')
                    }
                ];
            }
        });
        setIsEditMode(false);
        const resp = await putKeywordSet(
            selectedCategory._id,
            selectedCategory
        );
        const { success } = resp.data;
        if (!success) {
            console.log('warning');
        }
    };

    return isEditMode ? (
        <Box>
            <form onSubmit={(e) => handleSave(e)}>
                <div style={{ marginBottom: '16px' }}>
                    <Typography variant="h6">Category Name:</Typography>
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
                        Description:
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
                            onClick={handleCancel}
                            variant="outlined"
                        >
                            {i18next.t('Cancel', { ns: 'common' })}
                        </Button>
                        <Button
                            color="primary"
                            type="submit"
                            variant="contained"
                        >
                            {i18next.t('Update', { ns: 'common' })}
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
    ) : (
        <Box>
            <div style={{ marginBottom: '16px' }}>
                <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                    mb={2}
                >
                    <Typography variant="h6">
                        {i18next.t('Category Name', { ns: 'common' })}:
                    </Typography>
                    <IconButton onClick={handleEditClick} size="small">
                        <EditIcon />
                    </IconButton>
                </Box>
                <TextField
                    InputProps={{
                        readOnly: true
                    }}
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
                    InputProps={{
                        readOnly: true
                    }}
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedCategory?.keywords?.zh?.map((keyword, index) => (
                        <Chip color="primary" key={index} label={keyword} />
                    ))}
                </Box>
                {/* Add Anti-Keywords ZH */}
                <Typography variant="body1">
                    {i18next.t('Anti-Keywords (ZH)', { ns: 'common' })}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedCategory?.antiKeywords?.zh?.map(
                        (keyword, index) => (
                            <Chip
                                color="secondary"
                                key={index}
                                label={keyword}
                            />
                        )
                    )}
                </Box>
                {/* Add Keywords EN */}
                <Typography variant="body1">
                    {i18next.t('Course Keywords (EN)', { ns: 'common' })}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedCategory?.keywords?.en?.map((keyword, index) => (
                        <Chip color="primary" key={index} label={keyword} />
                    ))}
                </Box>
                {/* Add Anti-Keywords EN */}
                <Typography variant="body1">
                    {i18next.t('Anti-Keywords (EN)', { ns: 'common' })}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedCategory?.antiKeywords?.en?.map(
                        (keyword, index) => (
                            <Chip
                                color="secondary"
                                key={index}
                                label={keyword}
                            />
                        )
                    )}
                </Box>
            </Box>
        </Box>
    );
};

const CourseKeywordsOverview = ({ courseKeywordSets }) => {
    const [courseKeywordSetsState, setCourseKeywordSetsState] = useState(
        courseKeywordSets.map((courseKeywordSet) => ({
            ...courseKeywordSet,
            keywords_zh: courseKeywordSet.keywords?.zh?.join(', '),
            keywords_en: courseKeywordSet.keywords?.en?.join(', '),
            antiKeywords_zh: courseKeywordSet.antiKeywords?.zh?.join(', '),
            antiKeywords_en: courseKeywordSet.antiKeywords?.en?.join(', ')
        }))
    );
    const [itemToBeDeleted, setItemToBeDeleted] = useState({});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setRowSelection({});
    };

    const handleCategoryClick = (row) => {
        setRowSelection(row);
        setDrawerOpen(true); // Open the Drawer on small screens
    };

    const col = useMemo(() => col_keywords, [col_keywords]);

    const handleDelete = async (data) => {
        setIsDeleteDialogOpen(true);
        setItemToBeDeleted(data);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleteDialogOpen;
        setRowSelection({});
        setCourseKeywordSetsState((prevState) =>
            prevState.filter((item) => item._id !== itemToBeDeleted._id)
        );
        const resp = await deleteKeywordSet(itemToBeDeleted._id);
        if (!resp.success) {
            console.log('failed');
        }
        setIsDeleteDialogOpen(false);
        setItemToBeDeleted({});
    };

    const selectedARow =
        Object.keys(rowSelection) && Object.keys(rowSelection)[0];
    return (
        <Box>
            <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
            >
                <Typography variant="h6">Categories</Typography>
                <Box>
                    <Button
                        color="primary"
                        disabled={!selectedARow}
                        onClick={() =>
                            handleDelete(
                                courseKeywordSetsState[
                                    parseInt(Object.keys(rowSelection)[0])
                                ]
                            )
                        }
                        sx={{ mr: 1 }}
                        variant="outlined"
                    >
                        {i18next.t('Delete', { ns: 'common' })}
                    </Button>
                    <Button
                        color="primary"
                        component={LinkDom}
                        to={DEMO.KEYWORDS_NEW}
                        variant="contained"
                    >
                        {i18next.t('Create', { ns: 'common' })}
                    </Button>
                </Box>
            </Box>

            {/* Left sidebar */}
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid
                    item
                    md={selectedARow ? 7 : 12}
                    sx={{ overflowY: 'auto' }} // Left side scroll
                    xs={12}
                >
                    <ExampleWithLocalizationProvider
                        col={col}
                        data={courseKeywordSetsState}
                        enableMultiRowSelection={false}
                        enableRowSelection={true}
                        muiTableBodyRowProps={({ row }) => ({
                            //add onClick to row to select upon clicking anywhere in the row
                            onClick: row.getToggleSelectedHandler(),
                            sx: { cursor: 'pointer' }
                        })}
                        onRowSelectionChange={(e) => handleCategoryClick(e)}
                        rowSelection={rowSelection}
                    />
                </Grid>
                {/* Right content */}
                {/* Right side: Configuration panel */}
                {!isSmallScreen ? (
                    <Grid item md={5} sx={{ overflowY: 'auto' }} xs={12}>
                        <Paper style={{ padding: 16 }}>
                            {selectedARow ? (
                                <EditCard
                                    data={
                                        courseKeywordSetsState[
                                            parseInt(
                                                Object.keys(rowSelection)[0]
                                            )
                                        ]
                                    }
                                    setCourseKeywordSetsState={
                                        setCourseKeywordSetsState
                                    }
                                />
                            ) : null}
                        </Paper>
                    </Grid>
                ) : null}
            </Grid>
            {/* Drawer for small screens */}
            {isSmallScreen ? (
                <Drawer
                    anchor="right"
                    onClose={handleDrawerClose}
                    open={drawerOpen}
                >
                    <div style={{ width: 300, padding: 16 }}>
                        {Object.keys(rowSelection) &&
                        Object.keys(rowSelection)[0] ? (
                            <EditCard
                                data={
                                    courseKeywordSetsState[
                                        parseInt(Object.keys(rowSelection)[0])
                                    ]
                                }
                                setCourseKeywordSetsState={
                                    setCourseKeywordSetsState
                                }
                            />
                        ) : (
                            <Typography variant="h6">
                                Select a school to configure
                            </Typography>
                        )}
                        <Button
                            fullWidth
                            onClick={handleDrawerClose}
                            variant="contained"
                        >
                            {i18next.t('Close')}
                        </Button>
                    </div>
                </Drawer>
            ) : null}
            <Dialog
                aria-describedby="error-dialog-description"
                aria-labelledby="error-dialog-title"
                onClose={() => setIsDeleteDialogOpen(false)}
                open={isDeleteDialogOpen}
            >
                <DialogTitle id="error-dialog-title">
                    {i18next.t('Warning', { ns: 'common' })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="error-dialog-description">
                        {i18next.t('Do you want to delete')}
                        {/* TODO: show affected programs */}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => handleDeleteConfirm(false)}
                        variant="contained"
                    >
                        {i18next.t('Yes', { ns: 'common' })}
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => setIsDeleteDialogOpen(false)}
                        variant="outlined"
                    >
                        {i18next.t('Cancel', { ns: 'common' })}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CourseKeywordsOverview;

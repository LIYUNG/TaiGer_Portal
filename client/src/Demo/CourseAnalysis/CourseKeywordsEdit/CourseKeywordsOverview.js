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
import { useTranslation } from 'react-i18next';
import { Link as LinkDom } from 'react-router-dom';
import { deleteKeywordSet, putKeywordSet } from '../../../api';
import ExampleWithLocalizationProvider from '../../../components/MaterialReactTable';
import { col_keywords } from '../../Utils/contants';
import DEMO from '../../../store/constant';

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

  const { t } = useTranslation();

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleCategoryClick = (row) => {
    setRowSelection(row);
    if (isSmallScreen) {
      setDrawerOpen(true); // Open the Drawer on small screens
    }
  };

  const col = useMemo(() => col_keywords, [col_keywords]);

  const handleDelete = async (data) => {
    setIsDeleteDialogOpen(true);
    setItemToBeDeleted(data);
  };

  const handleDeleteConfirm = async () => {
    // TODO de-select!!
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
            [lang]: [...(prevCategory.antiKeywords[lang] || []), keyword]
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
                  keywords_zh: selectedCategory.keywords?.zh?.join(', '),
                  keywords_en: selectedCategory.keywords?.en?.join(', '),
                  antiKeywords_zh:
                    selectedCategory.antiKeywords?.zh?.join(', '),
                  antiKeywords_en: selectedCategory.antiKeywords?.en?.join(', ')
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
              antiKeywords_zh: selectedCategory.antiKeywords?.zh?.join(', '),
              antiKeywords_en: selectedCategory.antiKeywords?.en?.join(', ')
            }
          ];
        }
      });
      setIsEditMode(false);
      const resp = await putKeywordSet(selectedCategory._id, selectedCategory);
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
              value={selectedCategory.categoryName}
              onChange={(e) => handleCategoryNameAndDescription(e)}
              variant="outlined"
              fullWidth
              id="categoryName"
              size="small"
            />
          </div>

          {/* Editable description */}
          <div style={{ marginBottom: '16px' }}>
            <Typography variant="body2" color="textSecondary">
              Description:
            </Typography>
            <TextField
              value={selectedCategory.description}
              onChange={(e) => handleCategoryNameAndDescription(e)}
              variant="outlined"
              fullWidth
              id="description"
              multiline
              rows={3}
              size="small"
            />
          </div>
          <Box sx={{ width: '100%' }}>
            {/* Add Keywords ZH */}
            <Typography variant="body1">
              {t('Course Keywords (ZH)', { ns: 'common' })}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                label="Add course keyword here..."
                variant="outlined"
                value={keywordsZH}
                onChange={(e) => {
                  e.preventDefault();
                  setKeywordsZH(e.target.value);
                }}
                fullWidth
                size="small"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddCourseKeyword('zh', keywordsZH)}
                sx={{ ml: 2 }}
                size="small"
              >
                + Add (ZH)
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedCategory?.keywords?.zh?.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                  onDelete={() =>
                    handleDeleteCourseKeyword('zh', 'keywords', keyword)
                  }
                  color="primary"
                />
              ))}
            </Box>

            {/* Add Anti-Keywords ZH */}
            <Typography variant="body1">
              {t('Anti-Keywords (ZH)', { ns: 'common' })}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                label="Add course anti-keyword here..."
                variant="outlined"
                value={antiKeywordsZH}
                onChange={(e) => setAntiKeywordsZH(e.target.value)}
                fullWidth
                size="small"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddCourseAntiKeyword('zh', antiKeywordsZH)}
                sx={{ ml: 2 }}
                size="small"
              >
                + Add (ZH)
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedCategory?.antiKeywords?.zh?.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                  onDelete={() =>
                    handleDeleteCourseKeyword('zh', 'antiKeywords', keyword)
                  }
                  color="secondary"
                />
              ))}
            </Box>
            {/* Add Keywords EN */}
            <Typography variant="body1">
              {t('Course Keywords (EN)', { ns: 'common' })}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                label="Add course keyword here..."
                variant="outlined"
                value={keywordsEN}
                onChange={(e) => setKeywordsEN(e.target.value)}
                fullWidth
                size="small"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddCourseKeyword('en', keywordsEN)}
                sx={{ ml: 2 }}
                size="small"
              >
                + Add (EN)
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedCategory?.keywords?.en?.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                  onDelete={() =>
                    handleDeleteCourseKeyword('en', 'keywords', keyword)
                  }
                  color="primary"
                />
              ))}
            </Box>

            {/* Add Anti-Keywords EN */}
            <Typography variant="body1">
              {t('Anti-Keywords (EN)', { ns: 'common' })}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                label="Add course anti-keyword here..."
                variant="outlined"
                value={antiKeywordsEN}
                onChange={(e) => setAntiKeywordsEN(e.target.value)}
                fullWidth
                size="small"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddCourseAntiKeyword('en', antiKeywordsEN)}
                sx={{ ml: 2 }}
                size="small"
              >
                + Add (EN)
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {selectedCategory?.antiKeywords?.en?.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                  onDelete={() =>
                    handleDeleteCourseKeyword('en', 'antiKeywords', keyword)
                  }
                  color="secondary"
                />
              ))}
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                {t('Cancel', { ns: 'common' })}
              </Button>
              <Button variant="contained" color="primary" type="submit">
                {t('Update', { ns: 'common' })}
              </Button>
            </Box>
          </Box>
        </form>
        <Dialog
          open={isErrorDialogOpen}
          onClose={() => setIsErrorDialogOpen(false)}
          aria-labelledby="error-dialog-title"
          aria-describedby="error-dialog-description"
        >
          <DialogTitle id="error-dialog-title">Duplicate Keyword</DialogTitle>
          <DialogContent>
            <DialogContentText id="error-dialog-description">
              {errorMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsErrorDialogOpen(false)} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    ) : (
      <Box>
        <div style={{ marginBottom: '16px' }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Category Name:</Typography>
            <IconButton onClick={handleEditClick} size="small">
              <EditIcon />
            </IconButton>
          </Box>
          <TextField
            value={selectedCategory.categoryName}
            onChange={(e) => handleCategoryNameAndDescription(e)}
            variant="outlined"
            fullWidth
            id="categoryName"
            size="small"
            InputProps={{
              readOnly: true
            }}
          />
        </div>
        {/* Editable description */}
        <div style={{ marginBottom: '16px' }}>
          <Typography variant="body2" color="textSecondary">
            Description:
          </Typography>
          <TextField
            value={selectedCategory.description}
            onChange={(e) => handleCategoryNameAndDescription(e)}
            variant="outlined"
            fullWidth
            id="description"
            multiline
            rows={3}
            size="small"
            InputProps={{
              readOnly: true
            }}
          />
        </div>
        <Box sx={{ width: '100%' }}>
          {/* Add Keywords ZH */}
          <Typography variant="body1">
            {t('Course Keywords (ZH)', { ns: 'common' })}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedCategory?.keywords?.zh?.map((keyword, index) => (
              <Chip key={index} label={keyword} color="primary" />
            ))}
          </Box>
          {/* Add Anti-Keywords ZH */}
          <Typography variant="body1">
            {t('Anti-Keywords (ZH)', { ns: 'common' })}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedCategory?.antiKeywords?.zh?.map((keyword, index) => (
              <Chip key={index} label={keyword} color="secondary" />
            ))}
          </Box>
          {/* Add Keywords EN */}
          <Typography variant="body1">
            {t('Course Keywords (EN)', { ns: 'common' })}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedCategory?.keywords?.en?.map((keyword, index) => (
              <Chip key={index} label={keyword} color="primary" />
            ))}
          </Box>
          {/* Add Anti-Keywords EN */}
          <Typography variant="body1">
            {t('Anti-Keywords (EN)', { ns: 'common' })}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedCategory?.antiKeywords?.en?.map((keyword, index) => (
              <Chip key={index} label={keyword} color="secondary" />
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  const selectedARow =
    Object.keys(rowSelection) && Object.keys(rowSelection)[0];
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Categories</Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            disabled={!selectedARow}
            onClick={() =>
              handleDelete(
                courseKeywordSetsState[parseInt(Object.keys(rowSelection)[0])]
              )
            }
            sx={{ mr: 1 }}
          >
            {t('Delete', { ns: 'common' })}
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={LinkDom}
            to={DEMO.KEYWORDS_NEW}
          >
            {t('Create', { ns: 'common' })}
          </Button>
        </Box>
      </Box>

      {/* Left sidebar */}
      <Grid container spacing={2} sx={{ height: '100vh', mt: 1 }}>
        <Grid
          item
          xs={12}
          sx={{ overflowY: 'auto', maxHeight: '100vh' }} // Left side scroll
          md={selectedARow ? 7 : 12}
        >
          <ExampleWithLocalizationProvider
            data={courseKeywordSetsState}
            col={col}
            enableRowSelection={true}
            enableMultiRowSelection={false}
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
        {!isSmallScreen && (
          <Grid
            item
            xs={12}
            md={5}
            sx={{ overflowY: 'auto', maxHeight: '100vh' }}
          >
            <Paper style={{ padding: 16 }}>
              {selectedARow ? (
                <EditCard
                  data={
                    courseKeywordSetsState[
                      parseInt(Object.keys(rowSelection)[0])
                    ]
                  }
                  setCourseKeywordSetsState={setCourseKeywordSetsState}
                />
              ) : (
                <Typography variant="h6">
                  Select a keyword set to configure
                </Typography>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
      {/* Drawer for small screens */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <div style={{ width: 300, padding: 16 }}>
          {Object.keys(rowSelection) && Object.keys(rowSelection)[0] ? (
            <EditCard
              data={
                courseKeywordSetsState[parseInt(Object.keys(rowSelection)[0])]
              }
              setCourseKeywordSetsState={setCourseKeywordSetsState}
            />
          ) : (
            <Typography variant="h6">Select a school to configure</Typography>
          )}
          <Button onClick={handleDrawerClose} variant="contained" fullWidth>
            Close
          </Button>
        </div>
      </Drawer>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">Warning</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            {t('Do you want to delete?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteConfirm(false)} color="primary">
            Yes
          </Button>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseKeywordsOverview;

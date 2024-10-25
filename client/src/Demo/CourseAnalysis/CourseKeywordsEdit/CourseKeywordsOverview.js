import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { putKeywordSet } from '../../../api';

const CourseKeywordsOverview = ({ courseKeywordSets }) => {
  const [keywordsZH, setKeywordsZH] = useState('');
  const [antiKeywordsZH, setAntiKeywordsZH] = useState('');
  const [keywordsEN, setKeywordsEN] = useState('');
  const [antiKeywordsEN, setAntiKeywordsEN] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();

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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSaveKeywordSet = async (e) => {
    e.preventDefault();
    const resp = await putKeywordSet(selectedCategory._id, selectedCategory);
    const { success } = resp.data;
    if (!success) {
      console.log('warning');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Categories</Typography>
        <Button variant="contained" color="primary">
          Create New Analysis
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          height: window.innerHeight - 160,
          flexDirection: { xs: 'column', md: 'row' } // Responsive: column on small screens, row on medium and larger
        }}
      >
        {/* Left sidebar */}

        <Box
          sx={{
            minWidth: '290px',
            width: { xs: '100%', md: '25%' }, // Full width on small screens, 25% width on medium+
            borderRight: { md: '1px solid #ccc' }, // Add border only for medium and larger screens
            borderBottom: { xs: '1px solid #ccc', md: 'none' }, // Bottom border for mobile instead of right border
            overflowY: 'auto', // Makes the left sidebar scrollable
            maxHeight: { xs: '200px', md: 'none' } // Control height on mobile for scrolling
          }}
        >
          <List>
            {courseKeywordSets.map((keywordSet) => (
              <ListItem
                key={keywordSet.categoryName}
                sx={{ py: 0.5, px: 1 }} // Reduced vertical and horizontal padding
              >
                <ListItemButton
                  onClick={() => handleCategoryClick(keywordSet)}
                  sx={{ py: 0.5, px: 1 }} // Tighter padding for the button
                >
                  <ListItemText primary={keywordSet.categoryName} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        {/* Right content */}
        <Box
          sx={{
            p: 2,
            flexGrow: 1,
            overflowY: 'auto', // Makes the left sidebar scrollable
            maxHeight: { xs: '200px', md: 'none' } // Control height on mobile for scrolling
          }}
        >
          {selectedCategory ? (
            <form onSubmit={(e) => handleSaveKeywordSet(e)}>
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
                    onChange={(e) => setKeywordsZH(e.target.value)}
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
                    + Add Keywords (ZH)
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
                    onClick={() =>
                      handleAddCourseAntiKeyword('zh', antiKeywordsZH)
                    }
                    sx={{ ml: 2 }}
                    size="small"
                  >
                    + Add Anti-Keywords (ZH)
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
                    + Add Keywords (EN)
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
                    onClick={() =>
                      handleAddCourseAntiKeyword('en', antiKeywordsEN)
                    }
                    sx={{ ml: 2 }}
                    size="small"
                  >
                    + Add Anti-Keywords (EN)
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                <Box>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    {t('Save', { ns: 'common' })}
                  </Button>
                </Box>
              </Box>
            </form>
          ) : (
            <Typography variant="body1">
              Select a category to manage keywords.
            </Typography>
          )}
        </Box>
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
    </Box>
  );
};

export default CourseKeywordsOverview;

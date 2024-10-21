import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// TODO
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
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: window.innerHeight - 100,
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
        <Typography variant="h6">Categories</Typography>
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
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {selectedCategory ? (
          <>
            <Typography variant="h6">
              {selectedCategory.categoryName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {selectedCategory.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ width: '100%', p: 2 }}>
              {/* Add Keywords ZH */}
              <Typography variant="h6">
                {t('Course Keywords (ZH)', { ns: 'common' })}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Add course keyword here..."
                  variant="outlined"
                  value={keywordsZH}
                  onChange={(e) => setKeywordsZH(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddCourseKeyword('zh', keywordsZH)}
                  sx={{ ml: 2 }}
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
              <Typography variant="h6">
                {t('Anti-Keywords (ZH)', { ns: 'common' })}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Add course anti-keyword here..."
                  variant="outlined"
                  value={antiKeywordsZH}
                  onChange={(e) => setAntiKeywordsZH(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleAddCourseAntiKeyword('zh', antiKeywordsZH)
                  }
                  sx={{ ml: 2 }}
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
              <Typography variant="h6">
                {t('Course Keywords (EN)', { ns: 'common' })}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Add course keyword here..."
                  variant="outlined"
                  value={keywordsEN}
                  onChange={(e) => setKeywordsEN(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddCourseKeyword('en', keywordsEN)}
                  sx={{ ml: 2 }}
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
              <Typography variant="h6">
                {t('Anti-Keywords (EN)', { ns: 'common' })}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Add course anti-keyword here..."
                  variant="outlined"
                  value={antiKeywordsEN}
                  onChange={(e) => setAntiKeywordsEN(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleAddCourseAntiKeyword('en', antiKeywordsEN)
                  }
                  sx={{ ml: 2 }}
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
            </Box>
          </>
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
  );
};

export default CourseKeywordsOverview;

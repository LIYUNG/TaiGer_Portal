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
import { useTranslation } from 'react-i18next';
import { Link as LinkDom } from 'react-router-dom';
import { postKeywordSet } from '../../../api';
import DEMO from '../../../store/constant';
import { appConfig } from '../../../config';

const CourseKeywordsOverviewNew = () => {
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();

  const EditCard = (props) => {
    const [selectedCategory, setSelectedCategory] = useState(props.data);
    const [keywordsZH, setKeywordsZH] = useState('');
    const [antiKeywordsZH, setAntiKeywordsZH] = useState('');
    const [keywordsEN, setKeywordsEN] = useState('');
    const [antiKeywordsEN, setAntiKeywordsEN] = useState('');

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

    const handleSave = async () => {
      const resp = await postKeywordSet(selectedCategory._id, selectedCategory);
      const { success } = resp.data;
      if (!success) {
        console.log('warning');
      }
    };

    return (
      <Box>
        <form onSubmit={(e) => handleSave(e)}>
          <div style={{ marginBottom: '16px' }}>
            <Typography variant="h6">
              {t('Category Name', { ns: 'common' })}:
            </Typography>
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
              {t('Description', { ns: 'common' })}:
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
                component={LinkDom}
                to={DEMO.KEYWORDS_EDIT}
              >
                {t('Cancel', { ns: 'common' })}
              </Button>
              <Button variant="contained" color="primary" type="submit">
                {t('Update', { ns: 'common' })}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    );
  };

  return (
    <Box data-testid="course-keywords-new-component">
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.PROGRAMS}`}
        >
          {t('Program List', { ns: 'common' })}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.PROGRAMS}`}
        >
          {t('Keywords', { ns: 'common' })}
        </Link>
        <Typography color="text.primary">
          {t('New', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      <Box>
        <Typography variant="h6">
          {t('Categories', { ns: 'common' })}
        </Typography>
      </Box>
      <Paper style={{ padding: 16 }}>
        <EditCard data={{}} />
      </Paper>
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
            {t('OK', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseKeywordsOverviewNew;

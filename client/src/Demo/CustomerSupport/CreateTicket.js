import React, { useState } from 'react';
import { Link as LinkDom, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Box,
    Breadcrumbs,
    Link,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import { useTranslation } from 'react-i18next';
import { createComplaintTicket } from '../../api';
import { useAuth } from '../../components/AuthProvider';

const CreateComplaintTicket = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async () => {
        const response = await createComplaintTicket({
            requester_id: user?._id.toString(),
            title,
            description,
            category,
            status: 'open'
        });

        // TODO: error handling
        if (response.status === 201) {
            setDescription('');
            setTitle('');
            navigate(DEMO.CUSTOMER_CENTER_LINK);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        const { value } = e.target;
        setCategory(value);
    };

    return (
        <Box autoComplete="off" component="form" noValidate>
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
                    to={`${DEMO.CUSTOMER_CENTER_LINK}`}
                    underline="hover"
                >
                    {t('Customer Center', { ns: 'common' })}
                </Link>
                <Typography color="text.primary">
                    {t('Add Ticket', { ns: 'customerCenter' })}
                </Typography>
            </Breadcrumbs>
            <TextField
                fullWidth
                label="Describe your title"
                margin="normal"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                variant="outlined"
            />
            <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="select_category">
                    {t('Select Category', { ns: 'courses' })}
                </InputLabel>
                <Select
                    id="select_category"
                    label={t('Select Category', { ns: 'courses' })}
                    labelId="select_category"
                    name="select_category"
                    onChange={(e) => handleChange(e)}
                    value={category}
                >
                    <MenuItem value="">{t('Select Category')}</MenuItem>
                    <MenuItem value="agent">
                        {t('Report My Agent', { ns: 'common' })}
                    </MenuItem>
                    <MenuItem value="editor">
                        {t('Report My Editor', { ns: 'common' })}
                    </MenuItem>
                    <MenuItem value="essay_writer">
                        {t('Report My Essay Writer', { ns: 'common' })}
                    </MenuItem>
                    <MenuItem value="account">
                        Problem with My {appConfig.companyName} Account
                    </MenuItem>
                    <MenuItem value="others">
                        {t('Others', { ns: 'common' })}
                    </MenuItem>
                </Select>
            </FormControl>
            {category === 'account' ? <>Common Q&A</> : null}
            <TextField
                fullWidth
                label="Describe your situation"
                margin="normal"
                multiline
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                value={description}
                variant="outlined"
            />
            <Button
                color="primary"
                fullWidth
                onClick={handleSubmit}
                sx={{ mt: 2 }}
                variant="contained"
            >
                Submit
            </Button>
        </Box>
    );
};

export default CreateComplaintTicket;

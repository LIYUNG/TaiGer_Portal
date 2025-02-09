import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import DEMO from '../../../store/constant';
import { appConfig } from '../../../config';
import Footer from '../../../components/Footer/Footer';
import { Box, useTheme } from '@mui/material';

const Header = () => (
    <AppBar position="static">
        <Toolbar>
            <Typography sx={{ flexGrow: 1 }} variant="h6">
                TaiGer
            </Typography>
            <Button color="inherit" href="/login">
                Login
            </Button>
        </Toolbar>
    </AppBar>
);

const HeroSection = ({ logoLink }) => (
    <Container
        sx={{
            paddingY: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}
    >
        <img alt="Logo" src={logoLink} style={{ maxWidth: '100%' }} />
        <Typography
            align="center"
            color="textPrimary"
            component="h2"
            gutterBottom
            variant="h3"
        >
            Welcome to TaiGer Consultancy Portal
        </Typography>
        <Typography align="center" color="textSecondary" paragraph variant="h5">
            Your gateway to international education. We provide comprehensive
            support and resources to help you achieve your academic goals.
        </Typography>
        <Grid
            container
            justifyContent="center"
            spacing={2}
            sx={{ marginTop: 4 }}
        >
            <Grid item>
                <Button
                    color="primary"
                    href={DEMO.LOGIN_LINK}
                    variant="contained"
                >
                    Student Login
                </Button>
            </Grid>
            <Grid item>
                <Button
                    color="primary"
                    href={appConfig.companycompanyLandingPage}
                    variant="outlined"
                >
                    Learn More
                </Button>
            </Grid>
        </Grid>
    </Container>
);

const FeatureCard = ({ title, description }) => (
    <Grid item md={4} sm={6} xs={12}>
        <Paper
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: 2
            }}
        >
            <Typography component="h2" gutterBottom variant="h5">
                {title}
            </Typography>
            <Typography>{description}</Typography>
        </Paper>
    </Grid>
);

const FeaturesSection = () => (
    <Container sx={{ paddingTop: 8, paddingBottom: 8 }}>
        <Grid container spacing={4}>
            <FeatureCard
                description="We offer a range of services to help you succeed, from application assistance to visa support."
                title="Our Services"
            />
            <FeatureCard
                description="Hear from our successful students who have achieved their dreams with our support."
                title="Testimonials"
            />
            <FeatureCard
                description="Have questions? Get in touch with us and we will be happy to assist you."
                title="Contact Us"
            />
        </Grid>
    </Container>
);

const LandingPage = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const logoLink =
        mode === 'dark'
            ? `${appConfig.LoginPageDarkLogo}.svg`
            : `${appConfig.LoginPageLightLogo}.svg`;
    return (
        <Box>
            <Header />
            <main>
                <HeroSection logoLink={logoLink} />
                <FeaturesSection />
            </main>
            <Footer />
        </Box>
    );
};

export default LandingPage;

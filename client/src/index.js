import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { AuthProvider } from './components/AuthProvider/index';
import './index.css';
import i18n from './i18n';
import { CustomThemeProvider } from './components/ThemeProvider';
import { queryClient } from './api/client';
import { SnackBarProvider } from './contexts/use-snack-bar';

const storedLanguage = localStorage.getItem('locale') || 'en';
i18n.changeLanguage(storedLanguage);

const app = (
    <CustomThemeProvider>
        <I18nextProvider>
            <SnackBarProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <StrictMode>
                            <App />
                        </StrictMode>
                    </AuthProvider>
                </QueryClientProvider>
            </SnackBarProvider>
        </I18nextProvider>
    </CustomThemeProvider>
);

// Create a root.
const root = createRoot(document.getElementById('root'));

// Initial render
root.render(app);

// ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

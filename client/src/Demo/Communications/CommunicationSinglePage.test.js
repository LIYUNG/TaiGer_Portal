import 'react-i18next';

jest.mock('axios');
jest.mock('crypto');
jest.mock('../../api');
jest.mock('remark-gfm', () => () => {});

jest.mock('react-i18next', () => ({
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: { changeLanguage: () => new Promise(() => {}) }
        };
    },
    initReactI18next: { type: '3rdParty', init: () => {} }
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn()
}));

jest.mock('crypto', () => ({
    ...jest.requireActual('react-router-dom'),
    getRandomValues: jest.fn()
}));

jest.mock('../../components/AuthProvider');

class ResizeObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
}

describe('Communication page checking', () => {
    window.ResizeObserver = ResizeObserver;
    // TODO
    test('Communication page not crash', async () => {
        expect(1).toBe(1);
    });
});

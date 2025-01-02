import React, { createContext, useContext, useState } from 'react';

import {
    updateAcademicBackground,
    updateApplicationPreference,
    updateDocumentationHelperLink,
    updateLanguageSkill
} from '../../api/index';

const SurveyContext = createContext();

export const SurveyProvider = ({ children, value }) => {
    const [surveyState, setSurveyState] = useState(value);

    const handleChangeAcademic = (e) => {
        e.preventDefault();
        const university_temp = {
            ...surveyState.academic_background?.university
        };
        university_temp[e.target.name] = e.target.value;
        setSurveyState((prevState) => ({
            ...prevState,
            changed_academic: true,
            academic_background: {
                ...prevState.academic_background,
                university: university_temp
            }
        }));
    };

    const setApplicationPreference = (name, value) => {
        const application_preference_temp = {
            ...surveyState.application_preference
        };
        application_preference_temp[name] = value;
        setSurveyState((prevState) => ({
            ...prevState,
            changed_application_preference: true,
            application_preference: application_preference_temp
        }));
    };

    const handleChangeApplicationPreference = (e) => {
        e.preventDefault();
        setApplicationPreference(e.target.name, e.target.value);
    };

    const setApplicationPreferenceByField = (name) => {
        return (value) => {
            setApplicationPreference(name, value);
        };
    };

    const handleTestDate = (name, newValue) => {
        const language_temp = {
            ...surveyState.academic_background.language
        };
        language_temp[name] = newValue;
        setSurveyState((prevState) => ({
            ...prevState,
            changed_language: true,
            academic_background: {
                ...prevState.academic_background,
                language: language_temp
            }
        }));
    };

    const handleChangeLanguage = (e) => {
        e.preventDefault();
        const language_temp = {
            ...surveyState.academic_background.language
        };
        language_temp[e.target.name] = e.target.value;
        setSurveyState((prevState) => ({
            ...prevState,
            changed_language: true,
            academic_background: {
                ...prevState.academic_background,
                language: language_temp
            }
        }));
    };

    const handleAcademicBackgroundSubmit = (e, university) => {
        // e.preventDefault();
        updateAcademicBackground(university, surveyState.student_id).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setSurveyState((prevState) => ({
                        ...prevState,
                        changed_academic: false,
                        academic_background: {
                            ...prevState.academic_background,
                            university: data
                        },
                        success: success,
                        updateconfirmed: true,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setSurveyState((prevState) => ({
                        ...prevState,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setSurveyState((prevState) => ({
                    ...prevState,
                    error,
                    res_modal_status: 500,
                    res_modal_message: JSON.stringify(error)
                }));
            }
        );
    };

    const handleSurveyLanguageSubmit = (e, language) => {
        e.preventDefault();
        updateLanguageSkill(language, surveyState.student_id).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setSurveyState((prevState) => ({
                        ...prevState,
                        changed_language: false,
                        academic_background: {
                            ...prevState.academic_background,
                            language: data
                        },
                        success: success,
                        updateconfirmed: true,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setSurveyState((prevState) => ({
                        ...prevState,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setSurveyState((prevState) => ({
                    ...prevState,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const handleApplicationPreferenceSubmit = (e, application_preference) => {
        e.preventDefault();
        updateApplicationPreference(
            application_preference,
            surveyState.student_id
        ).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setSurveyState((prevState) => ({
                        ...prevState,
                        changed_application_preference: false,
                        application_preference: data,
                        success: success,
                        updateconfirmed: true,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setSurveyState((prevState) => ({
                        ...prevState,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setSurveyState((prevState) => ({
                    ...prevState,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const updateDocLink = (link, key) => {
        updateDocumentationHelperLink(link, key, 'survey').then(
            (resp) => {
                const { helper_link, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setSurveyState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        survey_link: helper_link[0]?.link,
                        success: success,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setSurveyState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setSurveyState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const onChangeURL = (e) => {
        e.preventDefault();
        const url_temp = e.target.value;
        setSurveyState((prevState) => ({
            ...prevState,
            survey_link: url_temp
        }));
    };

    const surveyData = {
        survey: surveyState,
        handleChangeAcademic,
        handleChangeApplicationPreference,
        setApplicationPreferenceByField,
        handleTestDate,
        handleChangeLanguage,
        handleAcademicBackgroundSubmit,
        handleSurveyLanguageSubmit,
        handleApplicationPreferenceSubmit,
        updateDocLink,
        onChangeURL
    };

    return (
        <SurveyContext.Provider value={surveyData}>
            {children}
        </SurveyContext.Provider>
    );
};

export const useSurvey = () => {
    return useContext(SurveyContext);
};

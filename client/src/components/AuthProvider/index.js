import React, { useEffect, createContext, useContext, useState } from 'react';

import { verify, logout } from '../../api/index';
import Loading from '../Loading/Loading';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [, forceUpdate] = useState();
    let [userdata, setUserdata] = useState({
        error: '',
        success: false,
        data: null,
        isLoaded: false,
        res_modal_message: '',
        res_modal_status: 0
    });

    useEffect(() => {
        verify().then(
            (resp) => {
                const { data, success } = resp.data;
                if (success) {
                    // TODO: to be remove in production
                    // setTimeout(function () {
                    setUserdata((state) => ({
                        ...state,
                        success: success,
                        data: data,
                        isLoaded: true
                    }));
                    setIsAuthenticated(true);
                    // }, 1000);
                } else {
                    // setTimeout(function () {
                    setUserdata((state) => ({
                        ...state,
                        data: null,
                        isLoaded: true
                    }));
                    // }, 1000);
                }
            },
            (error) => {
                setUserdata((state) => ({
                    ...state,
                    isLoaded: true,
                    error,
                    res_modal_status: 500
                }));
            }
        );
    }, []);

    const login = (data) => {
        setUserdata((state) => ({
            ...state,
            data: data
        }));
        setIsAuthenticated(true);
        // forceUpdate({});
    };

    const handleLogout = () => {
        logout().then(
            () => {
                setUserdata((state) => ({
                    ...state,
                    data: null
                }));
            },
            (error) => {
                setUserdata((state) => ({
                    ...state,
                    isLoaded: true,
                    error
                }));
            }
        );

        setIsAuthenticated(false);
        forceUpdate({});
    };

    const authData = {
        user: userdata.data,
        isAuthenticated,
        isLoaded: userdata.isLoaded,
        login,
        logout: handleLogout
    };

    if (!userdata.isLoaded) {
        return <Loading />;
    }

    return (
        <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

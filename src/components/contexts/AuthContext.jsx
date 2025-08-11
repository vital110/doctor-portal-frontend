import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        console.error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionExpiry, setSessionExpiry] = useState(null);

    const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minute

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const setupAutoLogoutWithTime = (timeRemaining) => {
        if (window.logoutTimer) {
            clearTimeout(window.logoutTimer);
        }

        window.logoutTimer = setTimeout(() => {
            logout();
            alert('Session expired. Please log in again.');
        }, timeRemaining);
    };

    const setupAutoLogout = () => {
        setupAutoLogoutWithTime(SESSION_TIMEOUT);
    };

    const checkAuthStatus = () => {
        try {
            const authData = localStorage.getItem('authData');
            const sessionExpiryData = localStorage.getItem('sessionExpiry');

            if (authData && sessionExpiryData) {
                const expiryTime = parseInt(sessionExpiryData);
                const currentTime = Date.now();

                if (currentTime < expiryTime) {
                    const userData = JSON.parse(authData);
                    setUser(userData);
                    setSessionExpiry(expiryTime);

                    const remainingTime = expiryTime - currentTime;
                    setupAutoLogoutWithTime(remainingTime);
                } else {
                    logout();
                }
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = (userData) => {
        const expiryTime = Date.now() + SESSION_TIMEOUT;

        localStorage.setItem('authData', JSON.stringify(userData));
        localStorage.setItem('sessionExpiry', expiryTime.toString());

        setUser(userData);
        setSessionExpiry(expiryTime);

        setupAutoLogout();
    };

    const logout = () => {
        localStorage.removeItem('authData');
        localStorage.removeItem('sessionExpiry');
        setUser(null);
        setSessionExpiry(null);

        if (window.logoutTimer) {
            clearTimeout(window.logoutTimer);
        }
    };

    const extendSession = () => {
        if (user) {
            const newExpiryTime = Date.now() + SESSION_TIMEOUT;
            localStorage.setItem('sessionExpiry', newExpiryTime.toString());
            setSessionExpiry(newExpiryTime);
            setupAutoLogout();
        }
    };

    const isAuthenticated = () => {
        return user !== null && sessionExpiry && Date.now() < sessionExpiry;
    };

    const value = {
        user,
        loading,
        login,
        logout,
        extendSession,
        isAuthenticated: isAuthenticated()
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

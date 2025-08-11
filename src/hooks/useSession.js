import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useSession = () => {
    const { user, extendSession } = useAuth();
    const { lastActivity, setLastActivity } = useState(Date.now());

    useEffect(() => {
        if (!user) return;

        const handleActivity = () => {
            const now = Date.now();
            //Extend session every 5 minutes of inactivity
            if (now - lastActivity > 5 * 60 * 1000) {
                extendSession();
                setLastActivity(now);
            }
        };
        //trck user activity
        const event = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        event.forEach(event => {
            document.addEventListener(event, handleActivity, true);
        });
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity, true);
            });
        };
    }, [user, lastActivity, extendSession, setLastActivity]);
    return { lastActivity };
};
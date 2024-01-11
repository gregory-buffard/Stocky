import {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const checkAuth = () => {
            if (token) {
                const decoded: any = jwtDecode(token);
                const expired = decoded.exp * 1000 < Date.now();

                if (expired) {
                    localStorage.removeItem('authToken');
                    setIsAuthenticated(false);
                } else setIsAuthenticated(true)
            } else setIsAuthenticated(false)
        };

        checkAuth();

        const interval = setInterval(() => {
            checkAuth();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return isAuthenticated
};
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = sessionStorage.getItem('token');
        const email = sessionStorage.getItem('email');
        const name = sessionStorage.getItem('name');
        return token ? { token, email, name } : null;
    });

    const navigate = useNavigate();

    const login = async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password });
        const { token, name } = res.data;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('name', name);
        setUser({ token, email, name });
        navigate('/dashboard');
    };

    const register = async (name, email, password) => {
        const res = await api.post('/api/auth/register',
            { name, email, password });
        const { token } = res.data;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('name', name);
        setUser({ token, email, name });
        navigate('/dashboard');
    };

    const logout = () => {
        sessionStorage.clear();
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
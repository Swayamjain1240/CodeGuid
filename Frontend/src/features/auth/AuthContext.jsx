import {authApi} from "../../api/authApi.js"
import React , { Children, createContext, useEffect, useState } from "react"

export const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const data = await authApi.getCurrentUser();

            setUser(data?.user || data || null);
        } catch {
            setUser(null);
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchUser();
    },[]);


    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout error:", error);
        }finally{
            setUser(null);
            window.location.href= "/login"
        }
    };

    return (
        <AuthContext.Provider value={{user, logout, loading, refreshUser: fetchUser , isAuthenticated:Boolean(user) }}>
            {children}
        </AuthContext.Provider>
    );
}
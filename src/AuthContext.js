import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './config/supabase';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
        setUser(data.user ?? null);
        setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
    });
    return () => sub.subscription?.unsubscribe();
    }, []);

    const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

    const signUp = (email, password) =>
    supabase.auth.signUp({ email, password });

    const signOut = () => supabase.auth.signOut();

    return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
        {children}
    </AuthContext.Provider>
    );
}

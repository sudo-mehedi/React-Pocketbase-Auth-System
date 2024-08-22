import React, { createContext, useState, useEffect, useContext } from 'react';
import PocketBase from 'pocketbase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const pb = new PocketBase('https://login-test.pockethost.io'); // Replace with your PocketBase URL

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = pb.authStore.model;
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      setUser(authData.record);
      return authData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email, password, passwordConfirm) => {
    try {
      const user = await pb.collection('users').create({
        email,
        password,
        passwordConfirm
      });
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
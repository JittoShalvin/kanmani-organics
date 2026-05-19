import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import api from './api';
import type { UserData } from './types/index';
import { ConfirmProvider } from './context/ConfirmContext';

// Components & Pages
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectForm from './pages/ProjectForm';
import AdminProfile from './pages/AdminProfile';
import CmsSettings from './pages/CmsSettings';
import AboutSettings from './pages/AboutSettings';
import Messages from './pages/Messages';
import ProductsList from './pages/ProductsList';
import FooterSettings from './pages/FooterSettings';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [user, setUser] = useState<UserData | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    console.log('App: Initializing with token:', token ? 'Yes' : 'No');
    if (token) {
      fetchProfile();
    } else {
      setInitializing(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      console.log('App: Fetching profile...');
      const res = await api.get('/admin/profile');
      console.log('App: Profile fetched:', res.data);
      setUser(res.data);
    } catch (err) {
      console.error('App: Profile fetch failed:', err);
      logout();
    } finally {
      setInitializing(false);
    }
  };

  const setAuth = (newToken: string, newUser: UserData) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setUser(null);
    setInitializing(false);
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-primary font-bold animate-pulse">Initializing Portal...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    console.log('App: Rendering Login');
    return (
      <ConfirmProvider>
        <Login setAuth={setAuth} />
      </ConfirmProvider>
    );
  }

  console.log('App: Rendering Main Layout');
  return (
    <ConfirmProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background flex">
          <Sidebar user={user} logout={logout} />
          
          <main className="flex-1 lg:ml-72 min-h-screen relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

            <div className="p-6 lg:p-12 pb-24 lg:pb-12 max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add" element={<ProjectForm />} />
                <Route path="/edit/:id" element={<ProjectForm isEdit />} />
                <Route path="/profile" element={<AdminProfile user={user} refreshUser={fetchProfile} />} />
                <Route path="/content" element={<CmsSettings />} />
                <Route path="/products" element={<ProductsList />} />
                <Route path="/about" element={<AboutSettings />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/footer" element={<FooterSettings />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </ConfirmProvider>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Loader2 } from 'lucide-react';
import api from '../api';
import type { UserData } from '../types/index';

interface LoginProps {
  setAuth: (token: string, user: UserData) => void;
}

const Login: React.FC<LoginProps> = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/login', { username, password });
      setAuth(res.data.token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative z-10 border border-white/40"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-12 hover:rotate-0 transition-transform duration-500">
             <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center text-white font-black text-2xl">K</div>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Admin Portal</h1>
          <p className="text-white/70 font-medium tracking-wide">Enter credentials to manage inventory</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-destructive/20 border border-destructive/30 text-white p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-2 h-2 bg-destructive rounded-full animate-ping" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-white/60 uppercase tracking-[0.2em] ml-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/10 border border-white/20 p-5 rounded-2xl text-white outline-none focus:ring-4 focus:ring-white/10 focus:border-white/40 transition-all font-bold placeholder:text-white/30"
              placeholder="admin"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-white/60 uppercase tracking-[0.2em] ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 p-5 rounded-2xl text-white outline-none focus:ring-4 focus:ring-white/10 focus:border-white/40 transition-all font-bold placeholder:text-white/30"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-3d bg-white text-primary p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 disabled:scale-100 mt-4 active:scale-95 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogOut size={20} className="rotate-180" />
                <span>Sign In Securely</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;

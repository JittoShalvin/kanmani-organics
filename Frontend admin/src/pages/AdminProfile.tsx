import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Save, ChevronRight, Loader2, PlusCircle } from 'lucide-react';
import api from '../api';
import type { UserData } from '../types/index';
import { useConfirm } from '../context/ConfirmContext';

interface AdminProfileProps {
  user: UserData;
  refreshUser: () => void;
}

const AdminProfile: React.FC<AdminProfileProps> = ({ user, refreshUser }) => {
  const { alert } = useConfirm();
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    name: user.name,
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    name: '',
    password: ''
  });
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await api.put('/admin/profile', formData);
      setSuccess(true);
      refreshUser();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      alert('Update failed', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/admin/register', newAdmin);
      setCreateSuccess(true);
      setNewAdmin({ username: '', email: '', name: '', password: '' });
      setTimeout(() => setCreateSuccess(false), 5000);
    } catch (err) {
      alert('Failed to create admin', { type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto space-y-12 pb-20"
    >
       <div className="bg-white rounded-[3rem] shadow-depth border border-border overflow-hidden">
        <div className="bg-gradient-hero p-12 text-white flex items-center gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
           <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl shadow-xl border border-white/30 animate-float relative z-10">
              <User size={40} />
           </div>
           <div className="relative z-10">
              <h1 className="text-4xl font-black mb-2 tracking-tight">Admin Profile</h1>
              <p className="text-white/80 font-medium text-lg">Manage your identity and security settings</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Full Name</label>
                 <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border border-border bg-muted/20 outline-none focus:ring-4 focus:ring-primary/10 font-bold" />
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Username</label>
                 <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full p-5 rounded-[1.5rem] border border-border bg-muted/20 outline-none focus:ring-4 focus:ring-primary/10 font-bold" />
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-5 rounded-[1.5rem] border border-border bg-muted/20 outline-none focus:ring-4 focus:ring-primary/10 font-bold" />
           </div>

           <div className="space-y-3">
              <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">New Password</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-5 rounded-[1.5rem] border border-border bg-muted/20 outline-none focus:ring-4 focus:ring-primary/10 font-bold" placeholder="Leave blank to keep current" />
              <div className="bg-secondary/50 p-4 rounded-xl flex items-start gap-3 mt-2">
                 <Settings size={16} className="text-primary mt-0.5 shrink-0" />
                 <p className="text-xs font-medium text-muted-foreground leading-relaxed">For security, use a combination of symbols, numbers, and capital letters. Password must be at least 8 characters.</p>
              </div>
           </div>

           {success && (
              <motion.div 
                initial={{opacity:0, y:20}} 
                animate={{opacity:1, y:0}} 
                className="bg-primary/10 text-primary p-5 rounded-2xl text-center font-black border border-primary/20 flex items-center justify-center gap-3"
              >
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                  <ChevronRight size={18} />
                </div>
                Profile Synchronized Successfully!
              </motion.div>
           )}

           <button type="submit" disabled={loading} className="w-full btn-3d bg-gradient-hero text-white font-black py-6 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl text-lg hover:scale-[1.02] active:scale-95 transition-all">
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <Save size={24} />
                  <span>Update Profile Credentials</span>
                </>
              )}
           </button>
        </form>
      </div>

      {/* Create User Section */}
      <div className="bg-white rounded-[3rem] shadow-depth border border-border overflow-hidden">
        <div className="bg-accent p-10 text-white flex items-center gap-6">
           <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <PlusCircle size={32} />
           </div>
           <div>
              <h2 className="text-2xl font-black tracking-tight">Create New Administrator</h2>
              <p className="text-white/80 font-medium">Provision a new account for your team</p>
           </div>
        </div>

        <form onSubmit={handleCreateAdmin} className="p-12 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">New Full Name</label>
                 <input 
                    type="text" 
                    required
                    value={newAdmin.name} 
                    onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} 
                    className="w-full p-4 rounded-xl border border-border bg-muted/10 focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-bold" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">New Username</label>
                 <input 
                    type="text" 
                    required
                    value={newAdmin.username} 
                    onChange={e => setNewAdmin({...newAdmin, username: e.target.value})} 
                    className="w-full p-4 rounded-xl border border-border bg-muted/10 focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-bold" 
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                 <input 
                    type="email" 
                    required
                    value={newAdmin.email} 
                    onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} 
                    className="w-full p-4 rounded-xl border border-border bg-muted/10 focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-bold" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Initial Password</label>
                 <input 
                    type="password" 
                    required
                    value={newAdmin.password} 
                    onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} 
                    className="w-full p-4 rounded-xl border border-border bg-muted/10 focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-bold" 
                 />
              </div>
           </div>

           {createSuccess && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-accent font-bold text-center py-2">
                 Account Created Successfully!
              </motion.div>
           )}

           <button 
              type="submit" 
              disabled={creating} 
              className="w-full py-5 bg-accent text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
           >
              {creating ? <Loader2 className="animate-spin" /> : 'Register New Administrator'}
           </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminProfile;

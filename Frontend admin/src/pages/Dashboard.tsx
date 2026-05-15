import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Package,
  Loader2,
  Leaf,
  Sprout,
  Grid,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Settings,
  Phone
} from 'lucide-react';
import api from '../api';
import type { Project } from '../types/index';

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchMessages();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const stats = [
    { label: 'Total Products', value: projects.length, icon: Package, color: 'bg-primary', description: 'Active items in store' },
    { label: 'Categories', value: new Set(projects.map(p => p.category)).size, icon: Grid, color: 'bg-accent', description: 'Product groups' },
    { label: 'Total Inquiries', value: messages.length, icon: MessageSquare, color: 'bg-primary', description: 'Customer messages' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-foreground tracking-tight mb-3">
            Admin <span className="text-primary underline decoration-accent/30 decoration-8 underline-offset-8">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium">Overview of your organic empire's performance</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/messages')}
            className="p-4 bg-white border border-border rounded-2xl shadow-sm hover:border-primary/30 transition-all text-primary"
            title="Messages"
          >
            <MessageSquare size={24} />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="p-4 bg-white border border-border rounded-2xl shadow-sm hover:border-primary/30 transition-all text-primary"
            title="Settings"
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="glass p-8 rounded-[2.5rem] shadow-depth border border-white/50 flex items-center gap-6 group hover:border-primary/20 transition-all cursor-default"
          >
            <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <stat.icon size={32} />
            </div>
            <div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-4xl font-black text-foreground my-1">{stat.value}</p>
              <p className="text-[10px] font-bold text-muted-foreground/60">{stat.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Inquiries Quick View */}
        <div className="xl:col-span-2 glass p-10 rounded-[3rem] border border-primary/20 shadow-depth bg-primary/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
                <MessageSquare size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">Recent Inquiries</h2>
                <p className="text-sm text-muted-foreground font-medium">Latest messages from customers</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/messages')}
              className="text-xs font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm"
            >
              Inbox <ExternalLink size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                 <Loader2 className="mx-auto text-primary/20 animate-spin mb-4" size={40} />
                 <p className="text-muted-foreground font-bold">No messages yet...</p>
              </div>
            ) : (
              messages.slice(0, 4).map((msg) => (
                <div 
                  key={msg._id}
                  onClick={() => navigate('/messages')}
                  className="bg-white/60 hover:bg-white p-6 rounded-[1.5rem] border border-border/50 hover:border-primary/30 transition-all cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-primary font-black text-xl shadow-sm">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-black text-foreground group-hover:text-primary transition-colors">{msg.name}</p>
                        {!msg.read && <span className="px-2 py-0.5 bg-accent text-white text-[8px] font-black uppercase rounded-full">New</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        {msg.phone && msg.phone.trim() !== "" && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md">
                            <Phone size={10} />
                            {msg.phone}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground font-medium italic">"{msg.message}"</p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-8">
          <div className="glass p-10 rounded-[3rem] border border-accent/20 shadow-depth bg-accent/5 flex flex-col justify-center text-center space-y-8 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all" />
            
            <div className="w-20 h-20 bg-accent rounded-[2rem] flex items-center justify-center text-white shadow-2xl mx-auto leaf-rotate relative z-10">
                <Leaf size={40} />
            </div>
            <div className="relative z-10">
                <h3 className="text-3xl font-black text-foreground">Premium CMS</h3>
                <p className="text-base text-muted-foreground font-medium mt-3 leading-relaxed">Your organic inventory is ready for expansion. Grow your catalog today.</p>
            </div>
            <div className="space-y-3 relative z-10">
              <button 
                onClick={() => navigate('/add')}
                className="w-full py-5 bg-accent text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <PlusCircle size={18} /> Add Product
              </button>
              <button 
                onClick={() => navigate('/products')}
                className="w-full py-5 bg-white border border-accent/20 text-accent font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-accent/10 transition-all shadow-sm flex items-center justify-center gap-3"
              >
                <TrendingUp size={18} /> View Inventory
              </button>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-border shadow-depth bg-white/50 space-y-4">
             <div className="flex items-center gap-3 text-primary">
                <Sprout size={20} />
                <h4 className="font-black text-xs uppercase tracking-widest">Growth Tip</h4>
             </div>
             <p className="text-sm text-muted-foreground font-medium italic">"Keep your product titles short and descriptive to improve customer engagement on mobile devices."</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Trash2, CheckCircle, Clock, User, MessageSquare, Loader2, Search, Filter, AlertCircle } from 'lucide-react';
import api from '../api';
import { useConfirm } from '../context/ConfirmContext';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const Messages = () => {
  const { confirm, alert } = useConfirm();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/messages/${id}/read`);
      setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      alert('Failed to update message status', { type: 'error' });
    }
  };

  const deleteMessage = async (id: string) => {
    const isConfirmed = await confirm('Are you sure you want to delete this message?');
    if (!isConfirmed) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m._id !== id));
    } catch (err) {
      alert('Failed to delete message', { type: 'error' });
    }
  };

  const filteredMessages = messages
    .filter(m => {
      if (filter === 'unread') return !m.read;
      if (filter === 'read') return m.read;
      return true;
    })
    .filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.phone && m.phone.includes(searchQuery))
    );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-foreground tracking-tight mb-3">
            Inquiry <span className="text-primary underline decoration-accent/30 decoration-8 underline-offset-8">Messages</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium">Manage and respond to customer inquiries</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-depth border border-border">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold">
             <MessageSquare size={20} />
             <span>{messages.filter(m => !m.read).length} New</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-border rounded-2xl font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border border-border shadow-sm">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f 
                ? 'bg-primary text-white shadow-lg' 
                : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6 text-primary">
          <Loader2 className="animate-spin" size={64} />
          <p className="text-xl font-bold animate-pulse">Fetching Messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-40 glass rounded-[3rem] border-dashed border-2 border-primary/20">
          <Mail size={80} className="mx-auto text-primary/20 mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No messages found</h2>
          <p className="text-muted-foreground">Your inbox is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMessages.map((msg) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key={msg._id}
                className={`glass p-8 rounded-[2.5rem] border transition-all hover:shadow-xl group ${
                  msg.read ? 'border-border bg-white/50' : 'border-primary/30 bg-primary/5 shadow-depth'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-border">
                        <User size={18} className="text-primary" />
                        <span className="font-black text-foreground">{msg.name}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-border">
                        <Mail size={18} className="text-primary" />
                        <span className="font-bold text-muted-foreground">{msg.email}</span>
                      </div>
                      {msg.phone && msg.phone.trim() !== "" && (
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-border">
                          <Phone size={18} className="text-primary" />
                          <span className="font-bold text-muted-foreground">{msg.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-border">
                        <Clock size={18} className="text-primary" />
                        <span className="font-bold text-muted-foreground">{formatDate(msg.createdAt)}</span>
                      </div>
                      {!msg.read && (
                        <span className="px-4 py-2 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg animate-pulse">
                          New Message
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                      <p className="text-lg font-medium text-foreground leading-relaxed pl-4 italic">
                        "{msg.message}"
                      </p>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-3 justify-center md:justify-start">
                    {!msg.read && (
                      <button
                        onClick={() => markAsRead(msg._id)}
                        className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
                        title="Mark as Read"
                      >
                        <CheckCircle size={24} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="w-14 h-14 bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl flex items-center justify-center hover:bg-destructive hover:text-white transition-all active:scale-95 shadow-sm"
                      title="Delete Message"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed bottom-10 right-10 bg-primary text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold z-50"
        >
          <CheckCircle size={24} />
          <span>Status Updated!</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Messages;

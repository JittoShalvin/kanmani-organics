import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Loader2, 
  CheckCircle, 
  Share2,
  Pencil,
  X,
  Globe,
  Camera,
  Video
} from 'lucide-react';
import api from '../api';

const FooterSettings = () => {
    const [settings, setSettings] = useState({
        facebook_url: '',
        instagram_url: '',
        youtube_url: '',
        footer_copyright: '© 2024 Kanmani Organics. All rights reserved.',
        footer_tagline: 'Authentic Organic Goodness'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            if (Object.keys(res.data).length > 0) {
                setSettings(prev => ({
                    ...prev,
                    ...res.data
                }));
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const keysToSave = ['facebook_url', 'instagram_url', 'youtube_url', 'footer_copyright', 'footer_tagline'];
            for (const key of keysToSave) {
                await api.put('/settings', { key, value: (settings as any)[key] });
            }
            setIsEditing(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            alert('Failed to save social links');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-40">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-foreground tracking-tight mb-3">
                        Footer <span className="text-primary underline decoration-accent/30 decoration-8 underline-offset-8">Links</span>
                    </h1>
                    <p className="text-muted-foreground text-xl font-medium text-balance max-w-2xl">
                        Manage your social media presence and footer information.
                    </p>
                </div>
            </header>

            <div className="glass p-10 rounded-[3rem] border border-primary/20 shadow-depth bg-primary/5">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-primary/10">
                    <div className="flex items-center gap-4 text-primary">
                        <Share2 size={24} />
                        <h2 className="text-xl font-black uppercase tracking-widest">Social Media Connections</h2>
                    </div>
                    <div className="flex gap-3">
                        {isEditing && (
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                {saving ? 'Saving...' : 'Save Links'}
                            </button>
                        )}
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isEditing ? 'bg-destructive/10 text-destructive' : 'bg-white text-muted-foreground shadow-sm hover:border-primary/30'}`}
                        >
                            {isEditing ? <X size={14} /> : <Pencil size={14} />}
                            {isEditing ? 'Cancel' : 'Edit Section'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Facebook URL</label>
                            <div className="relative group">
                                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={settings.facebook_url}
                                    onChange={e => setSettings({ ...settings, facebook_url: e.target.value })}
                                    className={`w-full p-5 pl-14 rounded-2xl border outline-none transition-all font-bold ${isEditing ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                    placeholder="https://facebook.com/your-page"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Instagram URL</label>
                            <div className="relative group">
                                <Camera className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={settings.instagram_url}
                                    onChange={e => setSettings({ ...settings, instagram_url: e.target.value })}
                                    className={`w-full p-5 pl-14 rounded-2xl border outline-none transition-all font-bold ${isEditing ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                    placeholder="https://instagram.com/your-profile"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">YouTube URL</label>
                            <div className="relative group">
                                <Video className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={settings.youtube_url}
                                    onChange={e => setSettings({ ...settings, youtube_url: e.target.value })}
                                    className={`w-full p-5 pl-14 rounded-2xl border outline-none transition-all font-bold ${isEditing ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                    placeholder="https://youtube.com/@your-channel"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Footer Tagline</label>
                            <div className="relative group">
                                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={settings.footer_tagline}
                                    onChange={e => setSettings({ ...settings, footer_tagline: e.target.value })}
                                    className={`w-full p-5 pl-14 rounded-2xl border outline-none transition-all font-bold ${isEditing ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                    placeholder="Authentic Organic Goodness"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Copyright Text</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">©</div>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={settings.footer_copyright}
                                    onChange={e => setSettings({ ...settings, footer_copyright: e.target.value })}
                                    className={`w-full p-5 pl-14 rounded-2xl border outline-none transition-all font-bold ${isEditing ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                    placeholder="© 2024 Kanmani Organics. All rights reserved."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {success && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="fixed bottom-10 right-10 bg-primary text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold z-50"
                >
                    <CheckCircle size={24} />
                    <span>Links Updated Successfully!</span>
                </motion.div>
            )}
        </motion.div>
    );
};

export default FooterSettings;

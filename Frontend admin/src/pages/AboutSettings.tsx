import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, CheckCircle, Info, Heart, Leaf, Truck, Award, Phone, Mail, MapPin, Pencil, Lock, Unlock, X } from 'lucide-react';
import api from '../api';

const AboutSettings = () => {
    const [settings, setSettings] = useState({
        about_title: 'Tradition Meets Purity',
        about_description_1: 'At Kanmani Organics, we specialize in cold-pressed organic oils and traditional puttu products. Our commitment is to deliver authentic, chemical-free products that honor traditional methods while ensuring the highest quality standards.',
        about_description_2: 'We source only the finest organic ingredients and use time-tested extraction and preparation methods. Every bottle and package reflects our dedication to purity, health, and the authentic flavors you remember.',
        about_feature_1_title: '100% Organic',
        about_feature_1_desc: 'Grown without synthetic pesticides or fertilizers',
        about_feature_2_title: 'Health First',
        about_feature_2_desc: 'Nutrient-rich produce for your wellbeing',
        about_feature_3_title: 'Traditional Methods',
        about_feature_3_desc: 'Time-tested extraction and preparation techniques',
        about_feature_4_title: 'Certified Quality',
        about_feature_4_desc: 'Organic certification and quality assured',
        contact_phone: '+91 98765 43210',
        contact_email: 'hello@kanmaniorganics.com',
        contact_address: '123 Organic Farm Road, Green Valley, Tamil Nadu 600001',
        contact_title: 'Contact Us',
        contact_subtitle: "Have questions? We'd love to hear from you",
        contact_badge: 'Get In Touch'
    });

    const [editStates, setEditStates] = useState({
        main: false,
        features: false,
        contact: false
    });

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

    const handleSaveSection = async (section: 'main' | 'features' | 'contact') => {
        setSaving(true);
        try {
            let keysToSave: string[] = [];
            if (section === 'main') {
                keysToSave = ['about_title', 'about_description_1', 'about_description_2'];
            } else if (section === 'features') {
                keysToSave = [1, 2, 3, 4].flatMap(num => [`about_feature_${num}_title`, `about_feature_${num}_desc`]);
            } else if (section === 'contact') {
                keysToSave = ['contact_phone', 'contact_email', 'contact_address', 'contact_title', 'contact_subtitle', 'contact_badge'];
            }

            for (const key of keysToSave) {
                await api.put('/settings', { key, value: (settings as any)[key] });
            }

            setEditStates({ ...editStates, [section]: false });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            alert('Failed to save settings');
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
                        About <span className="text-primary underline decoration-accent/30 decoration-8 underline-offset-8">Section</span>
                    </h1>
                    <p className="text-muted-foreground text-xl font-medium">Manage your brand story and key features</p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-10">
                {/* Main Content Card */}
                <div className="glass p-10 rounded-[3rem] shadow-depth border border-white/50 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Info size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-wider">Main Content</h2>
                        </div>
                        <div className="flex gap-3">
                            {editStates.main ? (
                                <>
                                    <button 
                                        onClick={() => handleSaveSection('main')}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                        Save
                                    </button>
                                    <button 
                                        onClick={() => setEditStates({...editStates, main: false})}
                                        className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-destructive hover:text-white transition-all"
                                    >
                                        <X size={14} /> Cancel
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setEditStates({...editStates, main: true})}
                                    className="flex items-center gap-2 px-6 py-2 bg-secondary text-muted-foreground rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all"
                                >
                                    <Pencil size={14} /> Edit Section
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Section Title</label>
                            <input
                                type="text"
                                disabled={!editStates.main}
                                value={settings.about_title}
                                onChange={e => setSettings({ ...settings, about_title: e.target.value })}
                                className={`w-full p-5 rounded-2xl border outline-none transition-all font-bold text-lg ${editStates.main ? 'border-primary bg-white focus:ring-4 focus:ring-primary/10 shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                placeholder="e.g. Tradition Meets Purity"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Description Paragraph 1</label>
                                <textarea
                                    rows={5}
                                    disabled={!editStates.main}
                                    value={settings.about_description_1}
                                    onChange={e => setSettings({ ...settings, about_description_1: e.target.value })}
                                    className={`w-full p-6 rounded-2xl border outline-none transition-all font-medium ${editStates.main ? 'border-primary bg-white focus:ring-4 focus:ring-primary/10 shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Description Paragraph 2</label>
                                <textarea
                                    rows={5}
                                    disabled={!editStates.main}
                                    value={settings.about_description_2}
                                    onChange={e => setSettings({ ...settings, about_description_2: e.target.value })}
                                    className={`w-full p-6 rounded-2xl border outline-none transition-all font-medium ${editStates.main ? 'border-primary bg-white focus:ring-4 focus:ring-primary/10 shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Card */}
                <div className="glass p-10 rounded-[3rem] shadow-depth border border-white/50 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                                <Leaf size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-wider">Key Features</h2>
                        </div>
                        <div className="flex gap-3">
                            {editStates.features ? (
                                <>
                                    <button 
                                        onClick={() => handleSaveSection('features')}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                        Save
                                    </button>
                                    <button 
                                        onClick={() => setEditStates({...editStates, features: false})}
                                        className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-destructive hover:text-white transition-all"
                                    >
                                        <X size={14} /> Cancel
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setEditStates({...editStates, features: true})}
                                    className="flex items-center gap-2 px-6 py-2 bg-secondary text-muted-foreground rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all"
                                >
                                    <Pencil size={14} /> Edit Features
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map((num) => {
                            const Icon = num === 1 ? Leaf : num === 2 ? Heart : num === 3 ? Truck : Award;
                            return (
                                <div key={num} className="p-8 rounded-[2rem] bg-white/40 border border-border/50 space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            <Icon size={20} />
                                        </div>
                                        <h3 className="font-black text-foreground">Feature {num}</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Title</label>
                                            <input
                                                type="text"
                                                disabled={!editStates.features}
                                                value={(settings as any)[`about_feature_${num}_title`]}
                                                onChange={e => setSettings({ ...settings, [`about_feature_${num}_title`]: e.target.value })}
                                                className={`w-full p-4 rounded-xl border outline-none transition-all font-bold ${editStates.features ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-muted/10 cursor-not-allowed'}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Description</label>
                                            <textarea
                                                rows={2}
                                                disabled={!editStates.features}
                                                value={(settings as any)[`about_feature_${num}_desc`]}
                                                onChange={e => setSettings({ ...settings, [`about_feature_${num}_desc`]: e.target.value })}
                                                className={`w-full p-4 rounded-xl border outline-none transition-all font-medium text-sm ${editStates.features ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-muted/10 cursor-not-allowed'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Contact Information Card */}
                <div className="glass p-10 rounded-[3rem] shadow-depth border border-white/50 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Phone size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-wider">Contact Information</h2>
                        </div>
                        <div className="flex gap-3">
                            {editStates.contact ? (
                                <>
                                    <button 
                                        onClick={() => handleSaveSection('contact')}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                        Save
                                    </button>
                                    <button 
                                        onClick={() => setEditStates({...editStates, contact: false})}
                                        className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-destructive hover:text-white transition-all"
                                    >
                                        <X size={14} /> Cancel
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setEditStates({...editStates, contact: true})}
                                    className="flex items-center gap-2 px-6 py-2 bg-secondary text-muted-foreground rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all"
                                >
                                    <Pencil size={14} /> Edit Contact
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="text"
                                        disabled={!editStates.contact}
                                        value={settings.contact_phone}
                                        onChange={e => setSettings({ ...settings, contact_phone: e.target.value })}
                                        className={`w-full p-5 pl-14 rounded-2xl border outline-none transition-all font-bold ${editStates.contact ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="email"
                                        disabled={!editStates.contact}
                                        value={settings.contact_email}
                                        onChange={e => setSettings({ ...settings, contact_email: e.target.value })}
                                        className={`w-full p-5 pl-14 rounded-2xl border outline-none transition-all font-bold ${editStates.contact ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                        placeholder="hello@kanmani.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Physical Address</label>
                            <div className="relative group h-full">
                                <MapPin className="absolute left-5 top-7 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                                <textarea
                                    rows={5}
                                    disabled={!editStates.contact}
                                    value={settings.contact_address}
                                    onChange={e => setSettings({ ...settings, contact_address: e.target.value })}
                                    className={`w-full p-6 pl-14 rounded-2xl border outline-none transition-all font-medium h-[155px] resize-none ${editStates.contact ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                    placeholder="Full address here..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/50">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Section Title</label>
                            <input
                                type="text"
                                disabled={!editStates.contact}
                                value={settings.contact_title}
                                onChange={e => setSettings({ ...settings, contact_title: e.target.value })}
                                className={`w-full p-5 rounded-2xl border outline-none transition-all font-bold ${editStates.contact ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                placeholder="e.g. Contact Us"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Section Subtitle</label>
                            <input
                                type="text"
                                disabled={!editStates.contact}
                                value={settings.contact_subtitle}
                                onChange={e => setSettings({ ...settings, contact_subtitle: e.target.value })}
                                className={`w-full p-5 rounded-2xl border outline-none transition-all font-medium ${editStates.contact ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                placeholder="e.g. Have questions? We'd love to hear from you"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Section Badge (Small Accent Text)</label>
                            <input
                                type="text"
                                disabled={!editStates.contact}
                                value={settings.contact_badge}
                                onChange={e => setSettings({ ...settings, contact_badge: e.target.value })}
                                className={`w-full p-5 rounded-2xl border outline-none transition-all font-black uppercase tracking-wider ${editStates.contact ? 'border-primary bg-white shadow-sm' : 'border-transparent bg-muted/20 cursor-not-allowed'}`}
                                placeholder="e.g. Get In Touch"
                            />
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
                    <span>Settings Updated!</span>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AboutSettings;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FileText, Loader2, CheckCircle, Image as ImageIcon, Plus, Trash2, Layout, ArrowLeft, Pencil, ChevronRight, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import api from '../api';
import { useConfirm } from '../context/ConfirmContext';

interface HeroSlide {
    id: string;
    image: string;
    subtitle: string;
    title: string;
    description: string;
    visible?: boolean;
}

const CmsSettings = () => {
    const { confirm, alert } = useConfirm();
    const [settings, setSettings] = useState({
        hero_slides: [] as HeroSlide[],
        hero_visible: 'true'
    });

    // View state for Hero Slides
    const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
    const [currentSlideIndex, setCurrentSlideIndex] = useState<number | null>(null);
    const [activeSlide, setActiveSlide] = useState<HeroSlide | null>(null);

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

    const handleSave = async (key: string, value: any) => {
        setSaving(true);
        try {
            await api.put('/settings', { key, value });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            return true;
        } catch (err) {
            alert('Failed to save setting', { type: 'error' });
            return false;
        } finally {
            setSaving(false);
        }
    };

    const toggleVisibility = async () => {
        const newValue = settings.hero_visible === 'true' ? 'false' : 'true';
        setSettings({ ...settings, hero_visible: newValue });
        
        setSaving(true);
        try {
            await api.put('/settings', { key: 'hero_visible', value: newValue });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            alert('Failed to update visibility', { type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const toggleSlideVisibility = async (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSlides = [...settings.hero_slides];
        newSlides[index].visible = newSlides[index].visible === false ? true : false;
        
        const success = await handleSave('hero_slides', newSlides);
        if (success) {
            setSettings({ ...settings, hero_slides: newSlides });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeSlide) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setSaving(true);
            const res = await api.post('/settings/upload', formData);
            setActiveSlide({ ...activeSlide, image: res.data.url });
        } catch (err) {
            alert('Image upload failed', { type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const startAddSlide = () => {
        setActiveSlide({
            id: Date.now().toString(),
            image: '',
            subtitle: '',
            title: '',
            description: '',
            visible: true
        });
        setCurrentSlideIndex(null);
        setViewMode('edit');
    };

    const startEditSlide = (index: number) => {
        setActiveSlide({ ...settings.hero_slides[index] });
        setCurrentSlideIndex(index);
        setViewMode('edit');
    };

    const removeSlide = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const isConfirmed = await confirm('Delete this slide?');
        if (!isConfirmed) return;

        const newSlides = settings.hero_slides.filter(s => s.id !== id);
        const success = await handleSave('hero_slides', newSlides);
        if (success) {
            setSettings({ ...settings, hero_slides: newSlides });
        }
    };

    const moveSlide = async (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
        e.stopPropagation();
        const newSlides = [...settings.hero_slides];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= newSlides.length) return;

        // Swap
        [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];

        const success = await handleSave('hero_slides', newSlides);
        if (success) {
            setSettings({ ...settings, hero_slides: newSlides });
        }
    };

    const saveActiveSlide = async () => {
        if (!activeSlide) return;

        let newSlides = [...settings.hero_slides];
        if (currentSlideIndex === null) {
            newSlides.push(activeSlide);
        } else {
            newSlides[currentSlideIndex] = activeSlide;
        }

        const success = await handleSave('hero_slides', newSlides);
        if (success) {
            setSettings({ ...settings, hero_slides: newSlides });
            setViewMode('list');
            setActiveSlide(null);
            setCurrentSlideIndex(null);
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
            className="space-y-12"
        >
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-5xl font-black text-foreground tracking-tight">
                        Hero <span className="text-primary underline decoration-accent/30 decoration-8 underline-offset-8">Slideshow</span>
                    </h1>
                    <button 
                        onClick={toggleVisibility}
                        className={`ml-4 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
                            settings.hero_visible === 'true' 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}
                    >
                        {settings.hero_visible === 'true' ? <Eye size={14} /> : <EyeOff size={14} />}
                        {settings.hero_visible === 'true' ? 'Showing on Page' : 'Hidden from Page'}
                    </button>
                </div>
                <p className="text-muted-foreground text-xl font-medium">Manage the main banners and slides on your website</p>
            </header>

            <div className="grid grid-cols-1 gap-12">
                {/* Hero Section Settings */}
                <div className="glass p-10 rounded-[3rem] shadow-depth border border-white/50 space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                                <Layout size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-foreground uppercase tracking-wider">Hero Slideshow</h2>
                                <p className="text-sm font-bold text-muted-foreground">Manage the main banners on your home page</p>
                            </div>
                        </div>
                        {viewMode === 'list' && (
                            <button
                                onClick={startAddSlide}
                                className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg active:scale-95"
                            >
                                <Plus size={24} />
                                <span>Add New Slide</span>
                            </button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {viewMode === 'list' ? (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {settings.hero_slides.map((slide, index) => (
                                    <div
                                        key={slide.id}
                                        onClick={() => startEditSlide(index)}
                                        className="group cursor-pointer bg-white/40 border border-border/50 rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all shadow-sm hover:shadow-xl"
                                    >
                                        <div className="aspect-[16/9] relative bg-muted/20">
                                            {slide.image ? (
                                                <img
                                                    src={`${import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5001'}${slide.image}`}
                                                    className="w-full h-full object-cover"
                                                    alt={slide.title}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                                    <ImageIcon size={48} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <div className="flex flex-col gap-2 mr-2">
                                                    <button
                                                        disabled={index === 0}
                                                        onClick={(e) => moveSlide(index, 'up', e)}
                                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-lg hover:scale-110 transition-transform disabled:opacity-30 disabled:scale-100"
                                                    >
                                                        <ArrowUp size={18} />
                                                    </button>
                                                    <button
                                                        disabled={index === settings.hero_slides.length - 1}
                                                        onClick={(e) => moveSlide(index, 'down', e)}
                                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-lg hover:scale-110 transition-transform disabled:opacity-30 disabled:scale-100"
                                                    >
                                                        <ArrowDown size={18} />
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={(e) => toggleSlideVisibility(index, e)}
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform ${
                                                        slide.visible !== false 
                                                        ? 'bg-primary text-white' 
                                                        : 'bg-destructive text-white'
                                                    }`}
                                                    title={slide.visible !== false ? "Slide Visible" : "Slide Hidden"}
                                                >
                                                    {slide.visible !== false ? <Eye size={20} /> : <EyeOff size={20} />}
                                                </button>
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-lg scale-90 group-hover:scale-100 transition-transform">
                                                    <Pencil size={20} />
                                                </div>
                                                <button
                                                    onClick={(e) => removeSlide(slide.id, e)}
                                                    className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center text-white shadow-lg scale-90 group-hover:scale-100 transition-transform hover:bg-destructive/80"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{slide.subtitle || 'NO SUBTITLE'}</p>
                                            <h3 className="font-black text-lg text-foreground line-clamp-1">{slide.title || 'Untitled Slide'}</h3>
                                            <div className="flex items-center gap-2 mt-4 text-primary font-bold text-xs">
                                                <span>Edit Details</span>
                                                <ChevronRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {settings.hero_slides.length === 0 && (
                                    <div className="col-span-full py-20 text-center border-4 border-dashed border-muted rounded-[3rem]">
                                        <ImageIcon size={64} className="mx-auto text-muted/30 mb-4" />
                                        <p className="text-muted-foreground font-bold">No slides found. Click "Add New Slide" to begin.</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="edit"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-10"
                            >
                                <button
                                    onClick={() => setViewMode('list')}
                                    className="flex items-center gap-2 text-primary font-black hover:translate-x-[-4px] transition-transform"
                                >
                                    <ArrowLeft size={20} />
                                    <span>Back to List</span>
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Slide Media</label>
                                        <div className="relative aspect-[16/9] rounded-[2rem] border-4 border-dashed border-muted overflow-hidden group/img bg-muted/10 hover:border-primary/30 transition-colors">
                                            {activeSlide?.image ? (
                                                <img
                                                    src={`${import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5001'}${activeSlide.image}`}
                                                    alt="Slide"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                                    <ImageIcon size={48} className="mb-2 opacity-20" />
                                                    <span className="text-[10px] font-black tracking-widest">DRAG OR CLICK TO UPLOAD</span>
                                                </div>
                                            )}
                                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                                                <Plus size={32} />
                                                <span className="text-xs font-black uppercase tracking-widest mt-2">Change Image</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </label>
                                            {saving && (
                                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                                    <Loader2 className="animate-spin text-primary" size={32} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-8">
                                        <div className="grid grid-cols-1 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Subtitle</label>
                                                <input
                                                    type="text"
                                                    value={activeSlide?.subtitle}
                                                    onChange={e => setActiveSlide({ ...activeSlide!, subtitle: e.target.value })}
                                                    className="w-full p-5 rounded-2xl border border-border bg-white outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-foreground"
                                                    placeholder="e.g. 100% Organic & Fresh"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Main Title Text</label>
                                            <input
                                                type="text"
                                                value={activeSlide?.title}
                                                onChange={e => setActiveSlide({ ...activeSlide!, title: e.target.value })}
                                                className="w-full p-5 rounded-2xl border border-border bg-white outline-none focus:ring-4 focus:ring-primary/10 transition-all font-black text-xl"
                                                placeholder="e.g. Pure & Natural"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Full Description</label>
                                            <textarea
                                                rows={3}
                                                value={activeSlide?.description}
                                                onChange={e => setActiveSlide({ ...activeSlide!, description: e.target.value })}
                                                className="w-full p-6 rounded-2xl border border-border bg-white outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                                placeholder="Describe the content of this slide..."
                                            />
                                        </div>

                                        <div className="flex justify-end gap-4 pt-4">
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className="px-10 py-5 rounded-2xl font-black text-muted-foreground hover:bg-muted/50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={saveActiveSlide}
                                                disabled={saving}
                                                className="bg-primary text-white px-12 py-5 rounded-2xl font-black shadow-xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                                            >
                                                {saving ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                                                <span>Save Slide</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {success && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="fixed bottom-10 right-10 bg-primary text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold z-50"
                >
                    <CheckCircle size={24} />
                    <span>Settings Updated Successfully!</span>
                </motion.div>
            )}
        </motion.div>
    );
};

export default CmsSettings;

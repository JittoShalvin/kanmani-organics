import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Trash2,
  Package,
  Loader2,
  Droplet,
  Leaf,
  Sprout,
  Pencil,
  Copy,
  Filter,
  FileText,
  CheckCircle,
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  X,
  List,
  ArrowUpDown,
  LayoutGrid
} from 'lucide-react';
import api from '../api';
import type { Project } from '../types/index';
import { useConfirm } from '../context/ConfirmContext';

const ProductsList = () => {
  const { confirm, alert } = useConfirm();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [settings, setSettings] = useState({
    products_title: 'Premium Organic Range',
    products_subtitle: 'Carefully crafted products using traditional methods and the finest organic ingredients'
  });
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchSettings();
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

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (Object.keys(res.data).length > 0) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const handleSaveSetting = async (key: string, value: string) => {
    try {
      await api.put('/settings', { key, value });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save setting', { type: 'error' });
    }
  };

  const deleteProject = async (id: string) => {
    const isConfirmed = await confirm('Are you sure you want to delete this product?');
    if (!isConfirmed) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product', { type: 'error' });
    }
  };

  const duplicateProject = async (project: Project) => {
    const isConfirmed = await confirm(`Duplicate "${project.name}"?`);
    if (!isConfirmed) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', `${project.name} (Copy)`);
      formData.append('description', project.description);
      formData.append('fullDescription', project.fullDescription);
      formData.append('category', project.category);
      formData.append('link', project.link);
      formData.append('usage', project.usage);
      formData.append('features', JSON.stringify(project.features));
      formData.append('benefits', JSON.stringify(project.benefits));
      formData.append('sizes', JSON.stringify(project.sizes));

      formData.append('imagePath', project.image);

      await api.post('/projects', formData);
      fetchProjects();
    } catch (err) {
      alert('Failed to duplicate product', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= filteredProjects.length) return;

    const item1 = filteredProjects[index];
    const item2 = filteredProjects[newIndex];

    // Find global indices to swap in the master list
    const globalIndex1 = projects.findIndex(p => p.id === item1.id);
    const globalIndex2 = projects.findIndex(p => p.id === item2.id);

    if (globalIndex1 === -1 || globalIndex2 === -1) return;

    const newProjects = [...projects];
    const temp = newProjects[globalIndex1];
    newProjects[globalIndex1] = newProjects[globalIndex2];
    newProjects[globalIndex2] = temp;

    // Send the FULL list of IDs to maintain absolute order
    const ids = newProjects.map(p => p.id);

    try {
      setProjects(newProjects); // Optimistic UI update
      await api.post('/projects/reorder', { ids });
    } catch (err) {
      alert('Failed to reorder products', { type: 'error' });
      fetchProjects(); // Revert if failed
    }
  };

  const toggleProductVisibility = async (project: Project) => {
    const newValue = !project.visible;
    try {
      await api.patch(`/projects/${project.id}/status`, { visible: newValue });
      setProjects(projects.map(p => p.id === project.id ? { ...p, visible: newValue } : p));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      alert('Failed to update product visibility', { type: 'error' });
    }
  };

  const [isSortingMode, setIsSortingMode] = useState(false);

  const categories = Array.from(new Set(['all', ...projects.map(p => p.category)])).filter(Boolean);

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

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
            Product <span className="text-primary underline decoration-accent/30 decoration-8 underline-offset-8">Catalog</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium">Manage and monitor your organic inventory</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (!isSortingMode) setSelectedCategory('all');
              setIsSortingMode(!isSortingMode);
            }}
            className={`btn-3d px-10 py-5 rounded-[1.5rem] flex items-center gap-3 font-bold shadow-xl transition-all ${
              isSortingMode ? 'bg-accent text-white' : 'bg-white text-primary border border-primary/20'
            }`}
          >
            {isSortingMode ? <LayoutGrid size={24} /> : <List size={24} />}
            <span>{isSortingMode ? 'Grid View' : 'Sorting Mode'}</span>
          </button>
          <button
            onClick={() => navigate('/add')}
            className="btn-3d bg-gradient-hero text-white px-10 py-5 rounded-[1.5rem] flex items-center gap-3 font-bold shadow-xl hover:scale-105 transition-transform"
          >
            <PlusCircle size={24} />
            <span>Add New Product</span>
          </button>
        </div>
      </header>

      {/* Site Appearance Section */}
      <div className="glass p-8 rounded-[2.5rem] border border-white/50 shadow-depth space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 text-primary">
            <FileText size={20} />
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Site Appearance: Products Section</h2>
          </div>
          <div className="flex gap-3">
            {isEditingSettings && (
              <button 
                onClick={() => {
                  handleSaveSetting('products_title', settings.products_title);
                  handleSaveSetting('products_subtitle', settings.products_subtitle);
                  setIsEditingSettings(false);
                }}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
              >
                <Save size={14} /> Save Changes
              </button>
            )}
            <button 
              onClick={() => setIsEditingSettings(!isEditingSettings)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isEditingSettings ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
            >
              {isEditingSettings ? <X size={14} /> : <Pencil size={14} />}
              {isEditingSettings ? 'Cancel' : 'Edit Section'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Main Heading</label>
            <div className="relative group">
              <input
                type="text"
                disabled={!isEditingSettings}
                value={settings.products_title}
                onChange={e => setSettings({ ...settings, products_title: e.target.value })}
                className={`w-full p-4 rounded-xl outline-none transition-all font-bold ${isEditingSettings ? 'bg-white border border-primary focus:ring-4 focus:ring-primary/10 shadow-sm' : 'bg-muted/20 border-transparent cursor-not-allowed'}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Description Subtext</label>
            <div className="relative group">
              <textarea
                disabled={!isEditingSettings}
                value={settings.products_subtitle}
                onChange={e => setSettings({ ...settings, products_subtitle: e.target.value })}
                rows={2}
                className={`w-full p-4 rounded-xl outline-none transition-all font-medium min-h-[60px] resize-none ${isEditingSettings ? 'bg-white border border-primary focus:ring-4 focus:ring-primary/10 shadow-sm' : 'bg-muted/20 border-transparent cursor-not-allowed'}`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 py-6 border-y border-secondary">
        <div className="flex items-center gap-3 mr-4 text-muted-foreground">
          <Filter size={20} />
          <span className="font-black uppercase tracking-widest text-xs">Filter by:</span>
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${selectedCategory === cat
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-white text-muted-foreground border border-border hover:border-primary/30'
              }`}
          >
            {cat === 'all' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6 text-primary">
          <div className="relative">
            <Loader2 className="animate-spin" size={64} />
            <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
          </div>
          <p className="text-xl font-bold animate-pulse tracking-wide">Cultivating Projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-40 glass rounded-[3rem] border-dashed border-2 border-primary/20">
          <Package size={80} className="mx-auto text-primary/20 mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {selectedCategory === 'all' ? 'No products found' : `No products in "${selectedCategory}"`}
          </h2>
          <p className="text-muted-foreground mb-8">Start by adding your first organic product to this category.</p>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-primary font-bold hover:underline"
            >
              View All Products
            </button>
          )}
        </div>
      ) : (
        isSortingMode ? (
          <div className="glass p-8 rounded-[3rem] border border-white/50 shadow-depth space-y-4">
            <div className="flex items-center gap-4 text-primary mb-8 border-b border-secondary pb-6">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                <ArrowUpDown size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest">Reorder Catalog</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Vertical alignment for precise sorting</p>
              </div>
              <button 
                onClick={() => setIsSortingMode(false)}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
              >
                <X size={14} /> Close Sorting
              </button>
            </div>
            
            <div className="space-y-4 max-w-4xl mx-auto">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-6 p-5 bg-white rounded-3xl border border-border shadow-sm hover:border-primary/40 hover:shadow-xl transition-all group"
                >
                  <div className="w-20 h-20 bg-muted rounded-2xl overflow-hidden flex-shrink-0 border border-secondary p-2 group-hover:scale-105 transition-transform">
                    <img 
                      src={`${import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5001'}${project.image}`} 
                      className="w-full h-full object-contain" 
                      alt={project.name}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-black text-xl text-foreground">{project.name}</h3>
                      <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em] bg-secondary px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium italic line-clamp-1 opacity-70">"{project.description}"</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-2 border-r border-secondary pr-4">
                       <button
                         disabled={idx === 0}
                         onClick={() => handleReorder(idx, 'up')}
                         className="w-12 h-12 bg-secondary text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-20 disabled:scale-100 active:scale-90"
                         title="Move Up"
                       >
                         <ArrowUp size={24} />
                       </button>
                       <button
                         disabled={idx === filteredProjects.length - 1}
                         onClick={() => handleReorder(idx, 'down')}
                         className="w-12 h-12 bg-secondary text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-20 disabled:scale-100 active:scale-90"
                         title="Move Down"
                       >
                         <ArrowDown size={24} />
                       </button>
                    </div>
                    
                    <button 
                      onClick={() => toggleProductVisibility(project)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                        project.visible !== false ? 'bg-primary text-white' : 'bg-destructive text-white'
                      }`}
                    >
                      {project.visible !== false ? <Eye size={24} /> : <EyeOff size={24} />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredProjects.map((project, idx) => {
              const Icon = project.category === 'oils' ? Droplet : project.category === 'puttu' ? Leaf : Sprout;
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={project.id}
                  className="card-3d group h-full"
                >
                  <div className="card-3d-inner bg-white rounded-[2.5rem] overflow-hidden shadow-depth border border-border group-hover:border-primary/30 transition-all h-full flex flex-col">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={`${import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5001'}${project.image}`}
                        alt={project.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-1000 drop-shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                      <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                        <span className="px-4 py-2 glass-dark rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl">
                          {project.category}
                        </span>
                        <div className="flex flex-col gap-2">
                          <button
                            disabled={idx === 0}
                            onClick={(e) => { e.stopPropagation(); handleReorder(idx, 'up'); }}
                            className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center text-primary shadow-xl hover:scale-110 transition-transform disabled:opacity-30 disabled:scale-100"
                          >
                            <ArrowUp size={18} />
                          </button>
                          <button
                            disabled={idx === filteredProjects.length - 1}
                            onClick={(e) => { e.stopPropagation(); handleReorder(idx, 'down'); }}
                            className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center text-primary shadow-xl hover:scale-110 transition-transform disabled:opacity-30 disabled:scale-100"
                          >
                            <ArrowDown size={18} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleProductVisibility(project); }}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform ${
                                project.visible !== false 
                                ? 'bg-primary text-white' 
                                : 'bg-destructive text-white'
                            }`}
                            title={project.visible !== false ? "Visible in Store" : "Hidden from Store"}
                          >
                            {project.visible !== false ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-2xl group-hover:rotate-12 transition-transform">
                          <Icon size={24} />
                        </div>
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-black text-foreground mb-3 group-hover:text-primary transition-colors">{project.name}</h3>
                      <p className="text-muted-foreground font-medium mb-8 flex-1 italic text-sm">"{project.description}"</p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.features.slice(0, 2).map((f, i) => (
                          <span key={i} className="text-[10px] bg-secondary text-primary font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">
                            {f}
                          </span>
                        ))}
                        {project.features.length > 2 && (
                          <span className="text-[10px] bg-muted text-muted-foreground font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">
                            +{project.features.length - 2} More
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-3 pt-6 border-t border-secondary">
                        <button
                          onClick={() => navigate(`/edit/${project.id}`)}
                          className="col-span-2 bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all active:scale-95"
                        >
                          <Pencil size={18} />
                          <span className="text-sm uppercase tracking-widest">Edit</span>
                        </button>
                        <button
                          onClick={() => duplicateProject(project)}
                          className="bg-secondary text-primary rounded-xl flex items-center justify-center shadow-sm hover:bg-primary hover:text-white transition-all active:scale-95"
                          title="Duplicate Product"
                        >
                          <Copy size={20} />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl flex items-center justify-center shadow-sm hover:bg-destructive hover:text-white transition-all active:scale-95"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )
      )
    }

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed bottom-10 right-10 bg-primary text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold z-50"
        >
          <CheckCircle size={24} />
          <span>Update Successful!</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductsList;

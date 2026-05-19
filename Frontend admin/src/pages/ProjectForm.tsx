import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  PlusCircle, 
  Trash2, 
  X, 
  Loader2, 
  Grid, 
  Sprout, 
  Leaf, 
  Package 
} from 'lucide-react';
import api from '../api';
import type { Project } from '../types/index';
import { useConfirm } from '../context/ConfirmContext';

interface ProjectFormProps {
  isEdit?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ isEdit }) => {
  const { alert } = useConfirm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    fullDescription: '',
    category: 'oils',
    link: '',
    features: [],
    benefits: [],
    usage: '',
    sizes: []
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  const [featureInput, setFeatureInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>(['oils', 'puttu', 'spices']);

  const id = window.location.pathname.split('/').pop();

  useEffect(() => {
    fetchCategories();
    if (isEdit && id) {
      fetchProject();
    }
  }, [isEdit, id]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/projects');
      const cats = Array.from(new Set(res.data.map((p: any) => p.category))) as string[];
      const combined = Array.from(new Set(['oils', 'puttu', 'spices', ...cats])).filter(Boolean);
      setExistingCategories(combined);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchProject = async () => {
    try {
      const res = await api.get('/projects');
      const p = res.data.find((x: any) => x.id === id);
      if (p) {
        setProject(p);
        const imageBase = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5001';
        setPreview(`${imageBase}${p.image}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', project.name || '');
      formData.append('description', project.description || '');
      formData.append('fullDescription', project.fullDescription || '');
      formData.append('category', project.category || '');
      formData.append('link', project.link || '');
      formData.append('usage', project.usage || '');
      formData.append('features', JSON.stringify(project.features));
      formData.append('benefits', JSON.stringify(project.benefits));
      formData.append('sizes', JSON.stringify(project.sizes));
      if (image) formData.append('image', image);

      if (isEdit && id) {
        await api.put(`/projects/${id}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      navigate('/products');
    } catch (err) {
      alert('Failed to save product', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-5xl mx-auto"
    >
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-3 text-primary font-black mb-10 hover:translate-x-[-8px] transition-transform group"
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
          <ArrowLeft size={20} />
        </div>
        <span>Back to Products</span>
      </button>

      <div className="bg-white rounded-[3rem] shadow-depth border border-border overflow-hidden">
        <div className="bg-gradient-hero p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <h1 className="text-4xl font-black mb-3 relative z-10">{isEdit ? 'Update Product' : 'New Organic Product'}</h1>
          <p className="text-white/80 font-medium relative z-10 text-lg">Define your product's details and organic certifications</p>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-12">
          {/* Essential Info Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-secondary pb-4">
               <Grid className="text-primary" size={24} />
               <h2 className="text-xl font-black text-foreground">Essential Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-3">
                  <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Product Name</label>
                  <input required type="text" value={project.name} onChange={e => setProject({...project, name: e.target.value})} className="w-full p-5 rounded-[1.5rem] border border-border bg-muted/20 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold" placeholder="e.g. Extra Virgin Coconut Oil" />
               </div>
               <div className="space-y-3">
                   <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Category</label>
                   {!isNewCategory ? (
                     <select 
                        value={project.category} 
                        onChange={e => {
                          if (e.target.value === 'ADD_NEW') {
                            setIsNewCategory(true);
                            setProject({...project, category: ''});
                          } else {
                            setProject({...project, category: e.target.value});
                          }
                        }} 
                        className="w-full p-5 rounded-[1.5rem] border border-border bg-muted/20 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold appearance-none"
                     >
                        {existingCategories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat === 'oils' ? 'Natural Oils' : 
                             cat === 'puttu' ? 'Traditional Puttu' : 
                             cat === 'spices' ? 'Organic Spices' : 
                             cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                        <option value="ADD_NEW">+ Add New Category</option>
                     </select>
                   ) : (
                     <div className="flex gap-3">
                        <input 
                          autoFocus
                          type="text" 
                          value={project.category} 
                          onChange={e => setProject({...project, category: e.target.value})} 
                          className="flex-1 p-5 rounded-[1.5rem] border border-primary bg-muted/20 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold" 
                          placeholder="Type new category name..." 
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsNewCategory(false);
                            setProject({...project, category: 'oils'});
                          }} 
                          className="px-6 rounded-[1.5rem] bg-secondary text-primary font-black hover:bg-secondary/80 transition-colors"
                        >
                          Cancel
                        </button>
                     </div>
                   )}
                </div>
            </div>

            <div className="space-y-3">
               <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">External Order Link (Amazon / WhatsApp)</label>
               <input type="url" value={project.link} onChange={e => setProject({...project, link: e.target.value})} className="w-full p-5 rounded-[1.5rem] border border-border bg-muted/20 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary" placeholder="https://amazon.in/products/..." />
            </div>

            <div className="space-y-3">
               <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Tagline / Short Description</label>
               <textarea 
                required 
                rows={2} 
                value={project.description} 
                onChange={e => setProject({...project, description: e.target.value})} 
                className="w-full p-5 rounded-[1.5rem] border border-border bg-muted/20 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-y" 
                placeholder="A brief catchphrase for the product list..." 
               />
            </div>

            <div className="space-y-3">
               <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Detailed Story</label>
               <textarea required rows={5} value={project.fullDescription} onChange={e => setProject({...project, fullDescription: e.target.value})} className="w-full p-6 rounded-[1.5rem] border border-border bg-muted/20 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" placeholder="Describe the origin, benefits, and uniqueness of this product..." />
            </div>

            <div className="space-y-3">
               <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">How to Use (Instructions)</label>
               <textarea rows={3} value={project.usage} onChange={e => setProject({...project, usage: e.target.value})} className="w-full p-6 rounded-[1.5rem] border border-border bg-muted/20 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" placeholder="Instructions for the customer..." />
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-8 pt-8">
            <div className="flex items-center gap-3 border-b border-secondary pb-4">
               <Save className="text-primary" size={24} />
               <h2 className="text-xl font-black text-foreground">Media & Assets</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
               <div className="space-y-3">
                  <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Product Photo</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      onChange={handleImageChange} 
                      className="hidden" 
                      id="image-upload" 
                      accept="image/*"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full aspect-square border-4 border-dashed border-muted rounded-[3rem] cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group overflow-hidden bg-muted/10"
                    >
                      {preview ? (
                        <div className="relative w-full h-full p-4">
                          <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-2xl drop-shadow-xl" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-black uppercase tracking-widest text-xs">Change Photo</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <PlusCircle size={48} className="text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                          <span className="font-black text-muted-foreground group-hover:text-primary uppercase tracking-widest text-xs">Upload High-Res Photo</span>
                        </>
                      )}
                    </label>
                  </div>
               </div>

               <div className="space-y-10">
                  {/* Dynamic Lists */}
                  <div className="space-y-4">
                    <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Available Sizes (e.g. 500ml, 1kg)</label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={sizeInput} 
                        onChange={e => setSizeInput(e.target.value)} 
                        className="flex-1 p-5 rounded-2xl border border-border bg-muted/20 outline-none focus:border-primary transition-all font-bold" 
                        placeholder="Add size..."
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), sizeInput && (setProject({...project, sizes: [...(project.sizes || []), sizeInput]}), setSizeInput('')))}
                      />
                      <button 
                        type="button" 
                        onClick={() => sizeInput && (setProject({...project, sizes: [...(project.sizes || []), sizeInput]}), setSizeInput(''))}
                        className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                      >
                        <PlusCircle size={24} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {project.sizes?.map((s, i) => (
                         <div key={i} className="bg-secondary text-primary px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 group animate-in fade-in zoom-in duration-300">
                           {s}
                           <button onClick={() => setProject({...project, sizes: project.sizes?.filter((_, idx) => idx !== i)})} className="hover:text-destructive"><X size={14} /></button>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Key Features (Bullet Points)</label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={featureInput} 
                        onChange={e => setFeatureInput(e.target.value)} 
                        className="flex-1 p-5 rounded-2xl border border-border bg-muted/20 outline-none focus:border-primary transition-all font-bold" 
                        placeholder="e.g. 100% Organic"
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), featureInput && (setProject({...project, features: [...(project.features || []), featureInput]}), setFeatureInput('')))}
                      />
                      <button 
                        type="button" 
                        onClick={() => featureInput && (setProject({...project, features: [...(project.features || []), featureInput]}), setFeatureInput(''))}
                        className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                      >
                        <PlusCircle size={24} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {project.features?.map((f, i) => (
                         <div key={i} className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 group animate-in fade-in zoom-in duration-300">
                           {f}
                           <button onClick={() => setProject({...project, features: project.features?.filter((_, idx) => idx !== i)})} className="hover:text-destructive"><X size={14} /></button>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex justify-end gap-6 pt-12 border-t border-secondary">
             <button 
              type="button" 
              onClick={() => navigate('/products')} 
              className="px-10 py-5 rounded-2xl font-black text-muted-foreground hover:bg-muted/50 transition-colors"
             >
              Cancel
             </button>
             <button 
              type="submit" 
              disabled={loading}
              className="btn-3d bg-gradient-hero text-white px-12 py-5 rounded-2xl font-black shadow-xl flex items-center gap-3 disabled:opacity-50"
             >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
              <span>{isEdit ? 'Save Changes' : 'Publish Product'}</span>
             </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProjectForm;

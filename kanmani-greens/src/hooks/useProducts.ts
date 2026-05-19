import { useState, useEffect } from 'react';
import { products as staticProducts, Product } from '../data/products';
import { Droplet, Leaf, Sprout } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5001';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        if (data.length > 0) {
          const formattedProducts = data.map((p: any) => ({
            ...p,
            // Map image path to full URL
            image: `${IMAGE_BASE}${p.image}`,
            // Map icon based on category
            icon: p.category === 'oils' ? Droplet : p.category === 'puttu' ? Leaf : Sprout,
            // Ensure lists are correct
            features: Array.isArray(p.features) ? p.features : [],
            benefits: Array.isArray(p.benefits) ? p.benefits : [],
            sizes: Array.isArray(p.sizes) ? p.sizes : [],
            visible: p.visible !== false
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Error fetching products, using static data:', error);
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};

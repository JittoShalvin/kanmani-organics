import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export interface SiteSettings {
  products_title: string;
  products_subtitle: string;
  [key: string]: any;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    products_title: "Premium Organic Range",
    products_subtitle: "Carefully crafted products using traditional methods and the finest organic ingredients"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE}/settings`);
        if (response.ok) {
          const data = await response.json();
          if (Object.keys(data).length > 0) {
            setSettings(prev => ({
              ...prev,
              ...data
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};

import { Leaf, Facebook, Instagram, Youtube } from "lucide-react";
import { useState, useEffect } from "react";

const Footer = () => {
  const [settings, setSettings] = useState({
    facebook_url: '#',
    instagram_url: '#',
    youtube_url: '#',
    footer_copyright: '© 2024 Kanmani Organics. All rights reserved.',
    footer_tagline: 'Bringing you the freshest organic produce from farm to table.'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_URL}/settings`);
        const data = await response.json();
        if (data) {
          setSettings({
            facebook_url: data.facebook_url || '#',
            instagram_url: data.instagram_url || '#',
            youtube_url: data.youtube_url || '#',
            footer_copyright: data.footer_copyright || '© 2024 Kanmani Organics. All rights reserved.',
            footer_tagline: data.footer_tagline || 'Bringing you the freshest organic produce from farm to table.'
          });
        }
      } catch (err) {
        console.error('Failed to fetch footer settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const normalizeUrl = (url: string) => {
    if (!url || url === '#') return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <img src="/cropped_circle_image.png" className="w-10 h-10 object-contain bg-white rounded-full p-0.5" alt="Kanmani Organics Logo" />
              <span className="font-display text-xl font-bold text-white">
                Kanmani Organics
              </span>
            </div>
            <p className="text-primary-foreground/80 text-sm max-w-[250px]">
              {settings.footer_tagline}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#home" className="text-primary-foreground/80 hover:text-white transition-all hover:translate-x-1 inline-block">
                  Home
                </a>
              </li>
              <li>
                <a href="#products" className="text-primary-foreground/80 hover:text-white transition-all hover:translate-x-1 inline-block">
                  Products
                </a>
              </li>
              <li>
                <a href="#about" className="text-primary-foreground/80 hover:text-white transition-all hover:translate-x-1 inline-block">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/80 hover:text-white transition-all hover:translate-x-1 inline-block">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            {/* Empty column for spacing */}
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold mb-6 text-white uppercase tracking-widest text-xs">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href={normalizeUrl(settings.facebook_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={normalizeUrl(settings.instagram_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={normalizeUrl(settings.youtube_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-primary-foreground/60 font-medium">
          <p>{settings.footer_copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

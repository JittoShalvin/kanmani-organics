import React, { useState, useEffect } from "react";
import { Leaf, Heart, Truck, Award } from "lucide-react";
import { Card } from "./ui/card";

const features = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "Grown without synthetic pesticides or fertilizers",
  },
  {
    icon: Heart,
    title: "Health First",
    description: "Nutrient-rich produce for your wellbeing",
  },
  {
    icon: Truck,
    title: "Traditional Methods",
    description: "Time-tested extraction and preparation techniques",
  },
  {
    icon: Award,
    title: "Certified Quality",
    description: "Organic certification and quality assured",
  },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const About = () => {
  const [content, setContent] = useState({
    about_title: 'Tradition Meets Purity',
    about_description_1: 'At Kanmani Organics, we specialize in cold-pressed organic oils and traditional puttu products. Our commitment is to deliver authentic, chemical-free products that honor traditional methods while ensuring the highest quality standards.',
    about_description_2: 'We source only the finest organic ingredients and use time-tested extraction and preparation methods. Every bottle and package reflects our dedication to purity, health, and the authentic flavors you remember.',
    features: [
      {
        icon: Leaf,
        title: "100% Organic",
        description: "Grown without synthetic pesticides or fertilizers",
      },
      {
        icon: Heart,
        title: "Health First",
        description: "Nutrient-rich produce for your wellbeing",
      },
      {
        icon: Truck,
        title: "Traditional Methods",
        description: "Time-tested extraction and preparation techniques",
      },
      {
        icon: Award,
        title: "Certified Quality",
        description: "Organic certification and quality assured",
      },
    ]
  });

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch(`${API_URL}/settings`);
        const data = await response.json();

        if (data.about_title) {
          setContent(prev => ({
            ...prev,
            about_title: data.about_title,
            about_description_1: data.about_description_1 || prev.about_description_1,
            about_description_2: data.about_description_2 || prev.about_description_2,
            features: [
              { ...prev.features[0], title: data.about_feature_1_title || prev.features[0].title, description: data.about_feature_1_desc || prev.features[0].description },
              { ...prev.features[1], title: data.about_feature_2_title || prev.features[1].title, description: data.about_feature_2_desc || prev.features[1].description },
              { ...prev.features[2], title: data.about_feature_3_title || prev.features[2].title, description: data.about_feature_3_desc || prev.features[2].description },
              { ...prev.features[3], title: data.about_feature_4_title || prev.features[3].title, description: data.about_feature_4_desc || prev.features[3].description },
            ]
          }));
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
      }
    };
    fetchAboutContent();
  }, []);

  // Split title for styling
  const titleParts = content.about_title.split(' ');

  return (
    <section id="about" className="py-20 bg-background relative overflow-hidden">
      {/* 3D Decorative elements */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl float-animation" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl float-animation" style={{ animationDelay: '-2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <span className="inline-block text-primary font-semibold uppercase tracking-wide px-4 py-2 bg-primary/10 rounded-full mb-4">
              About Us
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
              {titleParts.map((part, i) => (
                <React.Fragment key={i}>
                  <span className={`inline-block hover:text-primary transition-all duration-300 ${i === titleParts.length - 1 ? 'text-primary hover:scale-105' : 'hover:scale-105'}`}>
                    {part}
                  </span>
                  {' '}
                </React.Fragment>
              ))}
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              {content.about_description_1}
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {content.about_description_2}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {content.features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card-3d animate-in fade-in slide-in-from-right duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="card-3d-inner p-6 bg-gradient-card shadow-depth hover:shadow-3d transition-all duration-500 group h-full">
                    <div className="w-14 h-14 bg-gradient-hero rounded-xl flex items-center justify-center mb-4 shadow-depth group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

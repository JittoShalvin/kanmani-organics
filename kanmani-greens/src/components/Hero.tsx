import { Button } from "./ui/button";
import { Leaf, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// Images - Used for both desktop and mobile
import heroOilsImage from "@/assets/image3.png";
import heroOrganicImage from "@/assets/hero-organic.jpg";
import productOilImage from "@/assets/All Product New.jpg";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5001';

const staticSlides = [
  {
    id: 1,
    image: heroOilsImage,
    subtitle: "100% Organic & Fresh",
    title: "Pure & Natural",
    highlight: "Organic Oils",
    description:
      "Premium cold-pressed organic oils extracted using traditional methods. Experience the authentic taste and health benefits of pure, unrefined oils.",
  },
  {
    id: 2,
    image: heroOrganicImage,
    subtitle: "Traditional & Authentic",
    title: "Handcrafted",
    highlight: "Puttu Products",
    description:
      "Traditional South Indian puttu mix made from organic rice and fresh coconut. Bringing authentic flavors to your breakfast table.",
  },
  {
    id: 3,
    image: productOilImage,
    subtitle: "Quality Assured",
    title: "From Farm",
    highlight: "To Your Home",
    description:
      "We source only the finest organic ingredients directly from trusted farmers. Every product reflects our commitment to purity and quality.",
  },
];

const Hero = () => {
  const [slides, setSlides] = useState(staticSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const response = await fetch(`${API_URL}/settings`);
        const data = await response.json();

        if (data.hero_visible !== undefined) {
          setIsVisible(data.hero_visible === 'true');
        }

        if (data.hero_slides && data.hero_slides.length > 0) {
          const formattedSlides = data.hero_slides
            .filter((s: any) => s.visible !== false)
            .map((s: any) => ({
              ...s,
              image: s.image.startsWith('http') ? s.image : `${IMAGE_BASE}${s.image}`
            }));

          if (formattedSlides.length > 0) {
            setSlides(formattedSlides);
          }
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
      }
    };
    fetchHeroSlides();
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const scrollToContent = () => {
    const element = document.getElementById("products");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <div id="home">
      {/* MOBILE VERSION - Hidden on desktop (below 1024px) */}
      <section
        className="relative flex flex-col min-h-screen pt-16 overflow-hidden lg:hidden"
      >
        {/* Slideshow Background for Mobile */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`transition-all duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 absolute inset-0"
              }`}
          >
            {/* Background Image - Positioned at top */}
            <div className="w-full flex items-start justify-center bg-gradient-to-b from-background/5 to-background">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-auto object-contain max-h-[40vh] sm:max-h-[45vh] md:max-h-[50vh]"
              />
            </div>
          </div>
        ))}

        {/* Mobile Content - Directly Below Image */}
        <div className="container mx-auto px-4 relative z-10 bg-background pb-8 flex-1 flex flex-col justify-center">
          <div className="w-full text-center">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-700 ${index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 absolute pointer-events-none"
                  }`}
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center shadow-depth">
                    <Leaf className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-primary font-semibold uppercase tracking-wide text-xs">
                    {slide.subtitle}
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                  <span className="inline-block">
                    {slide.title}
                  </span>
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 leading-relaxed max-w-lg mx-auto">
                  {slide.description}
                </p>
              </div>
            ))}

            <div className="flex flex-col gap-3 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
              <Button
                onClick={scrollToContent}
                size="lg"
                className="btn-3d bg-gradient-hero text-sm px-8 py-6 text-primary-foreground w-full rounded-lg"
              >
                View More
                <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
              <Button
                onClick={() => {
                  const element = document.getElementById("contact");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth text-sm px-8 py-6 w-full rounded-lg"
              >
                Contact Us
              </Button>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center justify-center gap-2 mt-6 pt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1 rounded-full transition-all duration-500 ${index === currentSlide ? "w-8 bg-primary" : "w-8 bg-muted/50"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
              <span className="ml-2 text-xs text-muted-foreground font-medium">
                {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Mobile */}
        <button
          onClick={() => {
            prevSlide();
            setIsAutoPlaying(false);
          }}
          className="absolute left-3 top-32 z-20 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-depth hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            nextSlide();
            setIsAutoPlaying(false);
          }}
          className="absolute right-3 top-32 z-20 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-depth hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* DESKTOP VERSION - Hidden on mobile and tablets */}
      <section
        className="relative h-[calc(100vh-64px)] mt-16 flex items-center overflow-hidden hidden lg:flex"
      >
        {/* Slideshow Background - Full screen coverage for Desktop */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 z-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
          >
            {/* Base Background Color */}
            <div className="absolute inset-0 bg-background" />

            {/* Image container - Full width to allow natural fit */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-contain object-right"
              />
            </div>

            {/* Refined gradient mask for "Dark White" to "Light White" to Fade transition */}
            <div
              className="absolute inset-0 z-10"
              style={{
                background: `linear-gradient(to right, 
                  hsl(var(--background)) 0%, 
                  hsl(var(--background) / 0.98) 25%, 
                  hsl(var(--background) / 0.7) 45%, 
                  transparent 70%
                )`
              }}
            />
          </div>
        ))}

        {/* Floating decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl float-animation z-[1]" />
        <div
          className="absolute bottom-40 right-40 w-48 h-48 bg-accent/20 rounded-full blur-3xl float-animation z-[1]"
          style={{ animationDelay: "-3s" }}
        />

        {/* Desktop Content - Left aligned */}
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-xl lg:max-w-2xl">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-700 ${index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 absolute pointer-events-none"
                  }`}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center shadow-depth">
                    <Leaf className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-primary font-semibold uppercase tracking-wide text-sm">
                    {slide.subtitle}
                  </span>
                </div>

                <h1 className="font-display text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                  <span className="inline-block">
                    {slide.title}
                  </span>
                </h1>

                <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
                  {slide.description}
                </p>
              </div>
            ))}

            <div className="flex flex-row gap-4">
              <Button
                onClick={scrollToContent}
                size="lg"
                className="btn-3d bg-gradient-hero text-lg px-8 text-primary-foreground"
              >
                View More
                <ChevronDown className="ml-2 w-5 h-5 animate-bounce" />
              </Button>
              <Button
                onClick={() => {
                  const element = document.getElementById("contact");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                size="lg"
                className="btn-3d border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground transition-smooth text-lg px-8"
              >
                Contact Us
              </Button>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center gap-3 mt-12 pt-8 border-t border-border">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative h-2 rounded-full transition-all duration-500 overflow-hidden ${index === currentSlide ? "w-12 bg-primary" : "w-8 bg-muted hover:bg-primary/50"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {index === currentSlide && (
                    <div className="absolute inset-0 bg-primary-foreground/30 shimmer" />
                  )}
                </button>
              ))}
              <span className="ml-4 text-sm text-muted-foreground">
                {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Desktop */}
        <button
          onClick={() => {
            prevSlide();
            setIsAutoPlaying(false);
          }}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-depth hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => {
            nextSlide();
            setIsAutoPlaying(false);
          }}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-depth hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </section>
    </div>
  );
};

export default Hero;
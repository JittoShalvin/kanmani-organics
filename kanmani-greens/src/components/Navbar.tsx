import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src="/cropped_circle_image.png" className="w-10 h-10 object-contain" alt="Kanmani Organics Logo" />
            <span className="font-display text-2xl font-bold text-foreground">
              Kanmani Organics
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              Contact
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-gradient-hero hover:shadow-hover transition-smooth"
            >
              Get in Touch
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("home")}
                className="text-foreground hover:text-primary transition-smooth font-medium text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("products")}
                className="text-foreground hover:text-primary transition-smooth font-medium text-left"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-foreground hover:text-primary transition-smooth font-medium text-left"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-foreground hover:text-primary transition-smooth font-medium text-left"
              >
                Contact
              </button>
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-gradient-hero hover:shadow-hover transition-smooth w-full"
              >
                Get in Touch
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

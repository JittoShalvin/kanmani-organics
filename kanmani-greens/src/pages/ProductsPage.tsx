import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailModal from "@/components/ProductDetailModal";
import { useProducts } from "@/hooks/useProducts";
import { useSettings } from "@/hooks/useSettings";
import { Product } from "@/data/products";

const ProductsPage = () => {
  const { products: allProducts, loading: productsLoading } = useProducts();
  const { settings, loading: settingsLoading } = useSettings();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  const products = allProducts.filter(p => p.visible !== false);
  
  const categories = Array.from(new Set(["all", ...products.map(p => p.category)])).filter(Boolean);

  const filteredProducts = activeFilter === "all" 
    ? products 
    : products.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="pt-24 pb-12 bg-gradient-card relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
            Our <span className="text-primary">{settings.products_title}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {settings.products_subtitle}
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by:</span>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(category)}
                className={activeFilter === category ? "bg-gradient-hero text-primary-foreground" : ""}
              >
                {category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => {
              const Icon = product.icon;
              return (
                <div
                  key={product.id}
                  className="card-3d animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="card-3d-inner overflow-hidden bg-card shadow-depth hover:shadow-3d transition-all duration-500 group h-full">
                    <div 
                      className="relative overflow-hidden aspect-square cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-all duration-700 backdrop-blur-[2px]" />
                      
                      {/* Floating Badge on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/50">
                          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-primary font-bold text-sm tracking-wide">
                            Discover More
                          </span>
                        </div>
                      </div>

                      {/* Corner accents */}
                      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/0 group-hover:border-white/80 transition-all duration-700" />
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/0 group-hover:border-white/80 transition-all duration-700" />
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {product.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-auto">
                        <Button
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          onClick={() => setSelectedProduct(product)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default ProductsPage;

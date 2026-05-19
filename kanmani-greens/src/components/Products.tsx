import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import ProductDetailModal from "./ProductDetailModal";
import { useProducts } from "@/hooks/useProducts";
import { useSettings } from "@/hooks/useSettings";
import { Product } from "@/data/products";

const Products = () => {
  const { products, loading: productsLoading } = useProducts();
  const { settings, loading: settingsLoading } = useSettings();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (settings.products_visible === 'false') return null;

  // Show only first 3 visible products on homepage
  const displayProducts = products.filter(p => p.visible !== false).slice(0, 3);

  return (
    <section id="products" className="py-20 bg-gradient-card relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <span className="text-primary font-semibold uppercase tracking-wide">
            Our Products
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            {settings.products_title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {settings.products_subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product, index) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className="card-3d animate-in fade-in slide-in-from-bottom duration-700 h-full"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Card className="card-3d-inner flex flex-col h-full overflow-hidden bg-card shadow-depth hover:shadow-3d transition-all duration-500 group">
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

                  <div className="p-6 relative flex flex-col flex-1">
                    <h3 className="font-display text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.features.slice(0, 2).map((feature, idx) => (
                        <div
                          key={idx}
                          className="bg-secondary/50 text-primary text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider"
                        >
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <Button
                        className="w-full btn-3d border-2 border-primary/20 bg-background text-primary hover:bg-primary hover:text-white font-bold transition-all py-6"
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

        {/* View More Button */}
        <div className="text-center mt-12">
          <Link to="/products">
            <Button
              size="lg"
              className="btn-3d bg-gradient-hero text-primary-foreground text-lg px-8 group"
            >
              View More Products
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-muted-foreground text-sm mt-3">
            Explore our complete range of {products.length} organic products
          </p>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};

export default Products;

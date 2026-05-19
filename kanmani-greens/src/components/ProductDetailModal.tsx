import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink, ShoppingCart, Package, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCallback } from "react";

const RATING_STARS = [0, 1, 2, 3, 4] as const;

const GRADIENT_STYLE_CSS = `
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  animation: gradient 3s ease infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-gradient {
    animation: none;
  }
}
`;

function normalizeHttpUrl(raw: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  
  // If it already has a protocol, use it
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  
  // Otherwise, prepend https://
  return `https://${trimmed}`;
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
  if (!product) return null;

  const Icon = product.icon;

  const handleBuyNow = useCallback(() => {
    if (!product.link) return;

    const safeUrl = normalizeHttpUrl(product.link);
    if (!safeUrl) return;

    window.open(safeUrl, "_blank", "noopener,noreferrer");
  }, [product.link]);

  const handleContactClick = useCallback(() => {
    onClose();
    window.setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }, [onClose]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-primary/[0.02] border-primary/20 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <Icon className="w-7 h-7 text-primary-foreground drop-shadow-md" />
              </div>
              <div>
                <DialogTitle className="font-display text-2xl md:text-3xl text-foreground">
                  {product.name}
                </DialogTitle>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 mt-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group aspect-square bg-white border border-primary/10">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1.5 text-sm capitalize font-semibold shadow-lg">
                  {product.category}
                </Badge>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                  Premium Quality
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-3 text-center border border-primary/20">
                <Check className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-medium text-foreground">100% Natural</p>
              </div>
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-3 text-center border border-accent/20">
                <Check className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xs font-medium text-foreground">Certified</p>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-3 text-center border border-primary/20">
                <Star className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-medium text-foreground">Top Rated</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-2xl p-5 border border-primary/10">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-primary to-accent rounded-full"></span>
                About This Product
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.fullDescription}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-primary to-accent rounded-full"></span>
                Key Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, idx) => (
                  <Badge
                    key={idx}
                    className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground px-4 py-1.5 hover:scale-105 transition-transform duration-300 shadow-sm"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-primary to-accent rounded-full"></span>
                Health Benefits
              </h3>
              <ul className="space-y-2.5">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Usage & Sizes */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="relative overflow-hidden p-6 bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-2xl border border-secondary/50 group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-lg font-bold text-foreground mb-3 relative z-10">How to Use</h3>
            <p className="text-muted-foreground leading-relaxed relative z-10">{product.usage}</p>
          </div>
          <div className="relative overflow-hidden p-6 bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl border border-primary/20 group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-lg font-bold text-foreground mb-3 relative z-10">Available Sizes</h3>
            <div className="flex flex-wrap gap-2 relative z-10">
              {product.sizes?.map((size, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-background rounded-full text-sm font-semibold text-foreground border-2 border-primary/20 hover:border-primary/50 hover:scale-105 transition-all duration-300 shadow-sm"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl blur-xl"></div>
          <div className="relative bg-gradient-to-r from-card to-card/95 rounded-2xl border border-primary/20 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-foreground font-semibold text-lg mb-1">
                  Ready to experience pure goodness?
                </p>
                <p className="text-muted-foreground text-sm">
                  Order now and get the best quality natural products delivered to your door!
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleContactClick}
                  className="px-6 py-3 rounded-xl font-semibold border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105 shadow-sm"
                >
                  Contact Us
                </button>
                {product.link && (
                  <a
                    href={normalizeHttpUrl(product.link) || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative px-8 py-3 rounded-xl font-semibold text-primary-foreground overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center no-underline"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient motion-reduce:animate-none"></div>
                    <span className="relative flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Buy Now
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      
      {/* Vite-friendly: keep keyframes in a CSS module (no runtime style injection). */}
    </Dialog>
  );
};

export default ProductDetailModal;
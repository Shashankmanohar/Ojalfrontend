import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden hover-lift shadow-soft">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            New
          </span>
        )}
        {product.isBestseller && (
          <span className="px-3 py-1 bg-foreground text-background text-xs font-medium rounded-full">
            Bestseller
          </span>
        )}
        {product.originalPrice && (
          <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full">
            Sale
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background">
        <Heart size={18} className="text-foreground" />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block image-zoom">
        <div className="aspect-square bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.subcategory}
          </p>
          <h3 className="font-heading text-lg font-medium leading-tight mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(product.rating)
                    ? 'fill-primary text-primary'
                    : 'text-muted'
                }
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-semibold text-primary">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <Button
            size="icon"
            variant="outline"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => addToCart(product)}
          >
            <ShoppingBag size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

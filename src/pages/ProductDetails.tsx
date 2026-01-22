import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, Heart, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { Product, convertBackendProduct } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import productService from '@/services/productService';
import { toast } from '@/hooks/use-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const backendProduct = await productService.getProductById(id);
        const convertedProduct = convertBackendProduct(backendProduct);
        setProduct(convertedProduct);

        // Fetch all products to find related ones
        const allProducts = await productService.getAllProducts();
        const related = allProducts
          .filter((p) => p.category === backendProduct.category && p._id !== id)
          .slice(0, 4)
          .map(convertBackendProduct);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-semibold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast({
        title: 'Out of Stock',
        description: 'This product is currently out of stock.',
        variant: 'destructive',
      });
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-secondary/50 py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/shop" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden bg-muted border-2 border-transparent hover:border-primary transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={`${product.name} view ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {product.isNew && (
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    New Arrival
                  </span>
                )}
                {product.isBestseller && (
                  <span className="px-3 py-1 bg-foreground text-background text-xs font-medium rounded-full">
                    Bestseller
                  </span>
                )}
                {!product.inStock && (
                  <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              <p className="text-muted-foreground text-sm uppercase tracking-wide mb-2">
                {product.subcategory}
              </p>
              <h1 className="font-heading text-3xl lg:text-4xl font-semibold mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(product.rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="font-heading text-3xl font-semibold text-primary">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-8">{product.description}</p>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button size="lg" variant="outline">
                  <Heart size={20} />
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-3 p-6 bg-secondary/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Truck size={20} className="text-primary" />
                  <span className="text-sm">Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={20} className="text-primary" />
                  <span className="text-sm">30-day easy returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-primary" />
                  <span className="text-sm">2-year warranty included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="font-heading text-2xl lg:text-3xl font-semibold mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

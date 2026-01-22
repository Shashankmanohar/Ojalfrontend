import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { categories, Product, convertBackendProduct } from '@/lib/data';
import productService from '@/services/productService';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% protected checkout',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Handcrafted excellence',
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const backendProducts = await productService.getAllProducts();
        const convertedProducts = backendProducts.map(convertBackendProduct);
        setProducts(convertedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.filter((p) => p.isBestseller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const displayProducts = products.slice(0, 4); // Fallback if no featured/new products

  return (
    <div>
      {/* Hero Section - Classic & Elegant Design */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-amber-100/20 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-slate-200/20 rounded-full blur-2xl" />

          {/* Decorative Lines */}
          <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
          <div className="absolute bottom-1/3 right-0 w-40 h-px bg-gradient-to-l from-transparent via-slate-300/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-amber-200/50 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700 tracking-wide">
                  PREMIUM COLLECTION 2026
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                  <span className="block text-slate-900">Timeless</span>
                  <span className="block bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                    Elegance
                  </span>
                  <span className="block text-slate-800">For Your Table</span>
                </h1>

                {/* Decorative Divider */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-transparent" />
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                </div>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl font-light">
                Discover our exquisite collection of handcrafted crockery and glassware.
                Each piece is meticulously designed to bring sophistication and grace to your dining experience.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="px-8 py-6 text-base bg-slate-900 hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  asChild
                >
                  <Link to="/shop" className="flex items-center">
                    Explore Collection
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base border-2 border-slate-300 hover:border-slate-900 hover:bg-slate-50 transition-all duration-300"
                  asChild
                >
                  <Link to="/about">Our Craftsmanship</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-8 border-t border-slate-200">
                <div>
                  <p className="text-3xl font-bold text-slate-900">10K+</p>
                  <p className="text-sm text-slate-600 mt-1">Happy Customers</p>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div>
                  <p className="text-3xl font-bold text-slate-900">500+</p>
                  <p className="text-sm text-slate-600 mt-1">Premium Products</p>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div>
                  <p className="text-3xl font-bold text-slate-900">98%</p>
                  <p className="text-sm text-slate-600 mt-1">Satisfaction Rate</p>
                </div>
              </div>
            </div>

            {/* Right Content - Image Showcase */}
            <div className="relative hidden lg:block animate-slide-up">
              {/* Main Image Container */}
              <div className="relative">
                {/* Large Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80"
                    alt="Premium crockery collection"
                    className="w-full h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                </div>

                {/* Floating Card 1 - Top Right */}
                <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 backdrop-blur-sm border border-slate-100 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Award size={24} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Premium Quality</p>
                      <p className="font-semibold text-slate-900">Certified</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 - Bottom Left */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-5 backdrop-blur-sm border border-slate-100 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">4.9</p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 fill-amber-400" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="border-l border-slate-200 pl-4">
                      <p className="text-xs text-slate-500">Customer</p>
                      <p className="font-semibold text-slate-900">Reviews</p>
                    </div>
                  </div>
                </div>

                {/* Small Accent Image */}
                <div className="absolute top-1/2 -left-12 w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80"
                    alt="Elegant glassware"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-slate-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-8 bg-secondary/50 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Explore our carefully curated collections, each designed to bring
              elegance and functionality to your table.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.slice(0, 8).map((category, index) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                  <h3 className="font-heading text-lg lg:text-xl font-semibold text-background mb-1">
                    {category.name}
                  </h3>
                  <p className="text-background/80 text-sm hidden sm:block">
                    {category.subcategories.length} items
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h2 className="font-heading text-3xl lg:text-4xl font-semibold mb-2">
                {featuredProducts.length > 0 ? 'Bestsellers' : 'Our Products'}
              </h2>
              <p className="text-muted-foreground">
                {featuredProducts.length > 0 ? 'Our most loved pieces, chosen by you' : 'Discover our collection'}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/shop">
                View All
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(featuredProducts.length > 0 ? featuredProducts : displayProducts).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-charcoal to-charcoal-light">
            <div className="absolute inset-0 opacity-30">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200"
                alt="Table setting"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 p-8 lg:p-16 text-center">
              <h2 className="font-heading text-3xl lg:text-5xl font-semibold text-background mb-4">
                The Art of Dining
              </h2>
              <p className="text-background/80 text-lg mb-8 max-w-2xl mx-auto">
                Experience the perfect blend of form and function. Our collections are
                designed to make every meal a celebration.
              </p>
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
                asChild
              >
                <Link to="/shop">Explore Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <div>
                <h2 className="font-heading text-3xl lg:text-4xl font-semibold mb-2">
                  New Arrivals
                </h2>
                <p className="text-muted-foreground">
                  Fresh additions to our collection
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/shop">
                  View All
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold mb-4">
              Join the OJAL Family
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to receive exclusive offers, early access to new collections,
              and curated content delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button size="lg">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

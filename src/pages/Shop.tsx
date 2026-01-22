import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { categories, Product, convertBackendProduct } from '@/lib/data';
import productService from '@/services/productService';
import { toast } from '@/hooks/use-toast';

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const selectedCategory = searchParams.get('category') || 'all';

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const backendProducts = await productService.getAllProducts();
                const convertedProducts = backendProducts.map(convertBackendProduct);
                setProducts(convertedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load products. Please try again.',
                    variant: 'destructive',
                });
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filter by category
        if (selectedCategory !== 'all') {
            result = result.filter((p) => {
                const productCategory = p.category.toLowerCase().replace(/\s+/g, '-');
                const selectedCat = selectedCategory.toLowerCase();

                // Direct match or category name contains the selected category
                return productCategory === selectedCat ||
                    productCategory.includes(selectedCat) ||
                    p.category.toLowerCase() === selectedCat ||
                    p.subcategory.toLowerCase().includes(selectedCat);
            });
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.subcategory.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query)
            );
        }

        // Sort
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                result = result.filter((p) => p.isNew).concat(result.filter((p) => !p.isNew));
                break;
            default:
                // featured - bestsellers first
                result = result
                    .filter((p) => p.isBestseller)
                    .concat(result.filter((p) => !p.isBestseller));
        }

        return result;
    }, [selectedCategory, searchQuery, sortBy, products]);

    const handleCategoryChange = (categoryId: string) => {
        if (categoryId === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', categoryId);
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="bg-secondary/50 py-12 lg:py-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <h1 className="font-heading text-3xl lg:text-4xl font-semibold mb-4">
                        Shop Collection
                    </h1>
                    <p className="text-muted-foreground max-w-xl">
                        Explore our complete range of premium crockery and glassware,
                        crafted to bring elegance to your everyday dining.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <h3 className="font-heading text-lg font-semibold mb-4">Categories</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleCategoryChange('all')}
                                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === 'all'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                        }`}
                                >
                                    All Products
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryChange(category.id)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.id
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Mobile Filter Button */}
                            <Button
                                variant="outline"
                                className="lg:hidden"
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                            >
                                <SlidersHorizontal size={18} className="mr-2" />
                                Filters
                            </Button>

                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none px-4 py-2.5 pr-10 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                                />
                            </div>
                        </div>

                        {/* Mobile Filters */}
                        {isFilterOpen && (
                            <div className="lg:hidden mb-6 p-4 bg-secondary/50 rounded-lg animate-fade-in">
                                <h3 className="font-heading text-lg font-semibold mb-4">Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleCategoryChange('all')}
                                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${selectedCategory === 'all'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-background border border-border hover:bg-muted'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategoryChange(category.id)}
                                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${selectedCategory === category.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-background border border-border hover:bg-muted'
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading ? (
                            <div className="text-center py-16">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                                <p className="mt-4 text-muted-foreground">Loading products...</p>
                            </div>
                        ) : (
                            <>
                                {/* Results Count */}
                                <p className="text-muted-foreground text-sm mb-6">
                                    Showing {filteredProducts.length} products
                                </p>

                                {/* Products Grid */}
                                {filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {filteredProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <p className="text-muted-foreground mb-4">
                                            No products found matching your criteria.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSearchQuery('');
                                                handleCategoryChange('all');
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

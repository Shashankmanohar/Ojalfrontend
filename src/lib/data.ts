export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

// Backend product type from API
export interface BackendProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  images: Array<{ cloudinaryUrl: string; cloudinaryPublicId: string }>;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Convert backend product to frontend product format
export function convertBackendProduct(backendProduct: BackendProduct): Product {
  return {
    id: backendProduct._id,
    name: backendProduct.title,
    category: backendProduct.category,
    subcategory: backendProduct.category, // Can be enhanced with subcategory field
    price: backendProduct.price,
    rating: 4.5, // Default rating, can be enhanced with reviews system
    reviews: 0,
    image: backendProduct.images[0]?.cloudinaryUrl || '',
    description: backendProduct.description,
    inStock: backendProduct.stock > 0 && backendProduct.isActive,
    isNew: false, // Can be enhanced by checking createdAt date
    isBestseller: false, // Can be enhanced with sales data
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  subcategories: string[];
}

export const categories: Category[] = [
  {
    id: "plates",
    name: "Plates",
    description: "Elegant plates for every occasion",
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=600",
    subcategories: ["Dinner Plate", "Side Plate", "Dessert Plate", "Snack Plate", "Charger Plate"],
  },
  {
    id: "bowls",
    name: "Bowls",
    description: "Beautifully crafted bowls for serving and dining",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600",
    subcategories: ["Cereal Bowl", "Soup Bowl", "Dessert Bowl", "Serving Bowl", "Mixing Bowl"],
  },
  {
    id: "cups-mugs",
    name: "Cups & Mugs",
    description: "Premium cups and mugs for your beverages",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600",
    subcategories: ["Tea Cup", "Coffee Cup", "Mug", "Saucer"],
  },
  {
    id: "serving-crockery",
    name: "Serving Crockery",
    description: "Stunning serving pieces for memorable gatherings",
    image: "https://images.unsplash.com/photo-1594761051903-4f4f51be5fa5?w=600",
    subcategories: ["Serving Platter", "Casserole Dish", "Salad Bowl", "Gravy Boat", "Butter Dish", "Soup Tureen"],
  },
  {
    id: "drinkware",
    name: "Drinkware",
    description: "Crystal-clear glassware for every drink",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600",
    subcategories: ["Water Glass", "Juice Glass", "Tumbler", "Whisky Glass", "Wine Glass", "Tea Glass", "Milk Glass"],
  },
  {
    id: "tea-coffee-crockery",
    name: "Tea & Coffee Crockery",
    description: "Sophisticated tea and coffee sets",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600",
    subcategories: ["Tea Pot", "Coffee Pot", "Milk Jug", "Sugar Pot"],
  },
  {
    id: "specialty-crockery",
    name: "Specialty Crockery",
    description: "Unique pieces for special dining experiences",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600",
    subcategories: ["Ramekin", "Chip-and-Dip Plate", "Pasta Bowl"],
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Ivory Elegance Dinner Plate",
    category: "plates",
    subcategory: "Dinner Plate",
    price: 45,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=600",
    description: "A timeless dinner plate with a delicate gold rim, perfect for elegant dining experiences.",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "2",
    name: "Marble Touch Side Plate",
    category: "plates",
    subcategory: "Side Plate",
    price: 28,
    originalPrice: 35,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600",
    description: "Sophisticated marble-effect side plate that adds luxury to any table setting.",
    inStock: true,
    isNew: true,
  },
  {
    id: "3",
    name: "Crystal Clear Water Glass",
    category: "drinkware",
    subcategory: "Water Glass",
    price: 22,
    rating: 4.9,
    reviews: 256,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600",
    description: "Hand-blown crystal water glass with exceptional clarity and elegant design.",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "4",
    name: "Artisan Ceramic Soup Bowl",
    category: "bowls",
    subcategory: "Soup Bowl",
    price: 38,
    rating: 4.7,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600",
    description: "Handcrafted ceramic bowl with rustic charm and modern elegance.",
    inStock: true,
  },
  {
    id: "5",
    name: "Golden Rim Tea Cup Set",
    category: "cups-mugs",
    subcategory: "Tea Cup",
    price: 65,
    rating: 4.9,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600",
    description: "Delicate porcelain tea cup with matching saucer, featuring hand-painted gold details.",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "6",
    name: "Grand Serving Platter",
    category: "serving-crockery",
    subcategory: "Serving Platter",
    price: 89,
    rating: 4.8,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1594761051903-4f4f51be5fa5?w=600",
    description: "Magnificent oval serving platter perfect for entertaining guests.",
    inStock: true,
    isNew: true,
  },
  {
    id: "7",
    name: "Bordeaux Wine Glass",
    category: "drinkware",
    subcategory: "Wine Glass",
    price: 32,
    rating: 4.7,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600",
    description: "Classic wine glass designed to enhance the bouquet and flavors of red wines.",
    inStock: true,
  },
  {
    id: "8",
    name: "Victorian Tea Pot",
    category: "tea-coffee-crockery",
    subcategory: "Tea Pot",
    price: 125,
    rating: 4.9,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600",
    description: "Exquisite porcelain tea pot with vintage-inspired design and gold accents.",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "9",
    name: "Minimalist Coffee Mug",
    category: "cups-mugs",
    subcategory: "Mug",
    price: 24,
    rating: 4.5,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=600",
    description: "Modern matte-finish mug with comfortable handle for your daily coffee ritual.",
    inStock: true,
  },
  {
    id: "10",
    name: "Artisan Pasta Bowl",
    category: "specialty-crockery",
    subcategory: "Pasta Bowl",
    price: 42,
    rating: 4.6,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600",
    description: "Wide, shallow bowl designed perfectly for pasta dishes and risotto.",
    inStock: true,
    isNew: true,
  },
  {
    id: "11",
    name: "Crystal Whisky Glass",
    category: "drinkware",
    subcategory: "Whisky Glass",
    price: 48,
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600",
    description: "Heavy-bottomed crystal whisky glass with geometric cut design.",
    inStock: true,
  },
  {
    id: "12",
    name: "Elegant Dessert Plate",
    category: "plates",
    subcategory: "Dessert Plate",
    price: 32,
    rating: 4.7,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600",
    description: "Refined dessert plate with subtle floral motif and scalloped edges.",
    inStock: true,
  },
];

export interface CartItem extends Product {
  quantity: number;
}

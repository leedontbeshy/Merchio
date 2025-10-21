export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number; // 0..5
  stock: number;
  imageUrl: string;
  createdAt: string;
  tags: string[];
  specifications: Record<string, string>;
  isActive: boolean;
  views: number;
  sales: number;
};

export type Review = {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
};

export type Favorite = {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
};

const STORAGE_KEY = "merchio_products";

// Simple UUID generator
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const seedProducts: Product[] = [
  {
    id: generateUUID(),
    name: "Basic Tee",
    description: "Soft cotton tee in charcoal. Perfect for everyday wear with a comfortable fit and premium quality fabric.",
    price: 199000,
    category: "Apparel",
    rating: 4,
    stock: 32,
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    tags: ["cotton", "casual", "basic"],
    specifications: {
      "Material": "100% Cotton",
      "Size": "S, M, L, XL",
      "Color": "Charcoal",
      "Care": "Machine wash cold"
    },
    isActive: true,
    views: 156,
    sales: 23,
  },
  {
    id: generateUUID(),
    name: "Canvas Tote",
    description: "Durable everyday tote bag made from premium canvas. Spacious interior with reinforced handles.",
    price: 259000,
    category: "Bags",
    rating: 5,
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1546421845-6471bdcf3ebf?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    tags: ["canvas", "tote", "eco-friendly"],
    specifications: {
      "Material": "Heavy-duty Canvas",
      "Dimensions": "40cm x 35cm x 10cm",
      "Weight": "500g",
      "Features": "Reinforced handles, Interior pocket"
    },
    isActive: true,
    views: 89,
    sales: 12,
  },
  {
    id: generateUUID(),
    name: "Ceramic Mug",
    description: "12oz matte black ceramic mug with ergonomic handle. Perfect for coffee, tea, or any hot beverage.",
    price: 99000,
    category: "Home",
    rating: 3,
    stock: 54,
    imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    tags: ["ceramic", "mug", "kitchen"],
    specifications: {
      "Material": "Ceramic",
      "Capacity": "12oz (350ml)",
      "Finish": "Matte black",
      "Dishwasher": "Safe"
    },
    isActive: true,
    views: 203,
    sales: 45,
  },
  {
    id: generateUUID(),
    name: "Wireless Headphones",
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    price: 1299000,
    category: "Electronics",
    rating: 4.5,
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    tags: ["wireless", "headphones", "noise-cancellation"],
    specifications: {
      "Battery": "30 hours",
      "Connectivity": "Bluetooth 5.0",
      "Noise Cancellation": "Active",
      "Weight": "250g"
    },
    isActive: true,
    views: 312,
    sales: 67,
  },
  {
    id: generateUUID(),
    name: "Leather Wallet",
    description: "Genuine leather wallet with RFID blocking technology and multiple card slots.",
    price: 399000,
    category: "Accessories",
    rating: 4.2,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    tags: ["leather", "wallet", "rfid"],
    specifications: {
      "Material": "Genuine Leather",
      "RFID Protection": "Yes",
      "Card Slots": "8",
      "Coin Pocket": "Yes"
    },
    isActive: true,
    views: 178,
    sales: 34,
  },
];

function readAll(): Product[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
    return seedProducts;
  }
  try {
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

export function listProducts(params?: {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}): { products: Product[]; total: number; totalPages: number } {
  let items = readAll();
  const { q, category, minPrice, maxPrice, minRating, inStock, sortBy = "createdAt", sortOrder = "desc", page = 1, pageSize = 12 } = params || {};

  // Search
  if (q) {
    const s = q.toLowerCase();
    items = items.filter(
      (p) => 
        p.name.toLowerCase().includes(s) || 
        p.description.toLowerCase().includes(s) ||
        p.tags.some(tag => tag.toLowerCase().includes(s))
    );
  }

  // Category filter
  if (category && category !== "all") {
    items = items.filter((p) => p.category === category);
  }

  // Price range
  if (typeof minPrice === "number") items = items.filter((p) => p.price >= minPrice);
  if (typeof maxPrice === "number") items = items.filter((p) => p.price <= maxPrice);

  // Rating filter
  if (typeof minRating === "number") {
    items = items.filter((p) => p.rating >= minRating);
  }

  // Stock filter
  if (inStock === "inStock") items = items.filter((p) => p.stock > 0);
  if (inStock === "outOfStock") items = items.filter((p) => p.stock === 0);
  if (inStock === "lowStock") items = items.filter((p) => p.stock > 0 && p.stock < 10);

  // Sort
  items = [...items].sort((a, b) => {
    let aVal: any, bVal: any;
    
    switch (sortBy) {
      case "name":
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case "price":
        aVal = a.price;
        bVal = b.price;
        break;
      case "rating":
        aVal = a.rating;
        bVal = b.rating;
        break;
      case "stock":
        aVal = a.stock;
        bVal = b.stock;
        break;
      case "views":
        aVal = a.views;
        bVal = b.views;
        break;
      case "sales":
        aVal = a.sales;
        bVal = b.sales;
        break;
      default:
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
    }

    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  return {
    products: paginatedItems,
    total,
    totalPages,
  };
}

export function getProduct(id: string): Product | undefined {
  const product = readAll().find((p) => p.id === id);
  if (product) {
    // Increment view count
    const items = readAll();
    const index = items.findIndex(p => p.id === id);
    if (index >= 0) {
      items[index].views += 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }
  return product;
}

export function upsertProduct(product: Omit<Product, "id" | "createdAt" | "views" | "sales"> & { id?: string }) {
  const items = readAll();
  if (product.id) {
    const idx = items.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...product } as Product;
    }
  } else {
    const created: Product = {
      ...product,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      views: 0,
      sales: 0,
    } as Product;
    items.unshift(created);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function deleteProduct(id: string) {
  const items = readAll().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function listCategories(): string[] {
  const items = readAll();
  const set = new Set(items.map((p) => p.category));
  return ["all", ...Array.from(set)];
}

// Reviews functions
const REVIEWS_KEY = "merchio_reviews";

export function addReview(review: Omit<Review, "id" | "createdAt">) {
  const reviews = getReviews();
  const newReview: Review = {
    ...review,
    id: generateUUID(),
    createdAt: new Date().toISOString(),
  };
  reviews.push(newReview);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  
  // Update product rating
  const productReviews = getReviews(review.productId);
  const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
  
  const items = readAll();
  const productIndex = items.findIndex(p => p.id === review.productId);
  if (productIndex >= 0) {
    items[productIndex].rating = Math.round(averageRating * 10) / 10; // Round to 1 decimal
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  
  return newReview;
}

export function getReviews(productId?: string): Review[] {
  const raw = localStorage.getItem(REVIEWS_KEY);
  if (!raw) return [];
  try {
    const reviews = JSON.parse(raw) as Review[];
    return productId ? reviews.filter(r => r.productId === productId) : reviews;
  } catch {
    return [];
  }
}

// Favorites functions
const FAVORITES_KEY = "merchio_favorites";

export function addToFavorites(productId: string, userId: string = "user1") {
  const favorites = getFavorites();
  if (!favorites.find(f => f.productId === productId && f.userId === userId)) {
    const favorite: Favorite = {
      id: generateUUID(),
      productId,
      userId,
      createdAt: new Date().toISOString(),
    };
    favorites.push(favorite);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFromFavorites(productId: string, userId: string = "user1") {
  const favorites = getFavorites();
  const filtered = favorites.filter(f => !(f.productId === productId && f.userId === userId));
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
}

export function getFavorites(userId: string = "user1"): Favorite[] {
  const raw = localStorage.getItem(FAVORITES_KEY);
  if (!raw) return [];
  try {
    const favorites = JSON.parse(raw) as Favorite[];
    return favorites.filter(f => f.userId === userId);
  } catch {
    return [];
  }
}

export function isFavorite(productId: string, userId: string = "user1"): boolean {
  return getFavorites(userId).some(f => f.productId === productId);
}

// Analytics functions
export function getProductStats() {
  const products = readAll();
  const reviews = getReviews();
  
  return {
    totalProducts: products.length,
    totalCategories: new Set(products.map(p => p.category)).size,
    totalReviews: reviews.length,
    averageRating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
    totalViews: products.reduce((sum, p) => sum + p.views, 0),
    totalSales: products.reduce((sum, p) => sum + p.sales, 0),
    lowStockProducts: products.filter(p => p.stock < 10).length,
    outOfStockProducts: products.filter(p => p.stock === 0).length,
  };
}

// Related products function
export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const currentProduct = getProduct(productId);
  if (!currentProduct) return [];
  
  const allProducts = readAll();
  return allProducts
    .filter(p => p.id !== productId && p.category === currentProduct.category)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// Update review helpful count
export function updateReviewHelpful(reviewId: string) {
  const reviews = getReviews();
  const reviewIndex = reviews.findIndex(r => r.id === reviewId);
  if (reviewIndex >= 0) {
    reviews[reviewIndex].helpful += 1;
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }
}



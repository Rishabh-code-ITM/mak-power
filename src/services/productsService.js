import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './mockData';

const PRODUCTS_STORAGE_KEY = 'mak_power_products_catalog';
const CATEGORIES_STORAGE_KEY = 'mak_power_categories_catalog';

// Helper to get local data
function getLocalProducts() {
  const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

function saveLocalProducts(products) {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

function getLocalCategories() {
  const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
  return INITIAL_CATEGORIES;
}

export const productsService = {
  // Fetch all categories
  async getCategories() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        if (!error && data?.length) return data;
      } catch (err) {
        console.warn('Supabase categories fetch error, falling back to local data', err);
      }
    }
    return getLocalCategories();
  },

  // Fetch all products with filtering & sorting
  async getProducts({ category = 'all', search = '', sortBy = 'featured', inStockOnly = false, minPrice = 0, maxPrice = 10000 } = {}) {
    let list = [];
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('products').select('*, categories(name, slug)').eq('is_active', true);
        if (inStockOnly) query = query.gt('stock_quantity', 0);
        if (search) query = query.ilike('name', `%${search}%`);
        const { data, error } = await query;
        if (!error && data?.length) {
          list = data.map(item => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            categorySlug: item.categories?.slug || 'accessories',
            categoryName: item.categories?.name || 'Accessories',
            originalPrice: Number(item.original_price),
            sellingPrice: Number(item.selling_price),
            stock: item.stock_quantity,
            rating: Number(item.rating || 4.8),
            reviewsCount: item.reviews_count || 10,
            isFeatured: item.is_featured,
            isTrending: item.is_trending,
            isBestseller: item.is_bestseller,
            warrantyMonths: item.warranty_months,
            images: [item.image_url || '/image/featured-electronics.jpg'],
            shortDesc: item.short_desc,
            description: item.description,
            specifications: item.specifications || {}
          }));
        }
      } catch (err) {
        console.warn('Supabase products fetch failed, using local demo data', err);
      }
    }

    if (!list.length) {
      list = getLocalProducts();
    }

    // Apply Client-Side Filters
    let filtered = list.filter(item => {
      const matchCategory = category === 'all' || item.categorySlug === category;
      const matchSearch = !search || 
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        (item.shortDesc && item.shortDesc.toLowerCase().includes(search.toLowerCase())) ||
        (item.categoryName && item.categoryName.toLowerCase().includes(search.toLowerCase()));
      const matchStock = !inStockOnly || item.stock > 0;
      const matchPrice = item.sellingPrice >= minPrice && item.sellingPrice <= maxPrice;

      return matchCategory && matchSearch && matchStock && matchPrice;
    });

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      // featured / default
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return filtered;
  },

  // Get product by slug
  async getProductBySlug(slug) {
    const all = await this.getProducts();
    return all.find(p => p.slug === slug) || null;
  },

  // Admin: Add Product
  async addProduct(newProduct) {
    const products = getLocalProducts();
    const product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      slug: newProduct.slug || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      stock: Number(newProduct.stock) || 0,
      originalPrice: Number(newProduct.originalPrice) || Number(newProduct.sellingPrice),
      sellingPrice: Number(newProduct.sellingPrice) || 0,
      rating: 5.0,
      reviewsCount: 1,
      images: newProduct.images?.length ? newProduct.images : ['/image/featured-electronics.jpg']
    };
    products.unshift(product);
    saveLocalProducts(products);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('products').insert({
          name: product.name,
          slug: product.slug,
          original_price: product.originalPrice,
          selling_price: product.sellingPrice,
          stock_quantity: product.stock,
          is_featured: product.isFeatured || false,
          is_trending: product.isTrending || false,
          is_bestseller: product.isBestseller || false,
          short_desc: product.shortDesc,
          description: product.description,
          warranty_months: product.warrantyMonths || 6,
          specifications: product.specifications || {}
        });
      } catch (err) {
        console.error('Supabase product insert error', err);
      }
    }

    return product;
  },

  // Admin: Update Product
  async updateProduct(id, updatedFields) {
    const products = getLocalProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedFields };
      saveLocalProducts(products);
      return products[index];
    }
    return null;
  },

  // Admin: Delete Product
  async deleteProduct(id) {
    const products = getLocalProducts();
    const filtered = products.filter(p => p.id !== id);
    saveLocalProducts(filtered);
    return true;
  },

  // Reset to default sample catalog
  resetToDefaults() {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_PRODUCTS;
  }
};

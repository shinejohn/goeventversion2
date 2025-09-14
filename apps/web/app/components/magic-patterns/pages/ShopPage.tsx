import React from 'react';
import { Link } from 'react-router';
import { ShoppingCartIcon, FilterIcon, StarIcon, TruckIcon, ShieldCheckIcon, HeadphonesIcon, XIcon, CheckIcon, ArrowRightIcon, TagIcon, GridIcon, ListIcon } from 'lucide-react';
import { ShopCard } from '../components/ui/EnhancedCard';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string | null;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  images: string[];
  brand?: string | null;
  sku: string;
  inStock: boolean;
  stockCount: number;
  rating?: number | null;
  reviewCount: number;
  tags: string[];
  features: string[];
  isNew: boolean;
  isSale: boolean;
  isFeatured: boolean;
}

interface ShopPageProps {
  products: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  filters?: any;
  metrics?: {
    totalProducts: number;
    productsOnSale: number;
    newProducts: number;
    averageRating: number;
    priceRange: {
      min: number;
      max: number;
    };
    categories: Record<string, number>;
    brands: string[];
  };
  featuredDeals?: Array<Product & { discount: number }>;
}

export const ShopPage = ({ 
  products = [],
  pagination,
  filters = {},
  metrics,
  featuredDeals = []
}: ShopPageProps) => {
  // Default values for SSR
  const viewMode: 'grid' | 'list' = 'grid';
  const showFilters = false;
  const selectedCategory = filters.category || null;
  const priceRange: [number, number] = [filters.minPrice || 0, filters.maxPrice || 10000];
  
  const categories = [
    { id: 'audio', name: 'Audio Equipment', icon: '🎵' },
    { id: 'lighting', name: 'Lighting', icon: '💡' },
    { id: 'stage', name: 'Stage Equipment', icon: '🎭' },
    { id: 'instruments', name: 'Instruments', icon: '🎸' },
    { id: 'dj-equipment', name: 'DJ Equipment', icon: '🎧' },
    { id: 'merchandise', name: 'Merchandise', icon: '👕' },
    { id: 'accessories', name: 'Accessories', icon: '🎒' },
    { id: 'decorations', name: 'Decorations', icon: '🎨' },
    { id: 'safety', name: 'Safety Equipment', icon: '🦺' },
  ];
  
  const renderRating = (rating: number | null, reviewCount: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating) 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="ml-1 text-sm text-gray-600">({reviewCount})</span>
      </div>
    );
  };
  
  const renderProduct = (product: Product) => {
    const discount = product.compareAtPrice 
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;
    
    if (viewMode === 'list') {
      return (
        <Link
          key={product.id}
          to={`/shop/products/${product.id}`}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer flex gap-4"
        >
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 hover:text-indigo-600">{product.name}</h3>
                {product.brand && <p className="text-sm text-gray-500">{product.brand}</p>}
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {product.isNew && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">New</span>
                  )}
                  {product.isSale && (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">{discount}% OFF</span>
                  )}
                  {product.isFeatured && (
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Featured</span>
                  )}
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="flex flex-col items-end">
                  {product.compareAtPrice && (
                    <span className="text-sm text-gray-500 line-through">${product.compareAtPrice}</span>
                  )}
                  <span className="text-xl font-bold text-gray-900">${product.price}</span>
                </div>
                {renderRating(product.rating, product.reviewCount)}
                <div className="mt-2">
                  {product.inStock ? (
                    <span className="text-green-600 text-sm flex items-center">
                      <CheckIcon className="w-4 h-4 mr-1" />
                      In Stock ({product.stockCount})
                    </span>
                  ) : (
                    <span className="text-red-600 text-sm flex items-center">
                      <XIcon className="w-4 h-4 mr-1" />
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      );
    }
    
    return (
      <Link
        key={product.id}
        to={`/shop/products/${product.id}`}
        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="relative h-48">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {(product.isNew || product.isSale || product.isFeatured) && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && (
                <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs rounded-full">New</span>
              )}
              {product.isSale && (
                <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs rounded-full">{discount}% OFF</span>
              )}
              {product.isFeatured && (
                <span className="inline-block px-2 py-1 bg-purple-600 text-white text-xs rounded-full">Featured</span>
              )}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 hover:text-indigo-600 line-clamp-1">{product.name}</h3>
          {product.brand && <p className="text-sm text-gray-500">{product.brand}</p>}
          <div className="mt-2">
            {renderRating(product.rating, product.reviewCount)}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through mr-2">${product.compareAtPrice}</span>
              )}
              <span className="text-lg font-bold text-gray-900">${product.price}</span>
            </div>
            <div>
              {product.inStock ? (
                <span className="text-green-600 text-sm">In Stock</span>
              ) : (
                <span className="text-red-600 text-sm">Out of Stock</span>
              )}
            </div>
          </div>
          {product.features.length > 0 && (
            <div className="mt-2">
              <ul className="text-xs text-gray-600 space-y-1">
                {product.features.slice(0, 2).map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckIcon className="w-3 h-3 mr-1 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Link>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Event Equipment & Gear Shop</h1>
            <p className="text-xl mb-8">Everything you need to make your events unforgettable</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-center">
                <TruckIcon className="w-6 h-6 mr-2" />
                <span>Free Shipping $100+</span>
              </div>
              <div className="flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 mr-2" />
                <span>Quality Guaranteed</span>
              </div>
              <div className="flex items-center justify-center">
                <HeadphonesIcon className="w-6 h-6 mr-2" />
                <span>Expert Support</span>
              </div>
              <div className="flex items-center justify-center">
                <TagIcon className="w-6 h-6 mr-2" />
                <span>Best Prices</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Deals */}
      {featuredDeals.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDeals.slice(0, 3).map((deal) => (
              <Link
                key={deal.id}
                to={`/shop/products/${deal.id}`}
                className="bg-white border-2 border-red-500 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={deal.images[0]}
                    alt={deal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="inline-block px-3 py-1 bg-red-600 text-white text-lg font-bold rounded-full">
                      {deal.discount}% OFF
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900">{deal.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500 line-through mr-2">${deal.compareAtPrice}</span>
                      <span className="text-xl font-bold text-red-600">${deal.price}</span>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium">
                      Shop Now
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Shop by Category</h2>
          <Link 
            to="/shop"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                selectedCategory === category.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className="text-2xl mb-1">{category.icon}</span>
              <span className="text-xs text-center">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Filters and Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FilterIcon className="w-4 h-4 mr-2" />
              Filters
            </button>
            <span className="text-sm text-gray-500">
              {metrics?.totalProducts || 0} products
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Products Grid/List */}
        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or browse all products.
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {products.map(renderProduct)}
          </div>
        )}
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-1">
              <Link
                to={`/shop?page=${pagination.page - 1}`}
                className={`px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 ${
                  pagination.page === 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                }`}
              >
                Previous
              </Link>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <Link
                  key={i + 1}
                  to={`/shop?page=${i + 1}`}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    pagination.page === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
              <Link
                to={`/shop?page=${pagination.page + 1}`}
                className={`px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 ${
                  !pagination.hasMore ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                }`}
              >
                Next
              </Link>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { SearchIcon, ShoppingCartIcon, FilterIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

// Product type definition
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  description: string;
  vendor: string;
  inStock: boolean;
}

// Mock data - replace with Supabase data later
const mockProducts: Product[] = [
  // Featured Products
  {
    id: '1',
    name: 'Professional DJ Controller',
    price: 599.99,
    image: 'https://picsum.photos/seed/dj-controller/400/300',
    category: 'DJ Equipment',
    featured: true,
    description: 'High-performance DJ controller with 4-channel mixing',
    vendor: 'ProSound Gear',
    inStock: true
  },
  {
    id: '2',
    name: 'Stage Lighting Kit',
    price: 899.99,
    image: 'https://picsum.photos/seed/stage-lights/400/300',
    category: 'Lighting',
    featured: true,
    description: 'Complete LED stage lighting setup with DMX control',
    vendor: 'BrightStage Lighting',
    inStock: true
  },
  {
    id: '3',
    name: 'Wireless Microphone System',
    price: 399.99,
    image: 'https://picsum.photos/seed/wireless-mic/400/300',
    category: 'Audio',
    featured: true,
    description: '4-channel wireless microphone system with UHF technology',
    vendor: 'ClearSound Audio',
    inStock: true
  },
  // Regular Products
  {
    id: '4',
    name: 'PA Speaker System',
    price: 1299.99,
    image: 'https://picsum.photos/seed/pa-speakers/400/300',
    category: 'Audio',
    featured: false,
    description: 'Powerful 1000W PA system perfect for events',
    vendor: 'ProSound Gear',
    inStock: true
  },
  {
    id: '5',
    name: 'Event Tent 20x20',
    price: 2499.99,
    image: 'https://picsum.photos/seed/event-tent/400/300',
    category: 'Tents & Canopies',
    featured: false,
    description: 'Heavy-duty event tent with sidewalls',
    vendor: 'EventPro Supplies',
    inStock: true
  },
  {
    id: '6',
    name: 'Fog Machine Pro',
    price: 149.99,
    image: 'https://picsum.photos/seed/fog-machine/400/300',
    category: 'Special Effects',
    featured: false,
    description: '1500W fog machine with wireless remote',
    vendor: 'FX Masters',
    inStock: true
  },
  {
    id: '7',
    name: 'Portable Stage Platform',
    price: 799.99,
    image: 'https://picsum.photos/seed/stage-platform/400/300',
    category: 'Staging',
    featured: false,
    description: 'Modular stage platform 4x8 feet',
    vendor: 'StageWorks',
    inStock: true
  },
  {
    id: '8',
    name: 'LED Dance Floor',
    price: 3499.99,
    image: 'https://picsum.photos/seed/dance-floor/400/300',
    category: 'Flooring',
    featured: false,
    description: 'Interactive LED dance floor panels',
    vendor: 'PartyTech Solutions',
    inStock: true
  },
  {
    id: '9',
    name: 'Event Barricades (10-pack)',
    price: 699.99,
    image: 'https://picsum.photos/seed/barricades/400/300',
    category: 'Crowd Control',
    featured: false,
    description: 'Heavy-duty interlocking steel barricades',
    vendor: 'SafeEvent Supplies',
    inStock: true
  },
  {
    id: '10',
    name: 'Confetti Cannon Set',
    price: 89.99,
    image: 'https://picsum.photos/seed/confetti/400/300',
    category: 'Special Effects',
    featured: false,
    description: 'CO2 powered confetti cannons (4-pack)',
    vendor: 'FX Masters',
    inStock: true
  }
];

// Extract unique categories
const categories = ['All', ...Array.from(new Set(mockProducts.map(p => p.category)))];

export const ShopPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter products based on category and search
  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProducts = filteredProducts.filter(p => p.featured);
  const regularProducts = filteredProducts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">
              Event Equipment & Supplies
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Everything you need to make your event unforgettable
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
                <SearchIcon className="absolute right-4 top-3.5 h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              {/* Become a Vendor CTA */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Sell on GoEventCity</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Join our marketplace and reach thousands of event organizers
                </p>
                <button
                  onClick={() => navigate('/shop/become-vendor')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Become a Vendor
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden fixed bottom-4 right-4 z-10">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
            >
              <FilterIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowMobileFilters(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Featured Products */}
            {featuredProducts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.map(product => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/shop/products/${product.id}`)}
                    >
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <span className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-sm font-semibold">
                          Featured
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.vendor}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-blue-600">
                            ${product.price.toFixed(2)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to cart functionality
                            }}
                            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                          >
                            <ShoppingCartIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Other Products */}
            {regularProducts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularProducts.map(product => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/shop/products/${product.id}`)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.vendor}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to cart functionality
                            }}
                            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                          >
                            <ShoppingCartIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Products Message */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
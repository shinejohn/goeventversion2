import React, { memo, Component } from 'react';
import { ArrowRightIcon, ShoppingBagIcon, SearchIcon, TagIcon, TruckIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
export const GearPage = () => {
  const navigate = useNavigate();
  const shopCategories = [{
    title: 'Event Merch',
    description: 'Official merchandise from your favorite local events',
    path: '/shop/merch',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }, {
    title: 'Local Artist Goods',
    description: 'Unique items created by talented local artists',
    path: '/shop/artist-goods',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }, {
    title: 'Vintage Finds',
    description: 'One-of-a-kind vintage items from local collectors',
    path: '/shop/vintage',
    image: 'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }, {
    title: 'Ticket Packages',
    description: 'Special bundles including tickets and merchandise',
    path: '/shop/tickets',
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }, {
    title: 'Gift Ideas',
    description: 'Perfect presents for the event lovers in your life',
    path: '/shop/gifts',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }];
  // Sample featured products
  const featuredProducts = [{
    id: 'product-1',
    name: 'Clearwater Jazz Holiday 2024 T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '$24.99',
    category: 'Event Merch',
    event: 'Clearwater Jazz Holiday'
  }, {
    id: 'product-2',
    name: 'Handcrafted Beach Pottery',
    image: 'https://images.unsplash.com/photo-1565193298357-c304f6b19a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '$35.00',
    category: 'Local Artist Goods',
    artist: "Sarah's Ceramics"
  }, {
    id: 'product-3',
    name: 'Vintage Clearwater Postcard Set',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '$12.50',
    category: 'Vintage Finds',
    era: '1960s-1970s'
  }, {
    id: 'product-4',
    name: 'Summer Concert Series Package',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '$89.99',
    category: 'Ticket Packages',
    includes: '3 concerts + exclusive t-shirt'
  }, {
    id: 'product-5',
    name: 'Local Music Vinyl Collection',
    image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '$45.00',
    category: 'Gift Ideas',
    featured: '3 albums from local artists'
  }, {
    id: 'product-6',
    name: 'Beach Festival Essentials Kit',
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '$29.99',
    category: 'Event Merch',
    includes: 'Sunglasses, water bottle, tote bag'
  }];
  // Safe navigation handler
  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback direct navigation
      window.location.href = path;
    }
  };
  // Handle product click
  const handleProductClick = (productId: string) => {
    handleNavigation(`/shop/product/${productId}`);
  };
  // Handle category click
  const handleCategoryClick = (path: string) => {
    handleNavigation(path);
  };
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchInput = document.querySelector('input[placeholder="Search for merchandise, local art, and more..."]') as HTMLInputElement;
    const query = searchInput?.value || '';
    handleNavigation(`/shop/search?q=${encodeURIComponent(query)}`);
  };
  return <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              Shop Local Event Gear
            </h1>
            <p className="mt-3 text-xl">
              Merchandise, memorabilia, and unique finds from your community
            </p>
            <div className="mt-8 max-w-xl mx-auto">
              <form onSubmit={handleSearch} className="flex rounded-md shadow-sm">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 border-0 rounded-l-md text-gray-900 placeholder-gray-500" placeholder="Search for merchandise, local art, and more..." />
                </div>
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-r-md text-white bg-indigo-700 hover:bg-indigo-800">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Shop Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Shop By Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {shopCategories.map((category, index) => <div key={index} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCategoryClick(category.path)}>
              <div className="h-40 overflow-hidden">
                <img src={category.image} alt={category.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{category.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {category.description}
                </p>
                <div className="mt-3 flex items-center text-indigo-600 font-medium text-sm">
                  Shop now
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>)}
        </div>
      </div>
      {/* Featured Products */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium" onClick={() => handleNavigation('/shop/featured')}>
              View all
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProductClick(product.id)}>
                <div className="h-48 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      {product.price}
                    </span>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1 rounded" onClick={e => {
                  e.stopPropagation();
                  // Add to cart functionality
                  alert(`Added ${product.name} to cart!`);
                }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Support Local
            </h3>
            <p className="text-gray-600">
              Every purchase supports local artists, events, and businesses in
              your community
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <TagIcon className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Exclusive Items
            </h3>
            <p className="text-gray-600">
              Find unique merchandise and collectibles not available anywhere
              else
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <TruckIcon className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Convenient Delivery
            </h3>
            <p className="text-gray-600">
              Choose shipping or pick up your items at the next event
            </p>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Are you an artist or vendor?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Sell your merchandise, art, or collectibles on our platform and
            reach thousands of local customers
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-md shadow-sm hover:bg-indigo-50" onClick={() => handleNavigation('/shop/vendor-signup')}>
              Become a Vendor
            </button>
            <button className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm border border-indigo-500 hover:bg-indigo-800" onClick={() => handleNavigation('/shop/vendor-info')}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>;
};
import React, { useState } from 'react';
import { ArrowLeftIcon, ShareIcon, HeartIcon, ShoppingCartIcon, StarIcon, TruckIcon, ShieldCheckIcon, RefreshCwIcon, InfoIcon, ChevronDownIcon, UserIcon, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

// Types for props
interface Product {
  id: string;
  name: string;
  description?: string;
  image: string;
  price: string;
  category: string;
  event?: string;
  artist?: string;
  era?: string;
  includes?: string;
  featured?: string;
  stock_quantity?: number;
}

interface ProductDetailPageProps {
  product?: Product;
  relatedProducts?: Product[];
}

export const ProductDetailPage = ({ product: propProduct, relatedProducts = [] }: ProductDetailPageProps) => {
  const navigate = useNavigate();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [showDescription, setShowDescription] = useState(true);

  // Use props if provided, otherwise fallback to mock data
  const product = propProduct || {
    id: 'product-1',
    name: 'Clearwater Jazz Holiday 2024 T-Shirt',
    description: 'Official merchandise from the Clearwater Jazz Holiday 2024. This premium cotton t-shirt features the festival\'s exclusive artwork and celebrates the 45th anniversary of this beloved music festival. Perfect for jazz enthusiasts and festival-goers alike.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    price: '$24.99',
    category: 'Event Merch',
    event: 'Clearwater Jazz Holiday',
    stock_quantity: 15
  };

  // Safe navigation handler
  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
    }
  };

  const handleAddToCart = () => {
    // Create cart item
    const cartItem = {
      id: `${product.id}-${selectedSize || 'default'}`,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: parseFloat(product.price.replace('$', '')),
      category: product.category,
      quantity: selectedQuantity,
      ...(selectedSize && { selectedSize })
    };

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('shopping_cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex(
      (item: any) => item.id === cartItem.id
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += selectedQuantity;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }

    // Save updated cart
    localStorage.setItem('shopping_cart', JSON.stringify(existingCart));
    
    // Show success message
    alert(`Added ${selectedQuantity} x ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    // Add to cart first
    handleAddToCart();
    
    // Navigate to cart
    setTimeout(() => {
      handleNavigation('/shop/cart');
    }, 100);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        alert('Product link copied to clipboard!');
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => handleNavigation('/gear')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {product.name}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
                  isFavorite ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                <HeartIcon className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                {product.category}
              </span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.event && (
                <p className="text-lg text-gray-600">
                  From: <span className="font-semibold">{product.event}</span>
                </p>
              )}
              {product.artist && (
                <p className="text-lg text-gray-600">
                  By: <span className="font-semibold">{product.artist}</span>
                </p>
              )}
              {product.era && (
                <p className="text-lg text-gray-600">
                  Era: <span className="font-semibold">{product.era}</span>
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <p className="text-4xl font-bold text-gray-900">{product.price}</p>
              {product.stock_quantity && product.stock_quantity > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  {product.stock_quantity} in stock
                </p>
              )}
            </div>

            {/* Special Features */}
            {(product.includes || product.featured) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <InfoIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    {product.includes && (
                      <p className="text-sm text-yellow-800">
                        <span className="font-semibold">Includes:</span> {product.includes}
                      </p>
                    )}
                    {product.featured && (
                      <p className="text-sm text-yellow-800">
                        <span className="font-semibold">Featured:</span> {product.featured}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Size Selection (for apparel) */}
            {product.category === 'Event Merch' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="flex space-x-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-lg font-semibold px-4">{selectedQuantity}</span>
                <button 
                  onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-800 transition-colors"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Free shipping</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Secure payment</span>
                </div>
                <div className="flex items-center">
                  <RefreshCwIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Easy returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                <ChevronDownIcon 
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    showDescription ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {showDescription && (
                <div className="mt-4 text-gray-700 leading-relaxed">
                  {product.description}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct.id} 
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleNavigation(`/shop/product/${relatedProduct.id}`)}
                >
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {relatedProduct.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2">{relatedProduct.category}</p>
                    <p className="text-lg font-bold text-gray-900">{relatedProduct.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
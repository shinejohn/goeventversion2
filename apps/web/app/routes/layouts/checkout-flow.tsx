import React from 'react';
import { Outlet, Link } from 'react-router';
import { Shield, Lock } from 'lucide-react';

/**
 * Checkout Flow Layout
 * Secure, minimal layout for ticket purchases and payments
 * Focus on trust and security for financial transactions
 */

export default function CheckoutFlowLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Secure checkout header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/logo.svg" alt="When The Fun" className="h-8 w-auto" />
              <span className="text-sm text-gray-500">Secure Checkout</span>
            </Link>
            
            {/* Security indicators */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-green-600">
                <Lock className="h-4 w-4" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>SSL Protected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - centered and focused */}
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Trust badges and minimal footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Payment method logos */}
          <div className="flex justify-center gap-4 mb-4">
            <img src="/payment-icons/visa.svg" alt="Visa" className="h-8" />
            <img src="/payment-icons/mastercard.svg" alt="Mastercard" className="h-8" />
            <img src="/payment-icons/amex.svg" alt="American Express" className="h-8" />
            <img src="/payment-icons/paypal.svg" alt="PayPal" className="h-8" />
          </div>
          
          <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} When The Fun. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/help" className="hover:text-gray-900">Help</Link>
              <Link to="/terms-of-service" className="hover:text-gray-900">Terms</Link>
              <Link to="/privacy-policy" className="hover:text-gray-900">Privacy</Link>
              <Link to="/refund-policy" className="hover:text-gray-900">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
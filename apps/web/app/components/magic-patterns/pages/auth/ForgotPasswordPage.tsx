import React from 'react';
/**
 * Page: Forgot Password Page
 * Type: SSR
 * Mockdata: OFF
 * Description: Request password reset
 * Components: None
 */
import { MailIcon, ArrowLeftIcon, CheckCircleIcon } from 'lucide-react';
import { Link } from 'react-router';

export const ForgotPasswordPage = () => {
  return <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/auth/sign-in" className="flex items-center text-sm text-indigo-600 hover:text-indigo-500 mb-6">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to login
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your
          password
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" method="post">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    required 
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                    placeholder="you@example.com" 
                  />
                </div>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Send reset link
                </button>
              </div>
            </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/auth/sign-in" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Return to login
              </Link>
              <span className="mx-2 text-gray-500">•</span>
              <Link to="/auth/sign-up" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
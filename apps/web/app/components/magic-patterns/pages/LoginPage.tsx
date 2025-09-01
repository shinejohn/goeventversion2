import React, { useState, Component } from 'react';
/**
 * Page: Login Page
 * Type: CSR
 * Mockdata: OFF
 * Description: Unified login for all user types with role detection
 * Components: SocialLoginButtons, PasswordInput, RememberMeCheckbox, CommunityShowcase
 */
import { SocialLoginButtons } from '../components/ui/SocialLoginButtons';
import { PasswordInput } from '../components/ui/PasswordInput';
import { RememberMeCheckbox } from '../components/ui/RememberMeCheckbox';
import { CommunityShowcase } from '../components/ui/CommunityShowcase';
export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isBusinessLogin, setIsBusinessLogin] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log({
      email,
      password,
      rememberMe,
      isBusinessLogin
    });
  };
  return <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Community Showcase */}
      <div className="hidden md:block md:w-1/2 bg-indigo-700 relative">
        <CommunityShowcase />
      </div>
      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isBusinessLogin ? 'Login to your business account' : "Discover what's happening in your community"}
            </p>
          </div>
          <SocialLoginButtons />
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or login with email
                </span>
              </div>
            </div>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <PasswordInput value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <RememberMeCheckbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Log in
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  New here? Sign up
                </a>
              </div>
              <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-500" onClick={() => setIsBusinessLogin(!isBusinessLogin)}>
                {isBusinessLogin ? 'Login as a regular user' : 'Login as a business'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>;
};
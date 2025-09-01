import React, { useState, Component } from 'react';
/**
 * Page: Forgot Password Page
 * Type: CSR
 * Mockdata: OFF
 * Description: Request password reset
 * Components: None
 */
import { MailIcon, ArrowLeftIcon, CheckCircleIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
export const ForgotPasswordPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button onClick={() => navigateTo('/login')} className="flex items-center text-sm text-indigo-600 hover:text-indigo-500 mb-6">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to login
        </button>
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
          {!isSubmitted ? <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className={`block w-full pl-10 pr-3 py-2 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} placeholder="you@example.com" />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>
              <div>
                <button type="submit" disabled={isSubmitting} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                  {isSubmitting ? 'Sending...' : 'Send reset link'}
                </button>
              </div>
            </form> : <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Check your email
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  If you don't see it, please check your spam folder.
                </p>
              </div>
              <div className="mt-6">
                <button type="button" onClick={() => setIsSubmitted(false)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Try a different email address
                </button>
              </div>
            </div>}
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
              <button type="button" onClick={() => navigateTo('/login')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Return to login
              </button>
              <span className="mx-2 text-gray-500">•</span>
              <button type="button" onClick={() => navigateTo('/register')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Create new account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
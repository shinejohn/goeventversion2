import React, { useEffect, useState, Component } from 'react';
/**
 * Page: Reset Password Page
 * Type: CSR
 * Mockdata: OFF
 * Description: Reset password with token
 * Components: PasswordInput
 */
import { ArrowLeftIcon, CheckCircleIcon, AlertCircleIcon, RefreshCwIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
import { PasswordInput } from '../../components/ui/PasswordInput';
type TokenStatus = 'validating' | 'valid' | 'invalid' | 'expired';
export const ResetPasswordPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>('validating');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      // In a real app, we would validate the token from the URL with the backend
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (!token) {
        setTokenStatus('invalid');
        return;
      }
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        // For demo purposes, randomly choose a status
        const statuses: TokenStatus[] = ['valid', 'invalid', 'expired'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        // For better demo experience, default to valid
        setTokenStatus('valid');
      } catch (err) {
        setTokenStatus('invalid');
      }
    };
    validateToken();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsComplete(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Render different content based on token status
  const renderContent = () => {
    switch (tokenStatus) {
      case 'validating':
        return <div className="text-center py-8">
            <RefreshCwIcon className="h-12 w-12 mx-auto text-indigo-500 animate-spin" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Validating your reset link
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Please wait while we verify your password reset link...
            </p>
          </div>;
      case 'invalid':
        return <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Invalid reset link
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              This password reset link is invalid or has already been used.
            </p>
            <div className="mt-6">
              <button type="button" onClick={() => navigateTo('/auth/forgot-password')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Request a new link
              </button>
            </div>
          </div>;
      case 'expired':
        return <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <AlertCircleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Expired reset link
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              This password reset link has expired for security reasons.
            </p>
            <div className="mt-6">
              <button type="button" onClick={() => navigateTo('/auth/forgot-password')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Request a new link
              </button>
            </div>
          </div>;
      case 'valid':
        if (isComplete) {
          return <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Password reset complete
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Your password has been successfully reset. You can now log in
                with your new password.
              </p>
              <div className="mt-6">
                <button type="button" onClick={() => navigateTo('/login')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Go to login
                </button>
              </div>
            </div>;
        }
        return <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1">
                <PasswordInput value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1">
                <PasswordInput id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} error={confirmPassword && password !== confirmPassword ? "Passwords don't match" : ''} />
              </div>
            </div>
            {error && <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircleIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>}
            <div>
              <button type="submit" disabled={isSubmitting} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>;
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
          Create a new password for your account
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderContent()}
        </div>
      </div>
    </div>;
};
import React, { useEffect, useState, Component } from 'react';
/**
 * Page: Email Verification Page
 * Type: CSR
 * Mockdata: OFF
 * Description: Email confirmation landing page
 * Components: None
 */

import { CheckCircleIcon, XCircleIcon, RefreshCwIcon } from 'lucide-react';
type VerificationStatus = 'loading' | 'success' | 'expired' | 'invalid';
export const EmailVerificationPage = () => {
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [email, setEmail] = useState<string>('');
  useEffect(() => {
    // In a real implementation, we would verify the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
    // Simulate token verification
    const verifyToken = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        // For demo purposes, we'll randomly choose a status
        // In production, this would be determined by the API response
        const outcomes: VerificationStatus[] = ['success', 'expired', 'invalid'];
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        setStatus(randomOutcome);
      } catch (error) {
        setStatus('invalid');
      }
    };
    verifyToken();
  }, []);
  const handleResendVerification = async () => {
    // Reset to loading state
    setStatus('loading');
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Show alert for demo purposes
      alert(`Verification email resent to ${email}`);
      // Keep in expired state so user knows they need to check email
      setStatus('expired');
    } catch (error) {
      setStatus('invalid');
    }
  };
  return <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 text-indigo-600">
            {status === 'loading' ? <RefreshCwIcon className="h-12 w-12 animate-spin" /> : status === 'success' ? <CheckCircleIcon className="h-12 w-12 text-green-500" /> : <XCircleIcon className="h-12 w-12 text-red-500" />}
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {status === 'loading' ? 'Verifying your email...' : status === 'success' ? 'Email Verified!' : status === 'expired' ? 'Verification Link Expired' : 'Invalid Verification Link'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {status === 'loading' ? 'Please wait while we verify your email address.' : status === 'success' ? 'Your email has been successfully verified.' : status === 'expired' ? 'This verification link has expired.' : 'This verification link is invalid or has already been used.'}
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'loading' && <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-gray-500 mb-4">
                This should only take a moment...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>}
          {status === 'success' && <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Your account is now active and ready to use.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <a href="/calendar" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Continue to Calendar
                </a>
              </div>
              <div className="text-center">
                <a href="/settings" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Complete your profile settings
                </a>
              </div>
            </div>}
          {(status === 'expired' || status === 'invalid') && <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {status === 'expired' ? 'Your verification link has expired for security reasons.' : 'There was a problem with your verification link.'}
                    </p>
                  </div>
                </div>
              </div>
              {email ? <div>
                  <p className="text-sm text-gray-700 mb-4">
                    We can send a new verification link to:{' '}
                    <strong>{email}</strong>
                  </p>
                  <button onClick={handleResendVerification} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Resend Verification Email
                  </button>
                </div> : <div>
                  <p className="text-sm text-gray-700 mb-4">
                    Please try logging in again to request a new verification
                    email.
                  </p>
                  <a href="/login" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Return to Login
                  </a>
                </div>}
              <div className="text-center">
                <a href="/help/verification" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Need help? Contact support
                </a>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
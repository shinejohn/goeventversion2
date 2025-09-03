import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LogOutIcon, CheckIcon } from 'lucide-react';
const LogoutPage = () => {
  const navigate = useNavigate();
  // Simulate logging out
  useEffect(() => {
    // In a real app, this would call your auth service to log out
    const logoutTimer = setTimeout(() => {
      // Redirect to home page after logout
      navigate('/');
    }, 2000);
    return () => clearTimeout(logoutTimer);
  }, [navigate]);
  return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckIcon className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Logged Out Successfully
        </h1>
        <p className="text-gray-600 mb-6">
          You have been successfully logged out of your account.
        </p>
        <div className="animate-pulse mb-6 flex justify-center">
          <div className="bg-gray-200 h-2 w-24 rounded"></div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          You will be redirected to the home page shortly...
        </p>
        <div className="flex justify-center space-x-4">
          <button onClick={() => navigate('/login')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <LogOutIcon className="h-4 w-4 mr-2" />
            Log In Again
          </button>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Go to Home
          </button>
        </div>
      </div>
    </div>;
};
export default LogoutPage;
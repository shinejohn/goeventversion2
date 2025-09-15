import React, { useState } from 'react';
import { Link, redirect } from 'react-router';

import { SignInMethodsContainer } from '@kit/auth/sign-in';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import type { Route } from './+types/auth/sign-in';
import { authenticateUser } from '~/lib/auth.server';

// Inline Magic Patterns components
const SocialLoginButtons = () => {
  return (
    <div className="grid grid-cols-1 gap-3">
      <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="ml-2">Continue with Google</span>
      </button>
    </div>
  );
};

const PasswordInput = ({ value, onChange }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder="Password"
        required
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
            <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
};

const RememberMeCheckbox = ({ checked, onChange }: any) => {
  return (
    <div className="flex items-center">
      <input
        id="remember-me"
        name="remember-me"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
      />
      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
        Remember me
      </label>
    </div>
  );
};

const CommunityShowcase = () => {
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
      <div className="max-w-lg text-center">
        <h3 className="text-3xl font-bold mb-4">Join the Community</h3>
        <p className="text-lg mb-8 text-indigo-100">
          Discover amazing events, connect with performers, and find the perfect venues in your city.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">10K+</div>
            <div className="text-sm">Events</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">5K+</div>
            <div className="text-sm">Venues</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const i18n = await createI18nServerInstance(request);
  const client = getSupabaseServerClient(request);
  const { data: user } = await requireUser(client);

  if (user) {
    throw redirect(pathsConfig.app.home);
  }

  const searchParams = new URL(request.url).searchParams;
  const inviteToken = searchParams.get('invite_token') ?? undefined;
  const returnPath = searchParams.get('next') ?? pathsConfig.app.home;

  return {
    title: 'Sign In - GoEventCity',
    inviteToken,
    returnPath,
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title,
    },
  ];
};


export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { 
      success: false, 
      error: 'Email and password are required' 
    };
  }
  
  try {
    const supabase = getSupabaseServerClient(request);
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    if (data.user) {
      // Verify user has proper role setup
      const user = await authenticateUser(request);
      if (!user) {
        return { 
          success: false, 
          error: 'User account not properly configured' 
        };
      }
      
      return redirect(pathsConfig.app.home);
    }
    
    return { success: false, error: 'Authentication failed' };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    };
  }
};

export default function SignInPage(props: Route.ComponentProps) {
  const { inviteToken, returnPath } = props.loaderData;
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isBusinessLogin, setIsBusinessLogin] = useState(false);

  const signUpPath =
    pathsConfig.auth.signUp +
    (inviteToken ? `?invite_token=${inviteToken}` : '');

  const paths = {
    callback: pathsConfig.auth.callback,
    joinTeam: pathsConfig.app.joinTeam,
    returnPath,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.submit();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Community Showcase */}
      <div className="hidden md:block md:w-1/2 bg-indigo-700 relative">
        <CommunityShowcase />
      </div>
      
      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 sm:px-8 lg:px-12 py-12">
        <div className="max-w-xl w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isBusinessLogin ? 'Login to your business account' : "Discover what's happening in your community"}
            </p>
          </div>
          
          {/* Custom Sign-in Form */}
          <form method="post" onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </form>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to={signUpPath} className="font-medium text-indigo-600 hover:text-indigo-500">
                New here? Sign up
              </Link>
            </div>
            <button 
              type="button" 
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => setIsBusinessLogin(!isBusinessLogin)}
            >
              {isBusinessLogin ? 'Login as a regular user' : 'Login as a business'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

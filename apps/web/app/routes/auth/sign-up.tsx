import React, { useState } from 'react';
import { Link, redirect } from 'react-router';

import { SignUpMethodsContainer } from '@kit/auth/sign-up';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import type { Route } from '~/types/app/routes/auth/+types/sign-up';
import { UserIcon, BuildingIcon, MusicIcon, CheckIcon, CalendarIcon, TicketIcon, UsersIcon } from 'lucide-react';
import { redirect } from 'react-router';

// Inline Magic Patterns components
const SocialLoginButtons = ({ signUp = false }: { signUp?: boolean }) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="ml-2">{signUp ? 'Sign up with Google' : 'Continue with Google'}</span>
      </button>
    </div>
  );
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const i18n = await createI18nServerInstance(request);

  const inviteToken =
    new URL(request.url).searchParams.get('invite_token') ?? '';

  const user = await requireUser(getSupabaseServerClient(request));

  if (user.data) {
    throw redirect(pathsConfig.app.home);
  }

  return {
    title: 'Sign Up - GoEventCity',
    inviteToken,
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title,
    },
  ];
};

const paths = {
  callback: pathsConfig.auth.callback,
  appHome: pathsConfig.app.home,
};


export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // TODO: Implement authentication logic
  // const supabase = getSupabaseServerClient(request);
  // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  return { success: true };
};

export default function SignUpPage(props: Route.ComponentProps) {
  const { inviteToken } = props.loaderData;
  const [accountType, setAccountType] = useState<'fan' | 'venue' | 'performer'>('fan');

  const signInPath =
    pathsConfig.auth.signIn +
    (inviteToken ? `?invite_token=${inviteToken}` : '');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join the community and discover local events
            </p>
          </div>
          
          {/* Account Type Selection */}
          <div className="flex justify-center space-x-4 mb-6">
            <button 
              type="button" 
              onClick={() => setAccountType('fan')} 
              className={`flex flex-col items-center p-3 rounded-lg ${accountType === 'fan' ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500' : 'bg-gray-100 text-gray-700 border-2 border-transparent'}`}
            >
              <UserIcon className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Fan</span>
            </button>
            <button 
              type="button" 
              onClick={() => setAccountType('venue')} 
              className={`flex flex-col items-center p-3 rounded-lg ${accountType === 'venue' ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500' : 'bg-gray-100 text-gray-700 border-2 border-transparent'}`}
            >
              <BuildingIcon className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Venue</span>
            </button>
            <button 
              type="button" 
              onClick={() => setAccountType('performer')} 
              className={`flex flex-col items-center p-3 rounded-lg ${accountType === 'performer' ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500' : 'bg-gray-100 text-gray-700 border-2 border-transparent'}`}
            >
              <MusicIcon className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Performer</span>
            </button>
          </div>
          
          <SocialLoginButtons signUp={true} />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with existing auth
                </span>
              </div>
            </div>
          </div>

          {/* Use existing Supabase auth */}
          <div className="mt-8">
            <SignUpMethodsContainer
              providers={authConfig.providers}
              displayTermsCheckbox={authConfig.displayTermsCheckbox}
              inviteToken={inviteToken}
              paths={paths}
            />
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <Link to={signInPath} className="font-medium text-indigo-600 hover:text-indigo-500">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Benefits */}
      <div className="hidden md:block md:w-1/2 bg-indigo-700 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-white p-8">
          <h2 className="text-3xl font-bold mb-6">Join the Community</h2>
          <div className="max-w-md space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 bg-opacity-30">
                  <CalendarIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-medium">Discover Local Events</h3>
                <p className="mt-2">
                  Find concerts, performances, and activities happening in your area.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 bg-opacity-30">
                  <TicketIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-medium">Easy Ticketing</h3>
                <p className="mt-2">
                  Purchase tickets securely and manage all your bookings in one place.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 bg-opacity-30">
                  <UsersIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-medium">Connect with Others</h3>
                <p className="mt-2">
                  Follow your favorite venues and performers, and connect with other fans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

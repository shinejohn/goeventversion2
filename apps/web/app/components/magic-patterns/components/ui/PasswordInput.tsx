import React, { useState, Component } from 'react';
/**
 * Page: Password Input Component
 * Type: CSR
 * Mockdata: OFF
 * Description: Password field with visibility toggle
 * Components: None
 */
import { EyeIcon, EyeOffIcon } from 'lucide-react';
type PasswordInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export const PasswordInput = ({
  value,
  onChange
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return <div className="relative">
      <label htmlFor="password" className="sr-only">
        Password
      </label>
      <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" value={value} onChange={onChange} />
      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
        {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
      </button>
    </div>;
};
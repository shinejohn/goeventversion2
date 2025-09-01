import React, { Component } from 'react';
/**
 * Page: Remember Me Checkbox Component
 * Type: CSR
 * Mockdata: OFF
 * Description: Persistent login option
 * Components: None
 */
type RememberMeCheckboxProps = {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export const RememberMeCheckbox = ({
  checked,
  onChange
}: RememberMeCheckboxProps) => {
  return <div className="flex items-center">
      <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={checked} onChange={onChange} />
      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
        Remember me
      </label>
    </div>;
};
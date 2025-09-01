import React, { useState, Component } from 'react';
/**
 * Component: Password & Security
 * Type: CSR
 * Mockdata: ON
 * Description: Password change and security settings
 * Components: None
 */

import { LockIcon, KeyIcon, ShieldIcon, LogOutIcon } from 'lucide-react';
type UserData = {
  id: string;
  email: string;
  lastLogin: string;
  [key: string]: any;
};
type PasswordSecurityProps = {
  userData: UserData;
};
// Mock security data
const mockSecurityData = {
  activeSessions: [{
    id: 'session-1',
    device: 'Chrome on Windows',
    location: 'Clearwater, FL',
    ip: '192.168.1.1',
    lastActive: '2024-02-10T14:22:10Z',
    current: true
  }, {
    id: 'session-2',
    device: 'Safari on iPhone',
    location: 'Tampa, FL',
    ip: '192.168.1.2',
    lastActive: '2024-02-09T10:15:30Z',
    current: false
  }],
  securityEvents: [{
    id: 'event-1',
    type: 'login',
    device: 'Chrome on Windows',
    location: 'Clearwater, FL',
    ip: '192.168.1.1',
    timestamp: '2024-02-10T14:22:10Z'
  }, {
    id: 'event-2',
    type: 'password_change',
    device: 'Chrome on Windows',
    location: 'Clearwater, FL',
    ip: '192.168.1.1',
    timestamp: '2024-01-15T09:30:00Z'
  }, {
    id: 'event-3',
    type: 'login',
    device: 'Safari on iPhone',
    location: 'Tampa, FL',
    ip: '192.168.1.2',
    timestamp: '2024-02-09T10:15:30Z'
  }],
  twoFactorEnabled: false
};
export const PasswordSecurity = ({
  userData
}: PasswordSecurityProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(mockSecurityData.twoFactorEnabled);
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Reset form and show success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (error) {
      setPasswordError('Failed to update password. Please try again.');
    }
  };
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return <div className="py-6 px-4 sm:p-6 lg:pb-8">
      <div>
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Password & Security
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your password and account security settings.
        </p>
      </div>
      <div className="mt-6 space-y-8">
        {/* Change Password */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Change Password
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Update your password regularly to keep your account secure.</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="mt-5 sm:flex sm:flex-col sm:items-start">
              <div className="w-full sm:max-w-md">
                <div className="mb-4">
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input type="password" name="current-password" id="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="mb-4">
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input type="password" name="new-password" id="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input type="password" name="confirm-password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>
              {passwordError && <div className="mt-2 text-sm text-red-600">{passwordError}</div>}
              {passwordSuccess && <div className="mt-2 text-sm text-green-600">
                  Password updated successfully!
                </div>}
              <button type="submit" className="mt-4 bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Update Password
              </button>
            </form>
          </div>
        </div>
        {/* Two-Factor Authentication */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Two-Factor Authentication
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Add an extra layer of security to your account by enabling
                two-factor authentication.
              </p>
            </div>
            <div className="mt-5">
              <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}>
                <ShieldIcon className="mr-2 h-5 w-5 text-gray-500" />
                {twoFactorEnabled ? 'Disable' : 'Enable'} Two-Factor
                Authentication
              </button>
            </div>
          </div>
        </div>
        {/* Active Sessions */}
        <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Active Sessions
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Devices currently signed in to your account.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {mockSecurityData.activeSessions.map(session => <li key={session.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {session.device.includes('Chrome') ? <svg className="h-6 w-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.003h-.002l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.366zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728z" />
                          </svg> : <svg className="h-6 w-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                          </svg>}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {session.device}
                          {session.current && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Current
                            </span>}
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.location} • {session.ip} • Last active{' '}
                          {formatDate(session.lastActive)}
                        </p>
                      </div>
                    </div>
                    {!session.current && <button type="button" className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <LogOutIcon className="mr-1 h-4 w-4 text-gray-500" />
                        Sign Out
                      </button>}
                  </div>
                </li>)}
            </ul>
          </div>
        </div>
        {/* Security Log */}
        <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Security Log
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Recent security events for your account.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {mockSecurityData.securityEvents.map(event => <li key={event.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <div className="mr-4 flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {event.type === 'login' ? <KeyIcon className="h-4 w-4 text-gray-600" /> : <LockIcon className="h-4 w-4 text-gray-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {event.type === 'login' ? 'Login' : 'Password Change'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {event.device} • {event.location} •{' '}
                        {formatDate(event.timestamp)}
                      </p>
                    </div>
                  </div>
                </li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>;
};
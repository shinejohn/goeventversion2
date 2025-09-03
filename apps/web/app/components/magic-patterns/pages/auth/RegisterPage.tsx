import React, { useState, Component } from 'react';
/**
 * Page: Register Page
 * Type: CSR
 * Mockdata: OFF
 * Description: Create a new account
 * Components: SocialLoginButtons, PasswordInput
 */
import { SocialLoginButtons } from '../../components/ui/SocialLoginButtons';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { useNavigate } from 'react-router';
import { UserIcon, BuildingIcon, MusicIcon, CheckIcon } from 'lucide-react';
import { CalendarIcon, TicketIcon, UsersIcon } from 'lucide-react';
export const RegisterPage = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<'fan' | 'venue' | 'performer'>('fan');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    venueName: '',
    venueAddress: '',
    venueType: '',
    performerName: '',
    performerGenre: '',
    performerDescription: '',
    agreeToTerms: false,
    receiveUpdates: true
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      // In a real app, this would submit the form data to an API
      console.log('Form submitted:', formData);
      // Redirect to email verification page
      navigate('/auth/verify-email');
    }
  };
  const isNextDisabled = () => {
    if (step === 1) {
      return !formData.email || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword;
    }
    if (step === 2) {
      if (accountType === 'fan') {
        return !formData.firstName || !formData.lastName || !formData.agreeToTerms;
      } else if (accountType === 'venue') {
        return !formData.venueName || !formData.venueAddress || !formData.agreeToTerms;
      } else {
        return !formData.performerName || !formData.performerGenre || !formData.agreeToTerms;
      }
    }
    return false;
  };
  return <div className="min-h-screen flex flex-col md:flex-row bg-white">
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
            <button type="button" onClick={() => setAccountType('fan')} className={`flex flex-col items-center p-3 rounded-lg ${accountType === 'fan' ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500' : 'bg-gray-100 text-gray-700 border-2 border-transparent'}`}>
              <UserIcon className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Fan</span>
            </button>
            <button type="button" onClick={() => setAccountType('venue')} className={`flex flex-col items-center p-3 rounded-lg ${accountType === 'venue' ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500' : 'bg-gray-100 text-gray-700 border-2 border-transparent'}`}>
              <BuildingIcon className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Venue</span>
            </button>
            <button type="button" onClick={() => setAccountType('performer')} className={`flex flex-col items-center p-3 rounded-lg ${accountType === 'performer' ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500' : 'bg-gray-100 text-gray-700 border-2 border-transparent'}`}>
              <MusicIcon className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Performer</span>
            </button>
          </div>
          {/* Progress Steps */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step > 1 ? <CheckIcon className="h-5 w-5" /> : '1'}
                </div>
                <span className="text-xs mt-1">Account</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-200">
                <div className={`h-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} style={{
                width: step > 1 ? '100%' : '0%'
              }}></div>
              </div>
              <div className="flex flex-col items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step > 2 ? <CheckIcon className="h-5 w-5" /> : '2'}
                </div>
                <span className="text-xs mt-1">Details</span>
              </div>
            </div>
          </div>
          <SocialLoginButtons signUp={true} />
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or register with email
                </span>
              </div>
            </div>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {step === 1 && <div className="space-y-4">
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input id="email-address" name="email" type="email" autoComplete="email" required className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email address" value={formData.email} onChange={handleInputChange} />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <PasswordInput value={formData.password} onChange={e => setFormData({
                ...formData,
                password: e.target.value
              })} />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <PasswordInput id="confirm-password" name="confirmPassword" value={formData.confirmPassword} onChange={e => setFormData({
                ...formData,
                confirmPassword: e.target.value
              })} error={formData.confirmPassword && formData.password !== formData.confirmPassword ? "Passwords don't match" : ''} />
                </div>
              </div>}
            {step === 2 && <div className="space-y-4">
                {accountType === 'fan' && <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input id="firstName" name="firstName" type="text" autoComplete="given-name" required className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.firstName} onChange={handleInputChange} />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input id="lastName" name="lastName" type="text" autoComplete="family-name" required className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.lastName} onChange={handleInputChange} />
                      </div>
                    </div>
                  </>}
                {accountType === 'venue' && <>
                    <div>
                      <label htmlFor="venueName" className="block text-sm font-medium text-gray-700">
                        Venue Name
                      </label>
                      <input id="venueName" name="venueName" type="text" required className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.venueName} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label htmlFor="venueAddress" className="block text-sm font-medium text-gray-700">
                        Venue Address
                      </label>
                      <input id="venueAddress" name="venueAddress" type="text" required className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.venueAddress} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label htmlFor="venueType" className="block text-sm font-medium text-gray-700">
                        Venue Type
                      </label>
                      <select id="venueType" name="venueType" className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.venueType} onChange={handleInputChange}>
                        <option value="">Select venue type</option>
                        <option value="bar">Bar/Club</option>
                        <option value="concert">Concert Hall</option>
                        <option value="theater">Theater</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="outdoor">Outdoor Space</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </>}
                {accountType === 'performer' && <>
                    <div>
                      <label htmlFor="performerName" className="block text-sm font-medium text-gray-700">
                        Performer/Band Name
                      </label>
                      <input id="performerName" name="performerName" type="text" required className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.performerName} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label htmlFor="performerGenre" className="block text-sm font-medium text-gray-700">
                        Genre/Style
                      </label>
                      <input id="performerGenre" name="performerGenre" type="text" required className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.performerGenre} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label htmlFor="performerDescription" className="block text-sm font-medium text-gray-700">
                        Brief Description
                      </label>
                      <textarea id="performerDescription" name="performerDescription" rows={3} className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formData.performerDescription} onChange={handleInputChange}></textarea>
                    </div>
                  </>}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="agreeToTerms" name="agreeToTerms" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={formData.agreeToTerms} onChange={handleInputChange} required />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeToTerms" className="text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-indigo-600 hover:text-indigo-500">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-indigo-600 hover:text-indigo-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="receiveUpdates" name="receiveUpdates" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={formData.receiveUpdates} onChange={handleInputChange} />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="receiveUpdates" className="text-gray-700">
                      I'd like to receive updates about events, promotions, and
                      news
                    </label>
                  </div>
                </div>
              </div>}
            <div className="flex items-center justify-between">
              {step > 1 ? <button type="button" onClick={() => setStep(step - 1)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Back
                </button> : <button type="button" onClick={() => navigate('/login')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Already have an account?
                </button>}
              <button type="submit" disabled={isNextDisabled()} className={`group relative w-auto flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isNextDisabled() ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}>
                {step < 2 ? 'Next' : 'Create Account'}
              </button>
            </div>
          </form>
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
                  Find concerts, performances, and activities happening in your
                  area.
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
                  Purchase tickets securely and manage all your bookings in one
                  place.
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
                  Follow your favorite venues and performers, and connect with
                  other fans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
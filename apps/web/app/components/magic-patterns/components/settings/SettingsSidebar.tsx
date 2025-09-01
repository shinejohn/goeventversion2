import React, { Component } from 'react';
/**
 * Component: Settings Sidebar
 * Type: CSR
 * Mockdata: OFF
 * Description: Navigation menu for account settings
 * Components: None
 */
import { UserIcon, LockIcon, ShieldIcon, BellIcon, LinkIcon, CreditCardIcon, ReceiptIcon, DownloadIcon, XIcon } from 'lucide-react';
type SettingsSection = 'profile' | 'password' | 'privacy' | 'notifications' | 'connected' | 'payment' | 'subscription' | 'data' | 'close';
type SettingsSidebarProps = {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
};
export const SettingsSidebar = ({
  activeSection,
  onSectionChange
}: SettingsSidebarProps) => {
  const sections = [{
    id: 'profile',
    label: 'Profile Information',
    icon: <UserIcon className="h-5 w-5" />
  }, {
    id: 'password',
    label: 'Password & Security',
    icon: <LockIcon className="h-5 w-5" />
  }, {
    id: 'privacy',
    label: 'Privacy Settings',
    icon: <ShieldIcon className="h-5 w-5" />
  }, {
    id: 'notifications',
    label: 'Notification Preferences',
    icon: <BellIcon className="h-5 w-5" />
  }, {
    id: 'connected',
    label: 'Connected Accounts',
    icon: <LinkIcon className="h-5 w-5" />
  }, {
    id: 'payment',
    label: 'Payment Methods',
    icon: <CreditCardIcon className="h-5 w-5" />
  }, {
    id: 'subscription',
    label: 'Subscription & Billing',
    icon: <ReceiptIcon className="h-5 w-5" />
  }, {
    id: 'data',
    label: 'Data & Downloads',
    icon: <DownloadIcon className="h-5 w-5" />
  }, {
    id: 'close',
    label: 'Close Account',
    icon: <XIcon className="h-5 w-5" />
  }];
  return <nav className="py-4 h-full">
      <div className="px-4 mb-4 md:hidden">
        <select className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={activeSection} onChange={e => onSectionChange(e.target.value as SettingsSection)}>
          {sections.map(section => <option key={section.id} value={section.id}>
              {section.label}
            </option>)}
        </select>
      </div>
      <div className="hidden md:block">
        <ul className="space-y-1">
          {sections.map(section => <li key={section.id}>
              <button onClick={() => onSectionChange(section.id as SettingsSection)} className={`w-full flex items-center px-4 py-2 text-sm font-medium ${activeSection === section.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                <span className={`mr-3 ${activeSection === section.id ? 'text-indigo-500' : 'text-gray-500'}`}>
                  {section.icon}
                </span>
                {section.label}
              </button>
            </li>)}
        </ul>
      </div>
    </nav>;
};
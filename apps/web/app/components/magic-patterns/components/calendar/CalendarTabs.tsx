import React from 'react';
import { CalendarIcon, InfoIcon, UsersIcon, MessageSquareIcon } from 'lucide-react';
type CalendarTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};
export const CalendarTabs = ({
  activeTab,
  setActiveTab
}: CalendarTabsProps) => {
  const tabs = [{
    id: 'calendar',
    label: 'Calendar',
    icon: <CalendarIcon className="h-5 w-5" />
  }, {
    id: 'about',
    label: 'About',
    icon: <InfoIcon className="h-5 w-5" />
  }, {
    id: 'members',
    label: 'Members',
    icon: <UsersIcon className="h-5 w-5" />
  }, {
    id: 'discussion',
    label: 'Discussion',
    icon: <MessageSquareIcon className="h-5 w-5" />
  }];
  return <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex overflow-x-auto">
          {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>)}
        </nav>
      </div>
    </div>;
};
import React, { useState } from 'react';
import { DownloadIcon, CalendarIcon, FileTextIcon, TableIcon, BarChart2Icon, AlertTriangleIcon, LockIcon } from 'lucide-react';
type ExportToolsProps = {
  hubSlug: string;
  timeRange: string;
  isPremium: boolean;
};
export const ExportTools: React.FC<ExportToolsProps> = ({
  hubSlug,
  timeRange,
  isPremium
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf' | 'excel'>('csv');
  const [selectedData, setSelectedData] = useState<string[]>(['members', 'content', 'engagement']);
  const [isExporting, setIsExporting] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  // Handle checkbox change
  const handleDataSelection = (value: string) => {
    if (selectedData.includes(value)) {
      setSelectedData(selectedData.filter(item => item !== value));
    } else {
      setSelectedData([...selectedData, value]);
    }
  };
  // Handle export
  const handleExport = () => {
    if (!isPremium && (selectedFormat !== 'csv' || selectedData.includes('revenue'))) {
      setShowPremiumModal(true);
      return;
    }
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      // Show success message or trigger download
      alert(`Export complete! Your ${selectedFormat.toUpperCase()} file has been downloaded.`);
    }, 1500);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Export Analytics Data
        </h3>
        {isPremium ? <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Premium Hub
          </div> : <div className="text-xs text-gray-500 flex items-center">
            <LockIcon className="h-3 w-3 mr-1" />
            Some exports require Premium
          </div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Export Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Format
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input id="format-csv" name="format" type="radio" checked={selectedFormat === 'csv'} onChange={() => setSelectedFormat('csv')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
              <label htmlFor="format-csv" className="ml-2 block text-sm text-gray-700">
                CSV
              </label>
            </div>
            <div className="flex items-center">
              <input id="format-excel" name="format" type="radio" checked={selectedFormat === 'excel'} onChange={() => setSelectedFormat('excel')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
              <label htmlFor="format-excel" className="ml-2 flex items-center text-sm text-gray-700">
                Excel
                {!isPremium && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    Premium
                  </span>}
              </label>
            </div>
            <div className="flex items-center">
              <input id="format-pdf" name="format" type="radio" checked={selectedFormat === 'pdf'} onChange={() => setSelectedFormat('pdf')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
              <label htmlFor="format-pdf" className="ml-2 flex items-center text-sm text-gray-700">
                PDF Report
                {!isPremium && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    Premium
                  </span>}
              </label>
            </div>
          </div>
        </div>
        {/* Data to Include */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data to Include
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input id="data-members" name="data-members" type="checkbox" checked={selectedData.includes('members')} onChange={() => handleDataSelection('members')} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
              <label htmlFor="data-members" className="ml-2 flex items-center text-sm text-gray-700">
                <UserIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                Member Data
              </label>
            </div>
            <div className="flex items-center">
              <input id="data-content" name="data-content" type="checkbox" checked={selectedData.includes('content')} onChange={() => handleDataSelection('content')} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
              <label htmlFor="data-content" className="ml-2 flex items-center text-sm text-gray-700">
                <FileTextIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                Content Performance
              </label>
            </div>
            <div className="flex items-center">
              <input id="data-engagement" name="data-engagement" type="checkbox" checked={selectedData.includes('engagement')} onChange={() => handleDataSelection('engagement')} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
              <label htmlFor="data-engagement" className="ml-2 flex items-center text-sm text-gray-700">
                <BarChart2Icon className="h-4 w-4 mr-1.5 text-gray-400" />
                Engagement Metrics
              </label>
            </div>
            <div className="flex items-center">
              <input id="data-revenue" name="data-revenue" type="checkbox" checked={selectedData.includes('revenue')} onChange={() => handleDataSelection('revenue')} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
              <label htmlFor="data-revenue" className="ml-2 flex items-center text-sm text-gray-700">
                <DollarSignIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                Revenue Data
                {!isPremium && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    Premium
                  </span>}
              </label>
            </div>
          </div>
        </div>
        {/* Time Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <div className="relative">
            <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue={timeRange}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
              <option value="custom">Custom range</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Data will be exported for the selected time period
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {selectedData.length === 0 ? <div className="flex items-center text-amber-600">
              <AlertTriangleIcon className="h-4 w-4 mr-1.5" />
              Please select at least one data type
            </div> : <div>
              Exporting {selectedData.length} data{' '}
              {selectedData.length === 1 ? 'set' : 'sets'} as{' '}
              {selectedFormat.toUpperCase()}
            </div>}
        </div>
        <button onClick={handleExport} disabled={isExporting || selectedData.length === 0} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${isExporting || selectedData.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
          {isExporting ? <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Exporting...
            </> : <>
              <DownloadIcon className="h-4 w-4 mr-1.5" />
              Export Data
            </>}
        </button>
      </div>
      {/* Premium Modal */}
      {showPremiumModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <LockIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Premium Feature
            </h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Advanced export options are available with a Premium Hub
              subscription.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => setShowPremiumModal(false)} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => {
            setShowPremiumModal(false);
            // Redirect to upgrade page
            alert('Redirecting to upgrade page...');
          }} className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
// Dollar sign icon component
const DollarSignIcon: React.FC<{
  className?: string;
}> = ({
  className
}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>;
// User icon component
const UserIcon: React.FC<{
  className?: string;
}> = ({
  className
}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>;
import React from 'react';
import { PlusIcon, CheckSquareIcon, DownloadIcon, SettingsIcon } from 'lucide-react';
type QuickActionsBarProps = {
  onCreateNew: () => void;
  onBulkEdit: () => void;
  onExportData: () => void;
  onSettings: () => void;
};
export const QuickActionsBar = ({
  onCreateNew,
  onBulkEdit,
  onExportData,
  onSettings
}: QuickActionsBarProps) => {
  return <div className="flex flex-wrap gap-2">
      <button onClick={onCreateNew} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
        <PlusIcon className="h-4 w-4 mr-1.5" />
        Create New
      </button>
      <button onClick={onBulkEdit} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
        <CheckSquareIcon className="h-4 w-4 mr-1.5" />
        Bulk Edit
      </button>
      <button onClick={onExportData} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
        <DownloadIcon className="h-4 w-4 mr-1.5" />
        Export Data
      </button>
      <button onClick={onSettings} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
        <SettingsIcon className="h-4 w-4 mr-1.5" />
        Settings
      </button>
    </div>;
};
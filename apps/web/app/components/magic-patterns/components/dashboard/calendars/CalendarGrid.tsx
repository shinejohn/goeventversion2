import React, { useState } from 'react';
import { MoreVerticalIcon, EyeIcon, EditIcon, TrashIcon, PauseIcon, PlayIcon, CopyIcon, AlertTriangleIcon, UsersIcon, CalendarIcon, BarChart2Icon, DollarSignIcon, TrendingUpIcon, TrendingDownIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';
type Calendar = {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'active' | 'paused' | 'draft';
  stats: {
    followers: number;
    growthRate: number;
    events: number;
    pendingEvents: number;
    engagement: number;
    revenue: number;
  };
  lastUpdated: string;
  isPaid: boolean;
  price?: number;
};
type CalendarGridProps = {
  calendars: Calendar[];
  viewMode: 'grid' | 'list';
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onToggleStatus: (id: string, status: 'active' | 'paused' | 'draft') => void;
};
export const CalendarGrid = ({
  calendars,
  viewMode,
  onEdit,
  onView,
  onToggleStatus
}: CalendarGridProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Active
          </span>;
      case 'paused':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <PauseIcon className="h-3 w-3 mr-1" />
            Paused
          </span>;
      case 'draft':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Draft
          </span>;
      default:
        return null;
    }
  };
  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };
  const handleToggleStatus = (id: string, currentStatus: string) => {
    let newStatus: 'active' | 'paused' | 'draft';
    if (currentStatus === 'active') {
      newStatus = 'paused';
    } else if (currentStatus === 'paused') {
      newStatus = 'active';
    } else {
      newStatus = 'active'; // If it's a draft, make it active
    }
    onToggleStatus(id, newStatus);
    setOpenMenuId(null);
  };
  if (viewMode === 'grid') {
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {calendars.map(calendar => <div key={calendar.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-40 overflow-hidden">
              <img src={calendar.image} alt={calendar.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
                <div>
                  {getStatusBadge(calendar.status)}
                  {calendar.isPaid && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      <DollarSignIcon className="h-3 w-3 mr-1" />$
                      {calendar.price}/mo
                    </span>}
                </div>
                <div className="relative">
                  <button onClick={e => {
                e.stopPropagation();
                toggleMenu(calendar.id);
              }} className="p-1 rounded-full bg-white/20 hover:bg-white/40 text-white">
                    <MoreVerticalIcon className="h-5 w-5" />
                  </button>
                  {openMenuId === calendar.id && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button onClick={() => onView(calendar.id)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <EyeIcon className="h-4 w-4 mr-3 text-gray-400" />
                          View
                        </button>
                        <button onClick={() => onEdit(calendar.id)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <EditIcon className="h-4 w-4 mr-3 text-gray-400" />
                          Edit
                        </button>
                        <button onClick={() => handleToggleStatus(calendar.id, calendar.status)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          {calendar.status === 'active' ? <>
                              <PauseIcon className="h-4 w-4 mr-3 text-gray-400" />
                              Pause
                            </> : <>
                              <PlayIcon className="h-4 w-4 mr-3 text-gray-400" />
                              Activate
                            </>}
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <CopyIcon className="h-4 w-4 mr-3 text-gray-400" />
                          Duplicate
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          <TrashIcon className="h-4 w-4 mr-3 text-red-400" />
                          Delete
                        </button>
                      </div>
                    </div>}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div onClick={() => onView(calendar.id)} className="cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                  {calendar.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {calendar.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Followers</span>
                  <div className="flex items-center">
                    <span className="text-base font-medium text-gray-900">
                      {formatNumber(calendar.stats.followers)}
                    </span>
                    {calendar.stats.growthRate !== 0 && <span className={`ml-1 text-xs flex items-center ${calendar.stats.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calendar.stats.growthRate > 0 ? <TrendingUpIcon className="h-3 w-3 mr-0.5" /> : <TrendingDownIcon className="h-3 w-3 mr-0.5" />}
                        {Math.abs(calendar.stats.growthRate)}%
                      </span>}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Events</span>
                  <div className="flex items-center">
                    <span className="text-base font-medium text-gray-900">
                      {calendar.stats.events}
                    </span>
                    {calendar.stats.pendingEvents > 0 && <span className="ml-1 text-xs text-yellow-600">
                        (+{calendar.stats.pendingEvents} pending)
                      </span>}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Engagement</span>
                  <span className="text-base font-medium text-gray-900">
                    {calendar.stats.engagement}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Revenue</span>
                  <span className="text-base font-medium text-gray-900">
                    {calendar.stats.revenue > 0 ? `$${calendar.stats.revenue.toFixed(2)}` : '-'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Updated {calendar.lastUpdated}
                </span>
                <div className="flex space-x-2">
                  <button onClick={() => onView(calendar.id)} className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => onEdit(calendar.id)} className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                    <EditIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>)}
      </div>;
  }
  // List view
  return <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Calendar
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Followers
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Events
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Engagement
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Revenue
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Updated
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {calendars.map(calendar => <tr key={calendar.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                    <img src={calendar.image} alt={calendar.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {calendar.title}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {calendar.description}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(calendar.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="text-sm text-gray-900">
                    {formatNumber(calendar.stats.followers)}
                  </span>
                  {calendar.stats.growthRate !== 0 && <span className={`ml-1 text-xs flex items-center ${calendar.stats.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calendar.stats.growthRate > 0 ? <TrendingUpIcon className="h-3 w-3 mr-0.5" /> : <TrendingDownIcon className="h-3 w-3 mr-0.5" />}
                      {Math.abs(calendar.stats.growthRate)}%
                    </span>}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="text-sm text-gray-900">
                    {calendar.stats.events}
                  </span>
                  {calendar.stats.pendingEvents > 0 && <span className="ml-1 text-xs text-yellow-600">
                      (+{calendar.stats.pendingEvents})
                    </span>}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {calendar.stats.engagement}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {calendar.stats.revenue > 0 ? `$${calendar.stats.revenue.toFixed(2)}` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {calendar.lastUpdated}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative">
                  <button onClick={() => toggleMenu(calendar.id)} className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                    <MoreVerticalIcon className="h-5 w-5" />
                  </button>
                  {openMenuId === calendar.id && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button onClick={() => onView(calendar.id)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <EyeIcon className="h-4 w-4 mr-3 text-gray-400" />
                          View
                        </button>
                        <button onClick={() => onEdit(calendar.id)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <EditIcon className="h-4 w-4 mr-3 text-gray-400" />
                          Edit
                        </button>
                        <button onClick={() => handleToggleStatus(calendar.id, calendar.status)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          {calendar.status === 'active' ? <>
                              <PauseIcon className="h-4 w-4 mr-3 text-gray-400" />
                              Pause
                            </> : <>
                              <PlayIcon className="h-4 w-4 mr-3 text-gray-400" />
                              Activate
                            </>}
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <CopyIcon className="h-4 w-4 mr-3 text-gray-400" />
                          Duplicate
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          <TrashIcon className="h-4 w-4 mr-3 text-red-400" />
                          Delete
                        </button>
                      </div>
                    </div>}
                </div>
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>;
};
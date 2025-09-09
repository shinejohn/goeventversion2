import React, { useState } from 'react';
export const AdvancedFilters = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  return <div className="bg-white p-4 rounded-lg shadow-md mt-4 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Event Options
            </h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">
                  Free Events Only
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">
                  Has Tickets Available
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">
                  Friends Attending
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">
                  Walking Distance
                </span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Price Range
            </h3>
            <div className="px-2">
              <input type="range" min="0" max="500" value={priceRange[1] ?? 500} onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1] === 500 ? '500+' : priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Time of Day
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">Morning</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">Afternoon</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">Evening</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">Late Night</span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Event Type
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">Indoor</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">Outdoor</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">
                  Family-Friendly
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">21+ Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="px-4 py-2 text-sm text-gray-700 hover:text-gray-500">
          Clear All
        </button>
        <button className="ml-3 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700">
          Apply Filters
        </button>
      </div>
    </div>;
};
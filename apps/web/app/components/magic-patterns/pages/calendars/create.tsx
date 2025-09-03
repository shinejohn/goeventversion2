import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CalendarWizard } from '../../components/calendar/CalendarWizard';
import { ArrowLeftIcon } from 'lucide-react';
export default function CreateCalendarPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center">
          <button onClick={() => navigate('/calendars')} className="mr-4 p-1 rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-gray-700">
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Calendar
          </h1>
        </div>
        <CalendarWizard mode="create" />
      </div>
    </div>;
}
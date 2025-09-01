import React, { useState } from 'react';
import { CheckSquareIcon, FileUpIcon, UsersIcon, ClockIcon, PlusIcon, CheckIcon, XIcon, CalendarIcon } from 'lucide-react';
type OrganizerDashboardProps = {
  booking: any;
};
export const OrganizerDashboard = ({
  booking
}: OrganizerDashboardProps) => {
  const [tasks, setTasks] = useState([{
    id: 1,
    text: 'Review venue policies',
    completed: true
  }, {
    id: 2,
    text: 'Upload event insurance',
    completed: false
  }, {
    id: 3,
    text: 'Confirm final guest count',
    completed: false
  }, {
    id: 4,
    text: 'Arrange catering details',
    completed: false
  }, {
    id: 5,
    text: 'Plan event layout',
    completed: false
  }, {
    id: 6,
    text: 'Organize transportation',
    completed: false
  }]);
  const [documents, setDocuments] = useState([{
    id: 1,
    name: 'Signed Contract.pdf',
    type: 'contract',
    uploaded: true,
    date: 'June 5, 2024'
  }, {
    id: 2,
    name: 'Event Insurance.pdf',
    type: 'insurance',
    uploaded: false,
    required: true
  }, {
    id: 3,
    name: 'Floor Plan.pdf',
    type: 'layout',
    uploaded: false,
    required: false
  }]);
  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => task.id === taskId ? {
      ...task,
      completed: !task.completed
    } : task));
  };
  // Calculate days until event
  const calculateDaysUntil = () => {
    const eventDate = new Date(booking.date);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const daysUntilEvent = calculateDaysUntil();
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const taskProgress = Math.round(completedTasksCount / tasks.length * 100);
  return <div className="space-y-8">
      {/* Countdown Timer */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Event Countdown</h2>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-indigo-600 mb-2">
              {daysUntilEvent}
            </div>
            <div className="text-gray-600">days until your event</div>
            <div className="mt-4 text-sm text-gray-500 flex items-center justify-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {new Date(booking.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
            </div>
          </div>
        </div>
      </div>
      {/* Pre-event Checklist */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Pre-event Checklist
          </h2>
          <div className="text-sm text-gray-500">
            {completedTasksCount} of {tasks.length} completed ({taskProgress}%)
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {tasks.map(task => <div key={task.id} className={`flex items-start p-3 rounded-md ${task.completed ? 'bg-green-50 border border-green-100' : 'bg-white border border-gray-200'}`}>
                <button onClick={() => toggleTask(task.id)} className={`h-5 w-5 rounded border flex-shrink-0 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent'}`}>
                  {task.completed && <CheckIcon className="h-3 w-3" />}
                </button>
                <span className={`ml-3 text-sm ${task.completed ? 'text-green-800' : 'text-gray-700'}`}>
                  {task.text}
                </span>
              </div>)}
            <button className="mt-2 flex items-center text-sm text-indigo-600 hover:text-indigo-800">
              <PlusIcon className="h-4 w-4 mr-1" />
              Add custom task
            </button>
          </div>
        </div>
      </div>
      {/* Document Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Documents</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {documents.map(doc => <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex items-center">
                  <FileUpIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {doc.name}
                      {doc.required && !doc.uploaded && <span className="ml-2 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          Required
                        </span>}
                    </div>
                    {doc.uploaded ? <div className="text-xs text-gray-500">
                        Uploaded on {doc.date}
                      </div> : <div className="text-xs text-gray-500">Not uploaded</div>}
                  </div>
                </div>
                {doc.uploaded ? <div className="flex space-x-2">
                    <button className="text-xs text-indigo-600 hover:text-indigo-800">
                      View
                    </button>
                    <button className="text-xs text-gray-600 hover:text-gray-800">
                      Replace
                    </button>
                  </div> : <button className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                    Upload
                  </button>}
              </div>)}
            <button className="mt-2 flex items-center text-sm text-indigo-600 hover:text-indigo-800">
              <PlusIcon className="h-4 w-4 mr-1" />
              Upload new document
            </button>
          </div>
        </div>
      </div>
      {/* Guest List Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Guest List</h2>
          <div className="text-sm text-gray-500">
            {booking.guestCount} confirmed
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-center">
              <UsersIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Manage your guest list
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Track RSVPs, send invitations, and manage seating
              </p>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                Set Up Guest List
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Request Changes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Request Changes</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                Change Date or Time
              </div>
              <ChevronRight />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <div className="flex items-center">
                <PlusIcon className="h-5 w-5 text-gray-400 mr-2" />
                Add Services or Equipment
              </div>
              <ChevronRight />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
                Update Guest Count
              </div>
              <ChevronRight />
            </button>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Note: Change requests are subject to venue approval and may result
            in pricing adjustments.
          </div>
        </div>
      </div>
    </div>;
};
const ChevronRight = () => <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>;
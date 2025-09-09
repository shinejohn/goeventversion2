import React, { useState } from 'react';
import { DollarSignIcon, ClipboardCheckIcon, StarIcon, BarChartIcon, CalendarIcon, UsersIcon, CheckIcon, XIcon, Clock as ClockIcon, Plus as PlusIcon } from 'lucide-react';
type VenueOwnerDashboardProps = {
  booking: any;
};
export const VenueOwnerDashboard = ({
  booking
}: VenueOwnerDashboardProps) => {
  const [checklist, setChecklist] = useState([{
    id: 1,
    text: 'Review booking details',
    completed: true
  }, {
    id: 2,
    text: 'Confirm staff schedule',
    completed: true
  }, {
    id: 3,
    text: 'Prepare venue layout',
    completed: false
  }, {
    id: 4,
    text: 'Check equipment needs',
    completed: false
  }, {
    id: 5,
    text: 'Verify catering arrangements',
    completed: false
  }]);
  const toggleTask = (taskId: number) => {
    setChecklist(checklist.map(task => task.id === taskId ? {
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
  const completedTasksCount = checklist.filter(task => task.completed).length;
  const taskProgress = Math.round(completedTasksCount / checklist.length * 100);
  return <div className="space-y-8">
      {/* Event Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Event Status</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex-1 w-full sm:w-auto text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <CalendarIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-700 mb-1">
                {daysUntilEvent}
              </div>
              <div className="text-sm text-blue-600">days until event</div>
            </div>
            <div className="flex-1 w-full sm:w-auto text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <UsersIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-700 mb-1">
                {booking.guestCount}
              </div>
              <div className="text-sm text-green-600">expected guests</div>
            </div>
            <div className="flex-1 w-full sm:w-auto text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
              <DollarSignIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-purple-700 mb-1">
                ${booking.pricing.total.toFixed(0)}
              </div>
              <div className="text-sm text-purple-600">booking value</div>
            </div>
          </div>
        </div>
      </div>
      {/* Payment Tracking */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">
            Payment Tracking
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <div className="font-medium text-green-800">
                    Deposit Received
                  </div>
                  <div className="text-sm text-green-600">
                    ${booking.depositAmount.toFixed(2)} • {booking.depositDate}
                  </div>
                </div>
              </div>
              <div className="text-green-700 font-medium">
                ${(booking.depositAmount * 0.9).toFixed(2)}
                <div className="text-xs text-green-600">Payout (90%)</div>
              </div>
            </div>
            {booking.paymentStatus === 'deposit_paid' && <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-800">
                      Final Payment Pending
                    </div>
                    <div className="text-sm text-gray-600">
                      $
                      {(booking.pricing.total - booking.depositAmount).toFixed(2)}{' '}
                      • Due by {booking.balanceDueDate}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 font-medium">
                  $
                  {((booking.pricing.total - booking.depositAmount) * 0.9).toFixed(2)}
                  <div className="text-xs text-gray-500">
                    Future payout (90%)
                  </div>
                </div>
              </div>}
            {booking.paymentStatus === 'paid_in_full' && <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <div className="font-medium text-green-800">
                      Final Payment Received
                    </div>
                    <div className="text-sm text-green-600">
                      $
                      {(booking.pricing.total - booking.depositAmount).toFixed(2)}{' '}
                      • {booking.finalPaymentDate}
                    </div>
                  </div>
                </div>
                <div className="text-green-700 font-medium">
                  $
                  {((booking.pricing.total - booking.depositAmount) * 0.9).toFixed(2)}
                  <div className="text-xs text-green-600">Payout (90%)</div>
                </div>
              </div>}
            <div className="text-sm text-gray-600 mt-2">
              <div className="font-medium">Payout Schedule</div>
              <ul className="mt-1 text-xs space-y-1">
                <li>• Deposit payout: Already processed</li>
                <li>
                  • Final payment: Will be released 24 hours after event
                  completion
                </li>
                <li>• Platform fee: 10% of total booking value</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Event Day Checklist */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Event Day Checklist
          </h2>
          <div className="text-sm text-gray-500">
            {completedTasksCount} of {checklist.length} completed (
            {taskProgress}%)
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {checklist.map(task => <div key={task.id} className={`flex items-start p-3 rounded-md ${task.completed ? 'bg-green-50 border border-green-100' : 'bg-white border border-gray-200'}`}>
                <button onClick={() => toggleTask(task.id)} className={`h-5 w-5 rounded border flex-shrink-0 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent'}`}>
                  {task.completed && <CheckIcon className="h-3 w-3" />}
                </button>
                <span className={`ml-3 text-sm ${task.completed ? 'text-green-800' : 'text-gray-700'}`}>
                  {task.text}
                </span>
              </div>)}
            <button className="mt-2 flex items-center text-sm text-indigo-600 hover:text-indigo-800">
              <PlusIcon className="h-4 w-4 mr-1" />
              Add task
            </button>
          </div>
        </div>
      </div>
      {/* Check-in Tools */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Check-in Tools</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-center">
              <ClipboardCheckIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Event Day Check-in System
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Easily track arrivals, verify guests, and manage capacity
              </p>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                Set Up Check-in
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Post-Event */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">
            Post-Event Tools
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <StarIcon className="h-8 w-8 text-amber-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Request Reviews</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Automatically send review requests after the event
                  </p>
                </div>
              </div>
              <button className="mt-4 w-full py-2 px-3 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Schedule Review Request
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <BarChartIcon className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Event Analytics</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Track attendance, feedback, and financial metrics
                  </p>
                </div>
              </div>
              <button className="mt-4 w-full py-2 px-3 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
const PlusIcon = () => <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>;
const ClockIcon = () => <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>;
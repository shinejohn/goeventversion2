import React, { useState } from 'react';
import { CheckIcon, XIcon, EyeIcon, UserCheckIcon, UserXIcon, MessageSquareIcon, AlertTriangleIcon, BellIcon, ClockIcon, UserPlusIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
type PendingEvent = {
  id: string;
  title: string;
  calendar: string;
  submittedBy: string;
  date: string;
};
type MemberRequest = {
  id: string;
  name: string;
  calendar: string;
  requestType: string;
  date: string;
};
type Comment = {
  id: string;
  content: string;
  calendar: string;
  author: string;
  date: string;
};
type AISuggestion = {
  id: string;
  title: string;
  calendar: string;
  confidence: string;
  date: string;
};
type PendingActionsData = {
  events: PendingEvent[];
  memberRequests: MemberRequest[];
  comments: Comment[];
  aiSuggestions: AISuggestion[];
};
type PendingActionsProps = {
  data: PendingActionsData;
};
export const PendingActions = ({
  data
}: PendingActionsProps) => {
  const [activeTab, setActiveTab] = useState<'events' | 'members' | 'comments' | 'ai'>('events');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    events: true,
    members: true,
    comments: true,
    ai: true
  });
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  return <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Pending Actions
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Items that require your attention
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-800 text-xs font-medium">
              {data.events.length + data.memberRequests.length + data.comments.length + data.aiSuggestions.length}
            </span>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          <button onClick={() => setActiveTab('events')} className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm flex items-center ${activeTab === 'events' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            <ClockIcon className="h-4 w-4 mr-1.5" />
            Events ({data.events.length})
          </button>
          <button onClick={() => setActiveTab('members')} className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm flex items-center ${activeTab === 'members' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            <UserPlusIcon className="h-4 w-4 mr-1.5" />
            Members ({data.memberRequests.length})
          </button>
          <button onClick={() => setActiveTab('comments')} className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm flex items-center ${activeTab === 'comments' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            <MessageSquareIcon className="h-4 w-4 mr-1.5" />
            Comments ({data.comments.length})
          </button>
          <button onClick={() => setActiveTab('ai')} className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm flex items-center ${activeTab === 'ai' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            <div className="h-4 w-4 mr-1.5" />
            AI Suggestions ({data.aiSuggestions.length})
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {activeTab === 'events' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-900">
                Events Awaiting Approval
              </h3>
              <button onClick={() => toggleSection('events')} className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                {expandedSections.events ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </button>
            </div>
            {expandedSections.events && <div className="space-y-3">
                {data.events.length === 0 ? <div className="text-center py-4 text-gray-500">
                    No pending events
                  </div> : data.events.map(event => <div key={event.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {event.title}
                          </h4>
                          <div className="text-sm text-gray-500 mt-1">
                            Calendar: {event.calendar}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span>Submitted by: {event.submittedBy}</span>
                            <span className="mx-1">•</span>
                            <span>{event.date}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-md text-green-500 hover:text-green-700 hover:bg-green-100">
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100">
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>)}
              </div>}
          </div>}
        {activeTab === 'members' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-900">
                Member Requests
              </h3>
              <button onClick={() => toggleSection('members')} className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                {expandedSections.members ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </button>
            </div>
            {expandedSections.members && <div className="space-y-3">
                {data.memberRequests.length === 0 ? <div className="text-center py-4 text-gray-500">
                    No member requests
                  </div> : data.memberRequests.map(request => <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {request.name}
                          </h4>
                          <div className="text-sm text-gray-500 mt-1">
                            Calendar: {request.calendar}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span>Request: {request.requestType}</span>
                            <span className="mx-1">•</span>
                            <span>{request.date}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-1.5 rounded-md text-green-500 hover:text-green-700 hover:bg-green-100">
                            <UserCheckIcon className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100">
                            <UserXIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>)}
              </div>}
          </div>}
        {activeTab === 'comments' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-900">
                Comments to Moderate
              </h3>
              <button onClick={() => toggleSection('comments')} className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                {expandedSections.comments ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </button>
            </div>
            {expandedSections.comments && <div className="space-y-3">
                {data.comments.length === 0 ? <div className="text-center py-4 text-gray-500">
                    No comments to moderate
                  </div> : data.comments.map(comment => <div key={comment.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-900">{comment.content}</p>
                          <div className="text-sm text-gray-500 mt-1">
                            Calendar: {comment.calendar}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span>By: {comment.author}</span>
                            <span className="mx-1">•</span>
                            <span>{comment.date}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-1.5 rounded-md text-green-500 hover:text-green-700 hover:bg-green-100">
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100">
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>)}
              </div>}
          </div>}
        {activeTab === 'ai' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-900">
                AI Suggested Events
              </h3>
              <button onClick={() => toggleSection('ai')} className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                {expandedSections.ai ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </button>
            </div>
            {expandedSections.ai && <div className="space-y-3">
                {data.aiSuggestions.length === 0 ? <div className="text-center py-4 text-gray-500">
                    No AI suggestions
                  </div> : data.aiSuggestions.map(suggestion => <div key={suggestion.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">
                              {suggestion.title}
                            </h4>
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${suggestion.confidence === 'High' ? 'bg-green-100 text-green-800' : suggestion.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                              {suggestion.confidence}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Calendar: {suggestion.calendar}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span>Generated: {suggestion.date}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-md text-green-500 hover:text-green-700 hover:bg-green-100">
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100">
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>)}
              </div>}
          </div>}
        {/* View All Button */}
        <div className="mt-4 text-center">
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            View all pending items
          </button>
        </div>
      </div>
    </div>;
};
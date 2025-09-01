import React from 'react';
import { EnhancedEventCard } from './EnhancedEventCard';
type ListViewProps = {
  events: any[];
  hubData: any;
};
export const ListView = ({
  events,
  hubData
}: ListViewProps) => {
  // Group events by date
  const groupedEvents = events.reduce((groups, event) => {
    const dateKey = new Date(event.date).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
    return groups;
  }, {});
  // Convert to array and sort by date
  const sortedGroups = Object.entries(groupedEvents).map(([dateKey, events]) => ({
    date: new Date(dateKey),
    events
  })).sort((a, b) => a.date.getTime() - b.date.getTime());
  const formatGroupDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    }
  };
  return <div className="space-y-8">
      {sortedGroups.map(group => <div key={group.date.toISOString()} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 bg-gray-50 p-2 rounded-md">
            {formatGroupDate(group.date)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.events.map(event => <EnhancedEventCard key={event.id} event={event} hubData={hubData} />)}
          </div>
        </div>)}
    </div>;
};
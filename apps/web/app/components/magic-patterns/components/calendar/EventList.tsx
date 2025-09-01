import React from 'react';
import { EventCard } from './EventCard';
type Event = {
  id: string;
  title: string;
  image: string;
  date: Date;
  venue: {
    name: string;
    neighborhood: string;
    id: string;
    slug: string;
  };
  distance: {
    miles: number;
    minutes: number;
    mode: string;
  };
  price: {
    isFree: boolean;
    min?: number;
    max?: number;
  };
  categories: string[];
  friendsAttending: {
    id: string;
    name: string;
    avatar: string;
  }[];
  isOutdoor?: boolean;
  weather?: string;
};
type EventListProps = {
  events: Event[];
};
export const EventList = ({
  events
}: EventListProps) => {
  // Group events by date
  const groupedEvents = events.reduce((groups, event) => {
    const date = event.date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, Event[]>);
  return <div className="divide-y divide-gray-200">
      {Object.entries(groupedEvents).map(([date, dateEvents]) => <div key={date} className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{date}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dateEvents.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        </div>)}
    </div>;
};
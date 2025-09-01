import React, { useEffect, useState } from 'react';
import { useNavigationContext } from '../../../context/NavigationContext';
import { CalendarWizard } from '../../../components/calendar/CalendarWizard';
import { ArrowLeftIcon } from 'lucide-react';
export default function EditCalendarPage() {
  const {
    navigateTo
  } = useNavigationContext();
  const [isLoading, setIsLoading] = useState(true);
  const [calendarData, setCalendarData] = useState(null);
  // Mock data fetch for calendar
  useEffect(() => {
    // In a real app, this would fetch the calendar data from the API
    setTimeout(() => {
      setCalendarData({
        id: 'downtown-jazz-nights',
        name: 'Downtown Jazz Nights',
        category: 'music',
        description: 'A curated collection of the finest jazz performances happening in downtown Clearwater.',
        tags: ['jazz', 'live music', 'downtown', 'nightlife'],
        geographicScope: 'local',
        visibility: 'public',
        automationRules: [{
          id: 'rule-1',
          name: 'Jazz Events',
          conditions: {
            categories: ['jazz', 'blues'],
            locations: ['downtown'],
            keywords: ['saxophone', 'trumpet', 'jazz'],
            venues: {
              include: ['blue-note', 'jazz-corner'],
              exclude: []
            },
            timePreferences: {
              days: [5, 6],
              timeRange: {
                start: '18:00',
                end: '23:00'
              }
            },
            priceRange: {
              min: 0,
              max: 50
            }
          },
          autoApprove: true
        }],
        customization: {
          bannerImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          logo: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
          colorTheme: 'indigo',
          customCategories: ['smooth jazz', 'bebop', 'fusion'],
          welcomeMessage: 'Welcome to Downtown Jazz Nights! Discover the best jazz performances in town.',
          memberPermissions: {
            canAddEvents: true,
            canInviteMembers: true,
            canModerateDiscussions: false,
            canEditCalendar: false
          }
        },
        monetization: {
          isPaid: true,
          price: 4.99,
          benefits: ['Exclusive early access to event tickets', 'Monthly jazz playlist curations', 'Discounts at partner venues'],
          sponsorSlots: 2,
          promoCodes: [{
            code: 'JAZZFAN',
            discount: 25,
            expiresAt: '2023-12-31'
          }]
        }
      });
      setIsLoading(false);
    }, 1000);
  }, []);
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center">
          <button onClick={() => navigateTo(`/calendar/${calendarData.id}`)} className="mr-4 p-1 rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-gray-700">
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Calendar: {calendarData.name}
          </h1>
        </div>
        <CalendarWizard mode="edit" initialData={calendarData} />
      </div>
    </div>;
}
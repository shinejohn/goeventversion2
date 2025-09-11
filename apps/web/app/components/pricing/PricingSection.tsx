import React from 'react';
import { PricingCard } from './PricingCard';

interface PricingSectionProps {
  onSelectPlan: (userType: string, plan: string) => void;
  selectedPlans: Record<string, string>;
}

export function PricingSection({ onSelectPlan, selectedPlans }: PricingSectionProps) {
  const pricingData = {
    fan: {
      basic: {
        title: 'Basic User',
        price: 0,
        yearlyPrice: 0,
        description: 'Discover events and venues',
        features: [
          'Browse community calendar',
          'Search and filter events',
          'View event details',
          'Personal calendar (20 events)',
          'Purchase tickets',
          'Comments and reviews',
          'Check-in at events',
          'Basic profile',
          'Email notifications'
        ],
        limitations: [
          'Cannot share check-ins publicly',
          'No early access to events',
          'No messaging/social features',
          'No calendar sharing',
          'No advanced filters',
          'No data exports',
          'Standard support only'
        ]
      },
      premium: {
        title: 'Premium User',
        price: 9.99,
        yearlyPrice: 100,
        description: 'Enhanced social and early access',
        features: [
          'Everything in Basic',
          'Share check-ins publicly',
          'Direct messaging',
          'Friend connections',
          'Calendar sharing',
          'Group planning tools',
          'Social event discovery',
          'Early event alerts (24-48h)',
          'Early ticket access (1-2h)',
          'Price drop notifications',
          'VIP event access',
          'Advanced filters',
          'Unlimited saved events',
          'Personal analytics',
          'Export data',
          'Enhanced notifications',
          'Priority support',
          '2x check-in points',
          'Exclusive member perks',
          'Premium member badge'
        ],
        limitations: []
      }
    },
    performer: {
      basic: {
        title: 'Basic Performer',
        price: 0,
        yearlyPrice: 0,
        description: 'Showcase your talent',
        features: [
          'Basic performer profile',
          'List up to 5 events/month',
          'Basic event details',
          'Contact information display',
          'Social media links',
          'Basic search visibility'
        ],
        limitations: [
          'No verified badge',
          'No fan engagement tools',
          'No booking marketplace access',
          'No advanced analytics',
          'No promotional tools',
          'No direct fan communication',
          'No early event publishing'
        ]
      },
      premium: {
        title: 'Premium Performer',
        price: 19.99,
        yearlyPrice: 200,
        description: 'Verified and enhanced features',
        features: [
          'Everything in Basic',
          'Verified performer badge',
          'Enhanced profile with media gallery',
          'Custom URL (whensthefun.com/yourname)',
          'Unlimited event listings',
          '48-hour early event publishing',
          'Video embedding',
          'Fan/follower management',
          'Direct fan messaging',
          'Fan alerts',
          'Community hub creation',
          'Calendar sharing',
          'Presale access creation',
          'Booking marketplace access',
          'Contract management',
          'Invoice and payment tools',
          'Gear marketplace (10% platform fee)',
          'Merchandise integration',
          'Advanced analytics',
          'Attendee data access',
          'Check-in data',
          'Calendar save data',
          'Export all data',
          'Community creation tools',
          'Mass messaging',
          'Content curation',
          'Monetization tools',
          '90-day free ad package',
          'Self-serve advertising',
          'Promotional listing upgrades',
          'Featured placement',
          'Cross-promotion tools'
        ],
        limitations: []
      }
    },
    venue_manager: {
      basic: {
        title: 'Basic Venue',
        price: 0,
        yearlyPrice: 0,
        description: 'List your venue',
        features: [
          'Basic venue profile',
          'List up to 5 events/month',
          'Basic event management',
          'Contact information display',
          'Operating hours and amenities',
          'Basic search visibility'
        ],
        limitations: [
          'No verified badge',
          'No booking marketplace access',
          'No advanced calendar management',
          'No customer analytics',
          'No promotional tools',
          'No direct customer communication'
        ]
      },
      premium: {
        title: 'Premium Venue',
        price: 19.99,
        yearlyPrice: 200,
        description: 'Verified and enhanced management',
        features: [
          'Everything in Basic',
          'Verified venue badge',
          'Enhanced profile with virtual tours',
          'Custom URL (whensthefun.com/venuename)',
          'Unlimited event listings',
          'Multiple space management',
          'Video embedding',
          'Booking marketplace access',
          'Availability calendar management',
          'Rate card and pricing tools',
          'Contract management',
          'Invoice and payment processing',
          'Staff scheduling integration',
          'Customer/patron messaging',
          'Loyalty program management',
          'Event attendee communication',
          'Review management and responses',
          'Community building tools',
          'Advanced analytics',
          'Attendee data access',
          'Check-in data',
          'Calendar save data',
          'Revenue tracking and reporting',
          'Export all data',
          'Community creation tools',
          'Mass customer messaging',
          'Event curation and recommendations',
          'Local scene leadership tools',
          '90-day free ad package',
          'Self-serve advertising',
          'Featured venue listings',
          'Event promotion tools',
          'Cross-promotion with other venues'
        ],
        limitations: []
      }
    },
    influencer: {
      premium: {
        title: 'Premium Influencer',
        price: 19.99,
        yearlyPrice: 200,
        description: 'Create calendars and communities',
        features: [
          'Unlimited calendar creation',
          'Unlimited community creation',
          'Advanced analytics',
          'Custom branding',
          'Priority support',
          'Revenue sharing',
          'Content curation tools',
          'Mass messaging',
          'Monetization tools',
          'Community management',
          'Event recommendations',
          'Follower engagement tools',
          'Cross-promotion opportunities'
        ],
        limitations: []
      }
    },
    organizer: {
      basic: {
        title: 'Basic Organizer',
        price: 0,
        yearlyPrice: 0,
        description: 'Create and manage events',
        features: [
          'Basic event creation (5/month)',
          'Standard event details',
          'Basic ticketing',
          'Attendee check-in (QR codes)',
          'Basic event promotion',
          'Simple registration forms'
        ],
        limitations: [
          'No advanced ticketing options',
          'No team collaboration tools',
          'No advanced analytics',
          'No marketing automation',
          'No attendee communication tools',
          'No data exports'
        ]
      },
      premium: {
        title: 'Premium Organizer',
        price: 19.99,
        yearlyPrice: 200,
        description: 'Advanced event management',
        features: [
          'Everything in Basic',
          'Unlimited event creation',
          'Multi-tier ticketing (VIP, general, groups)',
          'Advanced registration forms',
          'Recurring event automation',
          'Event series management',
          'Team collaboration tools',
          'Attendee management',
          'Advanced analytics',
          'Marketing automation',
          'Communication tools',
          'Data export',
          'Revenue tracking',
          'Custom branding',
          'Priority support'
        ],
        limitations: []
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Select the perfect plan for your needs. All plans include core features, 
          with premium plans offering enhanced capabilities and tools.
        </p>
      </div>

      <div className="space-y-12">
        {/* Fan Plans */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">User Plans</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              {...pricingData.fan.basic}
              userType="fan"
              onSelect={onSelectPlan}
              selected={selectedPlans.fan === 'basic'}
            />
            <PricingCard
              {...pricingData.fan.premium}
              userType="fan"
              isPopular
              onSelect={onSelectPlan}
              selected={selectedPlans.fan === 'premium'}
            />
          </div>
        </div>

        {/* Performer Plans */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Performer Plans</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              {...pricingData.performer.basic}
              userType="performer"
              onSelect={onSelectPlan}
              selected={selectedPlans.performer === 'basic'}
            />
            <PricingCard
              {...pricingData.performer.premium}
              userType="performer"
              isPopular
              onSelect={onSelectPlan}
              selected={selectedPlans.performer === 'premium'}
            />
          </div>
        </div>

        {/* Venue Plans */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Venue Plans</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              {...pricingData.venue_manager.basic}
              userType="venue_manager"
              onSelect={onSelectPlan}
              selected={selectedPlans.venue_manager === 'basic'}
            />
            <PricingCard
              {...pricingData.venue_manager.premium}
              userType="venue_manager"
              isPopular
              onSelect={onSelectPlan}
              selected={selectedPlans.venue_manager === 'premium'}
            />
          </div>
        </div>

        {/* Organizer Plans */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Organizer Plans</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              {...pricingData.organizer.basic}
              userType="organizer"
              onSelect={onSelectPlan}
              selected={selectedPlans.organizer === 'basic'}
            />
            <PricingCard
              {...pricingData.organizer.premium}
              userType="organizer"
              isPopular
              onSelect={onSelectPlan}
              selected={selectedPlans.organizer === 'premium'}
            />
          </div>
        </div>

        {/* Influencer Plans */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Influencer Plans</h3>
          <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
            <PricingCard
              {...pricingData.influencer.premium}
              userType="influencer"
              isPopular
              onSelect={onSelectPlan}
              selected={selectedPlans.influencer === 'premium'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

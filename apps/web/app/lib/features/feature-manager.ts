import type { UserProfile } from '@kit/supabase/database';

export type UserType = 'fan' | 'performer' | 'venue_manager' | 'influencer' | 'organizer';
export type SubscriptionPlan = 'basic' | 'premium';

export interface FeatureConfig {
  [key: string]: boolean | number | string;
}

export interface UserFeatures {
  // Core features
  browseEvents: boolean;
  searchEvents: boolean;
  viewEventDetails: boolean;
  personalCalendar: boolean;
  purchaseTickets: boolean;
  commentsReviews: boolean;
  checkIn: boolean;
  basicProfile: boolean;
  emailNotifications: boolean;
  
  // Social features
  shareCheckins: boolean;
  directMessaging: boolean;
  friendConnections: boolean;
  calendarSharing: boolean;
  groupPlanning: boolean;
  socialDiscovery: boolean;
  
  // Premium access
  earlyEventAlerts: boolean;
  earlyTicketAccess: boolean;
  priceDropAlerts: boolean;
  vipEvents: boolean;
  advancedFilters: boolean;
  unlimitedSavedEvents: boolean;
  
  // Analytics & data
  personalAnalytics: boolean;
  dataExport: boolean;
  enhancedNotifications: boolean;
  prioritySupport: boolean;
  
  // Rewards
  doublePoints: boolean;
  exclusivePerks: boolean;
  premiumBadge: boolean;
  
  // Performer features
  verifiedBadge: boolean;
  enhancedProfile: boolean;
  customUrl: boolean;
  unlimitedEvents: boolean;
  earlyPublishing: boolean;
  videoEmbedding: boolean;
  fanManagement: boolean;
  directFanMessaging: boolean;
  fanAlerts: boolean;
  communityHub: boolean;
  presaleAccess: boolean;
  bookingMarketplace: boolean;
  contractManagement: boolean;
  invoiceTools: boolean;
  gearMarketplace: boolean;
  merchandiseIntegration: boolean;
  advancedAnalytics: boolean;
  attendeeData: boolean;
  checkinData: boolean;
  calendarSaveData: boolean;
  communityCreation: boolean;
  massMessaging: boolean;
  contentCuration: boolean;
  monetizationTools: boolean;
  freeAdPackage: boolean;
  selfServeAds: boolean;
  promotionalListings: boolean;
  featuredPlacement: boolean;
  crossPromotion: boolean;
  
  // Venue features
  multiSpaceManagement: boolean;
  availabilityCalendar: boolean;
  rateCardTools: boolean;
  invoiceProcessing: boolean;
  staffScheduling: boolean;
  customerMessaging: boolean;
  loyaltyProgram: boolean;
  attendeeCommunication: boolean;
  reviewManagement: boolean;
  communityBuilding: boolean;
  revenueTracking: boolean;
  eventCuration: boolean;
  localLeadership: boolean;
  featuredListings: boolean;
  eventPromotion: boolean;
  
  // Organizer features
  unlimitedEventCreation: boolean;
  multiTierTicketing: boolean;
  advancedForms: boolean;
  recurringEvents: boolean;
  eventSeries: boolean;
  teamCollaboration: boolean;
  attendeeManagement: boolean;
  marketingAutomation: boolean;
  communicationTools: boolean;
  
  // Influencer features
  unlimitedCalendars: boolean;
  unlimitedCommunities: boolean;
  customBranding: boolean;
  revenueSharing: boolean;
  
  // Limits
  savedEventsLimit: number;
  eventListingsLimit: number;
  calendarLimit: number;
  communityLimit: number;
}

export class FeatureManager {
  private userProfile: UserProfile | null;
  private userType: UserType;
  private subscriptionPlan: SubscriptionPlan;

  constructor(userProfile: UserProfile | null) {
    this.userProfile = userProfile;
    this.userType = (userProfile?.user_type as UserType) || 'fan';
    this.subscriptionPlan = this.determineSubscriptionPlan();
  }

  private determineSubscriptionPlan(): SubscriptionPlan {
    // This would check the user's active subscription
    // For now, we'll default to basic
    return 'basic';
  }

  public getFeatures(): UserFeatures {
    const baseFeatures = this.getBaseFeatures();
    const typeFeatures = this.getTypeSpecificFeatures();
    const planFeatures = this.getPlanSpecificFeatures();

    return {
      ...baseFeatures,
      ...typeFeatures,
      ...planFeatures
    };
  }

  private getBaseFeatures(): Partial<UserFeatures> {
    return {
      browseEvents: true,
      searchEvents: true,
      viewEventDetails: true,
      personalCalendar: true,
      purchaseTickets: true,
      commentsReviews: true,
      checkIn: true,
      basicProfile: true,
      emailNotifications: true,
      savedEventsLimit: 20,
      eventListingsLimit: 5,
      calendarLimit: 0,
      communityLimit: 0
    };
  }

  private getTypeSpecificFeatures(): Partial<UserFeatures> {
    switch (this.userType) {
      case 'performer':
        return {
          basicProfile: true,
          eventListingsLimit: this.subscriptionPlan === 'premium' ? -1 : 5,
          verifiedBadge: this.subscriptionPlan === 'premium',
          enhancedProfile: this.subscriptionPlan === 'premium',
          customUrl: this.subscriptionPlan === 'premium',
          unlimitedEvents: this.subscriptionPlan === 'premium',
          earlyPublishing: this.subscriptionPlan === 'premium',
          videoEmbedding: this.subscriptionPlan === 'premium',
          fanManagement: this.subscriptionPlan === 'premium',
          directFanMessaging: this.subscriptionPlan === 'premium',
          fanAlerts: this.subscriptionPlan === 'premium',
          communityHub: this.subscriptionPlan === 'premium',
          presaleAccess: this.subscriptionPlan === 'premium',
          bookingMarketplace: this.subscriptionPlan === 'premium',
          contractManagement: this.subscriptionPlan === 'premium',
          invoiceTools: this.subscriptionPlan === 'premium',
          gearMarketplace: this.subscriptionPlan === 'premium',
          merchandiseIntegration: this.subscriptionPlan === 'premium',
          advancedAnalytics: this.subscriptionPlan === 'premium',
          attendeeData: this.subscriptionPlan === 'premium',
          checkinData: this.subscriptionPlan === 'premium',
          calendarSaveData: this.subscriptionPlan === 'premium',
          communityCreation: this.subscriptionPlan === 'premium',
          massMessaging: this.subscriptionPlan === 'premium',
          contentCuration: this.subscriptionPlan === 'premium',
          monetizationTools: this.subscriptionPlan === 'premium',
          freeAdPackage: this.subscriptionPlan === 'premium',
          selfServeAds: this.subscriptionPlan === 'premium',
          promotionalListings: this.subscriptionPlan === 'premium',
          featuredPlacement: this.subscriptionPlan === 'premium',
          crossPromotion: this.subscriptionPlan === 'premium'
        };

      case 'venue_manager':
        return {
          basicProfile: true,
          eventListingsLimit: this.subscriptionPlan === 'premium' ? -1 : 5,
          verifiedBadge: this.subscriptionPlan === 'premium',
          enhancedProfile: this.subscriptionPlan === 'premium',
          customUrl: this.subscriptionPlan === 'premium',
          unlimitedEvents: this.subscriptionPlan === 'premium',
          multiSpaceManagement: this.subscriptionPlan === 'premium',
          videoEmbedding: this.subscriptionPlan === 'premium',
          bookingMarketplace: this.subscriptionPlan === 'premium',
          availabilityCalendar: this.subscriptionPlan === 'premium',
          rateCardTools: this.subscriptionPlan === 'premium',
          contractManagement: this.subscriptionPlan === 'premium',
          invoiceProcessing: this.subscriptionPlan === 'premium',
          staffScheduling: this.subscriptionPlan === 'premium',
          customerMessaging: this.subscriptionPlan === 'premium',
          loyaltyProgram: this.subscriptionPlan === 'premium',
          attendeeCommunication: this.subscriptionPlan === 'premium',
          reviewManagement: this.subscriptionPlan === 'premium',
          communityBuilding: this.subscriptionPlan === 'premium',
          advancedAnalytics: this.subscriptionPlan === 'premium',
          attendeeData: this.subscriptionPlan === 'premium',
          checkinData: this.subscriptionPlan === 'premium',
          calendarSaveData: this.subscriptionPlan === 'premium',
          revenueTracking: this.subscriptionPlan === 'premium',
          communityCreation: this.subscriptionPlan === 'premium',
          massMessaging: this.subscriptionPlan === 'premium',
          eventCuration: this.subscriptionPlan === 'premium',
          localLeadership: this.subscriptionPlan === 'premium',
          freeAdPackage: this.subscriptionPlan === 'premium',
          selfServeAds: this.subscriptionPlan === 'premium',
          featuredListings: this.subscriptionPlan === 'premium',
          eventPromotion: this.subscriptionPlan === 'premium',
          crossPromotion: this.subscriptionPlan === 'premium'
        };

      case 'influencer':
        return {
          unlimitedCalendars: this.subscriptionPlan === 'premium',
          unlimitedCommunities: this.subscriptionPlan === 'premium',
          advancedAnalytics: this.subscriptionPlan === 'premium',
          customBranding: this.subscriptionPlan === 'premium',
          prioritySupport: this.subscriptionPlan === 'premium',
          revenueSharing: this.subscriptionPlan === 'premium',
          communityCreation: this.subscriptionPlan === 'premium',
          massMessaging: this.subscriptionPlan === 'premium',
          contentCuration: this.subscriptionPlan === 'premium',
          monetizationTools: this.subscriptionPlan === 'premium',
          calendarLimit: this.subscriptionPlan === 'premium' ? -1 : 1,
          communityLimit: this.subscriptionPlan === 'premium' ? -1 : 1
        };

      case 'organizer':
        return {
          eventListingsLimit: this.subscriptionPlan === 'premium' ? -1 : 5,
          unlimitedEventCreation: this.subscriptionPlan === 'premium',
          multiTierTicketing: this.subscriptionPlan === 'premium',
          advancedForms: this.subscriptionPlan === 'premium',
          recurringEvents: this.subscriptionPlan === 'premium',
          eventSeries: this.subscriptionPlan === 'premium',
          teamCollaboration: this.subscriptionPlan === 'premium',
          attendeeManagement: this.subscriptionPlan === 'premium',
          advancedAnalytics: this.subscriptionPlan === 'premium',
          marketingAutomation: this.subscriptionPlan === 'premium',
          communicationTools: this.subscriptionPlan === 'premium',
          dataExport: this.subscriptionPlan === 'premium',
          revenueTracking: this.subscriptionPlan === 'premium',
          customBranding: this.subscriptionPlan === 'premium',
          prioritySupport: this.subscriptionPlan === 'premium'
        };

      default: // fan
        return {};
    }
  }

  private getPlanSpecificFeatures(): Partial<UserFeatures> {
    if (this.subscriptionPlan === 'premium') {
      return {
        shareCheckins: true,
        directMessaging: true,
        friendConnections: true,
        calendarSharing: true,
        groupPlanning: true,
        socialDiscovery: true,
        earlyEventAlerts: true,
        earlyTicketAccess: true,
        priceDropAlerts: true,
        vipEvents: true,
        advancedFilters: true,
        unlimitedSavedEvents: true,
        personalAnalytics: true,
        dataExport: true,
        enhancedNotifications: true,
        prioritySupport: true,
        doublePoints: true,
        exclusivePerks: true,
        premiumBadge: true,
        savedEventsLimit: -1
      };
    }

    return {};
  }

  public hasFeature(feature: keyof UserFeatures): boolean {
    const features = this.getFeatures();
    return Boolean(features[feature]);
  }

  public getFeatureLimit(feature: keyof UserFeatures): number {
    const features = this.getFeatures();
    const value = features[feature];
    return typeof value === 'number' ? value : 0;
  }

  public canAccessFeature(feature: keyof UserFeatures, currentUsage?: number): boolean {
    if (!this.hasFeature(feature)) {
      return false;
    }

    const limit = this.getFeatureLimit(feature);
    if (limit === -1) {
      return true; // Unlimited
    }

    return currentUsage === undefined || currentUsage < limit;
  }
}

export function useFeatures(userProfile: UserProfile | null) {
  const featureManager = new FeatureManager(userProfile);
  return {
    features: featureManager.getFeatures(),
    hasFeature: (feature: keyof UserFeatures) => featureManager.hasFeature(feature),
    getFeatureLimit: (feature: keyof UserFeatures) => featureManager.getFeatureLimit(feature),
    canAccessFeature: (feature: keyof UserFeatures, currentUsage?: number) => 
      featureManager.canAccessFeature(feature, currentUsage)
  };
}

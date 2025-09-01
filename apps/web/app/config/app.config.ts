export default {
  name: "When's The Fun",
  url: import.meta.env.VITE_APP_URL,
  organizationName: 'Community',        // Instead of 'Organization'
  organizationNamePlural: 'Communities',
  features: {
    enableOrganizations: true,
    enablePersonalAccount: false,       // Communities are primary
    enableTeamAccounts: true,
    enableNotifications: true,
    enableBilling: true,
    enableMultiFactorAuth: true,
  },
  paths: {
    home: '/calendar',                  // Calendar is home!
    dashboard: '/dashboard',
    settings: '/settings',
    calendar: '/calendar',              // Primary path
    events: '/events',
    venues: '/venues',
  }
};
export const environment = {
  production: false,
  staging: false,
  testing: false,
  appName: 'TaskFlow Pro',
  version: '1.0.0',
  api: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 30000,
    retryAttempts: 3
  },
  auth: {
    clientId: 'dev-client-id',
    redirectUri: 'http://localhost:4200/auth/callback',
    logoutUri: 'http://localhost:4200/auth/logout'
  },
  features: {
    enableAnalytics: false,
    enableLogging: true,
    enableMockData: true,
    enableDevTools: true
  },
  external: {
    googleMapsApiKey: 'dev-google-maps-key',
    stripePublishableKey: 'pk_test_...',
    sentryDsn: ''
  },
  cache: {
    ttl: 300000, // 5 minutes
    maxSize: 100
  }
};

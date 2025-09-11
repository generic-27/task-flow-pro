export const environment = {
  production: false,
  staging: false,
  testing: true,
  appName: 'TaskFlow Pro - Test',
  version: '1.0.0-test',
  api: {
    baseUrl: 'http://localhost:3001/api',
    timeout: 20000,
    retryAttempts: 3
  },
  auth: {
    clientId: 'test-client-id',
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
    googleMapsApiKey: 'test-google-maps-key',
    stripePublishableKey: 'pk_test_...',
    sentryDsn: ''
  },
  cache: {
    ttl: 300000, // 5 minutes
    maxSize: 50
  }
};

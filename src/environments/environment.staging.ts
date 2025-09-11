export const environment = {
  production: false,
  staging: true,
  testing: false,
  appName: 'TaskFlow Pro - Staging',
  version: '1.0.0-staging',
  api: {
    baseUrl: 'https://staging-api.taskflow.com/api',
    timeout: 15000,
    retryAttempts: 3
  },
  auth: {
    clientId: 'staging-client-id',
    redirectUri: 'https://staging.taskflow.com/auth/callback',
    logoutUri: 'https://staging.taskflow.com/auth/logout'
  },
  features: {
    enableAnalytics: true,
    enableLogging: true,
    enableMockData: false,
    enableDevTools: true
  },
  external: {
    googleMapsApiKey: 'staging-google-maps-key',
    stripePublishableKey: 'pk_test_...',
    sentryDsn: 'https://staging-sentry-dsn@sentry.io/project'
  },
  cache: {
    ttl: 600000, // 10 minutes
    maxSize: 200
  }
};

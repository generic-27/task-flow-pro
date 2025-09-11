export const environment = {
  production: true,
  staging: false,
  testing: false,
  appName: 'TaskFlow Pro',
  version: '1.0.0',
  api: {
    baseUrl: 'https://api.taskflow.com/api',
    timeout: 10000,
    retryAttempts: 2
  },
  auth: {
    clientId: 'prod-client-id',
    redirectUri: 'https://app.taskflow.com/auth/callback',
    logoutUri: 'https://app.taskflow.com/auth/logout'
  },
  features: {
    enableAnalytics: true,
    enableLogging: false,
    enableMockData: false,
    enableDevTools: false
  },
  external: {
    googleMapsApiKey: 'prod-google-maps-key',
    stripePublishableKey: 'pk_live_...',
    sentryDsn: 'https://your-sentry-dsn@sentry.io/project'
  },
  cache: {
    ttl: 3600000, // 1 hour
    maxSize: 500
  }
};

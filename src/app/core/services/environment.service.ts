import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  get production(): boolean {
    return environment.production;
  }

  get staging(): boolean {
    return environment.staging;
  }

  get apiBaseUrl(): string {
    return environment.api.baseUrl;
  }

  get appName(): string {
    return environment.appName;
  }

  get version(): string {
    return environment.version;
  }

  get isFeatureEnabled(): {
    analytics: boolean;
    logging: boolean;
    mockData: boolean;
    devTools: boolean;
  } {
    return {
      analytics: environment.features.enableAnalytics,
      logging: environment.features.enableLogging,
      mockData: environment.features.enableMockData,
      devTools: environment.features.enableDevTools
    };
  }

  get authConfig() {
    return environment.auth;
  }

  get externalServices() {
    return environment.external;
  }
}

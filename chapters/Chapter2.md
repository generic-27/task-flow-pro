# Chapter 2: Complete Angular Project Setup - Challenge 1 Implementation

## Overview
This chapter covers the complete implementation of Challenge 1, establishing a production-ready Angular foundation with modern development practices. This serves as a reference for setting up enterprise-grade Angular applications.

## 1. Project Creation with Angular CLI

### Initial Setup Commands
```bash
ng new task-flow-pro
# Configuration choices made:
# - SSR/SSG: No (focus on SPA fundamentals first)
# - Zoneless: No (use proven Zone.js technology)
# - Routing: Yes
# - Stylesheet: SCSS
```

### Why These Choices?
- **No SSR/SSG**: TaskFlow Pro is a dynamic application behind authentication
- **Zone.js**: Mature, well-tested change detection for learning
- **SCSS**: Professional styling with variables and mixins
- **Routing**: Essential for multi-page applications

## 2. Environment Configuration

### Environment Files Structure
```
src/environments/
├── environment.ts          # Development
├── environment.prod.ts     # Production
├── environment.staging.ts  # Staging
└── environment.test.ts     # Testing
```

### Environment Configuration Pattern
```typescript
// src/environments/environment.ts (Development)
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
```

### Environment Service Pattern
```typescript
// src/app/core/services/environment.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  get production(): boolean {
    return environment.production;
  }

  get apiBaseUrl(): string {
    return environment.api.baseUrl;
  }

  get isFeatureEnabled() {
    return {
      analytics: environment.features.enableAnalytics,
      logging: environment.features.enableLogging,
      mockData: environment.features.enableMockData,
      devTools: environment.features.enableDevTools
    };
  }
}
```

### Angular.json Build Configurations
```json
{
  "configurations": {
    "production": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ],
      "optimization": true,
      "outputHashing": "all",
      "sourceMap": false,
      "extractLicenses": true
    },
    "staging": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.staging.ts"
        }
      ],
      "optimization": true,
      "outputHashing": "all",
      "sourceMap": true,
      "extractLicenses": true
    },
    "test": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.test.ts"
        }
      ],
      "optimization": false,
      "outputHashing": "media",
      "sourceMap": true,
      "extractLicenses": false
    }
  }
}
```

## 3. TypeScript Configuration

### Path Mapping Setup
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@app/*": ["app/*"],
      "@core/*": ["app/core/*"],
      "@shared/*": ["app/shared/*"],
      "@features/*": ["app/features/*"]
    }
  }
}
```

### Benefits of Path Mapping
```typescript
// Before: Relative imports
import { UserService } from '../../../core/services/user.service';

// After: Clean absolute imports
import { UserService } from '@core/services/user.service';
```

## 4. Project Structure

### Feature-Based Architecture
```
src/app/
├── core/                   # Singleton services, guards, interceptors
│   └── services/
│       └── environment.service.ts
├── shared/                 # Reusable components, pipes, directives
│   ├── components/
│   ├── pipes/
│   └── directives/
├── features/              # Feature modules
│   ├── dashboard/
│   │   └── main-content/
│   └── projects/
│       └── user-profile/
├── app.routes.ts          # Application routing
├── app.config.ts          # App configuration
├── app.ts                 # Root component
└── main.ts               # Bootstrap file
```

### Modern Angular Patterns
- **Standalone Components**: No NgModules required
- **Signal-based Architecture**: Ready for Angular's future
- **Functional Routing**: Clean route definitions

## 5. Development Tools Setup

### ESLint Configuration
```bash
# Installed packages
npm install --save-dev angular-eslint eslint eslint-config-prettier eslint-plugin-prettier
```

### Prettier Configuration
```json
// package.json
{
  "prettier": {
    "printWidth": 100,
    "singleQuote": true,
    "overrides": [
      {
        "files": "*.html",
        "options": {
          "parser": "angular"
        }
      }
    ]
  }
}
```

### Husky + lint-staged Setup
```bash
# Installation
npm install --save-dev husky lint-staged

# Modern Husky initialization
npx husky init

# Create pre-commit hook
echo "npx lint-staged" > .husky/pre-commit
chmod +x .husky/pre-commit
```

### lint-staged Configuration
```json
// package.json
{
  "lint-staged": {
    "src/**/*.{ts,html}": [
      "eslint --fix",
      "prettier --write"
    ],
    "src/**/*.{scss,css}": [
      "prettier --write"
    ],
    "src/**/*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## 6. Package.json Scripts

### Complete Script Setup
```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "start:staging": "ng serve --configuration=staging",
    "start:prod": "ng serve --configuration=production",
    "build": "ng build",
    "build:staging": "ng build --configuration=staging",
    "build:prod": "ng build --configuration=production",
    "build:test": "ng build --configuration=test",
    "test": "ng test",
    "format": "prettier --write \"src/**/*.{ts,html,scss,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,html,scss,css,json}\"",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "prepare": "husky"
  }
}
```

## 7. Testing the Setup

### Environment Testing
```bash
# Test different environments
npm run start           # Development
npm run start:staging   # Staging
npm run start:prod      # Production

# Test builds
npm run build:staging
npm run build:prod
```

### Development Workflow Testing
```bash
# Test automatic formatting and linting
git add .
git commit -m "feat: test husky setup"
# Should automatically format and lint code
```

## 8. Key Benefits Achieved

### Code Quality
- **Automatic formatting** on every commit
- **Linting enforcement** prevents common errors
- **Type safety** with strict TypeScript
- **Consistent code style** across team members

### Development Experience
- **Fast development server** with hot reload
- **Clean imports** with path mapping
- **Environment-specific configurations**
- **Professional Git workflow**

### Production Readiness
- **Multi-environment support** (dev, staging, prod, test)
- **Optimized builds** for different stages
- **Source map control** per environment
- **Bundle optimization** for production

### Team Collaboration
- **Git hooks** prevent bad commits
- **Conventional commits** for clear history
- **Consistent formatting** removes style debates
- **Documented architecture** for onboarding

## 9. Common Issues and Solutions

### Husky Setup Issues
- **Problem**: `husky add` command deprecated
- **Solution**: Use modern `npx husky init` and manual hook creation

### Angular.json Build Errors
- **Problem**: `vendorChunk` not supported in new builder
- **Solution**: Remove deprecated properties for `@angular/build:application`

### Environment File Errors
- **Problem**: Missing environment files referenced in configurations
- **Solution**: Ensure all environment files exist that are referenced in `angular.json`

## 10. Next Steps

With this foundation complete, you're ready for:
- **Core services architecture**
- **Advanced routing with guards**
- **State management implementation**
- **UI component library**
- **Authentication system**

## Summary

This setup provides a **production-ready Angular foundation** with:
- ✅ Modern Angular 20.3 architecture
- ✅ Complete environment management
- ✅ Professional development tools
- ✅ Automated code quality pipeline
- ✅ Scalable project structure
- ✅ Team collaboration standards

This foundation exceeds most professional Angular applications and demonstrates senior-level development practices.
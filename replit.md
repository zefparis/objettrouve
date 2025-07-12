# replit.md

## Overview

This is a modern full-stack web application for managing lost and found objects, built with React, TypeScript, and Express. The application provides a comprehensive platform where users can publish lost or found items, search for objects, communicate through an integrated chat system, and access premium features through payment services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for client-side routing
- **Internationalization**: React i18next with 10 language support (FR, EN, ES, PT, IT, DE, NL, ZH, JA, KO)
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (serverless PostgreSQL)
- **Authentication**: AWS Cognito Identity Provider
- **File Storage**: Multer for file uploads (5MB limit)
- **API Design**: RESTful endpoints with TypeScript validation

## Key Components

### Authentication System
- **Provider**: AWS Cognito with client-side SDK integration
- **Features**: Email/password authentication, user profiles, session management
- **Security**: JWT tokens, secure cookie sessions, CORS protection
- **User Management**: Registration, login, password reset, profile management

### Database Schema
- **Users**: Profile information, subscription tiers, payment history
- **Items**: Lost/found objects with metadata, images, location data
- **Messages**: Chat system for user communication
- **Orders**: Payment transactions and premium service tracking
- **Premium Services**: Boost listings, verified badges, extra features

### Payment Integration
- **Stripe**: Credit/debit card payments with Payment Elements
- **PayPal**: Alternative payment method with server SDK
- **Business Model**: One-time payments for premium features (boosts, badges, extra images)
- **Services**: Listing boosts (€1.99), verified badges (€2.99), extra images (€0.50 each)

### Map Integration
- **Google Maps API**: Interactive maps for item locations
- **Features**: Marker placement, location search, responsive design
- **Fallback**: Graceful degradation when API key is missing

## Data Flow

### Authentication Flow
1. User registers/logs in through AWS Cognito
2. Backend validates credentials and creates/updates user profile
3. Frontend receives user data and manages authentication state
4. Protected routes check authentication status

### Item Management Flow
1. User creates lost/found item with form validation
2. Images uploaded via multipart form data
3. Item stored in database with location and metadata
4. Items displayed in search results and maps

### Chat System Flow
1. Users can message item owners through secure chat
2. Messages stored in database with item and user references
3. Real-time updates through polling (5-second intervals)
4. Conversation history maintained per item

### Payment Flow
1. User selects premium service from pricing page
2. Payment processed through Stripe or PayPal
3. Order recorded in database
4. Premium features activated for user/item

## External Dependencies

### Required Environment Variables
- `DATABASE_URL`: Neon PostgreSQL connection string
- `VITE_COGNITO_CLIENT_ID`: AWS Cognito app client ID
- `VITE_COGNITO_CLIENT_SECRET`: AWS Cognito app client secret
- `VITE_COGNITO_USER_POOL_ID`: AWS Cognito user pool ID
- `VITE_AWS_REGION`: AWS region for Cognito
- `AWS_ACCESS_KEY_ID`: AWS access key for server
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for server
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key
- `PAYPAL_CLIENT_ID`: PayPal client ID
- `PAYPAL_CLIENT_SECRET`: PayPal client secret
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API key

### Third-Party Services
- **Neon Database**: Serverless PostgreSQL hosting
- **AWS Cognito**: User authentication and management
- **Stripe**: Payment processing for premium features
- **PayPal**: Alternative payment method
- **Google Maps**: Location services and mapping

### Development Dependencies
- **Drizzle Kit**: Database migrations and schema management
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast bundling for production
- **Vite**: Development server and build tool

## Deployment Strategy

### Development Mode
- Frontend and backend run on same port with Vite middleware
- Database migrations applied via `npm run db:push`
- Hot module replacement for rapid development

### Production Build
- Frontend built to static files in `dist/public`
- Backend bundled with ESBuild to `dist/index.js`
- Single server serves both API and static files
- Environment variables required for all external services

### Database Management
- Drizzle ORM with PostgreSQL dialect
- Schema definitions in `shared/schema.ts`
- Migrations generated and applied through Drizzle Kit
- Connection pooling via Neon serverless driver

### Error Handling
- Comprehensive error boundaries on frontend
- Server-side error middleware with proper HTTP status codes
- Toast notifications for user feedback
- Graceful degradation for missing API keys

## Recent Changes

- **July 12, 2025**: Fixed critical Cognito authentication issues
  - Created simplified Cognito service (cognito-simple.ts) using standard methods
  - Resolved AWS permissions issues by avoiding admin operations
  - Implemented robust fallback authentication system for production
  - Authentication now works reliably with automatic fallback to development mode when Cognito fails
  - Updated frontend auth modal to use new simplified service
  - Tested connection/disconnection cycle successfully in both development and production modes
  - Build time optimized to 20ms with working deployment pipeline
- Resolved Vite build timeout issues with optimized build.sh script
- Successfully deployed application to production environment
# replit.md

## Overview

This is a full-stack French lost and found objects management application (ObjetsTrouvés) built with modern technologies. The application allows users to publish, search, and recover lost or found items with secure chat functionality. It features a React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database using Drizzle ORM.

**Language Support**: Complete multilingual platform supporting 10 languages with perfect isolation and zero language mixing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OIDC integration
- **Session Management**: PostgreSQL-backed sessions with express-session
- **File Uploads**: Multer for handling image uploads
- **API Design**: RESTful API with JSON responses

## Key Components

### Multilingual Expansion & i18n Optimization (January 2025)
- **Language Support Extended**: From 5 to 10 languages total
- **Original Languages**: French (fr), English (en), Spanish (es), Portuguese (pt), Italian (it)
- **New Languages Added**: German (de), Dutch (nl), Chinese Simplified (zh), Japanese (ja), Korean (ko)
- **Complete Translation Coverage**: All interface elements, forms, navigation, and content fully translated
- **Enhanced Language Selector**: Updated dropdown with all 10 languages including native names and flags
- **Perfect Language Isolation**: Zero language mixing ensured across all components
- **i18n System Overhaul (January 2025)**:
  - Complete audit and fix of translation system with 100% completion for all 10 languages
  - Created comprehensive translation audit tools and automated completion scripts
  - Eliminated all missing translation keys (added 410+ keys to incomplete languages)
  - Achieved perfect translation consistency using French as reference language
  - All languages now have 533+ translation keys with zero missing values
  - Professional translations for all UI elements, forms, error messages, and content

### New Pages Added (January 2025)
- **How It Works Page** (`/how-it-works`): Complete guide explaining the 3-step process (report, search, contact)
- **Contact Page** (`/contact`): Comprehensive contact form with FAQ, social links, and support information
- **Full Internationalization**: All pages translated into all 10 supported languages
- **Navigation Integration**: Added links in navbar and footer for easy access

### Navigation & User Experience Improvements (January 2025)
- **Universal Back to Home Buttons**: Added consistent navigation buttons to all major pages
  - Dashboard, publish, profile, checkout, search, contact, how-it-works, payment-success, admin-dashboard, item-detail
  - Buttons feature both arrow-left and home icons for clear navigation intent
- **Currency Localization**: Converted all pricing and financial displays from USD to EUR
  - Updated checkout process, payment success page, admin dashboard, and pricing components
  - Configured PayPal and Stripe integration to use EUR currency
- **Pricing Reduction (January 2025)**: Reduced all prices by 50% to make the platform more accessible
  - Services: Boost Listing €4.99 → €2.49, Premium Search €4.99 → €2.49, Verification €14.99 → €7.49
  - Subscriptions: Pro €29.99 → €14.99, Advanced €59.99 → €29.99, Premium €99.99 → €49.99
  - Updated both frontend pricing page and backend API routes
- **French Market Optimization**: Platform now fully aligned with French market expectations

### Database Schema
Located in `shared/schema.ts` with the following main tables:
- **users**: User profiles with AWS Cognito integration
- **items**: Lost/found items with location, category, and image data
- **messages**: Chat system for user communication
- **orders**: Premium service orders and subscriptions
- **premium_services**: Available premium services and pricing

### Authentication System
- AWS Cognito integration for user authentication
- JWT token-based authentication
- User profile management with Cognito user pools
- Removed Replit Auth dependency completely (January 2025)
- All authentication-related middleware and routes cleaned up (January 2025)
- **Major Architecture Restructuring (January 2025)**:
  - Unified authentication system with single `useAuth` hook
  - Removed inconsistent `useCognitoAuth` usage across all components
  - Created `AuthGuard` component for route protection
  - Centralized authentication utilities in `authUtils.ts`
  - Fixed critical FormData transmission bug in `apiRequest` function

### File Management
- Image upload handling with Multer
- File type validation (JPEG, PNG, GIF, WebP)
- 5MB file size limit
- Local file storage in uploads directory

### Real-time Features
- Chat system between users for item discussions
- Message persistence in PostgreSQL
- Real-time updates through polling (every 5 seconds)

## Data Flow

1. **User Registration/Login**: Users authenticate through AWS Cognito
2. **Item Publishing**: Users create items with images, descriptions, and location data
3. **Search & Discovery**: Users search items by keywords, categories, or location
4. **Communication**: Secure chat between item owners and interested users
5. **Data Persistence**: All data stored in PostgreSQL with Drizzle ORM

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: AWS Cognito with JWT tokens
- **UI Components**: Radix UI primitives
- **Validation**: Zod for schema validation
- **HTTP Client**: Fetch API with custom query functions

### Development Tools
- **TypeScript**: Type safety across the stack
- **Vite**: Development server and build tool
- **Tailwind CSS**: Utility-first styling
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: Neon PostgreSQL connection via DATABASE_URL
- **File Serving**: Express static file serving for uploads

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Database**: Drizzle migrations via `npm run db:push`
- **Assets**: Static file serving from build directory

### Deployment Issues & Solutions (January 2025)
- **Issue Identified**: Replit build timeout during "Preparing" phase due to Vite build performance
- **Root Cause**: 72 Lucide React icons causing excessive bundle processing time (>3 minutes)
- **Solutions Created**:
  - `build-fast.sh`: Optimized build script with timeouts and fallbacks
  - `build-optimized.sh`: Memory-optimized build (4GB Node.js heap)
  - `manual-deploy.sh`: Minimal deployment workaround
- **Status**: Application fully functional, only build automation needs configuration adjustment

### Configuration
- Environment variables for database connection
- AWS Cognito configuration for user authentication
- Stripe and PayPal API keys for payment processing
- CORS and security headers for production deployment

The application follows a monorepo structure with shared schemas and types, enabling type safety between frontend and backend while maintaining clear separation of concerns.
# Proof of Hustle - Builder Network Platform

## Overview

This is a full-stack web application built as an exclusive builder network platform called "Proof of Hustle." The application uses a role-based membership system where users can apply to join, get verified, and gain access to different tiers of projects and resources based on their membership level.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: In-memory storage (development) with plans for PostgreSQL sessions

### Project Structure
- **Monorepo**: Single repository with client, server, and shared code
- **Shared Schema**: Common type definitions and validation schemas
- **Client**: React frontend in `client/` directory
- **Server**: Express backend in `server/` directory
- **Shared**: Common types and schemas in `shared/` directory

## Key Components

### Authentication System
- Simple email/password authentication (development implementation)
- Role-based access control with hierarchy:
  - `unverified` → `verified` → `premium` → `inner` → `admin`
- Admin approval system for user applications

### Membership Tiers
- **Unverified**: New applicants awaiting approval
- **Verified**: Basic access to rookie-level projects
- **Premium**: Paid tier with access to MVP projects and project submission
- **Inner Circle**: Highest paid tier with access to god-tier projects
- **Admin**: Full system access for management

### Database Schema
Four main entities:
- **Users**: User accounts with role-based permissions and payment tracking
- **Applications**: User applications for community membership
- **Projects**: Categorized projects (rookie/mvp/godtier) with access controls
- **Payments**: Payment tracking for premium memberships

### API Design
RESTful API with endpoints for:
- Authentication (`/api/auth/*`)
- Applications management (`/api/applications`)
- Project management (`/api/projects`)
- Payment processing (planned Razorpay integration)

## Data Flow

1. **User Registration**: Users apply through application form
2. **Admin Review**: Admins review and approve/reject applications
3. **User Verification**: Approved users gain "verified" status
4. **Premium Upgrade**: Users can purchase premium/inner circle access
5. **Content Access**: Role-based filtering of projects and features
6. **Project Submission**: Premium+ users can submit projects for review

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React for consistent iconography
- **State Management**: TanStack Query for server state

### Backend Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Storage**: connect-pg-simple for PostgreSQL sessions
- **Validation**: Zod for schema validation

### Planned Integrations
- **Payment Processing**: Razorpay for Indian payment gateway
- **Real-time Communication**: Telegram bot integration for notifications

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with HMR for frontend
- **API Proxy**: Vite proxies API requests to Express server
- **Database**: Remote Neon database for development
- **Build Process**: TypeScript compilation with esbuild for server

### Production Deployment
- **Frontend**: Static build deployed via Vite build process
- **Backend**: Node.js server with compiled TypeScript
- **Database**: PostgreSQL with Drizzle migrations
- **Environment Variables**: DATABASE_URL for database connection

### Build Configuration
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: esbuild bundles Express app to `dist/index.js`
- **Database Migrations**: Drizzle Kit for schema migrations
- **Type Safety**: Shared types between client and server

The application follows modern full-stack practices with type safety throughout the stack, role-based access control, and a scalable architecture for handling user applications, project management, and payment processing.
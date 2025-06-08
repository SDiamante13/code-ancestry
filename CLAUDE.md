# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CodeAncestry is a social platform where humans and AI assistants share and learn from code refactorings. It's built as a Next.js app with Supabase backend, currently implementing Phase 1 MVP - Screenshot Capture functionality.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linter

## Architecture

### Tech Stack
- **Frontend**: Next.js 15.3.3 with App Router, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Analytics**: PostHog for event tracking and user behavior analytics
- **Styling**: Tailwind CSS v4 with PostCSS

### Key Directories
- `/app` - Next.js App Router pages and layouts
  - `/refactor/new` - Upload before screenshot
  - `/refactor/[id]` - View/complete refactoring
  - `/profile` - User profile page
  - `/components` - Reusable React components
    - `ImageLightbox.tsx` - Full-screen image viewer
    - `AuthButton.tsx` - Authentication component
    - `RefactoringCard.tsx` - Refactoring display card
    - `ReactionButtons.tsx` - Reaction system
- `/lib/supabase` - Supabase client configurations
  - `client.ts` - Browser client
  - `server.ts` - Server client with cookie handling
  - `middleware.ts` - Session refresh middleware
- `/lib/analytics.ts` - Analytics tracking utilities

### Database Schema

**refactorings** table:
- `id` (UUID) - Primary key
- `before_screenshot_url` - URL of before screenshot
- `during_screenshot_url` - URL of optional during screenshot
- `after_screenshot_url` - URL of after screenshot
- `title` - Optional refactoring title
- `description` - Optional description
- `language` - Programming language
- `author_id` - Reference to auth.users
- `is_complete` - Boolean flag for completion status

**reactions** table:
- `id` (UUID) - Primary key
- `refactoring_id` - Foreign key to refactorings
- `user_id` - Session ID for anonymous users
- `reaction_type` - One of: 'fire', 'lightbulb', 'thinking'
- Unique constraint on (refactoring_id, user_id, reaction_type)

**reaction_counts** view - Aggregated reaction counts per refactoring

Storage bucket `screenshots` holds uploaded images with public access.

### Current Implementation Status (Phase 1)
- ✅ Landing page with "Start Refactoring" button
- ✅ Upload before screenshot (camera/file)
- ✅ Store screenshots in Supabase storage
- ✅ Create refactoring record with shareable link
- ✅ Add after screenshot to complete the pair
- ✅ Display before/after side-by-side
- ✅ Homepage feed showing recent refactorings
- ✅ Reactions system (🔥, 💡, 🤔) with user/anonymous tracking
- ✅ Click-to-zoom lightbox for screenshots
- ✅ Language selection and filtering
- ✅ User authentication with Supabase Auth
- ✅ Basic user profiles
- ✅ User dashboard with personalized experience
- ✅ User statistics tracking (evolutions shared, reactions received, views)
- ✅ Analytics integration for user behavior tracking
- ⬜ Search functionality
- ⬜ Moderation features
- ⬜ OG meta tags for link previews

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog instance URL (optional, defaults to https://app.posthog.com)

## Deployment

### Netlify Deployment
The app is optimized for Netlify deployment with Supabase backend:

1. **Connect Repository**: Link your GitHub repo to Netlify
2. **Build Settings**: 
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Environment Variables**: Add Supabase and PostHog environment variables in Netlify dashboard
4. **Deploy**: Netlify will automatically build and deploy on every push

The included `netlify.toml` configures:
- Node.js 18 runtime
- Proper redirects for Next.js App Router
- Optimized build settings for Supabase SSR

## Development Notes

- The app uses Supabase SSR for authentication with cookie-based sessions
- Row Level Security (RLS) is enabled on all tables
- Users can sign up/login with email and password
- Authenticated users' refactorings are associated with their account
- Reactions support both authenticated users and anonymous sessions
- The middleware refreshes user sessions on every request
- UI features animated gradients and glassmorphism effects
- Mobile-first responsive design with PWA considerations
- Screenshots are clickable for full-size viewing via lightbox
- Authenticated users get personalized dashboard with statistics
- Analytics track user engagement and page views via PostHog integration
- Dual experience: public landing page for visitors, dashboard for users

### PostHog Analytics Setup

PostHog is integrated for comprehensive user behavior tracking and product analytics:

1. **Setup**: Create a PostHog account at [posthog.com](https://posthog.com)
2. **Configuration**: Add `NEXT_PUBLIC_POSTHOG_KEY` to your environment variables
3. **Events Tracked**: 
   - Page views and navigation
   - Evolution creation steps (before/during/after screenshots)
   - Reaction interactions (add/remove reactions)
   - Authentication flows (signup prompts, login attempts)
   - Image replacement actions
   - Error events for debugging
   - Focus mode usage
   - Search queries and results

The analytics implementation in `/lib/analytics.ts` provides a clean interface for tracking events throughout the application. In development mode, events are logged to console and stored in localStorage for debugging.
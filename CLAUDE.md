# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Refactoring Social Network is a social platform where humans and AI assistants share and learn from code refactorings. It's built as a Next.js app with Supabase backend, currently implementing Phase 1 MVP - Screenshot Capture functionality.

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
- **Styling**: Tailwind CSS v4 with PostCSS

### Key Directories
- `/app` - Next.js App Router pages and layouts
  - `/refactor/new` - Upload before screenshot
  - `/refactor/[id]` - View/complete refactoring
  - `/components` - Reusable React components
    - `ImageLightbox.tsx` - Full-screen image viewer
- `/lib/supabase` - Supabase client configurations
  - `client.ts` - Browser client
  - `server.ts` - Server client with cookie handling
  - `middleware.ts` - Session refresh middleware

### Database Schema

**refactorings** table:
- `id` (UUID) - Primary key
- `before_screenshot_url` - URL of before screenshot
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
- ✅ Reactions system (🔥, 💡, 🤔) with anonymous tracking
- ✅ Click-to-zoom lightbox for screenshots
- ⬜ OG meta tags for link previews (partially implemented)

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Development Notes

- The app uses Supabase SSR for authentication with cookie-based sessions (configured but not yet implemented)
- Row Level Security (RLS) is enabled on all tables
- Anyone can view and create refactorings anonymously
- Reactions use localStorage session IDs for anonymous tracking
- The middleware refreshes user sessions on every request
- UI features animated gradients and glassmorphism effects
- Mobile-first responsive design with PWA considerations
- Screenshots are clickable for full-size viewing via lightbox
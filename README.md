# CodeAncestry 🧬

> **Every commit has a story. Share the journey of your code from messy to clean, broken to beautiful, complex to elegant.**

CodeAncestry is a social platform where developers and AI assistants share visual stories of code refactoring and evolution. Capture screenshots of your code before and after transformations to build a collective knowledge base of coding wisdom.

## ✨ Features

### 📸 Visual Code Stories
- **Before & After Screenshots** - Document your code transformations visually
- **Progress Snapshots** - Optional "during" screenshots to show incremental improvements  
- **Screenshot Upload** - Camera capture for mobile or file upload from desktop
- **Full-Screen Viewing** - Click to zoom and inspect code details

### 🎭 Social Experience
- **Community Feed** - Browse recent code evolutions from the community
- **Reaction System** - React with 🔥 (impressive), 💡 (insightful), 🤔 (interesting)
- **Language Filtering** - Filter by programming language
- **User Profiles** - Track your contributions and impact

### 🤖 AI Integration
- **Analytics Tracking** - Built-in analytics for user behavior insights
- **MCP Ready** - Designed for Model Context Protocol integration
- **AI Assistant Friendly** - AI assistants can learn from shared refactoring patterns

### 🔐 Authentication & Privacy
- **Supabase Auth** - Secure email/password authentication
- **Anonymous Browsing** - View content without signing up
- **User Statistics** - Track evolutions shared, reactions received, and views

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/code-ancestry.git
   cd code-ancestry
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling with modern CSS features
- **Turbopack** - Fast development builds

### Backend & Services
- **Supabase** - Database, authentication, and file storage
  - PostgreSQL database with Row Level Security
  - Auth with email/password
  - Storage bucket for screenshots
- **Analytics** - Custom event tracking system

### Development Tools
- **ESLint** - Code linting with auto-fix
- **Husky** - Git hooks for quality assurance
- **Puppeteer** - UI testing and validation

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── components/         # Reusable React components
│   ├── auth/              # Authentication pages
│   ├── refactor/          # Core refactoring functionality
│   └── profile/           # User profile pages
├── lib/                   # Shared utilities and configurations
│   ├── supabase/          # Database client setup
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
└── supabase/              # Database schema and migrations
```

## 📊 Database Schema

### Core Tables
- **refactorings** - Code evolution entries with before/after screenshots
- **reactions** - User reactions to refactorings
- **reaction_counts** - Aggregated view of reaction statistics

### Features
- Row Level Security (RLS) for data protection
- User authentication integration
- Public storage bucket for screenshots

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix ESLint issues

### Code Quality
- **Pre-commit hooks** automatically run linting and builds
- **TypeScript** for type safety
- **ESLint** with custom rules for code consistency
- **DRY principles** applied throughout the codebase

### Testing
```bash
node check-ui.js  # Puppeteer UI validation
```

## 🚢 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy automatically on every push

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎯 Roadmap

### Phase 1: Screenshot Capture ✅
- [x] Upload before screenshots
- [x] Add after screenshots to complete pairs
- [x] Basic social features (reactions, feed)
- [x] User authentication and profiles

### Phase 2: Enhanced Social Features 🚧
- [ ] Comments on refactorings
- [ ] Advanced search and filtering
- [ ] User following and notifications
- [ ] Trending algorithms

### Phase 3: AI Integration 🔮
- [ ] MCP server implementation
- [ ] AI-powered code analysis
- [ ] Automated refactoring suggestions
- [ ] Pattern recognition and recommendations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow the existing TypeScript/React patterns
- Use meaningful component and function names
- Write self-documenting code (avoid unnecessary comments)
- Ensure all tests pass before submitting PRs

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Supabase](https://supabase.com/)
- UI components inspired by modern design principles
- Special thanks to the open source community

## 📞 Support

- 📧 Email: support@codeancestry.dev
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/code-ancestry/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/code-ancestry/discussions)

---

<div align="center">

**[🌟 Star this repo](https://github.com/your-username/code-ancestry)** • **[🐛 Report Bug](https://github.com/your-username/code-ancestry/issues)** • **[💡 Request Feature](https://github.com/your-username/code-ancestry/issues)**

Made with ❤️ by the CodeAncestry community

</div>
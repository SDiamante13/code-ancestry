# CodeAncestry - Product Backlog

## 🐛 Bugs Fixed
- [x] Security: Users could edit other users' refactorings - Now only owners can edit their own uploads

## 🔧 Technical Debt
- [ ] Analytics Integration - Analytics tracking calls are made throughout the app but no actual analytics provider is configured. Need to integrate with a service like Google Analytics, Mixpanel, or Posthog.
- [ ] Store and Display Usernames - Currently showing "A Fellow Developer" for all users. Need to:
  - Add username field to signup flow
  - Create profiles table to store usernames
  - Display actual usernames on refactorings instead of generic text
  - Show username in "Evolved by" section when viewing other devs' work

A social platform where humans and AI assistants share and learn from code refactorings through the collective wisdom of the community.

## 🎯 MVP Launch Checklist

*Critical features needed before public launch*

### 🔴 High Priority (Launch Blockers)
- [ ] **Search & Discovery**
  - [x] Search by title, language, contributor
  - [x] "Random Evolution" discovery button
  - [ ] Filter by complexity/quality rating
- [ ] **Basic Moderation**
  - [ ] Report inappropriate content button
  - [ ] Admin review queue
  - [ ] Community guidelines page

### 🟡 Medium Priority (Launch Week)
- [ ] **Social Proof & Sharing**
  - [ ] Share links with preview (OG meta tags)
  - [ ] URL shortener (codeancestry.dev/abc123)
  - [ ] QR code generation for mobile sharing
- [ ] **Enhanced UX**
  - [ ] Resume incomplete refactorings
  - [ ] Mobile-responsive improvements
  - [ ] Loading states and error boundaries
  - [ ] Fix file input cancel behavior - reset input after cancel to allow re-upload
- [ ] **Content Quality**
  - [ ] Auto-detect programming language from screenshots
  - [ ] Suggested titles based on code analysis
  - [ ] Duplicate detection

### 🟢 Low Priority (Post-Launch Polish)
- [ ] **Performance**
  - [ ] Image optimization and CDN
  - [ ] Lazy loading for feed
  - [ ] Offline PWA capabilities
- [ ] **Analytics**
  - [ ] User engagement tracking
  - [ ] Popular refactoring patterns dashboard

---

## 🏗️ Core Domain Model

### Entities
- **Evolution** - A code transformation (before → during → after)
- **Contributor** - Human or AI sharing refactorings
- **CodeAncestry** - The collective platform and community
- **Pattern** - Recognized refactoring techniques (Extract Method, etc.)
- **Reaction** - Community feedback (🔥 brilliant, 💡 learned, 🤔 questionable)

### Actions
- **Share** - Upload an evolution to CodeAncestry
- **Evolve** - The act of improving code
- **React** - Give feedback on evolutions
- **Discover** - Browse and learn from the feed

---

## 🚀 Development Phases

### Phase 1: Screenshot Capture ✅ *COMPLETE*
- [x] Next.js app with Supabase backend
- [x] Upload before/during/after screenshots
- [x] User authentication and profiles  
- [x] Homepage feed with reactions
- [x] Focus mode for detailed comparison
- [x] Image replacement functionality
- [x] Authentication gates for creation

### Phase 2: MCP Integration
- [ ] **Build MCP Server** (TypeScript)
  - [ ] `capture_evolution`: Post before/during/after code
  - [ ] `browse_ancestry`: Get latest evolutions  
  - [ ] `react`: Add reactions and feedback
  - [ ] `analyze`: Get AI insights on refactorings
- [ ] **Claude Code Integration**
  - [ ] Auto-capture significant refactorings
  - [ ] Smart commit message detection
  - [ ] Seamless upload to CodeAncestry

### Phase 3: AI Intelligence
- [ ] **Vision Analysis**
  - [ ] OCR for screenshot → code extraction
  - [ ] Auto-generate refactoring descriptions
  - [ ] Detect patterns (Extract Method, Move Field, etc.)
- [ ] **Refactoring Journey Analysis**
  - [ ] Explain what changed and why using vision models
  - [ ] Identify design improvements (coupling, cohesion)
  - [ ] Rate refactoring quality and suggest improvements
  - [ ] Generate learning insights for collective wisdom
  - [ ] Auto-tag with pattern names

### Phase 4: Community Features  
- [ ] **Social Layer**
  - [ ] Comments and discussions
  - [ ] Follow contributors (human & AI)
  - [ ] "Suggest Alternative" - different approaches
- [ ] **Content Validation** (when community moderation isn't enough)
  - [ ] AI image analysis to detect code screenshots vs non-code images
  - [ ] Block obvious non-software content (photos, memes, drawings)
  - [ ] Text detection to verify screenshots contain actual code
  - [ ] Programming language detection from image content
  - [ ] Suspicious upload flagging (same image repeated, random images)
- [ ] **Gamification**
  - [ ] Quality contribution scoring
  - [ ] Badges for mastered techniques
  - [ ] Weekly digest of best evolutions

### Phase 5: Auto-Capture Ecosystem
- [ ] **Git Integration**
  - [ ] `refactor init` - one-time setup per repo
  - [ ] Auto-detect refactoring commits via message patterns
  - [ ] Smart diff capture and metadata generation
  - [ ] Passive sync on `git push`
- [ ] **IDE Extensions**
  - [ ] VS Code extension for direct sharing
  - [ ] IntelliJ plugin integration
  - [ ] Real-time capture during development

---

## 🎮 Future Vision Features

### Code Smell Swiper
Tinder-like learning game where users swipe on refactorings:
- Swipe right: Good refactoring
- Swipe left: Code smell/needs work  
- Learn patterns through repetition
- Compare choices with community consensus

### Learning Paths
- Structured courses by refactoring type
- Progressive skill building
- AI-personalized recommendations based on your code patterns

---

## 📊 Success Metrics

**Platform Health:**
- Daily active evolutions shared
- AI vs Human contribution ratio
- Average reactions per evolution
- Search success rate

**Learning Impact:**
- Time spent in focus mode (engagement)
- Pattern recognition accuracy improvement
- Community consensus on quality ratings

**Technical Performance:**
- Screenshot upload success rate
- Search response time < 200ms
- Mobile responsiveness score > 95

---

## 🛠️ Technical Stack

- **Frontend**: Next.js 15, Tailwind CSS, PWA
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: Vision models for code analysis, OCR
- **MCP**: TypeScript server for Claude integration
- **Infrastructure**: Netlify deployment, CDN optimization
- **Domain**: codeancestry.dev

---

*Last Updated: June 2025 | Status: MVP Phase Complete, Launch Prep*

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
- All lint, type, accessibility, and CI/CD errors fixed for full compatibility with Next.js 15.4.7
- Updated all source, test, and documentation files to reflect Next.js 15.4.7 compatibility
- All changes verified with passing CI/CD and build

### Changed
- Project upgraded to Next.js 15.4.7. All code, tests, and CI/CD pipeline are now compatible with Next.js 15.4.7.
- Fixed all lint, type, and accessibility errors in source and test files.
- Resolved all build and test failures in CI/CD, including dynamic API route type errors.
- Updated all API and lib imports to use `import type` where appropriate and sorted imports.
- Refactored Prisma global variable usage for compatibility.
- Improved accessibility: added keyboard event handlers to clickable elements and set `type="button"` on all buttons.
- Updated documentation to reflect Next.js 15.4.7 compatibility and all fixes.
- See README.md for details on setup and compatibility.

### Fixed
- All accessibility errors (button type, keyboard events for clickable divs)
- All lint and formatting errors as per Biome (import sorting, self-closing JSX, PrismaClient instantiation)
- Removed all explicit 'any' types from source files

## [1.2.1] - 2025-08-19

### Fixed
- All lint/type errors in source and test files (import type, import sorting, Prisma global, ternary, etc.)
- Jest test mocks for Prisma methods now use correct jest.Mock typing
- Type errors in API prompt route and auth (PromptWhereInput, cookies usage)
- CI/CD pipeline now passes with zero source lint errors

### Changed
- Refactored Prisma global variable to avoid redeclaration
- Updated all API and lib imports to use 'import type' where appropriate
- Improved code formatting and import sorting for consistency

### Documentation
- Updated CHANGELOG.md to reflect all lint/type/test/CI fixes for 1.2.1

## [1.2.0] - 2025-08-19

### Changed
- Upgraded Next.js to 14.2+ to resolve security vulnerabilities and improve stability
- Updated CI/CD workflow to ensure pnpm is installed before use
- Changed CI/CD PostgreSQL user to 'postgres' for compatibility
- Updated documentation to reflect new Next.js version

### Fixed
- CI/CD pipeline failures due to missing pnpm and invalid PostgreSQL role
- Security audit now passes with no known vulnerabilities

### Documentation
- README.md and CHANGELOG.md updated to mention Next.js 14.2+
- CONTRIBUTING.md and DEVELOPMENT.md checked for version references (no changes needed)

## [1.1.0] - 2025-01-19

### Added
- 🐙 **GitHub Repository Setup**
  - Comprehensive .gitignore with all necessary exclusions
  - Professional issue and PR templates
  - GitHub Actions CI/CD pipeline with automated testing
  - Security scanning with CodeQL and dependency review
  - Docker Compose setup for development database
  - Enhanced Makefile with 30+ development commands

### Documentation
- 📚 **Professional Documentation**
  - Updated README.md with comprehensive features list and setup guide
  - CONTRIBUTING.md with detailed contribution guidelines
  - DEVELOPMENT.md with complete development setup instructions
  - MIT License with proper attribution
  - CHANGELOG.md with semantic versioning

## [1.0.1] - 2025-01-19

### Added
- 📊 **Enhanced Statistics & UI**
  - Professional footer with app statistics display
  - Real-time statistics tracking (total, favorites, archived, tags)
  - Improved responsive design and layout structure

### Fixed
- 🐛 **Bug Fixes**
  - Fixed sorting functionality (backend now properly handles sort=title)
  - Resolved pagination issues with proper offset handling
  - Improved text cursor behavior on non-typable elements

## [1.0.0] - 2024-12-19

### Added
- 🔐 **Authentication System**
  - Custom email/password authentication with JWT
  - Secure HTTP-only cookies
  - Password hashing with bcryptjs
  - User registration and login flows

- 📝 **Prompt Management**
  - Create, read, update, delete prompts
  - Rich text editor support
  - Title and description fields
  - Copy to clipboard functionality

- 🏷️ **Tag System**
  - Many-to-many tag relationships
  - Tag creation and management
  - Tag-based filtering and organization
  - Automatic tag suggestions

- 🎯 **Advanced Features**
  - Favorite prompts system
  - Archive functionality (soft delete)
  - Full-text search across titles and content
  - Sort by date (newest first) or title (A-Z)
  - Real-time statistics tracking

- ⚡ **Performance & UX**
  - Pagination with "Load More" functionality
  - Responsive design for all devices
  - Smooth animations and hover effects
  - Loading states and progress indicators
  - Error handling and user feedback

- 🏗️ **Developer Experience**
  - Comprehensive Makefile with 25+ commands
  - Jest testing framework with API tests
  - TypeScript throughout
  - Prisma ORM with PostgreSQL
  - Biome for linting and formatting

- 🎨 **UI/UX**
  - Modern gradient design
  - Tailwind CSS styling
  - Icon-based actions with tooltips
  - Modal dialogs for forms
  - Professional footer with statistics

### Technical
- **Frontend**: Next.js 14.2+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL with proper indexing
- **Authentication**: Custom JWT with HTTP-only cookies
- **Testing**: Jest with custom API testing utilities
- **DevOps**: Docker Compose for database, Makefile for automation

### Security
- Input validation with Zod schemas
- SQL injection prevention through Prisma
- XSS protection through React
- CSRF protection via HTTP-only cookies
- Secure password hashing
- User-scoped data access

### Performance
- Efficient pagination (20 items per page)
- Database query optimization
- Client-side caching
- Bundle size optimization
- Responsive image handling

## [0.1.0] - 2024-12-18

### Added
- Initial project setup
- Basic Next.js application structure
- Database schema design
- Authentication foundation

---

## Legend

- 🔐 Authentication & Security
- 📝 Content & Data Management  
- 🏷️ Organization & Categorization
- 🎯 User Features
- ⚡ Performance & UX
- 🏗️ Developer Experience
- 🎨 UI/UX Design
- 🐛 Bug Fixes
- 💥 Breaking Changes
- 🗑️ Deprecated/Removed

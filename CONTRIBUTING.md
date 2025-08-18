# Contributing to Prompt Vault

Thank you for your interest in contributing to Prompt Vault! We welcome contributions from the community.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database

### Setup Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/Illangasinghe/prompt-vault.git
   cd prompt-vault
   ```

2. **Install dependencies**
   ```bash
   make setup
   # or manually:
   # pnpm install
   # cp .env.example .env
   # pnpm prisma db push
   ```

3. **Start development server**
   ```bash
   make dev
   ```

## 📝 Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic

3. **Test your changes**
   ```bash
   make test
   make lint
   ```

4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

### Code Style

- We use **Biome** for linting and formatting
- Run `make format` to format your code
- Run `make lint` to check for issues
- Follow existing TypeScript patterns
- Use meaningful variable and function names

### Database Changes

- If you modify the database schema:
  ```bash
  make db-migrate
  ```
- Always test migrations thoroughly
- Document any breaking changes

## 🐛 Bug Reports

When filing an issue, please include:

- **Clear title** describing the issue
- **Steps to reproduce** the bug
- **Expected behavior** vs **actual behavior**
- **Environment info** (OS, Node version, browser)
- **Screenshots** if applicable

### Bug Report Template

```
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Node version: [e.g. 18.17.0]
 - Browser: [e.g. Chrome, Firefox]
 - Version: [e.g. 1.0.0]
```

## 💡 Feature Requests

We love new ideas! When suggesting features:

- **Check existing issues** to avoid duplicates
- **Describe the problem** you're trying to solve
- **Explain your solution** in detail
- **Consider alternatives** you've thought about
- **Add mockups/examples** if helpful

## 🔧 Types of Contributions

### 🐛 Bug Fixes
- Fix issues in existing functionality
- Improve error handling
- Performance optimizations

### ✨ New Features
- UI/UX improvements
- New prompt management features
- Additional authentication methods
- Performance enhancements

### 📚 Documentation
- Improve README
- Add code comments
- Write tutorials or guides
- Update API documentation

### 🧪 Testing
- Add unit tests
- Improve test coverage
- Add integration tests
- Performance testing

## 📋 Pull Request Process

1. **Create a descriptive PR title**
   - `fix: resolve login issue with special characters`
   - `feat: add bulk delete functionality`
   - `docs: update installation instructions`

2. **Fill out the PR template**
   - Describe what changes you made
   - Reference any related issues
   - Add screenshots for UI changes

3. **Ensure your PR:**
   - ✅ Passes all tests (`make test`)
   - ✅ Passes linting (`make lint`)
   - ✅ Is up to date with main branch
   - ✅ Has descriptive commit messages

4. **Wait for review**
   - Be responsive to feedback
   - Make requested changes promptly
   - Keep discussions respectful

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   ├── signin/             # Authentication pages
│   └── page.tsx            # Main app page
├── components/             # Reusable React components
├── lib/                    # Utility libraries
└── styles/                 # Global styles

prisma/
└── schema.prisma          # Database schema

__tests__/                 # Test files
```

## 🚨 Important Guidelines

### Security
- **Never commit secrets** (API keys, passwords, etc.)
- **Review database queries** for SQL injection risks
- **Validate all user inputs** on both client and server
- **Follow authentication best practices**

### Performance
- **Keep bundle size small** - avoid unnecessary dependencies
- **Optimize database queries** - use indexes, avoid N+1
- **Use proper React patterns** - memo, useMemo, useCallback
- **Test with large datasets** - ensure pagination works

### Accessibility
- **Use semantic HTML** elements
- **Add proper ARIA labels** for screen readers
- **Ensure keyboard navigation** works
- **Test with screen readers** when possible

## 🎯 Areas We Need Help

- [ ] **Mobile responsiveness** improvements
- [ ] **Dark mode** implementation
- [ ] **Keyboard shortcuts** for power users
- [ ] **Export/import** functionality
- [ ] **Advanced search** with operators
- [ ] **Prompt templates** system
- [ ] **Collaboration features** 
- [ ] **API documentation**
- [ ] **Performance optimizations**
- [ ] **Accessibility improvements**

## ❓ Questions?

- 💬 **Discussions**: Use GitHub Discussions for questions
- 🐛 **Issues**: File bugs and feature requests
- 📧 **Email**: Contact maintainers for sensitive issues

## 🙏 Recognition

Contributors are recognized in:
- README contributors section
- Release notes for major contributions
- Special thanks in documentation

---

**Thank you for contributing to Prompt Vault!** 🚀

Every contribution, no matter how small, helps make this project better for everyone.

# 🛠️ Development Setup Guide

This guide will help you set up the Prompt Vault development environment quickly and easily.

## 🚀 Quick Start (Recommended)

### Option 1: Using Docker (Easiest)

```bash
# 1. Clone and setup
git clone https://github.com/Illangasinghe/prompt-vault.git
cd prompt-vault
make install

# 2. Start database with Docker
make docker-up

# 3. Setup database schema
make db-setup

# 4. Start developing
make dev
```

### Option 2: Manual Setup

```bash
# 1. Clone and install
git clone https://github.com/Illangasinghe/prompt-vault.git
cd prompt-vault
make setup

# 2. Configure environment (see below)
cp .env.example .env
# Edit .env with your database credentials

# 3. Start developing  
make dev
```

## 📋 Prerequisites

### Required
- **Node.js 18+** (check with `node --version`)
- **pnpm** (recommended) or npm/yarn
- **PostgreSQL 12+** OR **Docker** (for database)

### Installation

**Node.js & pnpm:**
```bash
# Install Node.js from https://nodejs.org/
# Then install pnpm
npm install -g pnpm

# Or use nvm for Node version management
nvm use  # Uses version from .nvmrc
```

**PostgreSQL (if not using Docker):**
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

## 🔧 Environment Configuration

### 1. Database Configuration

**Option A: Docker (Recommended)**
```bash
# Start PostgreSQL with Docker
make docker-up

# Use this DATABASE_URL in .env:
DATABASE_URL="postgresql://prompt_vault_user:secure_password_change_this@localhost:5432/prompt_vault_db"
```

**Option B: Local PostgreSQL**
```sql
-- Connect to PostgreSQL and run:
CREATE DATABASE prompt_vault_db;
CREATE USER prompt_vault_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE prompt_vault_db TO prompt_vault_user;
```

```bash
# Use this DATABASE_URL in .env:
DATABASE_URL="postgresql://prompt_vault_user:your_password@localhost:5432/prompt_vault_db"
```

### 2. JWT Secret

```bash
# Generate a secure JWT secret
openssl rand -hex 32

# Add to .env:
JWT_SECRET="your-generated-secret-here"
```

### 3. Complete .env Example

```env
# Database
DATABASE_URL="postgresql://prompt_vault_user:secure_password@localhost:5432/prompt_vault_db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"

# Optional
NODE_ENV="development"
PORT=3000
```

## 🏗️ Development Workflow

### Daily Development

```bash
# Start database (if using Docker)
make docker-up

# Start development server
make dev

# In another terminal, run tests while developing
make test --watch
```

### Common Commands

```bash
# 📦 Setup & Installation
make setup          # Complete first-time setup
make install         # Install dependencies only

# 🚀 Development
make dev             # Start development server
make build           # Build for production
make start           # Start production server

# 🗄️ Database
make db-setup        # Initialize database schema
make db-migrate      # Run migrations
make db-studio       # Open Prisma Studio
make db-reset        # Reset database (DESTRUCTIVE)

# 🐳 Docker
make docker-up       # Start database container
make docker-down     # Stop containers
make docker-logs     # View container logs
make docker-pgadmin  # Start with PgAdmin web interface

# 🧪 Testing & Quality
make test            # Run test suite
make lint            # Check code quality
make format          # Format code
make clean           # Clean build artifacts

# ℹ️  Help
make help            # Show all available commands
```

## 🐛 Troubleshooting

### Database Connection Issues

**Problem:** `Error: P1001: Can't reach database server`
```bash
# Check if PostgreSQL is running
make docker-logs  # If using Docker
sudo systemctl status postgresql  # If using local PostgreSQL

# Verify DATABASE_URL in .env matches your setup
```

**Problem:** `Error: P1017: Server has closed the connection`
```bash
# Restart database container
make docker-down
make docker-up
```

### Port Conflicts

**Problem:** `Error: Port 3000 is already in use`
```bash
# Kill process on port 3000
pkill -f "next dev"
# Or use different port
PORT=3001 make dev
```

### Permission Issues

**Problem:** `EACCES: permission denied`
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
# Or reinstall pnpm
npm install -g pnpm
```

### Build Errors

**Problem:** TypeScript or build errors
```bash
# Clean and reinstall
make clean
rm -rf node_modules pnpm-lock.yaml
make install

# Check for type errors
pnpm run type-check
```

## 🔍 Useful Tools

### Database Management

**Prisma Studio (Included)**
```bash
make db-studio
# Opens at http://localhost:5555
```

**PgAdmin (Docker)**
```bash
make docker-pgadmin
# Opens at http://localhost:5050
# Email: admin@promptvault.com
# Password: admin_password_change_this
```

### Development Tools

**VS Code Extensions (Recommended)**
- Prisma (for schema files)
- Tailwind CSS IntelliSense
- TypeScript Importer
- Jest Runner
- GitLens

**Browser DevTools**
- React Developer Tools
- Database inspection via browser network tab

## 📊 Project Structure

```
prompt-vault/
├── 📁 src/
│   ├── 📁 app/              # Next.js App Router
│   │   ├── 📁 api/         # API endpoints
│   │   ├── signin/         # Auth pages
│   │   └── page.tsx        # Main app page
│   ├── 📁 components/      # React components
│   ├── 📁 lib/            # Utilities
│   └── 📁 styles/         # Global styles
├── 📁 prisma/             # Database schema
├── 📁 __tests__/          # Test files
├── 📁 public/             # Static assets
└── 📁 .github/            # GitHub templates & workflows
```

## ✅ Development Checklist

**Before Starting:**
- [ ] Node.js 18+ installed
- [ ] pnpm installed  
- [ ] Database running (Docker or local)
- [ ] .env file configured
- [ ] Dependencies installed (`make install`)
- [ ] Database schema applied (`make db-setup`)

**During Development:**
- [ ] Tests passing (`make test`)
- [ ] No linting errors (`make lint`)
- [ ] Code formatted (`make format`)
- [ ] Database schema up to date

**Before Committing:**
- [ ] All tests pass
- [ ] Code is formatted
- [ ] No console errors
- [ ] Database migrations tested
- [ ] Documentation updated if needed

## 🚀 Deployment

See the main [README.md](README.md) for deployment instructions.

## 🆘 Need Help?

1. **Check the logs:** `make docker-logs` or console output
2. **Review documentation:** README.md, CONTRIBUTING.md
3. **Search issues:** Check GitHub issues for similar problems
4. **Ask for help:** Create a new GitHub issue with:
   - Your environment details
   - Steps to reproduce
   - Error messages
   - What you've tried

---

**Happy coding! 🎉**

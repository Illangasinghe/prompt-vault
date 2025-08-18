# Prompt Vault - Development Makefile
# ===================================

.PHONY: help install dev build start stop clean test lint format setup db-setup db-migrate db-reset db-studio

# Colors for output
CYAN := \033[36m
YELLOW := \033[33m
GREEN := \033[32m
RED := \033[31m
RESET := \033[0m

# Default target
.DEFAULT_GOAL := help

## help: Show this help message
help:
	@echo "$(CYAN)Prompt Vault - Development Commands$(RESET)"
	@echo ""
	@echo "$(YELLOW)🚀 Application Commands:$(RESET)"
	@echo "  $(GREEN)make dev$(RESET)        - Start development server"
	@echo "  $(GREEN)make build$(RESET)      - Build production application"
	@echo "  $(GREEN)make start$(RESET)      - Start production server"
	@echo "  $(GREEN)make stop$(RESET)       - Stop development server"
	@echo ""
	@echo "$(YELLOW)📦 Setup Commands:$(RESET)"
	@echo "  $(GREEN)make setup$(RESET)      - Complete project setup (install + db-setup)"
	@echo "  $(GREEN)make install$(RESET)    - Install dependencies"
	@echo ""
	@echo "$(YELLOW)🗄️  Database Commands:$(RESET)"
	@echo "  $(GREEN)make db-setup$(RESET)   - Setup database and run migrations"
	@echo "  $(GREEN)make db-migrate$(RESET) - Run database migrations"
	@echo "  $(GREEN)make db-reset$(RESET)   - Reset database (DESTRUCTIVE)"
	@echo "  $(GREEN)make db-studio$(RESET)  - Open Prisma Studio"
	@echo ""
	@echo "$(YELLOW)🐳 Docker Commands:$(RESET)"
	@echo "  $(GREEN)make docker-up$(RESET)   - Start database with Docker"
	@echo "  $(GREEN)make docker-down$(RESET) - Stop Docker containers"
	@echo "  $(GREEN)make docker-logs$(RESET) - View Docker container logs"
	@echo "  $(GREEN)make docker-clean$(RESET) - Clean Docker volumes and containers"
	@echo ""
	@echo "$(YELLOW)🧹 Development Commands:$(RESET)"
	@echo "  $(GREEN)make test$(RESET)       - Run tests"
	@echo "  $(GREEN)make lint$(RESET)       - Run linter"
	@echo "  $(GREEN)make format$(RESET)     - Format code"
	@echo "  $(GREEN)make clean$(RESET)      - Clean build artifacts"
	@echo ""
	@echo "$(YELLOW)💡 Quick Start:$(RESET)"
	@echo "  1. $(GREEN)make setup$(RESET)     # First time setup"
	@echo "  2. $(GREEN)make dev$(RESET)       # Start developing"
	@echo ""

## setup: Complete project setup
setup: install db-setup
	@echo "$(GREEN)✅ Project setup complete! Run 'make dev' to start.$(RESET)"

## install: Install dependencies
install:
	@echo "$(CYAN)📦 Installing dependencies...$(RESET)"
	@pnpm install

## dev: Start development server
dev:
	@echo "$(CYAN)🚀 Starting development server...$(RESET)"
	@echo "$(YELLOW)📱 App will be available at: http://localhost:3000$(RESET)"
	@pnpm run dev

## build: Build production application
build:
	@echo "$(CYAN)🏗️  Building production application...$(RESET)"
	@pnpm run build

## start: Start production server
start: build
	@echo "$(CYAN)🚀 Starting production server...$(RESET)"
	@pnpm run start

## stop: Stop development server
stop:
	@echo "$(CYAN)🛑 Stopping development server...$(RESET)"
	@pkill -f "next dev" || echo "$(YELLOW)⚠️  No development server running$(RESET)"

## db-setup: Setup database and run migrations
db-setup:
	@echo "$(CYAN)🗄️  Setting up database...$(RESET)"
	@npx prisma generate
	@npx prisma db push
	@echo "$(GREEN)✅ Database setup complete!$(RESET)"

## db-migrate: Run database migrations
db-migrate:
	@echo "$(CYAN)🗄️  Running database migrations...$(RESET)"
	@npx prisma db push

## db-reset: Reset database (DESTRUCTIVE)
db-reset:
	@echo "$(RED)⚠️  WARNING: This will reset all database data!$(RESET)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(CYAN)🗄️  Resetting database...$(RESET)"
	@npx prisma db push --force-reset
	@echo "$(GREEN)✅ Database reset complete!$(RESET)"

## db-studio: Open Prisma Studio
db-studio:
	@echo "$(CYAN)🎨 Opening Prisma Studio...$(RESET)"
	@npx prisma studio

## test: Run tests
test:
	@echo "$(CYAN)🧪 Running tests...$(RESET)"
	@pnpm run test

## lint: Run linter
lint:
	@echo "$(CYAN)🔍 Running linter...$(RESET)"
	@pnpm run lint

## format: Format code
format:
	@echo "$(CYAN)✨ Formatting code...$(RESET)"
	@pnpm run format || echo "$(YELLOW)⚠️  Format command not available$(RESET)"

## clean: Clean build artifacts
clean:
	@echo "$(CYAN)🧹 Cleaning build artifacts...$(RESET)"
	@rm -rf .next
	@rm -rf node_modules/.cache
	@echo "$(GREEN)✅ Clean complete!$(RESET)"

# Check if required tools are installed
check-deps:
	@command -v pnpm >/dev/null 2>&1 || { echo "$(RED)❌ pnpm is not installed. Please install pnpm first.$(RESET)"; exit 1; }
	@command -v node >/dev/null 2>&1 || { echo "$(RED)❌ Node.js is not installed. Please install Node.js first.$(RESET)"; exit 1; }

# Docker Commands
## docker-up: Start database with Docker
docker-up:
	@echo "$(CYAN)🐳 Starting Docker containers...$(RESET)"
	@docker-compose up -d postgres
	@echo "$(GREEN)✅ Database container started!$(RESET)"
	@echo "$(YELLOW)📊 Database URL: postgresql://prompt_vault_user:secure_password_change_this@localhost:5432/prompt_vault_db$(RESET)"

## docker-down: Stop Docker containers  
docker-down:
	@echo "$(CYAN)🐳 Stopping Docker containers...$(RESET)"
	@docker-compose down

## docker-logs: View Docker container logs
docker-logs:
	@echo "$(CYAN)📋 Docker container logs:$(RESET)"
	@docker-compose logs -f postgres

## docker-clean: Clean Docker volumes and containers
docker-clean:
	@echo "$(RED)⚠️  WARNING: This will remove all Docker containers and volumes!$(RESET)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(CYAN)🧹 Cleaning Docker resources...$(RESET)"
	@docker-compose down -v --remove-orphans
	@docker system prune -f
	@echo "$(GREEN)✅ Docker cleanup complete!$(RESET)"

## docker-pgadmin: Start database with PgAdmin
docker-pgadmin:
	@echo "$(CYAN)🐳 Starting Docker containers with PgAdmin...$(RESET)"
	@docker-compose --profile admin up -d
	@echo "$(GREEN)✅ Containers started!$(RESET)"
	@echo "$(YELLOW)📊 Database: http://localhost:5432$(RESET)"
	@echo "$(YELLOW)🎨 PgAdmin: http://localhost:5050$(RESET)"

# Ensure dependencies are checked before running commands
install dev build start test lint: check-deps

# 🔒 Prompt Vault

A powerful, secure prompt management application for organizing and storing your AI prompts with a beautiful, modern interface.

![Prompt Vault](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## ✨ Features

### 🔐 **Secure Authentication**
- Custom email/password authentication with JWT
- Secure HTTP-only cookies
- Password hashing with bcryptjs

### 📝 **Prompt Management**
- **Create & Edit** - Rich text prompts with titles and descriptions
- **Delete** - Remove unwanted prompts
- **Organize** - Tag-based categorization system
- **Search** - Full-text search across titles and content
- **Copy to Clipboard** - One-click prompt copying

### 🎯 **Smart Organization**
- **Favorites** - Mark important prompts as favorites
- **Archive** - Archive old prompts without deletion
- **Tags** - Many-to-many tag relationships
- **Filtering** - Filter by favorites, archived status, tags
- **Sorting** - Sort by date (newest first) or title (A-Z)

### 🚀 **Performance & UX**
- **Pagination** - Load more prompts on demand
- **Real-time Statistics** - Track totals, favorites, archived, tags
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Beautiful hover effects and transitions
- **Keyboard Friendly** - Accessible interactions

### 📊 **Dashboard Features**
- Live statistics in footer
- Progress indicators
- Loading states
- Visual feedback for all actions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14.2+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Custom JWT with HTTP-only cookies
- **Validation**: Zod schemas
- **Testing**: Jest with custom API testing
- **Development**: Biome (linting/formatting), pnpm

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database

### Option 1: Using Makefile (Recommended)

```bash
# Complete setup in one command
make setup

# Start developing
make dev
```

### Option 2: Manual Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# 3. Setup database
pnpm prisma db push

# 4. Start development server
pnpm dev
```

### 🔧 Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/prompt_vault_db"

# Authentication  
JWT_SECRET="your-super-secret-jwt-key"
```

## 📋 Available Commands

Run `make help` to see all available commands:

### 🚀 Application Commands
- `make dev` - Start development server
- `make build` - Build production application  
- `make start` - Start production server
- `make stop` - Stop development server

### 📦 Setup Commands
- `make setup` - Complete project setup (install + db-setup)
- `make install` - Install dependencies

### 🗄️ Database Commands
- `make db-setup` - Setup database and run migrations
- `make db-migrate` - Run database migrations
- `make db-reset` - Reset database (DESTRUCTIVE)
- `make db-studio` - Open Prisma Studio

### 🧹 Development Commands
- `make test` - Run tests
- `make lint` - Run linter  
- `make format` - Format code
- `make clean` - Clean build artifacts

## 🎨 Usage

1. **Sign Up/Sign In** - Create an account with email and password
2. **Create Prompts** - Click "New Prompt" to add prompts with tags
3. **Organize** - Use tags, favorites, and archive to organize
4. **Search & Filter** - Find prompts quickly with search and filters
5. **Copy & Use** - One-click copy to use prompts anywhere

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── prompts/        # Prompt CRUD operations
│   │   ├── stats/          # Statistics endpoint
│   │   └── user/           # User info endpoint
│   ├── signin/             # Sign in/up page
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Main application page
├── components/             # React components
│   ├── EditPromptDialog.tsx
│   ├── NewPromptDialog.tsx
│   └── PromptCard.tsx
├── lib/                    # Utility libraries
│   ├── auth.ts            # Authentication logic
│   └── prisma.ts          # Prisma client
└── styles/
    └── globals.css        # Global styles
prisma/
└── schema.prisma          # Database schema
__tests__/                 # Test files
```

## 🧪 Testing

```bash
# Run all tests
make test

# Run tests with watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 📈 Database Schema

The application uses a clean, normalized schema:

- **Users** - Authentication and user management
- **Prompts** - Core prompt data with favorites/archive flags
- **Tags** - User-specific tag system
- **PromptTags** - Many-to-many relationship between prompts and tags

## 🔒 Security Features

- JWT tokens with secure HTTP-only cookies
- Password hashing with bcryptjs
- Input validation with Zod schemas
- User-scoped data access
- CORS protection
- XSS protection through React

## 🚀 Performance

- **Pagination** - Loads 20 prompts at a time
- **Client-side filtering** - Fast tag filtering
- **Optimized queries** - Efficient database operations
- **Lazy loading** - Components loaded on demand
- **Responsive images** - Optimized for all screen sizes

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

1. Fork the repository: [`https://github.com/Illangasinghe/prompt-vault`](https://github.com/Illangasinghe/prompt-vault)
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -am 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

For development setup, see [DEVELOPMENT.md](DEVELOPMENT.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database with [Prisma](https://prisma.io/) 
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)

## 👨‍💻 Author

**Indunil Illangasinghe**
- GitHub: [@Illangasinghe](https://github.com/Illangasinghe)
- Project: [Prompt Vault Starter](https://github.com/Illangasinghe/prompt-vault)

---

**Made with ❤️ for better prompt management**

*Happy prompting! 🚀*
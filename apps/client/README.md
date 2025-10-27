# Codura - Frontend UI for Code Execution Platform

A modern, professional coding challenge platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Authentication System**: Beautiful login and signup pages with validation
- **Dashboard**: Paginated questions table with filtering and search
- **Problem Solver**: Split-panel interface with Monaco code editor
- **Multi-language Support**: JavaScript, Python, Java, and C++
- **Modern UI**: Dark theme with smooth animations and responsive design
- **Developer-focused**: VS Code-like editor experience

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Code Editor**: Monaco Editor (VS Code editor)
- **Icons**: Lucide React
- **Monorepo**: Turborepo

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎨 Pages

### Authentication
- **Login Page** (`/login`): Email/password authentication with social login options
- **Signup Page** (`/signup`): User registration with validation

### Dashboard
- **Problem List** (`/dashboard`): Browse and filter coding problems
- Paginated table with 10 problems per page
- Search functionality
- Difficulty filters (Easy, Medium, Hard)
- Progress tracking statistics

### Problem Detail
- **Problem Solver** (`/problem/:id`): Solve coding challenges
- Split-panel layout (description + editor)
- Monaco code editor with syntax highlighting
- Multiple language support
- Test case runner
- Code submission system

## 🎯 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   └── Navbar.tsx       # Navigation component
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   └── ProblemDetail.tsx
├── data/
│   ├── mockQuestions.ts
│   └── mockProblemDetails.ts
├── lib/
│   └── utils.ts         # Utility functions
└── App.tsx              # Main app with routing
```

## 🎨 Design Features

- **Dark Theme**: Professional dark color scheme optimized for coding
- **Smooth Animations**: Fade-in, slide-up transitions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Typography**: Inter font family
- **Gradient Accents**: Eye-catching primary color gradients
- **VS Code-like Editor**: Familiar interface for developers

## 🔧 Configuration

The project uses:
- **Tailwind CSS**: Custom color palette and animations
- **TypeScript**: Strict type checking
- **ESLint**: Code quality and consistency
- **Vite**: Fast development and optimized builds

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features

### UI Components
- Customizable Button with multiple variants
- Input fields with icons and error states
- Card components with hover effects
- Badge components for difficulty levels

### Code Editor
- Syntax highlighting for multiple languages
- Auto-completion and IntelliSense
- Line numbers and minimap
- Theme: VS Dark

### Dashboard Features
- Real-time search filtering
- Difficulty-based filtering
- Pagination controls
- Progress statistics
- Solved problem tracking

## 🚧 Future Enhancements

- User authentication with JWT
- Backend API integration
- Real code execution
- Discussion forums
- Contest system
- User profiles and submissions history

## 📄 License

This project is part of a Turborepo monorepo structure.

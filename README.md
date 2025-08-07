# WellNest - AI-Powered Wellness Tracking App

A modern wellness tracking application built with React, TypeScript, and AI-powered insights. Track your daily wellness with personalized recommendations, mood tracking, and intelligent health insights.

## 🌟 Features

- **AI-Powered Chatbot**: Get personalized wellness advice and support
- **Mood Tracking**: Monitor your daily emotional well-being
- **Wellness Dashboard**: Visual insights into your health patterns
- **Personalized Recommendations**: AI-driven suggestions for better wellness
- **Accessibility Features**: Inclusive design for all users
- **Real-time Analytics**: Track your progress with detailed charts
- **Crisis Detection**: Intelligent monitoring for mental health support

## 🚀 Live Demo

Visit the live application: [WellNest](https://your-username.github.io/WellNest/)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Hook Form** with Yup validation

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **Google Gemini AI** integration
- **JWT** authentication
- **Rate limiting** and security middleware

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (for backend)

### Project Structure
This project is organized into three main directories:

- **frontend**: Contains all frontend code (React, TypeScript)
- **backend**: Contains all backend code (Node.js, Express)
- **shared**: Contains code shared between frontend and backend

### Setup
```bash
# Clone the repository
git clone https://github.com/your-username/WellNest.git
cd WellNest

# Install dependencies for all workspaces
npm install

# Run both frontend and backend in development mode
npm run dev

# Run only frontend
npm run dev:frontend

# Run only backend
npm run dev:backend

# Build all workspaces
npm run build
```

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run init-db

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/wellnest

# JWT
JWT_SECRET=your-secret-key

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Server
PORT=3001
NODE_ENV=development
```

## 🚀 Deployment

### Frontend Deployment (GitHub Pages)

This project is configured for automatic deployment to GitHub Pages:

1. **Push to GitHub**: The app automatically deploys when you push to the `main` branch
2. **GitHub Pages**: Enable GitHub Pages in your repository settings
3. **Custom Domain** (Optional): Configure a custom domain in repository settings

### Backend Deployment

For the backend, you can deploy to:

- **Railway**: Easy deployment with PostgreSQL
- **Heroku**: Traditional hosting platform
- **Vercel**: Serverless functions
- **DigitalOcean**: VPS hosting

#### Railway Deployment Example:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up
```

## 📁 Project Structure

```
WellNest/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── services/          # API services
│   └── types/             # TypeScript types
├── backend/               # Backend source code
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── services/         # Business logic
├── scripts/              # Utility scripts
└── docs/                 # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help or have questions:
- Open an issue on GitHub
- Check the documentation in the `/docs` folder
- Contact the development team

## 🔒 Security

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📊 Analytics

The app includes:
- User engagement metrics
- Wellness trend analysis
- AI interaction patterns
- Performance monitoring

---

Made with ❤️ for better wellness tracking

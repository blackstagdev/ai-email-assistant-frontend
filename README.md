# AI Email Assistant - Frontend

React + TypeScript frontend for the AI Email Assistant platform.

## 🎯 Features (Section 6 - Part 1)

- ✅ React 18 + TypeScript
- ✅ Vite for fast development
- ✅ Tailwind CSS for styling
- ✅ React Router for navigation
- ✅ Zustand for state management
- ✅ Axios for API calls
- ✅ Authentication (login/register)
- ✅ Protected routes
- ✅ Responsive sidebar layout

## 📦 Structure

```
src/
├── components/
│   └── Layout.tsx          # Main layout with sidebar
├── pages/
│   ├── Login.tsx           # Login page
│   ├── Register.tsx        # Registration page
│   ├── Dashboard.tsx       # Dashboard (placeholder)
│   ├── Contacts.tsx        # Contacts list (placeholder)
│   ├── ContactDetail.tsx   # Contact details (placeholder)
│   ├── Drafts.tsx          # Email drafts (placeholder)
│   ├── Integrations.tsx    # Platform settings (placeholder)
│   └── Chat.tsx            # AI chat (placeholder)
├── store/
│   └── authStore.ts        # Authentication state
├── lib/
│   └── api.ts              # API client & endpoints
├── App.tsx                 # Main app with routing
├── main.tsx                # Entry point
└── index.css               # Global styles + Tailwind
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will run on http://localhost:5173

## 🔧 Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:3000/api
```

## 📡 API Integration

The frontend connects to the backend API endpoints:

- **Auth:** `/api/auth/login`, `/api/auth/register`
- **Contacts:** `/api/contacts`, `/api/contacts/:id`
- **Drafts:** `/api/drafts`, `/api/drafts/generate`
- **Integrations:** `/api/integrations`
- **Analytics:** `/api/analytics/dashboard`
- **Chat:** `/api/chat`

All API calls automatically include the JWT token from localStorage.

## 🎨 Styling

Uses Tailwind CSS with custom utility classes:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container
- `.input` - Form input
- `.label` - Form label

## 🔐 Authentication

- Login and register pages
- JWT token stored in localStorage
- Automatic redirect on 401 errors
- Protected routes require authentication

## 🧭 Navigation

Main navigation items:
- Dashboard - Analytics and metrics
- Contacts - Contact management
- Draft Emails - AI-generated email drafts
- AI Chat - Chat with AI assistant
- Integrations - Platform connections

## ⏭️ Coming in Part 2

- Full Dashboard with charts
- Contact list with search
- Contact detail page with timeline
- Draft email approval workflow
- Integration connection UI
- AI chat interface

## 📄 License

ISC

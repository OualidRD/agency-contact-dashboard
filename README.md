# Dashboard Application

A professional, modern Next.js 16 dashboard application for managing agencies and contacts with authentication, search, filtering, and daily usage limits. Built with TypeScript, Clerk authentication, and CSV data integration.

**Status**: Production-Ready | **Deployment**: Free tier on Vercel

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Features in Detail](#features-in-detail)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This dashboard application provides a comprehensive interface for viewing and managing agencies and contacts data stored in CSV format. It features:

- **Secure Authentication** via Clerk with sign-in and sign-up flows
- **Protected Dashboard** with route-level access control
- **Agency Management** with full search and filtering capabilities
- **Contact Management** with intelligent daily viewing limits
- **Modern UI** with responsive design and professional styling
- **RESTful APIs** for data access with authentication

The application is optimized for deployment on Vercel and requires minimal configuration.

---

## ✨ Features

### Authentication & Security
- **Clerk Integration** - Enterprise-grade authentication with OAuth support
- **Route Protection** - Middleware-enforced access control
- **Secure Sessions** - Token-based user sessions
- **Public Routes** - Sign-in, sign-up, and landing page

### Agencies Management
- **Complete Agency Listing** - Display all agencies from CSV data
- **Advanced Search** - Real-time search across all agency fields
- **Flexible Filtering** - Filter by multiple criteria
- **Detail Modals** - Comprehensive agency information in modal view
- **Responsive Tables** - Mobile-friendly data presentation
- **Clickable Links** - Direct links to websites and emails

### Contacts Management
- **Contact Directory** - Browse and search all contacts
- **Daily Limit System** - 50 contacts per user per day
- **Usage Tracking** - Real-time limit counter and progress indicator
- **Smart Reset** - Automatic UTC midnight reset
- **Upgrade Path** - Premium tier for unlimited access
- **Professional Modals** - Detailed contact information view
- **Persistent Tracking** - localStorage-based usage tracking per user

### User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Professional UI** - Modern, minimalist design with smooth interactions
- **Navigation Bar** - Quick access to all sections and user profile
- **Real-time Updates** - Dynamic data fetching and display
- **Performance Optimized** - Fast loading times and efficient rendering

---

## 🛠 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js | 16.0.5 |
| **Language** | TypeScript | 5.x |
| **UI Library** | React | 19.2.0 |
| **Authentication** | Clerk | 5.7.5 |
| **Data Parsing** | csv-parser | 3.2.0 |
| **Styling** | CSS Modules | Native |
| **Build Tool** | Turbopack | Next.js built-in |
| **Deployment** | Vercel | Free tier compatible |

---

## 📁 Project Structure

```
dashboard/
├── src/
│   ├── app/
│   │   ├── api/                          # API routes (server-side)
│   │   │   ├── agencies/
│   │   │   │   └── route.ts              # GET /api/agencies
│   │   │   └── contacts/
│   │   │       └── route.ts              # GET /api/contacts
│   │   │
│   │   ├── dashboard/                    # Protected dashboard pages
│   │   │   ├── agencies/
│   │   │   │   ├── page.tsx              # Agencies listing page
│   │   │   │   ├── agencies.module.css   # Agencies styling
│   │   │   │   └── agencies.new.module.css
│   │   │   │
│   │   │   ├── contacts/
│   │   │   │   ├── page.tsx              # Contacts listing page
│   │   │   │   └── contacts.module.css   # Contacts styling
│   │   │   │
│   │   │   ├── layout.tsx                # Dashboard layout
│   │   │   ├── page.tsx                  # Dashboard home
│   │   │   ├── dashboard.module.css      # Dashboard styling
│   │   │   │
│   │   │   └── upgrade/
│   │   │       ├── page.tsx              # Premium tier page
│   │   │       └── upgrade.module.css
│   │   │
│   │   ├── sign-in/
│   │   │   └── [[...catch-all]]/
│   │   │       └── page.tsx              # Clerk sign-in page
│   │   │
│   │   ├── sign-up/
│   │   │   └── [[...catch-all]]/
│   │   │       └── page.tsx              # Clerk sign-up page
│   │   │
│   │   ├── layout.tsx                    # Root layout (ClerkProvider)
│   │   ├── page.tsx                      # Home page (redirects)
│   │   └── globals.css                   # Global styles
│   │
│   ├── components/
│   │   ├── Navbar.tsx                    # Navigation component
│   │   └── Navbar.module.css             # Navbar styling
│   │
│   └── lib/
│       └── readCsv.ts                    # CSV parsing utility
│
├── data/                                  # CSV data files
│   ├── agencies_agency_rows.csv
│   └── contacts_contact_rows.csv
│
├── public/                                # Static assets
├── middleware.ts                          # Clerk route protection middleware
├── .env.local.example                     # Environment variables template
├── package.json                           # Dependencies
├── tsconfig.json                          # TypeScript configuration
├── next.config.ts                         # Next.js configuration
├── eslint.config.mjs                      # ESLint configuration
├── postcss.config.mjs                     # PostCSS configuration
├── README.md                              # This file
├── PROJECT_SUMMARY.md                     # Implementation details
└── QUICKSTART.md                          # Quick setup guide
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm package manager
- Clerk account (free tier available at https://clerk.com)
- CSV data files in `data/` directory

### Installation

1. **Clone the repository** (or download the project)
```bash
cd dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables** (see next section)

4. **Run development server**
```bash
npm run dev
```

5. **Access the application**
Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 🔐 Environment Configuration

### Required Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Clerk Authentication (https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_CLERK_FRONTEND_API=https://your-app.clerk.accounts.dev

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard/agencies
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard/agencies
```

### Getting Clerk Credentials

1. Visit [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application (or select existing)
3. Navigate to **API Keys** or **Credentials**
4. Copy the **Publishable Key** and **Secret Key**
5. Add them to `.env.local`
6. Configure **Redirect URLs** in Clerk:
   - Development: `http://localhost:3000/sign-in`, `http://localhost:3000/sign-up`
   - Production: Your Vercel URL

### Notes on Environment Variables

- `NEXT_PUBLIC_*` variables are exposed to the browser (only use for public keys)
- `CLERK_SECRET_KEY` is server-side only (never exposed to client)
- Never commit `.env.local` to version control (included in `.gitignore`)

---

## 📡 API Documentation

### Authentication

All API endpoints require Clerk authentication. Requests without valid tokens will be rejected.

### Endpoints

#### GET /api/agencies

Returns all agencies from the CSV data file.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Agency Name",
    "email": "contact@agency.com",
    "phone": "+1 (555) 123-4567",
    "website": "https://agency.com",
    "address": "123 Main St, City, ST 12345",
    ...
]
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (missing/invalid Clerk token)
- `500` - Server error

#### GET /api/contacts

Returns all contacts from the CSV data file.

**Response:**
```json
[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 987-6543",
    "title": "Manager",
    "agency": "Agency Name",
    ...
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (missing/invalid Clerk token)
- `500` - Server error

---

## 🎨 Features in Detail

### Agencies Management

**Path**: `/dashboard/agencies`

Features:
- **Search**: Filter agencies by any field in real-time
- **Sort**: Click column headers to sort (name, location, etc.)
- **Detail Modal**: Click any agency row to view complete information
- **Responsive**: Mobile-optimized table layout
- **Performance**: Server-side CSV parsing for fast loading

**CSV Requirements**: The `agencies_agency_rows.csv` file should have headers in the first row. The application automatically reads all columns.

### Contacts Management

**Path**: `/dashboard/contacts`

Features:
- **Daily Limit**: 50 contacts per user per day (UTC-based)
- **Usage Tracking**: Real-time progress indicator and counter
- **Smart Reset**: Automatic reset at UTC midnight
- **Search & Filter**: Find contacts by name, email, phone, etc.
- **Detail View**: Comprehensive contact information in modals
- **Upgrade Option**: Direct link to premium tier when limit reached

**Daily Limit Logic**:
- Tracked per user in browser localStorage
- Resets automatically at UTC 00:00
- Shows countdown to reset time
- Upgrade button appears when limit is reached

### Dashboard Home

**Path**: `/dashboard`

Features:
- **Quick Stats**: Overview of agencies, contacts, and daily usage
- **Daily Limit Card**: Visual progress bar and remaining count
- **Feature Showcase**: List of key features
- **Quick Actions**: Buttons for quick navigation to agencies, contacts, and upgrade

### User Profile & Navigation

**Navbar** component at top of all dashboard pages:
- User profile picture with Clerk integration
- Signed-in user display
- Sign out button
- Navigation links to key sections
- Responsive mobile menu

---

## 💻 Development

### Available Scripts

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Development Workflow

1. **Make changes** to TypeScript/TSX files
2. **Hot reload** happens automatically
3. **Check console** for errors and warnings
4. **Test in browser** at http://localhost:3000
5. **Run linter** before committing

### Code Quality

- **TypeScript**: Full type safety throughout the application
- **CSS Modules**: Scoped styling to prevent conflicts
- **ESLint**: Code quality enforcement
- **Next.js Best Practices**: Following official recommendations

### Extending the Application

**Adding a new page**:
1. Create folder in `src/app/dashboard/new-feature/`
2. Add `page.tsx` with your component
3. Automatically available at `/dashboard/new-feature`

**Adding a new API endpoint**:
1. Create route file: `src/app/api/new-endpoint/route.ts`
2. Export `GET`, `POST`, etc. as needed
3. Use Clerk's `auth()` for authentication

**Adding CSS**:
1. Create `.module.css` file in same directory
2. Import as: `import styles from './component.module.css'`
3. Use: `<div className={styles.className}>`

---

## 🌐 Deployment

### Deploy to Vercel (Free Tier)

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

**Step 2: Connect to Vercel**
1. Visit [Vercel](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

**Step 3: Configure Environment Variables**
1. In Vercel project settings, go to "Environment Variables"
2. Add:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_FRONTEND_API`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
3. Set environment to "Production"

**Step 4: Deploy**
1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Your app is live!

**Step 5: Update Clerk Configuration**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Settings → Domains
3. Add your Vercel URL (e.g., `https://dashboard-abc123.vercel.app`)
4. Save changes

**Step 6: Test Deployment**
1. Visit your Vercel URL
2. Test sign-in/sign-up flow
3. Verify agencies and contacts display correctly
4. Test daily limit functionality

### Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Build completes without errors
- [ ] Clerk URLs updated
- [ ] Sign-in/sign-up tested
- [ ] Data displays correctly
- [ ] All features working as expected

### Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Click "Add Domain"
3. Enter your domain
4. Follow DNS configuration instructions
5. Update Clerk with your custom domain

---

## 🐛 Troubleshooting

### Issue: "Clerk not initialized" Error

**Cause**: Missing or incorrect environment variables

**Solution**:
1. Verify `.env.local` exists in project root
2. Check all Clerk variables are present
3. Copy exact values from Clerk Dashboard (no extra spaces)
4. Restart dev server (`npm run dev`)

### Issue: CSV Files Not Found

**Cause**: Missing data files or incorrect path

**Solution**:
1. Ensure `data/` folder exists in project root
2. Verify files exist:
   - `data/agencies_agency_rows.csv`
   - `data/contacts_contact_rows.csv`
3. Check file permissions are readable
4. Restart dev server

### Issue: Tables Show No Data

**Cause**: CSV parsing error or incorrect format

**Solution**:
1. Open CSV file in text editor
2. Verify first row contains column headers
3. Check file encoding is UTF-8
4. Ensure no special characters causing parsing issues
5. Check browser Network tab for API errors
6. Check server console for detailed error messages

### Issue: Daily Limit Not Working

**Cause**: localStorage disabled or cleared

**Solution**:
1. Verify JavaScript is enabled in browser
2. Check browser localStorage is not disabled
3. Clear browser cache and reload
4. Try in incognito/private window
5. Check browser console (F12) for errors

### Issue: Sign-in/Sign-up Not Working

**Cause**: Clerk configuration issues

**Solution**:
1. Verify Clerk credentials in `.env.local`
2. Check Clerk dashboard is accessible
3. Ensure redirect URLs are configured in Clerk
4. Clear browser cookies and cache
5. Try different browser
6. Check Clerk documentation for updates

### Issue: 401 Unauthorized on API Calls

**Cause**: Expired or invalid Clerk token

**Solution**:
1. Sign out and sign back in
2. Clear browser localStorage
3. Check Clerk configuration
4. Verify API route uses proper Clerk auth check
5. Review Clerk middleware in `middleware.ts`

### Getting Help

For more detailed troubleshooting:
1. Check [QUICKSTART.md](./QUICKSTART.md) for basic setup
2. Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for implementation details
3. Check server console (`npm run dev` output) for error messages
4. Check browser console (F12 Developer Tools) for client errors
5. Visit [Next.js Documentation](https://nextjs.org/docs)
6. Visit [Clerk Documentation](https://clerk.com/docs)

---

## 📚 Additional Resources

### Documentation

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Clerk Authentication Docs](https://clerk.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [CSS Modules Guide](https://nextjs.org/docs/app/building-your-application/styling/css-modules)

### Learning Resources

- [Next.js Tutorial](https://nextjs.org/learn)
- [Clerk Integration Guide](https://clerk.com/docs/nextjs)
- [TypeScript with React](https://react-typescript-cheatsheet.netlify.app/)

---

## 📄 License

This project is provided as-is for development and deployment purposes.

---

## 🤝 Contributing

This is a production project. For modifications:

1. Create a feature branch
2. Make changes with descriptive commits
3. Test thoroughly before pushing
4. Submit PR with clear description

---

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review error messages in console
3. Check documentation files
4. Verify environment configuration
5. Clear cache and restart dev server

---

**Last Updated**: November 2025 | **Status**: Production Ready

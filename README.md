# ByteFolio

A modern, full-featured portfolio application built with Next.js 15, featuring a complete admin dashboard for dynamic content management. Built for developers and creatives who want a professional online presence without touching code after initial setup.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KunalGupta25/Bytefolio)

## ✨ Features

### Public Portfolio
- **Hero Section** - Eye-catching landing with name, specialization, and call-to-action
- **About Me** - Professional summary and bio with profile image
- **Skills Showcase** - Categorized skills with proficiency levels and custom icons
- **Education Timeline** - Academic background displayed in an interactive vertical timeline
- **Projects Gallery** - Portfolio projects with images, tags, live demos, and repository links
- **Certifications** - Professional certifications with verification links
- **Contact Form** - Dual email integration (EmailJS client-side + Resend server-side fallback)
- **Dark/Light Mode** - System-aware theme switching with smooth transitions
- **Responsive Design** - Optimized for all screen sizes and devices
- **SEO Optimized** - Built-in sitemap, robots.txt, canonical URLs, and JSON-LD structured data

### Admin Dashboard
Complete CRUD operations for all content sections:
- **Dashboard Overview** - Real-time stats for projects, skills, certifications, and page views
- **About Management** - Edit professional summary, bio, and profile image
- **Skills Manager** - Add/edit/delete skills with categories, levels, and Lucide icons
- **Education Manager** - Manage academic history with timeline integration
- **Projects Manager** - Full project portfolio management with image upload support
- **Certifications Manager** - Track and display professional credentials
- **Site Settings** - Configure site name, tagline, SEO metadata, and contact information
- **Integrations** - Set up EmailJS, Google Analytics, Ko-fi, and custom HTML widgets

## 🛠️ Tech Stack

**Frontend**
- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) - High-quality React components
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library
- [React Hook Form](https://react-hook-form.com/) - Form validation
- [Zod](https://zod.dev/) - Schema validation

**Backend & Database**
- [Firebase Realtime Database](https://firebase.google.com/docs/database) - Real-time data storage
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) - Secure server-side operations
- Next.js Server Actions - Type-safe mutations

**AI & Integrations**
- [Google Genkit](https://firebase.google.com/docs/genkit) - AI capabilities
- [EmailJS](https://www.emailjs.com/) - Client-side email
- [Resend](https://resend.com/) - Server-side email fallback
- [Recharts](https://recharts.org/) - Dashboard analytics

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser["🌐 Browser"]
        PublicPages["📄 Public Portfolio<br/>Hero | About | Skills<br/>Projects | Contact"]
        AdminDashboard["🔐 Admin Dashboard<br/>Content Management<br/>Site Settings"]
    end

    subgraph "Next.js App Router"
        AppRouter["⚡ App Router<br/>(Port 9002)"]
        ServerActions["🔄 Server Actions<br/>actions.ts"]
        Middleware["🛡️ Middleware<br/>Auth & Security"]
        
        subgraph "API Layer"
            MetadataAPI["📊 Metadata API<br/>SEO + JSON-LD"]
            RobotsAPI["🤖 robots.ts"]
            SitemapAPI["🗺️ sitemap.ts"]
        end
    end

    subgraph "Data Layer"
        FirebaseAdmin["🔥 Firebase Admin SDK<br/>firebase-admin.ts"]
        DataQueries["📚 Data Queries<br/>data.ts"]
        Validation["✅ Zod Schemas<br/>Type Safety"]
    end

    subgraph "External Services"
        Firebase["🔥 Firebase Realtime DB<br/>Real-time Sync"]
        EmailJS["📧 EmailJS<br/>Client Email"]
        Resend["📨 Resend<br/>Server Email Fallback"]
        Analytics["📈 Google Analytics<br/>Tracking"]
        Genkit["🤖 Google Genkit<br/>AI Features"]
    end

    subgraph "Styling & UI"
        Tailwind["🎨 Tailwind CSS"]
        Shadcn["🧩 shadcn/ui<br/>Components"]
        LucideIcons["🎯 Lucide Icons"]
        ThemeSystem["🌓 Dark/Light Mode"]
    end

    Browser -->|Renders| PublicPages
    Browser -->|Admin Access| AdminDashboard
    
    PublicPages -->|Routes| AppRouter
    AdminDashboard -->|CRUD Operations| ServerActions
    
    AppRouter -->|Server-side| ServerActions
    AppRouter -->|SEO| MetadataAPI
    AppRouter -->|Crawlers| RobotsAPI
    AppRouter -->|Sitemap| SitemapAPI
    
    ServerActions -->|Validate| Validation
    ServerActions -->|Execute| FirebaseAdmin
    
    PublicPages -->|Queries| DataQueries
    AdminDashboard -->|Queries| DataQueries
    
    DataQueries -->|Read| FirebaseAdmin
    Middleware -->|Protect| AdminDashboard
    
    FirebaseAdmin -->|Read/Write| Firebase
    
    PublicPages -->|Track| Analytics
    PublicPages -->|Send Contact| EmailJS
    ServerActions -->|Fallback Email| Resend
    ServerActions -->|AI Features| Genkit
    
    PublicPages -.->|Styled by| Tailwind
    AdminDashboard -.->|Styled by| Tailwind
    PublicPages -.->|Uses| Shadcn
    AdminDashboard -.->|Uses| Shadcn
    PublicPages -.->|Icons| LucideIcons
    PublicPages -.->|Theme| ThemeSystem

    style Browser fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style Firebase fill:#FFA000,stroke:#FF6F00,stroke-width:3px,color:#fff
    style ServerActions fill:#10B981,stroke:#059669,stroke-width:2px,color:#fff
    style FirebaseAdmin fill:#F59E0B,stroke:#D97706,stroke-width:2px,color:#fff
    style Validation fill:#8B5CF6,stroke:#6D28D9,stroke-width:2px,color:#fff
    style AdminDashboard fill:#EF4444,stroke:#DC2626,stroke-width:2px,color:#fff
    style PublicPages fill:#3B82F6,stroke:#2563EB,stroke-width:2px,color:#fff
    style AppRouter fill:#06B6D4,stroke:#0891B2,stroke-width:2px,color:#fff
```

### **Key Architecture Highlights**

- **🎯 Server-First Design**: All mutations go through Next.js Server Actions for type safety and security
- **⚡ Real-time Data**: Firebase Realtime Database provides instant content updates
- **🔐 Secure by Default**: Firebase Admin SDK bypasses client rules, admin routes protected
- **📱 Responsive Components**: shadcn/ui + Tailwind CSS for consistent, mobile-first UI
- **🎨 Dynamic Theming**: System-aware dark/light mode with smooth transitions
- **📊 SEO Optimized**: Automatic sitemap generation, robots.txt, canonical URLs, and structured data
- **✉️ Resilient Email**: Dual email setup with automatic fallback (EmailJS → Resend)
- **🤖 AI Ready**: Google Genkit integration for future AI-powered features

## 🚀 Quick Start

### Prerequisites
- Node.js 20 or higher
- Firebase project ([Create one here](https://console.firebase.google.com/))
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/KunalGupta25/Bytefolio.git
cd Bytefolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project or select existing
- Navigate to Project Settings → Service Accounts
- Click "Generate New Private Key" under Admin SDK
- Download the JSON file

4. **Set up environment variables**

Create `.env.local` in the root directory:

```env
# Firebase Admin SDK (from downloaded JSON file)
FIREBASE_SERVICE_ACCOUNT_TYPE="service_account"
FIREBASE_SERVICE_ACCOUNT_PROJECT_ID="your-project-id"
FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID="your-private-key-id"
FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL="firebase-adminsdk@your-project.iam.gserviceaccount.com"
FIREBASE_SERVICE_ACCOUNT_CLIENT_ID="your-client-id"
FIREBASE_SERVICE_ACCOUNT_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
FIREBASE_SERVICE_ACCOUNT_TOKEN_URI="https://oauth2.googleapis.com/token"
FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/YOUR_EMAIL_ENCODED"
FIREBASE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN="googleapis.com"

# Firebase Realtime Database
FIREBASE_DATABASE_URL="https://your-project-default-rtdb.firebaseio.com"

# Admin Credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"

# Email Service (Optional)
CONTACT_FORM_RECIPIENT_EMAIL="your-email@example.com"
RESEND_API_KEY="re_xxxxxxxxxxxx"

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Site Configuration
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

5. **Configure Firebase Realtime Database Rules**

In Firebase Console → Realtime Database → Rules, set:
```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```
*The Admin SDK bypasses these rules, keeping your data secure.*

6. **Start development server**
```bash
npm run dev
```

Visit [http://localhost:9002](http://localhost:9002) to see your portfolio.

7. **Access admin panel**

Navigate to [http://localhost:9002/admin/login](http://localhost:9002/admin/login) and use the credentials from your `.env.local` file.

## 📜 Available Scripts

```bash
npm run dev          # Start development server on port 9002
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run genkit:dev   # Start Genkit AI development server
```

## 🗂️ Project Structure

```
Bytefolio/
├── src/
│   ├── app/
│   │   ├── actions.ts              # Server actions for CRUD operations
│   │   ├── layout.tsx              # Root layout with metadata
│   │   ├── page.tsx                # Homepage
│   │   ├── robots.ts               # SEO robots configuration
│   │   ├── sitemap.ts              # Dynamic sitemap generation
│   │   ├── admin/                  # Admin dashboard
│   │   │   ├── login/              # Admin authentication
│   │   │   ├── about/              # About Me management
│   │   │   ├── skills/             # Skills management
│   │   │   ├── education/          # Education management
│   │   │   ├── projects/           # Projects management
│   │   │   ├── certifications/     # Certifications management
│   │   │   ├── settings/           # Site settings
│   │   │   └── integrations/       # Third-party integrations
│   │   └── components/             # Page-specific components
│   ├── components/
│   │   └── ui/                     # Reusable UI components (shadcn)
│   ├── lib/
│   │   ├── data.ts                 # Data interfaces and queries
│   │   ├── firebase-admin.ts       # Firebase Admin initialization
│   │   ├── site-url.ts             # URL utilities
│   │   └── utils.ts                # Helper functions
│   ├── hooks/                      # React hooks
│   └── ai/                         # Genkit AI configuration
├── public/                         # Static assets
├── docs/                           # Documentation
└── .env.local.example              # Environment variables template
```

## 🔐 Security

- **Private Database**: Firebase rules set to deny all public access
- **Server-Side Auth**: Admin SDK handles all database operations securely
- **Environment Variables**: Sensitive credentials stored in `.env.local`
- **Admin Routes**: Protected with basic authentication (enhance for production)
- **SEO Protection**: Admin routes excluded via robots.txt and noindex meta tags

## 🌐 Deployment

### Deploy to Vercel

1. Click the "Deploy with Vercel" button above, or:
2. Connect your GitHub repository to Vercel
3. Add all environment variables from `.env.local`
4. Deploy

### Deploy to Netlify

1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables
5. Deploy

The project includes `netlify.toml` for automatic Netlify configuration.

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.ts` to customize colors:
- Primary: Navy blue `#24292F`
- Secondary: Light gray `#E5E5E5`
- Accent: Teal `#008080`

### Site Content
All content is managed through the admin dashboard at `/admin`:
- Update your name, tagline, and bio
- Add/remove skills, projects, and certifications
- Configure social media links
- Customize site metadata for SEO

### Components
All UI components are in `src/components/ui/` and can be customized following shadcn/ui patterns.

## 📊 Features in Detail

### Email Integration
ByteFolio supports dual email configuration:
- **EmailJS** (Client-side): Configure in Admin → Integrations
- **Resend** (Server-side): Automatic fallback using environment variables

### Analytics
- **Google Analytics**: Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to track visitors
- **Page Views**: Built-in counter displayed in admin dashboard

### AI Integration
Google Genkit is integrated for potential AI features:
```bash
npm run genkit:dev  # Start AI development server
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built with:
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Lucide](https://lucide.dev/) for icons
- [Vercel](https://vercel.com/) for hosting platform
- [Firebase](https://firebase.google.com/) for backend services

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation in `/docs`

---

**Made with ❤️ by Kunal Gupta**

[![Support](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/kunalgupta25)

 Weather Analytics Dashboard

A comprehensive React/Next.js TypeScript dashboard for visualizing weather data over interactive maps with polygon drawing and timeline controls.

## 🚀 Live Demo

**Deployed Application:**https://vercel.com/anuskaghosh2912-gmailcoms-projects/weather-dashboard/kBfWmACwdCgtgrxCwPBtErtdjwCr

## 📋 Setup and Run Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Setup

1. **Clone the repository:**
\`\`\`bash
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
\`\`\`

2. **Install dependencies:**
\`\`\`bash
pnpm install
\`\`\`

3. **Run development server:**
\`\`\`bash
pnpm dev
\`\`\`

4. **Open application:**
Navigate to (http://localhost:3000)

### Build for Production
\`\`\`bash
pnpm run build
pnpm start
\`\`\`

## 📚 Libraries and Technologies Used

### Core Framework
- **Next.js 14.2.0** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety and development experience

### UI Components & Styling
- **shadcn/ui** - Modern component library
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Headless UI primitives
  - `@radix-ui/react-dialog` - Modal dialogs
  - `@radix-ui/react-dropdown-menu` - Dropdown menus
  - `@radix-ui/react-select` - Select components
  - `@radix-ui/react-separator` - Visual separators
  - `@radix-ui/react-slot` - Component composition
- **Lucide React** - Modern icon library
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional CSS classes

### Mapping & Visualization
- **Leaflet 1.9.4** - Interactive map library
- **@types/leaflet** - TypeScript definitions for Leaflet

### Development Tools
- **ESLint** - Code linting
- **PostCSS & Autoprefixer** - CSS processing
- **tailwindcss-animate** - Animation utilities

## 🎯 Key Features Implemented

### ✅ Timeline Control System
- **30-day Analysis Window** - 15 days historical + 15 days predictive
- **Dual Mode Support** - Point-in-time vs Range analysis
- **Hourly Precision** - 720 total hours available
- **Quick Navigation** - Preset buttons (Now, Yesterday, Last Week)
- **Visual Indicators** - Current time marker and duration display

### ✅ Interactive Mapping
- **Leaflet Integration** - Professional mapping with OpenStreetMap
- **Polygon Drawing** - 3-12 point polygon creation
- **Smart Completion** - Automatic polygon closure detection
- **Reset Controls** - Map view reset functionality

### ✅ Advanced Data Visualization
- **Multiple Data Sources** - Temperature, Humidity, Wind Speed, Precipitation
- **Color-Coded Regions** - Dynamic polygon coloring based on weather data
- **Real-time Updates** - Automatic color updates on timeline changes
- **Visual Legend** - Clear color rule explanations

### ✅ Professional UI/UX
- **Glass Morphism Design** - Modern backdrop blur effects
- **Premium Gradients** - Sophisticated color schemes
- **Responsive Layout** - Works across different screen sizes
- **Enterprise-Grade Styling** - Professional dashboard appearance

## 🏗️ Architecture & Design Decisions

### State Management
- **React Context API** - Global state management for dashboard data
- **Custom Hooks** - Reusable logic for sidebar and dashboard interactions

### Component Structure
\`\`\`
src/
├── app/
│   ├── page.tsx              # Main dashboard page
│   ├── layout.tsx            # Root layout with providers
│   └── globals.css           # Global styles + premium animations
├── components/
│   ├── app-sidebar.tsx       # Mission control sidebar
│   ├── map-container.tsx     # Leaflet map + polygon drawing
│   ├── timeline-slider.tsx   # Advanced timeline control
│   └── ui/                   # shadcn/ui components
└── types/
    └── polygon.ts            # TypeScript type definitions
\`\`\`

### API Integration Strategy
- **Open-Meteo Archive API** - Reliable, free weather data service
- **Error Handling** - Graceful fallback to mock data if API fails
- **Data Processing** - Automatic averaging for time ranges
- **Efficient Caching** - Minimized API calls during user interactions

### Performance Optimizations
- **Lazy Loading** - Dynamic imports for Leaflet to reduce initial bundle
- **Efficient Re-renders** - Optimized React Context usage
- **Memory Management** - Proper cleanup of map markers and polygons

## 🎨 Design Philosophy

### Professional Enterprise Aesthetic
- **Glass Morphism** - Modern transparency effects with backdrop blur
- **Gradient Systems** - Sophisticated color transitions
- **Premium Typography** - Advanced font features and spacing
- **Micro-interactions** - Smooth hover effects and transitions

### User Experience Focus
- **Intuitive Controls** - Clear visual feedback for all interactions
- **Progressive Disclosure** - Information revealed as needed
- **Accessibility** - Proper ARIA labels and keyboard navigation
- **Visual Hierarchy** - Clear information organization

## 🔧 Development Workflow

### Code Quality
- **TypeScript Strict Mode** - Full type safety
- **ESLint Configuration** - Consistent code style
- **Component Composition** - Reusable, maintainable components

### Responsive Design
- **Mobile-First Approach** - Works on all device sizes
- **Flexible Layouts** - CSS Grid and Flexbox
- **Touch-Friendly** - Optimized for mobile interactions

## 🚀 Deployment

This application is deployed on **Vercel** with automatic deployments from the main branch.

### Environment Setup
- **Node.js 18+** - Runtime environment
- **Vercel Platform** - Hosting and deployment
- **GitHub Integration** - Automatic deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

**Built with ❤️ using Next.js, TypeScript, Leaflet, and Open-Meteo API**

*Professional weather analytics platform for enterprise data visualization*

<img width="1890" height="847" alt="image" src="https://github.com/user-attachments/assets/6977d532-1818-49d7-92f5-bdcb6aebb8c0" />


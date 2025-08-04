# Weather Dashboard

A comprehensive React/Next.js TypeScript dashboard for visualizing weather data over interactive maps with polygon drawing and timeline controls.

## 🌟 Features

### ✅ All Requirements Implemented

- **📊 Timeline Slider**: 30-day window with hourly resolution
  - Single point selection mode
  - Dual-ended range selection mode
  - Quick time selection buttons (Now, Yesterday, Last Week)
  - Visual "Today" marker

- **🗺️ Interactive Map**: Leaflet-based with full functionality
  - Polygon drawing (3-12 points minimum/maximum)
  - Automatic polygon closure detection
  - Reset view control
  - Polygon persistence during map navigation

- **🎨 Polygon Drawing Tools**: Complete implementation
  - Visual feedback during drawing
  - Point-by-point drawing with visual markers
  - Automatic data source assignment
  - Real-time polygon management

- **📋 Data Source Selection**: Advanced sidebar controls
  - Multiple data sources (Temperature, Humidity, Wind Speed, Precipitation)
  - Color-coded visualization rules
  - Excel/Google Sheets style filtering interface
  - Dynamic rule management (add/remove color rules)

- **🌈 Color-coded Visualization**: Dynamic polygon coloring
  - Real-time color updates based on weather data
  - Threshold-based coloring rules
  - Support for all comparison operators (=, <, >, <=, >=)
  - Visual legend with color explanations

- **🌤️ Open-Meteo API Integration**: Full implementation
  - Real-time weather data fetching
  - Multiple weather parameters
  - Automatic data averaging for time ranges
  - Robust error handling with fallback data

- **⚡ Dynamic Updates**: Real-time responsiveness
  - Automatic polygon color updates on timeline changes
  - Efficient API calls with proper data handling
  - Live value display in sidebar

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: React Context API
- **Mapping**: Leaflet with full feature support
- **Weather API**: Open-Meteo Archive API (no key required)
- **Styling**: Tailwind CSS with custom slider styles

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone and install**:
\`\`\`bash
git clone <repository-url>
cd weather-dashboard
npm install
\`\`\`

2. **Run development server**:
\`\`\`bash
npm run dev
\`\`\`

3. **Open application**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 API Integration

### Open-Meteo Archive API

**Base URL**: `https://archive-api.open-meteo.com/v1/archive`

**No API Key Required** - Free service with generous limits

#### Parameters Used:
- `latitude` & `longitude`: Polygon center coordinates
- `start_date` & `end_date`: ISO date format (YYYY-MM-DD)
- `hourly`: Multiple weather parameters

#### Weather Parameters:
- `temperature_2m`: Temperature at 2 meters (°C)
- `relative_humidity_2m`: Relative humidity (%)
- `wind_speed_10m`: Wind speed at 10 meters (km/h)
- `precipitation`: Precipitation amount (mm)

#### Example API Call:
\`\`\`
https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&start_date=2025-07-18&end_date=2025-08-01&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation
\`\`\`

#### Response Format:
\`\`\`json
{
  "hourly": {
    "time": ["2025-07-18T00:00", "2025-07-18T01:00", ...],
    "temperature_2m": [15.2, 14.8, 14.5, ...],
    "relative_humidity_2m": [82, 84, 86, ...],
    "wind_speed_10m": [8.5, 7.2, 6.8, ...],
    "precipitation": [0.0, 0.1, 0.0, ...]
  }
}
\`\`\`

## 📖 Usage Guide

### 1. Timeline Control
- **Single Mode**: Click and drag to select specific hour
- **Range Mode**: Drag both ends to select time window
- **Quick Buttons**: Jump to Now, Yesterday, or Last Week
- **Visual Feedback**: Red line shows current time

### 2. Drawing Polygons
1. Select data source from dropdown
2. Click "Draw Polygon" button
3. Click 3-12 points on map
4. Close by clicking near first point or reaching 12 points
5. Polygon automatically fetches and displays weather data

### 3. Managing Data Sources
- **Expand/Collapse**: Click + button on data source cards
- **Add Rules**: Use color picker, operator dropdown, and value input
- **Remove Rules**: Click trash icon next to rules
- **Visual Preview**: See colors applied in real-time

### 4. Polygon Management
- **View All**: See all polygons in sidebar with current values
- **Delete**: Click trash icon to remove polygons
- **Real-time Updates**: Values update automatically with timeline changes

## 🏗️ Project Structure

\`\`\`
src/
├── app/
│   ├── page.tsx                 # Main dashboard
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles + slider CSS
├── components/
│   ├── app-sidebar.tsx         # Sidebar with all controls
│   ├── map-container.tsx       # Leaflet map + polygon drawing
│   ├── timeline-slider.tsx     # Timeline control component
│   └── ui/                     # shadcn/ui components
├── contexts/
│   └── dashboard-context.tsx   # Global state management
└── lib/
    └── utils.ts               # Utility functions
\`\`\`

## 🎯 Key Features Breakdown

### Timeline Slider Implementation
- **30-day Window**: 15 days before and after current date
- **Hourly Resolution**: 720 total hours available
- **Dual Mode Support**: Single point or range selection
- **Visual Indicators**: Current time marker and duration display

### Polygon Drawing System
- **Point Validation**: Minimum 3, maximum 12 points
- **Visual Feedback**: Red markers and dashed lines during drawing
- **Auto-completion**: Smart polygon closure detection
- **Data Integration**: Automatic weather data fetching on completion

### Weather Data Processing
- **Centroid Calculation**: Uses polygon center for weather queries
- **Data Averaging**: Averages values across selected time range
- **Color Application**: Real-time color updates based on rules
- **Error Handling**: Graceful fallback to mock data if API fails

### Color Rule Engine
- **Multiple Operators**: Support for =, <, >, <=, >= comparisons
- **Rule Priority**: Processes rules in value order
- **Dynamic Updates**: Real-time color changes
- **Visual Legend**: Clear color rule explanations

## 🔧 Customization

### Adding New Data Sources
\`\`\`typescript
{
  id: "pressure",
  name: "Atmospheric Pressure (hPa)",
  field: "surface_pressure",
  colorRules: [
    { id: "1", color: "#ef4444", operator: "<", value: 1000 },
    { id: "2", color: "#22c55e", operator: ">=", value: 1000 }
  ]
}
\`\`\`

### Modifying Map Settings
\`\`\`typescript
// In map-container.tsx
const newMap = L.map(mapRef.current).setView([YOUR_LAT, YOUR_LNG], ZOOM_LEVEL)
\`\`\`

### Custom Color Rules
- Use hex colors: `#ff0000`, `#00ff00`, etc.
- Operators: `=`, `<`, `>`, `<=`, `>=`
- Values: Any numeric threshold

## 🐛 Troubleshooting

### Common Issues

1. **Map Not Loading**
   - Check internet connection
   - Verify Leaflet CSS import
   - Clear browser cache

2. **API Errors**
   - Check network connectivity
   - Verify date ranges are valid
   - Monitor browser console for errors

3. **Polygon Drawing Issues**
   - Ensure "Draw Polygon" is active
   - Click precisely on map
   - Check minimum 3 points requirement

4. **Timeline Not Updating**
   - Verify slider movement
   - Check date calculations
   - Ensure proper time range format

### Performance Tips
- **API Optimization**: Data is cached during drawing session
- **Map Performance**: Polygons are efficiently managed
- **Memory Usage**: Old markers are properly cleaned up

## 🚀 Bonus Features Implemented

- ✅ **Multiple Data Sources**: 4 different weather parameters
- ✅ **Advanced Color Rules**: Excel-style filtering interface
- ✅ **Visual Legend**: Real-time color rule display
- ✅ **Quick Time Selection**: Preset time buttons
- ✅ **Robust Error Handling**: Graceful API failure handling
- ✅ **Visual Feedback**: Drawing mode indicators and progress
- ✅ **Responsive Design**: Works on different screen sizes

## 📈 Future Enhancements

- [ ] Polygon editing (drag vertices)
- [ ] Data export (CSV/JSON)
- [ ] Animation transitions
- [ ] Mobile touch optimization
- [ ] Offline data caching
- [ ] Custom polygon naming
- [ ] Historical data comparison

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Next.js, TypeScript, and Open-Meteo API**

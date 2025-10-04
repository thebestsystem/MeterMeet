# MeterMeet 💰⏱️

MeterMeet is a modern, real-time meeting cost tracker that transforms time into clear financial insights. Built as a responsive single-page web application, it helps teams understand the true cost of their meetings in real-time.

## ✨ Features

### 📊 Real-Time Cost Calculations
- **Total Estimated Cost**: Complete meeting cost based on inputs
- **Cost per Minute**: Precise per-minute breakdown
- **Cost per Second**: Real-time granular tracking
- **Overhead Support**: Configurable overhead percentage (facilities, benefits, etc.)

### ⏲️ Live Timer Mode
- **Start/Pause/Reset**: Full timer controls
- **Progressive Cost Accumulation**: Watch costs grow in real-time
- **Precision Tracking**: Updates every 100ms for smooth visualization
- **Keyboard Shortcuts**: Space/Enter for start/pause, Escape/R for reset

### 🚨 Smart Alert System
- **Customizable Threshold**: Set your own cost alert limit (default: $500)
- **Visual Notifications**: Animated slide-in alerts
- **Audio Notifications**: Optional sound alerts using Web Audio API
- **Auto-Hide**: Alerts automatically disappear after 10 seconds

### 🎨 Modern UI Design
- **Gradient Background**: Beautiful blue-purple gradient
- **Pill-Style Result Boxes**: Clean, modern result displays
- **Responsive Design**: Works perfectly on all device sizes
- **System Fonts**: Uses native system font stack for optimal performance
- **Accessibility**: Supports high contrast mode and reduced motion preferences

### 💾 Smart Features
- **Auto-Save Configuration**: Remembers your settings using localStorage
- **Input Validation**: Prevents invalid values and provides sensible defaults
- **Mobile-Friendly**: Touch-optimized for mobile and tablet use

## 🚀 Quick Start

1. **Open the App**: Navigate to the MeterMeet URL
2. **Configure Settings**:
   - Number of attendees (1-100)
   - Average hourly rate ($)
   - Expected meeting duration (minutes)
   - Overhead percentage (optional)
   - Alert threshold (optional, default $500)
3. **View Real-Time Calculations**: See costs update instantly
4. **Start Live Timer**: Click "Start" or press Space/Enter
5. **Monitor Progress**: Watch costs accumulate in real-time

## 📱 Responsive Design

MeterMeet adapts beautifully to all screen sizes:
- **Desktop**: Full-width layout with grid columns
- **Tablet**: Optimized column arrangements
- **Mobile**: Single-column layout with touch-friendly controls

## ⌨️ Keyboard Shortcuts

- **Space** or **Enter**: Start/Pause timer
- **Escape** or **R**: Reset timer

## 🔧 Technical Details

### Architecture
- **Pure Vanilla JavaScript**: No framework dependencies
- **Modern CSS**: Grid layout, CSS custom properties, animations
- **Web Standards**: Uses modern browser APIs responsibly
- **Progressive Enhancement**: Works without JavaScript for basic calculations

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Audio Support**: Web Audio API for alert sounds (graceful fallback if unavailable)

### Performance
- **Lightweight**: Total bundle size under 30KB
- **Fast Loading**: Optimized CSS and JavaScript
- **Smooth Animations**: 60fps animations using CSS transforms
- **Efficient Updates**: Optimized DOM manipulation

## 💡 Use Cases

### 👥 Team Meetings
- Track the cost of daily standups, planning sessions, and reviews
- Make data-driven decisions about meeting length and attendee count

### 💼 Client Consultations  
- Demonstrate value and transparency in billing
- Set appropriate meeting durations based on budget

### 🏢 Corporate Training
- Calculate training costs per participant
- Optimize workshop duration for cost effectiveness

### 📊 Meeting Optimization
- Identify expensive meetings that could be emails
- Right-size meeting attendee lists based on cost impact

## 🎯 Best Practices

1. **Set Realistic Rates**: Include benefits and overhead in hourly rates
2. **Use Overhead**: Account for facilities, equipment, and indirect costs
3. **Monitor Alerts**: Pay attention to threshold notifications
4. **Regular Reviews**: Use data to optimize meeting practices
5. **Share Results**: Make costs visible to promote awareness

## 🔒 Privacy & Security

- **No Data Collection**: All calculations happen locally in your browser
- **No Server Required**: Static files only, no backend dependencies
- **Local Storage Only**: Settings saved locally, never transmitted
- **No Analytics**: Zero tracking or data collection

## 📄 File Structure

```
/
├── index.html          # Main application HTML
├── styles.css          # Modern CSS with responsive design
├── script.js           # JavaScript application logic
└── README.md           # This documentation
```

## 🌟 Key Benefits

- **Transparency**: Make meeting costs visible and tangible
- **Efficiency**: Encourage shorter, more focused meetings  
- **Awareness**: Help teams understand the true cost of time
- **Optimization**: Data-driven meeting management
- **Simplicity**: Easy to use, no setup required

---

**MeterMeet makes every minute count—literally.** 

Transform your meeting culture with real-time cost awareness. Start tracking today and watch your team naturally become more efficient and focused.

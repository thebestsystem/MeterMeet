# MeterMeet Enhanced - Feature Testing Guide 🧪

## 🎯 How to Test All New Features

### 1. Theme System Testing
**Dark/Light Mode Toggle**
- Click the 🌙 button in the header to switch to light mode
- Click the ☀️ button to switch back to dark mode
- Change your system theme - the app should auto-detect and switch
- Refresh the page - your theme preference should persist

### 2. Multi-Currency Testing
**Currency Selection**
- Click the currency dropdown in the header
- Try different currencies: USD ($), EUR (€), QAR (ر.ق), TND (د.ت)
- Watch all cost displays update with proper formatting
- Verify the currency symbol updates in input labels

### 3. Rate Configuration Testing
**Average vs Individual Rates**
- Click "Individual Rates" button to switch modes
- Increase attendees to 8 - see individual rate inputs appear
- Set different rates for each attendee (e.g., 50, 75, 100, 125...)
- Switch back to "Average Rate" mode
- Compare total costs between modes

### 4. Meeting Presets Testing
**Quick Configuration**
- Press keyboard shortcut "1" for Daily Standup preset
- Press "2" for Sprint Planning preset
- Press "3" for All Hands preset
- Or click the preset buttons in the interface
- Watch all inputs update automatically

### 5. Enhanced Timer Testing
**Advanced Timer Features**
- Start the timer and watch for the pulsing animation
- Observe the progress bar filling up
- Let cost reach $100 - watch for pulse animation
- Continue to $250 and $500 milestones
- Check milestone indicators on progress bar
- Listen for audio feedback (if supported by browser)

### 6. Interactive Controls Testing
**Input Enhancements**
- Use +/- buttons next to attendees input
- Try the overhead range slider
- Drag to change percentage and watch number input sync
- Use keyboard shortcuts while timer is running

### 7. Data Export Testing
**Export Functionality**
- Configure a meeting with individual rates
- Start and run timer for a few seconds
- Press Ctrl+E (or Cmd+E on Mac) to export
- Check downloaded JSON file for complete data

### 8. Notification System Testing
**Toast Messages**
- Apply different presets - watch for success notifications
- Start/pause/reset timer - see status notifications
- Export data - confirm export notification
- Watch notifications auto-hide after 3 seconds

### 9. Accessibility Testing
**Keyboard Navigation**
- Tab through all controls in logical order
- Use Space/Enter to start/pause timer
- Use Escape/R to reset timer
- Press T to toggle theme
- Verify all interactive elements have focus indicators

### 10. Responsive Design Testing
**Mobile Experience**
- Resize browser to mobile width (< 768px)
- Verify header stacks vertically
- Check input grid becomes single column
- Test timer display adapts properly
- Confirm buttons stack vertically
- Try portrait/landscape orientations

## 🎮 Advanced Feature Combinations

### Test Scenario 1: International Team Meeting
1. Set currency to EUR
2. Switch to Individual Rates mode
3. Set 6 attendees with rates: 45, 55, 65, 75, 85, 95
4. Set duration to 90 minutes
5. Overhead to 30%
6. Start timer and reach €200 milestone
7. Export data to see comprehensive report

### Test Scenario 2: Executive Session
1. Apply "All Hands" preset (press 3)
2. Switch to dark mode
3. Change to Individual Rates
4. Set higher rates: 150, 200, 250, 300, 350 (first 5 attendees)
5. Watch rapid cost accumulation
6. Test alert system at $3000 threshold

### Test Scenario 3: Quick Standup
1. Press 1 for Daily Standup preset
2. Use QAR currency
3. Start timer immediately
4. Test pause/resume functionality
5. Reset and try again with different overhead
6. Export data for comparison

## 🔍 Performance Testing Points

### Visual Performance
- Smooth animations at 60fps
- No layout shifts during theme switching
- Responsive hover effects on all buttons
- Crisp text rendering in both themes

### Audio Performance
- Milestone sound plays without lag
- Alert sounds are pleasant, not jarring
- Audio gracefully fails if not supported

### Data Persistence
- Theme preference survives page refresh
- Currency selection persists
- Rate mode preference is remembered
- Last configuration auto-loads appropriately

## 🐛 Known Limitations

1. **Audio Context**: Requires user gesture to enable audio in some browsers
2. **Service Worker**: Optional PWA features not implemented (404 errors are normal)
3. **Currency Rates**: Uses display formatting only, no real-time exchange rates
4. **Export Format**: JSON only (CSV/PDF could be added in future versions)

## 🎉 Success Criteria

✅ All theme switching works smoothly
✅ Currency formatting displays correctly for all supported currencies
✅ Individual rate calculations are mathematically accurate
✅ Presets apply all settings correctly
✅ Timer animations are smooth and engaging
✅ Milestone celebrations trigger at correct intervals
✅ Export contains comprehensive meeting data
✅ Keyboard shortcuts work reliably
✅ Mobile experience is fully functional
✅ Notifications provide helpful feedback

---

**Ready to test? Start with pressing "1" for a Daily Standup preset, then explore from there!** 🚀
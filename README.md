# MCC Question Bank App

A modern, mobile-friendly question bank application for MCC (Multi-Crew Coordination) exam preparation. Now available as a Progressive Web App (PWA) that can be installed on Android and iOS devices!

## Features

- 📝 Generate custom tests with a user-specified number of questions
- ✅ Real-time scoring and detailed results
- 📊 Test history tracking (stored in localStorage)
- 🎯 Frequently missed questions tracking
- ⏱️ Timer for each test
- 📱 Fully responsive and mobile-friendly design
- 🎨 Modern, sleek UI with smooth animations
- 📲 **PWA Support** - Install on Android and iOS devices
- 🔄 **Offline Support** - Works without internet connection

## Setup

### For Local Development

1. Serve the app over HTTPS (required for PWA):
   - Use a local server like `python -m http.server` or `npx serve`
   - Or use a tool like `npx http-server` with SSL

### For Production Deployment

1. Deploy to GitHub Pages or any HTTPS hosting:
   - Create a new repository
   - Upload all files (index.html, styles.css, app.js, questions.json, manifest.json, sw.js, icons/)
   - Go to Settings > Pages
   - Select the main branch as source
   - Your app will be live at `https://yourusername.github.io/repository-name/`

### Installing as PWA

**On Android (Chrome/Edge):**
1. Open the app in Chrome or Edge browser
2. Tap the menu (three dots) → "Add to Home screen" or "Install app"
3. The app will be installed and appear on your home screen

**On iOS (Safari):**
1. Open the app in Safari browser
2. Tap the Share button (square with arrow)
3. Select "Add to Home Screen"
4. The app will be installed and appear on your home screen

## Usage

1. Enter the number of questions you want in your test
2. Click "Start Test"
3. Answer each question by clicking on your choice
4. Navigate between questions using Previous/Next buttons
5. Click "Submit Test" when finished
6. Review your results and see which questions you got wrong
7. Check your test history and frequently missed questions on the home screen

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - All styling and responsive design
- `app.js` - Application logic and functionality
- `questions.json` - Question bank data
- `manifest.json` - PWA manifest file
- `sw.js` - Service worker for offline functionality
- `icons/` - PWA icons directory

## Adding Questions

Edit `questions.json` to add more questions. Each question should follow this format:

```json
{
  "questionId": 1,
  "question": "Your question here?",
  "answers": {
    "a": "Answer option A",
    "b": "Answer option B",
    "c": "Answer option C",
    "d": "Answer option D"
  },
  "correctAnswer": "b"
}
```

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- localStorage API
- Fetch API
- CSS Grid and Flexbox


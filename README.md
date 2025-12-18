# ATPL Question Bank App

A modern, mobile-friendly question bank application for ATPL (Airline Transport Pilot License) exam preparation.

## Features

- 📝 Generate custom tests with a user-specified number of questions
- ✅ Real-time scoring and detailed results
- 📊 Test history tracking (stored in localStorage)
- 🎯 Frequently missed questions tracking
- ⏱️ Timer for each test
- 📱 Fully responsive and mobile-friendly design
- 🎨 Modern, sleek UI with smooth animations

## Setup

1. Simply open `index.html` in a web browser, or
2. Deploy to GitHub Pages:
   - Create a new repository
   - Upload all files (index.html, styles.css, app.js, questions.json)
   - Go to Settings > Pages
   - Select the main branch as source
   - Your app will be live at `https://yourusername.github.io/repository-name/`

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


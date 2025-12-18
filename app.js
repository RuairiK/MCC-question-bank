// State management
let allQuestions = [];
let currentTest = [];
let userAnswers = {};
let currentQuestionIndex = 0;
let testStartTime = null;
let timerInterval = null;

// DOM elements
const homeScreen = document.getElementById('homeScreen');
const testScreen = document.getElementById('testScreen');
const resultsScreen = document.getElementById('resultsScreen');
const questionCountInput = document.getElementById('questionCount');
const startTestBtn = document.getElementById('startTestBtn');
const questionText = document.getElementById('questionText');
const answersContainer = document.getElementById('answersContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitTestBtn = document.getElementById('submitTestBtn');
const currentQuestionNum = document.getElementById('currentQuestionNum');
const totalQuestions = document.getElementById('totalQuestions');
const progressFill = document.getElementById('progressFill');
const timer = document.getElementById('timer');
const testHistory = document.getElementById('testHistory');
const frequentlyMissed = document.getElementById('frequentlyMissed');
const scorePercentage = document.getElementById('scorePercentage');
const scoreNumber = document.getElementById('scoreNumber');
const totalScore = document.getElementById('totalScore');
const wrongAnswersList = document.getElementById('wrongAnswersList');
const newTestBtn = document.getElementById('newTestBtn');
const reviewMissedBtn = document.getElementById('reviewMissedBtn');
const maxQuestions = document.getElementById('maxQuestions');

// Initialize app
async function init() {
    await loadQuestions();
    updateMaxQuestions();
    loadTestHistory();
    loadFrequentlyMissed();
    setupEventListeners();
}

// Questions data (embedded as fallback - placeholder only)
// Primary source is questions.json file
const questionsData = [
  {
    "questionId": 0,
    "question": "[PLACEHOLDER] This is a sample question. Please ensure questions.json is available.",
    "answers": {
      "a": "Placeholder option A",
      "b": "Placeholder option B",
      "c": "Placeholder option C",
      "d": "Placeholder option D"
    },
    "correctAnswer": "a"
  }
];

// Load questions - tries to fetch from JSON file first (works on GitHub Pages),
// falls back to embedded data if fetch fails (works when opening file directly)
async function loadQuestions() {
    try {
        // Try to fetch from questions.json first (works when served via HTTP/HTTPS)
        const response = await fetch('questions.json');
        if (response.ok) {
            allQuestions = await response.json();
        } else {
            throw new Error('Failed to fetch questions.json');
        }
    } catch (error) {
        // Fallback to embedded questions (works when opening file directly)
        console.log('Using embedded questions data (questions.json not available)');
        allQuestions = questionsData;
    }
    
    // Filter out questions with unknown answers (null or undefined)
    allQuestions = allQuestions.filter(question => {
        return question.correctAnswer !== null && question.correctAnswer !== undefined;
    });
    
    questionCountInput.max = allQuestions.length;
    updateMaxQuestions();
}

function updateMaxQuestions() {
    maxQuestions.textContent = `(Max: ${allQuestions.length} questions available)`;
}

// Setup event listeners
function setupEventListeners() {
    startTestBtn.addEventListener('click', startTest);
    prevBtn.addEventListener('click', goToPreviousQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);
    submitTestBtn.addEventListener('click', submitTest);
    newTestBtn.addEventListener('click', () => showScreen('home'));
    reviewMissedBtn.addEventListener('click', reviewMissedQuestions);
}

// Start a new test
function startTest() {
    const questionCount = parseInt(questionCountInput.value);
    
    if (questionCount < 1 || questionCount > allQuestions.length) {
        alert(`Please enter a number between 1 and ${allQuestions.length}`);
        return;
    }

    // Generate random test
    currentTest = generateRandomTest(questionCount);
    userAnswers = {};
    currentQuestionIndex = 0;
    testStartTime = Date.now();
    
    // Start timer
    startTimer();
    
    // Show test screen
    showScreen('test');
    displayQuestion();
    updateTestControls();
}

// Generate random test questions
function generateRandomTest(count) {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Display current question
function displayQuestion() {
    const question = currentTest[currentQuestionIndex];
    questionText.textContent = question.question;
    
    // Update question number and progress
    currentQuestionNum.textContent = currentQuestionIndex + 1;
    totalQuestions.textContent = currentTest.length;
    const progress = ((currentQuestionIndex + 1) / currentTest.length) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Clear and populate answers
    answersContainer.innerHTML = '';
    const answers = question.answers;
    
    for (const [key, value] of Object.entries(answers)) {
        const answerOption = document.createElement('div');
        answerOption.className = 'answer-option';
        if (userAnswers[question.questionId] === key) {
            answerOption.classList.add('selected');
        }
        
        answerOption.innerHTML = `
            <span class="answer-label">${key.toUpperCase()}</span>
            <span class="answer-text">${value}</span>
        `;
        
        answerOption.addEventListener('click', () => selectAnswer(question.questionId, key));
        answersContainer.appendChild(answerOption);
    }
}

// Select an answer
function selectAnswer(questionId, answer) {
    userAnswers[questionId] = answer;
    displayQuestion(); // Refresh to show selection
    updateTestControls();
}

// Update test navigation controls
function updateTestControls() {
    prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === currentTest.length - 1) {
        nextBtn.style.display = 'none';
        submitTestBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitTestBtn.style.display = 'none';
    }
}

// Navigate to previous question
function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        updateTestControls();
    }
}

// Navigate to next question
function goToNextQuestion() {
    if (currentQuestionIndex < currentTest.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        updateTestControls();
    }
}

// Start timer
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - testStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// Stop timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Submit test and show results
function submitTest() {
    stopTimer();
    
    const results = calculateResults();
    saveTestHistory(results);
    updateFrequentlyMissed(results.wrongQuestions);
    displayResults(results);
    showScreen('results');
}

// Calculate test results
function calculateResults() {
    let correct = 0;
    const wrongQuestions = [];
    
    currentTest.forEach(question => {
        const userAnswer = userAnswers[question.questionId];
        const correctAnswer = question.correctAnswer;
        
        if (userAnswer === correctAnswer) {
            correct++;
        } else {
            wrongQuestions.push({
                question: question,
                userAnswer: userAnswer || 'Not answered',
                correctAnswer: correctAnswer
            });
        }
    });
    
    const total = currentTest.length;
    const percentage = Math.round((correct / total) * 100);
    const timeElapsed = Math.floor((Date.now() - testStartTime) / 1000);
    
    return {
        score: correct,
        total: total,
        percentage: percentage,
        wrongQuestions: wrongQuestions,
        timeElapsed: timeElapsed,
        date: new Date().toISOString()
    };
}

// Display results
function displayResults(results) {
    scorePercentage.textContent = `${results.percentage}%`;
    scoreNumber.textContent = results.score;
    totalScore.textContent = results.total;
    
    // Display wrong answers
    wrongAnswersList.innerHTML = '';
    
    if (results.wrongQuestions.length === 0) {
        wrongAnswersList.innerHTML = '<p class="empty-state">Perfect! You got all questions correct! 🎉</p>';
    } else {
        results.wrongQuestions.forEach(item => {
            const wrongItem = document.createElement('div');
            wrongItem.className = 'wrong-answer-item';
            
            const answers = item.question.answers;
            const answerOptions = Object.entries(answers).map(([key, value]) => {
                let className = 'wrong-answer-option';
                if (key === item.userAnswer) {
                    className += ' user-answer';
                }
                if (key === item.correctAnswer) {
                    className += ' correct-answer';
                }
                
                return `<div class="${className}">
                    <strong>${key.toUpperCase()}:</strong> ${value}
                    ${key === item.userAnswer ? ' (Your answer)' : ''}
                    ${key === item.correctAnswer ? ' (Correct)' : ''}
                </div>`;
            }).join('');
            
            wrongItem.innerHTML = `
                <h4>${item.question.question}</h4>
                <div class="wrong-answer-options">
                    ${answerOptions}
                </div>
            `;
            
            wrongAnswersList.appendChild(wrongItem);
        });
    }
}

// Save test history to localStorage
function saveTestHistory(results) {
    let history = JSON.parse(localStorage.getItem('testHistory') || '[]');
    history.unshift({
        date: results.date,
        score: results.score,
        total: results.total,
        percentage: results.percentage,
        timeElapsed: results.timeElapsed
    });
    
    // Keep only last 50 tests
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    
    localStorage.setItem('testHistory', JSON.stringify(history));
    loadTestHistory();
}

// Load and display test history
function loadTestHistory() {
    const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
    
    if (history.length === 0) {
        testHistory.innerHTML = '<p class="empty-state">No tests taken yet</p>';
        return;
    }
    
    testHistory.innerHTML = '';
    history.forEach((test, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date(test.date);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const timeStr = formatTime(test.timeElapsed);
        
        historyItem.innerHTML = `
            <div>
                <div><strong>${dateStr}</strong></div>
                <div style="font-size: 0.875rem; color: var(--text-secondary);">Time: ${timeStr}</div>
            </div>
            <div class="history-score">${test.percentage}% (${test.score}/${test.total})</div>
        `;
        
        testHistory.appendChild(historyItem);
    });
}

// Update frequently missed questions
function updateFrequentlyMissed(wrongQuestions) {
    let missedCounts = JSON.parse(localStorage.getItem('frequentlyMissed') || '{}');
    
    wrongQuestions.forEach(item => {
        const questionId = item.question.questionId;
        missedCounts[questionId] = (missedCounts[questionId] || 0) + 1;
    });
    
    localStorage.setItem('frequentlyMissed', JSON.stringify(missedCounts));
    loadFrequentlyMissed();
}

// Load and display frequently missed questions
function loadFrequentlyMissed() {
    const missedCounts = JSON.parse(localStorage.getItem('frequentlyMissed') || '{}');
    const sorted = Object.entries(missedCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10
    
    if (sorted.length === 0) {
        frequentlyMissed.innerHTML = '<p class="empty-state">No frequently missed questions yet</p>';
        return;
    }
    
    frequentlyMissed.innerHTML = '';
    sorted.forEach(([questionId, count]) => {
        const question = allQuestions.find(q => q.questionId === parseInt(questionId));
        if (question) {
            const missedItem = document.createElement('div');
            missedItem.className = 'history-item';
            missedItem.innerHTML = `
                <div>
                    <div><strong>${question.question}</strong></div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">Missed ${count} time${count > 1 ? 's' : ''}</div>
                </div>
            `;
            frequentlyMissed.appendChild(missedItem);
        }
    });
}

// Review missed questions
function reviewMissedQuestions() {
    const missedCounts = JSON.parse(localStorage.getItem('frequentlyMissed') || '{}');
    const sorted = Object.entries(missedCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    if (sorted.length === 0) {
        alert('No frequently missed questions to review.');
        return;
    }
    
    const missedQuestionIds = sorted.map(([id]) => parseInt(id));
    currentTest = allQuestions.filter(q => missedQuestionIds.includes(q.questionId));
    
    if (currentTest.length === 0) {
        alert('No questions found.');
        return;
    }
    
    userAnswers = {};
    currentQuestionIndex = 0;
    testStartTime = Date.now();
    
    startTimer();
    showScreen('test');
    displayQuestion();
    updateTestControls();
}

// Show specific screen
function showScreen(screen) {
    homeScreen.classList.remove('active');
    testScreen.classList.remove('active');
    resultsScreen.classList.remove('active');
    
    if (screen === 'home') {
        homeScreen.classList.add('active');
        loadTestHistory();
        loadFrequentlyMissed();
    } else if (screen === 'test') {
        testScreen.classList.add('active');
    } else if (screen === 'results') {
        resultsScreen.classList.add('active');
    }
}

// Format time in seconds to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);


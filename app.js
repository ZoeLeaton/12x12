// create variable to hold the state of the game
let mistakes = 0
let currentQuestion = 0
let timeLeft = 120; // now 2 minutes
let timerInterval; // For storing the timer interval
let timerStarted = false; // Track if timer has been started

// this section of code adds all answers from the 10 times table to the answers array. This includes repeated values.
let answers = []
for (let i = 1; i <= 12; i++) { //changed 10 to 12//
    for (let j = 1; j <= 12; j++) { //changed to 12//
        answers.push(i*j)
    }
}

// this code randomises the order of the answers array
answers = answers.sort(() => Math.random() - 0.5)

// Sound handling
let soundEnabled = true;

// Create audio elements for correct and incorrect sounds
const correctSound = new Audio("Correct Sound.mp3");
const incorrectSound = new Audio("Incorrect Sound.mp3");

function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById("sound-toggle").textContent = soundEnabled ? "Sound On" : "Sound Off";
}

// Timer functions
function startTimer() {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Set up the interval to count down every second
    timerInterval = setInterval(function() {
        timeLeft--;
        updateTimerDisplay();
        
        // Check if time is up
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById("timer").textContent = formattedTime;
}

function endGame() {
    // Disable all buttons
    for (let i = 1; i <= 144; i++) { //changed from 100 to 144 (12 x 12)//
        const button = document.getElementById(i);
        if (button) {
            button.disabled = true;
        }
    }
    
    // Show game over message
    alert(`Time's up! You found ${currentQuestion} numbers with ${mistakes} mistakes.`);
}

function resetGame() {
    // Reset game variables
    mistakes = 0;
    currentQuestion = 0;
    timeLeft = 120;
    timerStarted = false;
    
    // Stop current timer if running
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Randomize answers again
    answers = answers.sort(() => Math.random() - 0.5);
    
    // Reset the display
    showMistakes();
    showQuestion();
    updateTimerDisplay(); // Reset timer display 
    
    // Enable all buttons
    for (let i = 1; i <= 144; i++) { //now 144 buttons//
        const button = document.getElementById(i);
        if (button) {
            button.disabled = false;
            button.textContent = "?";
        }
    }
}

function showMistakes() {
    // insert the value of mistakes into the HTML element with id="mistakes"
    document.getElementById("mistakes").textContent = mistakes;
}

function showQuestion() {
    // insert the value of answers[currentQuestion] into the HTML element with id="num"
    document.getElementById("num").textContent = answers[currentQuestion];
}

function checkAnswer(i) { 
    // Start the timer on first click if not already started
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    // these three lines use the id of the button, i, to work out 
    // which row and column the button was
    let I = i - 1;
    let row = (I % 12) + 1; //10 to 12//
    let col = (Math.floor(I / 12)) + 1; //10 to 12//

    let question = answers[currentQuestion];
    
    if(row * col == question) {
        const button = document.getElementById(i);
        button.textContent = row * col;
        button.disabled = true; // Disable the button after correct answer
        
        // Play correct sound if enabled
        if (soundEnabled) {
            correctSound.play();
        }
        
        currentQuestion++;
        showQuestion();
    } else {
        mistakes++;
        showMistakes();
        
        // Play incorrect sound if enabled
        if (soundEnabled) {
            incorrectSound.play();
        }
    }
}

function addEventListeners() {
    // add event listeners for all the grid buttons so they call the checkAnswer function
    for (let i = 1; i <= 144; i++) { //144 buttons//
        const button = document.getElementById(i);
        if (button) {
            button.addEventListener("click", function() {
                checkAnswer(i);
            });
        }
    }
    
    // Add event listener for sound toggle button
    document.getElementById("sound-toggle").addEventListener("click", toggleSound);
    
    // Add event listener for reset game button if it exists
    if (document.getElementById("reset-game")) {
        document.getElementById("reset-game").addEventListener("click", resetGame);
    }
}

// run addEventListener Function
addEventListeners();

// run showQuestion Function
showQuestion();

// Show the timer display without starting it
updateTimerDisplay();
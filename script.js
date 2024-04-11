// Global variables
const app = document.querySelector('.app');
const quizMaker = document.getElementById('quiz-maker');
const questionsContainer = document.getElementById('questions-container');
const addQuestionBtn = document.getElementById('add-question');
const addOptionsBtn = document.getElementById('add-options');
const addCorrectAnswerBtn = document.getElementById('add-correct-answer');
const setQuizBtn = document.getElementById('set-quiz');
const showQuizBtn = document.getElementById('show-quiz');
const seeQuizBtn = document.getElementById('see-quiz');
const playAgainBtn = document.getElementById('play-again');
const quizDisplay = document.getElementById('quiz');
const scoreDisplay = document.getElementById('score'); // Reference to the score div
const QUESTIONS = 'QUESTIONS';
let userQuestions = [];

// Function to add a new question input field
function addQuestionInput() {
 const addQuestionDiv = questionsContainer.querySelector('.questionName');

    if (addQuestionDiv === null) {
        const questionInput = document.createElement('input');
        questionInput.setAttribute('type', 'text');
        questionInput.setAttribute('placeholder', 'Enter your question');
        questionInput.classList.add('questionName');
        questionsContainer.appendChild(questionInput);
    } else {
        alert("Question box already exists")
    }
    
}

// Function to add answer input fields for incorrect answers
function questionOptions() {
        const questionOptions = document.createElement('input');
        questionOptions.setAttribute('type', 'text');
        questionOptions.setAttribute('placeholder', 'Enter answer');
        questionOptions.classList.add('questionOption');
        questionsContainer.appendChild(questionOptions);
}

// Function to add answer input field for the correct answer
function questionAnswer() {
    const questionAnswerDiv = questionsContainer.querySelector('.questionAnswer');

    if (questionAnswerDiv === null) {
        const answerInput = document.createElement('input');
        answerInput.setAttribute('type', 'text');
        answerInput.setAttribute('placeholder', 'Enter correct answer');
        answerInput.classList.add('questionAnswer');
        questionsContainer.appendChild(answerInput);
    } else {
        alert("Answer box already exists");
    }
}

// Event listener for adding a new question
addQuestionBtn.addEventListener('click', addQuestionInput);

// Event listener for adding answer options
addOptionsBtn.addEventListener('click', questionOptions);

// Event listener for adding a correct answer
addCorrectAnswerBtn.addEventListener('click', questionAnswer);

// Function to set user questions in local storage
function setUserQuestionsInLocalStorage(questions) {
    localStorage.setItem(QUESTIONS, JSON.stringify(questions));
}

// Function to get user questions from local storage
function getUserQuestionsFromLocalStorage() {
    const storedQuestions = localStorage.getItem(QUESTIONS);
    return storedQuestions ? JSON.parse(storedQuestions) : [];
}


// Event listener for setting the quiz
setQuizBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Gather user input and construct questions array
    const questionNameInputValue = questionsContainer.querySelector('.questionName').value;
    const questionAnswerInputValue = questionsContainer.querySelector('.questionAnswer').value;
    const questionOptions = questionsContainer.querySelectorAll('.questionOption');
    const options = Array.from(questionOptions).map((questionOption) => questionOption.value)

    const questionObject = {
        questionName: questionNameInputValue,
        id: Math.floor(Date.now() / 1000),
        options,
        questionAnswer: questionAnswerInputValue,
        chosenAnswer: questionOptions.value
    }

    userQuestions.push(questionObject); // Push questionObject into userQuestions

     setUserQuestionsInLocalStorage(userQuestions); // Store updated userQuestions in local storage

    // Clear the input fields for next question
    questionsContainer.innerHTML = '';

    // Continue adding questions until user is ready to submit
    addQuestionInput(); // Add input field for next question
});

// Event listener for showing the quiz with questions and options only
showQuizBtn.addEventListener('click', () => {
    userQuestions = getUserQuestionsFromLocalStorage(); // Retrieve userQuestions from local storage
    displayQuiz(false); // Pass false to indicate not showing correct answers
    seeQuizBtn.style.display = 'none'; // Hide the "See Quiz" button after showing the quiz
});

// Event listener for showing the quiz with questions, options, and correct answers
seeQuizBtn.addEventListener('click', () => {
   
    displayQuiz(true); // Pass true to indicate showing correct answers
    // Add a submit button
       seeQuizBtn.style.display = "none"

      const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.style.display = 'none';
    }


});

// Event listener for resetting the quiz in local storage and displaying the Quiz Maker
playAgainBtn.addEventListener('click', () => {
    //Remove the User's stored questions from local storage
    localStorage.removeItem(QUESTIONS);

    // Reset the Quiz Display
    quizDisplay.style.display = "none";
    quizMaker.style.display = "block";
    scoreDisplay.innerHTML = '';

    // Clear the User Questions Array
    userQuestions = [];

    // Show the See Quiz Button again
    seeQuizBtn.style.display = "block";

})


// Function to display the quiz
function displayQuiz(showCorrectAnswers) {
    // Hide the quiz maker
    quizMaker.style.display = 'none';

    // Show the quiz display area
    quizDisplay.style.display = 'block';

    // Clear previous quiz content
    quizDisplay.innerHTML = '';

    // Retrieve questions from local storage
    const storedQuestions = userQuestions;

    // Display each question
    storedQuestions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `<p>${index + 1}. ${question.questionName}</p>`;
        quizDisplay.appendChild(questionElement);

        // Display options
        question.options.forEach(option => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.setAttribute('type', 'radio');
            input.setAttribute('name', `answer-${index}`);
            input.setAttribute('value', option);
            label.appendChild(input);
            label.appendChild(document.createTextNode(option));
            quizDisplay.appendChild(label);
            quizDisplay.appendChild(document.createElement('br'));
        });

        // If showCorrectAnswers is true, display correct answer
        if (showCorrectAnswers) {
            const correctAnswerLabel = document.createElement('label');
            correctAnswerLabel.textContent = `Correct answer: ${question.questionAnswer}`;
            quizDisplay.appendChild(correctAnswerLabel);
        }

        // Add a line break
        quizDisplay.appendChild(document.createElement('br'));
    });

    // Add a submit button if the quiz is being taken
    if (!showCorrectAnswers) {
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.addEventListener('click', submitQuiz); // Add event listener to submit the quiz
        quizDisplay.appendChild(submitButton);
    }
}

// Function to handle quiz submission
function submitQuiz() {
    // Retrieve questions from local storage
    const storedQuestions = userQuestions;

    let score = 0;

    // Loop through each question to check the selected answer
    storedQuestions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name='answer-${index}']:checked`);
        if (selectedOption) {
            // Compare the selected option value with the correct answer
            if (selectedOption.value === question.questionAnswer) {
                score++; // Increase score if the answer is correct
            }
        }
    });

    // Display the score in the "score" div
    scoreDisplay.innerHTML = `Well Done!!! You scored ${score} out of ${storedQuestions.length}`;

    scoreDisplay.appendChild(seeQuizBtn);
    scoreDisplay.appendChild(playAgainBtn);
    
    // Hide the "Submit" button
     this.style.display = 'none'

       // Display the "See Quiz" button
    seeQuizBtn.style.display = 'block';

    // Display the "Play Again" button
    playAgainBtn.style.display = 'block';

}
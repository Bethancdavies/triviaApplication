/* Trivia Application 
Uses trivia.co.uk API to get questions and answers to trivia 
User is prompted for topic and provided questions on topic, 
trivia game is scored 
@author BDavies 
@Since 20220317 

TO DO: 
-loader for api calls (chain .then)
- refactor some of the duplicated code 
*/

function runTriviaApp() {
  //API variables
  let userSelections;
  let userSelectionsUnformatted;
  let url;
  const userSelectionsList = document.querySelectorAll("input[type='checkbox']");

  // question labels
  const text1Label = document.querySelector('#apiTriviaText1Label');
  const text2Label = document.querySelector('#apiTriviaText2Label');
  const select1Label = document.querySelector('#apiTriviaSelect1Label');
  const select2Label = document.querySelector('#apiTriviaSelect2Label');
  const radio1Label = document.querySelector('#apiTriviaRadio1Legend');
  const radio2Label = document.querySelector('#apiTriviaRadio2Legend');

  // array of labels
  const arrayOfLabels = [text1Label, text2Label, select1Label, select2Label, radio1Label, radio2Label];

  // option arrays (populated to include incorrect and correct answers for multiple choice inputs)
  const answers1 = document.querySelector('#apiTriviaSelect1').options;
  const answers2 = document.querySelector('#apiTriviaSelect2').options;
  const answers3 = document.querySelectorAll('input[name = apiTriviaRadio1]');
  const answers4 = document.querySelectorAll('input[name = apiTriviaRadio2]');

  // correct answers variables
  let correctAnswerText1;
  let correctAnswerText2;
  let correctAnswerSelect1;
  let correctAnswerSelect2;
  let correctAnswerRadio1;
  let correctAnswerRadio2;

  // array to hold correct answers
  let arrayOfAnswers;

  //user guesses variables
  let userapiTriviaText1;
  let userapiTriviaText2;
  let userapiTriviaSelect1;
  let userapiTriviaSelect2;
  let userapiTriviaRadio1;
  let userapiTriviaRadio2;

  // forms and results
  const form = document.querySelector('.needs-validation');
  const results = document.querySelector('#myResults');
  const answersDiv = document.querySelector('#answersDiv');
  const topicDiv = document.querySelector('#triviaTopicDiv');
  const trivaSectionDiv = document.querySelector('#apiTriviaSection');

  //error span
  const submitErrorSpan = document.querySelector('#submitError');
  const topicErrorSpan = document.querySelector('#topicErrorSpan');
  // submit, play again, and see answer buttons
  const seeAnswersButton = document.querySelector('#seeAnswers');
  const playAgainButton = document.querySelectorAll('.playAgain');
  const submitTopicsButton = document.querySelector('#submitTopics');

  //booleans
  let hasTriedToSubmit;
  let hasShown;

  //Event Listeners
  seeAnswersButton.addEventListener('click', seeAnswers);
  playAgainButton.forEach((button) => {
    button.addEventListener('click', playAgain);
  });
  form.addEventListener('submit', handleSubmit);
  document.body.addEventListener('change', validate);

  submitTopicsButton.addEventListener('click', getUserChoice);

  function showTriviaQuestions() {
    trivaSectionDiv.classList.remove('hidden');
  }

  const getQuestions = async () => {
    const triviaQuestionCall = await fetch(url);
    const triviaJson = await triviaQuestionCall.json().then(showTriviaQuestions());
    form.reset();
    // function that gets labels for questions and updates text content
    function getLabels() {
      for (let index = 0; index < triviaJson.length; index++) {
        arrayOfLabels[index].textContent = triviaJson[index].question;
      }
    }

    /* function that gets the incorrect and correct answers, 
     asigns to an array and updates the forms qustion selections  
     NOTE: no options given for text boxes, sometimes is not logical
      */
    getLabels();
    // passes in the question number and the answerlist to populate
    function getAnswers(questionNumber, answerList) {
      let answers = triviaJson[questionNumber].incorrectAnswers; //capture incorrect answers
      let correctAnswer = triviaJson[questionNumber].correctAnswer; //capture correct answer
      answers.push(correctAnswer); // add correct answer to incorrect answers array
      //shuffle answers - found at https://bost.ocks.org/mike/shuffle/
      function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }
      // shuffle array
      answers = shuffle(answers);
      // if is a select input add an empty string to the start of the array
      if (answerList === answers1 || answerList === answers2) {
        answers.unshift(' ');
      }

      for (let index = 0; index < answerList.length; index++) {
        // populate textContent
        if (answerList === answers1 || answerList === answers2) {
          answerList[index].textContent = answers[index];
        } else {
          // populate label
          answerList[index].labels[0].textContent = answers[index];
        }
        //  assign values to options
        answerList[index].value = answers[index];
      }
      return correctAnswer;
    }
    // call getAnswers and assign the return value of the correct answer to a variable

    correctAnswerText1 = triviaJson[0].correctAnswer;
    correctAnswerText2 = triviaJson[1].correctAnswer;
    correctAnswerSelect1 = getAnswers(2, answers1);
    correctAnswerSelect2 = getAnswers(3, answers2);
    correctAnswerRadio1 = getAnswers(4, answers3);
    correctAnswerRadio2 = getAnswers(5, answers4);
  };

  // function to get user choice for trivia, if none then do not call API and alert user
  function getUserChoice() {
    userSelections = '';
    userSelectionsUnformatted = '';
    userSelectionsList.forEach((option) => {
      if (option.checked) {
        userSelectionsUnformatted += option.value;
      }
    });
    // if there are selections, remove the last comma from string and update API url
    // hide the topics and error span if there is chosen, if not add error span back
    if (userSelectionsUnformatted !== '') {
      userSelections = userSelectionsUnformatted.slice(0, -1);
      url = `https://the-trivia-api.com/questions?categories=${userSelections}&limit=6`;
      getQuestions();
      topicErrorSpan.classList.add('hidden');
      topicDiv.classList.add('hidden');
    } else {
      topicErrorSpan.classList.remove('hidden');
    }
  }
  /* 
Function to validate the Form  
TO DO: refactor the checks, clean up query selectors
*/

  function validate() {
    // holds check variables for submit
    let check1 = validateTextOrSelect(document.querySelector('#apiTriviaText1'));
    let check2 = validateTextOrSelect(document.querySelector('#apiTriviaText2'));
    let check3 = validateTextOrSelect(document.querySelector('#apiTriviaSelect1'));
    let check4 = validateTextOrSelect(document.querySelector('#apiTriviaSelect2'));
    let check5 = validateRadio(document.querySelectorAll('input[name = apiTriviaRadio1]'), radio1Label);
    let check6 = validateRadio(document.querySelectorAll('input[name = apiTriviaRadio2]'), radio2Label);

    /* Function to validate text or select form elements */
    function validateTextOrSelect(element) {
      let partOneFormValid = false;

      if (element.value === '' || element.value === ' ') {
        if (hasTriedToSubmit) {
          element.parentElement.focus();
          element.parentElement.classList.add('error'); //add error message
        }
      } else {
        element.parentElement.classList.remove('error'); //remove error message
        partOneFormValid = true;
      }
      return partOneFormValid;
    }
    /* 
    Function to validate radio buttons, ensures atleast one button is clicked, if not add error
    */

    function validateRadio(element, legend) {
      let partTwoFormValid = false;
      for (let index = 0; index < element.length; index++) {
        if (element[index].checked == true) {
          legend.classList.remove('error');
          partTwoFormValid = true;
          return partTwoFormValid;
        } else if (hasTriedToSubmit) {
          legend.classList.add('error');
        }
      }
      return partTwoFormValid;
    }
    // if all checks return true - validate will return true and remove the error message
    if (check1 & check2 & check3 & check4 & check5 & check6) {
      submitErrorSpan.classList.add('hidden');
      return true;
    }
  }

  /* 
  function to handle the submit of the form, if validate is true - calculateScore(), else show error message
  */
  function handleSubmit(event) {
    hasTriedToSubmit = true;
    event.preventDefault();
    event.stopPropagation();
    if (validate()) {
      calculateScore();
    } else {
      submitErrorSpan.classList.remove('hidden');
    }
    /* Function to calculate the score of the trivia, **Called from validate**  
    gets the user input and compares to api correct answer, if correct +1 to score 
*/
    function calculateScore() {
      let score = 0; //score reset to 0
      let correctAnswers = 0;
      const totalQuestions = 6;
      // get value of .value questions
      userapiTriviaText1 = document.querySelector('#apiTriviaText1').value;
      userapiTriviaText2 = document.querySelector('#apiTriviaText2').value;
      userapiTriviaSelect1 = document.querySelector('#apiTriviaSelect1').value;
      userapiTriviaSelect2 = document.querySelector('#apiTriviaSelect2').value;
      //get value of radio buttons
      answers3.forEach((answer) => {
        if (answer.checked) {
          userapiTriviaRadio1 = answer.value;
        }
      });
      answers4.forEach((answer) => {
        if (answer.checked) {
          userapiTriviaRadio2 = answer.value;
        }
      });
      // check user answers vs actual answers
      checkAnswers(userapiTriviaText1, correctAnswerText1);
      checkAnswers(userapiTriviaText2, correctAnswerText2);
      checkAnswers(userapiTriviaSelect1, correctAnswerSelect1);
      checkAnswers(userapiTriviaSelect2, correctAnswerSelect2);
      checkAnswers(userapiTriviaRadio1, correctAnswerRadio1);
      checkAnswers(userapiTriviaRadio2, correctAnswerRadio2);
      /* 
      function that checks correct answer against userInput, if correct +1 to score
      */
      function checkAnswers(userInput, correctAnswer) {
        if (userInput.toLowerCase() === correctAnswer.toLowerCase()) {
          correctAnswers += 1;
        }
      }
      // score is given as a percentage to 2 decimal places
      score = ((correctAnswers / totalQuestions) * 100).toFixed(2);

      // showScore is called, passing in the score and the correct answers as params
      showScore(score, correctAnswers);
    }
  }
  /* 
  function to show the score and the number of correct answers, turns color based on score percentage
  */

  function showScore(score, correctAnswers) {
    let correctAnswerSpan = document.querySelector('#numberOfCorrectAnswers');
    correctAnswerSpan.textContent = correctAnswers;
    let scoreSpan = document.querySelector('#scorePercentage');
    scoreSpan.textContent = score;
    scoreSpan.parentElement.classList.remove('red', 'yellow', 'green');
    if (score <= 50) {
      scoreSpan.parentElement.classList.add('red');
    } else if (score > 50 && score < 80) {
      scoreSpan.parentElement.classList.add('yellow');
    } else {
      scoreSpan.parentElement.classList.add('green');
    }
    //  hide the form and show the results
    results.classList.remove('hidden');
    trivaSectionDiv.classList.add('hidden');
  }
  /* function that shows user the answer to questions, using array of questions and array of answers */
  function seeAnswers() {
    hasShown = true;
    // create array of answers
    arrayOfAnswers = [correctAnswerText1, correctAnswerText2, correctAnswerSelect1, correctAnswerSelect2, correctAnswerRadio1, correctAnswerRadio2];
    // output to populate div
    let output = `<div id = "populatedText">`;
    for (let index = 0; index < arrayOfLabels.length; index++) {
      output += `<p class="question">Question ${index + 1}: ${arrayOfLabels[index].innerHTML}</p> 
      <p class="answer">Answer: ${arrayOfAnswers[index]} </p> `;
    }
    output += `</div>`;
    // update div content
    answersDiv.insertAdjacentHTML('afterbegin', output);
    // hide results and show answers
    results.classList.add('hidden');
    answersDiv.classList.remove('hidden');
    output = ''; // Clear String each time to avoid duplicates on replay
  }
  /* function to play game again, hides everything and provides user with topic box again */

  function playAgain(event) {
    hasTriedToSubmit = false; //update booleans each time - flags for error messages and clearing classes
    hasShown = false;
    event.preventDefault();
    if (hasShown) {
      let populatedText = document.querySelector('#populatedText');
      populatedText.parentNode.removeChild(populatedText);
    }
    // show the topics div and remove everything else on page meant to be hidden
    topicDiv.classList.remove('hidden');
    submitErrorSpan.classList.add('hidden');
    answersDiv.classList.add('hidden');
    results.classList.add('hidden');
    trivaSectionDiv.classList.add('hidden'); // this is to be changed
  }
}
runTriviaApp();

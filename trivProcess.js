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
    const triviaJson = await triviaQuestionCall.json().then(showTriviaQuestions()); //extract JSON from the http response
    // gets labels for questions and updates text content
    function getLabels() {
      for (let index = 0; index < triviaJson.length; index++) {
        arrayOfLabels[index].textContent = triviaJson[index].question;
      }
    }
    getLabels();
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
    // TO DO: could eventually store in array
    correctAnswerText1 = triviaJson[0].correctAnswer;
    correctAnswerText2 = triviaJson[1].correctAnswer;
    correctAnswerSelect1 = getAnswers(2, answers1);
    correctAnswerSelect2 = getAnswers(3, answers2);
    correctAnswerRadio1 = getAnswers(4, answers3);
    correctAnswerRadio2 = getAnswers(5, answers4);
  };
  function getUserChoice() {
    userSelections = '';
    userSelectionsUnformatted = '';
    userSelectionsList.forEach((option) => {
      if (option.checked) {
        userSelectionsUnformatted += option.value;
      }
    });
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

  function validate() {
    let check1 = validateTextOrSelect(document.querySelector('#apiTriviaText1'));
    let check2 = validateTextOrSelect(document.querySelector('#apiTriviaText2'));
    let check3 = validateTextOrSelect(document.querySelector('#apiTriviaSelect1'));
    let check4 = validateTextOrSelect(document.querySelector('#apiTriviaSelect2'));
    let check5 = validateRadio(document.querySelectorAll('input[name = apiTriviaRadio1]'), radio1Label);
    let check6 = validateRadio(document.querySelectorAll('input[name = apiTriviaRadio2]'), radio2Label);

    function validateTextOrSelect(element) {
      let partOneFormValid = false;

      if (element.value === '' || element.value === ' ') {
        if (hasTriedToSubmit) {
          element.parentElement.focus();
          element.parentElement.classList.add('error');
        }
      } else {
        element.parentElement.classList.remove('error');
        partOneFormValid = true;
      }
      return partOneFormValid;
    }

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

    if (check1 & check2 & check3 & check4 & check5 & check6) {
      submitErrorSpan.classList.add('hidden');
      return true;
    }
  }

  function handleSubmit(event) {
    hasTriedToSubmit = true;
    event.preventDefault;
    if (validate()) {
      console.log('valid');
      calculateScore();
    } else {
      submitErrorSpan.classList.remove('hidden');
      console.log('invalid');
    }
    event.preventDefault();
    event.stopPropagation();
    // get user entries on submit // validate these before assigning

    function calculateScore() {
      let score = 0;
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
      function checkAnswers(userInput, correctAnswer) {
        if (userInput.toLowerCase() === correctAnswer.toLowerCase()) {
          correctAnswers += 1;
        }
      }
      score = ((correctAnswers / totalQuestions) * 100).toFixed(2);

      showScore(score, correctAnswers);
    }
  }
  //  function to show the score and the number of correct answers, turns color based on score
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

  function seeAnswers() {
    hasShown = true;
    // create array of answers
    arrayOfAnswers = [correctAnswerText1, correctAnswerText2, correctAnswerSelect1, correctAnswerSelect2, correctAnswerRadio1, correctAnswerRadio2];
    let output = `<div id = "populatedText">`;
    for (let index = 0; index < arrayOfLabels.length; index++) {
      output += `<p class="question">Question ${index + 1}: ${arrayOfLabels[index].innerHTML}</p> 
      <p class="answer">Answer: ${arrayOfAnswers[index]} </p> `;
    }
    output += `</div>`;
    answersDiv.insertAdjacentHTML('afterbegin', output);
    results.classList.add('hidden');
    answersDiv.classList.remove('hidden');
    output = ''; // Clear String each time
  }

  function playAgain(event) {
    hasTriedToSubmit = false;
    hasShown = false;
    event.preventDefault();
    if (hasShown) {
      let populatedText = document.querySelector('#populatedText');
      populatedText.parentNode.removeChild(populatedText);
    }
    form.reset();
    //remove once submit topics button added
    topicDiv.classList.remove('hidden');
    submitErrorSpan.classList.add('hidden');
    answersDiv.classList.add('hidden');
    results.classList.add('hidden');
    trivaSectionDiv.classList.add('hidden'); // this is to be changed
  }
}
runTriviaApp();

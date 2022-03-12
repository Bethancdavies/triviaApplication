// Create a simple web page that contains a JavaScript form that will allow the user to answer 7 trivia questions.
// Your trivia game should contain:

//     2 text boxes
//     2 select dropdowns (4 options min)
//     2 multiple choice questions (using radio buttons, 4 options min)
//     1 choose-all-that-apply (checkboxes, 4 options min, one answer should be "None of the above"). No part-points for semi-correct answers.

function runTriviaApp() {
  //API constants
  const url = 'https://the-trivia-api.com/questions?categories=sport&leisure%2Cfilm&tv%2Cmusic&limit=4';
  const fetchObject = {
    method: 'GET',
    headers: {},
  };
  // question labels
  const select1Label = document.querySelector('#apiTriviaSelect1Label');
  const select2Label = document.querySelector('#apiTriviaSelect2Label');
  const radio1Label = document.querySelector('#apiTriviaRadio1Legend');
  const radio2Label = document.querySelector('#apiTriviaRadio2Legend');
  // array of labels
  const arrayOfLabels = [select1Label, select2Label, radio1Label, radio2Label];
  // answer arrays
  const answers1 = document.querySelector('#apiTriviaSelect1').options;
  const answers2 = document.querySelector('#apiTriviaSelect2').options;
  const answers3 = document.querySelectorAll('input[name = question3]');
  const answers4 = document.querySelectorAll('input[name = question4]');

  // API CALL
  const getQuestions = async () => {
    const triviaQuestionCall = await fetch(url);
    const triviaJson = await triviaQuestionCall.json(); //extract JSON from the http response
    // Use API for dropdowns and multiple choice- 4 questions returned from one call
    // gets labels for questions and updates text content
    function getLabels() {
      for (let index = 0; index < triviaJson.length; index++) {
        arrayOfLabels[index].textContent = triviaJson[index].question;
      }
    }
    getLabels(); // put in right place eventually
    function getAnswers(questionNumber, answerList) {
      let answers = triviaJson[questionNumber].incorrectAnswers; //capture incorrect answers
      let correctAnswer = triviaJson[questionNumber].correctAnswer; //capture correct answer
      answers.push(correctAnswer); // create array of all answers
      //shuffle answers list

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
    let correctAnswer1 = getAnswers(0, answers1);
    let correctAnswer2 = getAnswers(1, answers2);
    let correctAnswer3 = getAnswers(2, answers3);
    let correctAnswer4 = getAnswers(3, answers4);
  };
  getQuestions(); // put this in the right place?

  const form = document.querySelector('form');

  //handle submit of form  (see above for whats needed)
  function handleSubmit() {
    function validateTextBoxes1() {}
    function validateTextBoxes2() {}
  }

  // show score function
  function showScore() {}
}
runTriviaApp();

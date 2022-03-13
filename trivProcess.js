// Create a simple web page that contains a JavaScript form that will allow the user to answer 7 trivia questions.
// Your trivia game should contain:

//     2 text boxes
//     2 select dropdowns (4 options min)
//     2 multiple choice questions (using radio buttons, 4 options min)
//     1 choose-all-that-apply (checkboxes, 4 options min, one answer should be "None of the above"). No part-points for semi-correct answers.

function runTriviaApp() {
  //API constants
  const url = 'https://the-trivia-api.com/questions?categories=music&limit=6';

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
  // correct answers constants
  let correctAnswerText1;
  let correctAnswerText2;
  let correctAnswerSelect1;
  let correctAnswerSelect2;
  let correctAnswerRadio1;
  let correctAnswerRadio2;

  // API CALL
  const getQuestions = async () => {
    const triviaQuestionCall = await fetch(url); //often gives CORS error, fix in future
    const triviaJson = await triviaQuestionCall.json(); //extract JSON from the http response
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
      answers.push(correctAnswer); // create array of all answers
      //shuffle answers list TO DO
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
  getQuestions();

  const form = document.querySelector('form');
  form.addEventListener('submit', handleSubmit);

  function handleSubmit(event) {
    event.preventDefault();
    // get user entries on submit //

    let userapiTriviaText1 = document.querySelector('#apiTriviaText1').value;
    let userapiTriviaText2 = document.querySelector('#apiTriviaText2').value;

    answers3.forEach((answer) => {
      if (answer.checked) {
        console.log(answer.value);
      }
    });
  }
  function calculateScore() {}
  // show score function
  function showScore() {}
}
runTriviaApp();

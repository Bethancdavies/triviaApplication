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
  // To do - load only once api request is back
  // API CALL
  const getQuestions = async () => {
    const triviaQuestionCall = await fetch(url); //often gives CORS error, fix in future via server
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
  getQuestions();

  const form = document.querySelector('.needs-validation');
  form.addEventListener('submit', handleSubmit);
  document.body.addEventListener('change', validate);
  const results = document.querySelector('#myResults');

  let userapiTriviaText1 = document.querySelector('#apiTriviaText1').value;
  let userapiTriviaText2 = document.querySelector('#apiTriviaText2').value;
  let userapiTriviaSelect1 = document.querySelector('#apiTriviaSelect1').value;
  let userapiTriviaSelect2 = document.querySelector('#apiTriviaSelect2').value;
  let userapiTriviaRadio1;
  let userapiTriviaRadio2;

  window.addEventListener(
    'load',
    function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      let validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          'submit',
          function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          },
          false
        );
      });
    },
    false
  );

  function validate() {}

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

  function handleSubmit(event) {
    event.preventDefault();
    // get user entries on submit // validate these before assigning

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

    calculateScore();
    function calculateScore() {
      let score = 0;
      let correctAnswers = 0;
      const totalQuestions = 7;
      if (userapiTriviaSelect1 === correctAnswerSelect1) {
        console.log('correct');
      }
      showScore();
    }

    //only show if submits correctly
  }

  function showScore() {
    //run this function if all info is correct
    results.classList.remove('hidden');
  }
}
runTriviaApp();

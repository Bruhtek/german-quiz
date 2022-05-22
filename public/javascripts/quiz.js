let startButton = document.querySelector("#start-button");
startButton.value = "Loading...";
startButton.disabled = true;

startButton.addEventListener('click', (event) =>
{
	event.preventDefault();
	startQuiz();
});

async function fetchQuestions()
{
	let response = await fetch("/quiz/questions");
	let data = await response.json();
	console.log(data);
	return data;
}

let questions = fetchQuestions();

questions.then((data) =>
{
	questions = data;
	startButton.value = "Start";
	startButton.disabled = false;
});

let questionScreen = document.querySelector('.question-screen');
let startScreen = document.querySelector('.start-screen');
let finishScreen = document.querySelector('.finish-screen');
let nameInput = document.querySelector('#name-input');

let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;

let quizTimer = document.querySelector('.header .time p');

let start = Date.now();
let maxTime = 1200;

function startQuiz()
{
	if (!nameInput.value) return;

	questionScreen.classList.remove('hidden');
	startScreen.classList.add('hidden');

	start = Date.now();
	setInterval(() =>
	{
		let delta = Date.now() - start;
		let seconds = Math.floor(delta / 1000);
		let timeLeft = maxTime - seconds;
		if (timeLeft < 0)
		{
			endQuiz();
		} else
		{
			quizTimer.innerHTML = Math.floor(timeLeft / 60) + ":" + ((timeLeft % 60).toString().length == 1 ? "0" + (timeLeft % 60) : (timeLeft % 60));
		}

	}, 200);

	displayQuestion(currentQuestionIndex);
}

let questionTitle = document.querySelector('.question-container .title p');
let abcdAnswers = [];
abcdAnswers.push(document.querySelector('.question-container .answer .ansA'));
abcdAnswers.push(document.querySelector('.question-container .answer .ansB'));
abcdAnswers.push(document.querySelector('.question-container .answer .ansC'));
abcdAnswers.push(document.querySelector('.question-container .answer .ansD'));
let questionAnswerAbcd = document.querySelector('.question-container .answer .abcd');
let questionAnswerWrite = document.querySelector('.question-container .answer .write');
let writeSubmitBtn = document.querySelector('.question-container .answer .write .write-submit-btn');
let writeInput = document.querySelector('.question-container .answer .write input');

abcdAnswers[0].addEventListener('click', (event) => { selectAnswer(0); });
abcdAnswers[1].addEventListener('click', (event) => { selectAnswer(1); });
abcdAnswers[2].addEventListener('click', (event) => { selectAnswer(2); });
abcdAnswers[3].addEventListener('click', (event) => { selectAnswer(3); });

writeSubmitBtn.addEventListener('click', (event) => { submitAnswer(); });

let quizAnswers = [];

function scrambleAnswers()
{
	abcdAnswers[0].style.order = Math.floor(Math.random() * 10);
	abcdAnswers[1].style.order = Math.floor(Math.random() * 10);
	abcdAnswers[2].style.order = Math.floor(Math.random() * 10);
	abcdAnswers[3].style.order = Math.floor(Math.random() * 10);
}

function displayQuestion(index)
{
	let question = questions[index];

	if (question == null)
	{
		endQuiz();
		return;
	}

	questionTitle.innerHTML = question.title;
	if (question.type == "abcd")
	{
		questionAnswerAbcd.classList.remove('hidden');
		questionAnswerWrite.classList.add('hidden');

		//enable clicking 
		abcdAnswers[0].style.pointerEvents = "auto";
		abcdAnswers[1].style.pointerEvents = "auto";
		abcdAnswers[2].style.pointerEvents = "auto";
		abcdAnswers[3].style.pointerEvents = "auto";

		abcdAnswers[0].innerHTML = question.answers[0];
		abcdAnswers[1].innerHTML = question.answers[1];
		abcdAnswers[2].innerHTML = question.answers[2];
		abcdAnswers[3].innerHTML = question.answers[3];
		scrambleAnswers();
	} else if (question.type == "write")
	{
		questionAnswerAbcd.classList.add('hidden');
		questionAnswerWrite.classList.remove('hidden');
		writeInput.value = "";
	}
}

function selectAnswer(index)
{
	//disable additional clicks
	abcdAnswers[0].style.pointerEvents = "none";
	abcdAnswers[1].style.pointerEvents = "none";
	abcdAnswers[2].style.pointerEvents = "none";
	abcdAnswers[3].style.pointerEvents = "none";

	if (questions[currentQuestionIndex].correct == index)
	{
		abcdAnswers[index].classList.add('correct');
		correctCount++;
	} else
	{
		abcdAnswers[index].classList.add('wrong');
		wrongCount++;
	}

	quizAnswers.push(index);
	updateScore();

	setTimeout(() =>
	{
		abcdAnswers[index].classList.remove('correct');
		abcdAnswers[index].classList.remove('wrong');

		currentQuestionIndex++;
		displayQuestion(currentQuestionIndex);
	}, 2000);
}

function submitAnswer()
{
	let answer = writeInput.value;
	if (answer.toLowerCase() == questions[currentQuestionIndex].correct.toLowerCase())
	{
		writeSubmitBtn.classList.add('correct');
		writeInput.classList.add('correct');
		correctCount++;
	} else
	{
		writeSubmitBtn.classList.add('wrong');
		writeInput.classList.add('wrong');
		wrongCount++;
	}
	quizAnswers.push(answer);

	updateScore();

	setTimeout(() =>
	{
		writeSubmitBtn.classList.remove('correct');
		writeSubmitBtn.classList.remove('wrong');
		writeInput.classList.remove('correct');
		writeInput.classList.remove('wrong');

		currentQuestionIndex++;
		displayQuestion(currentQuestionIndex);
	}, 2000);
}

let scoreGood = document.querySelector('.header .score .good');
let scoreBad = document.querySelector('.header .score .bad');
let scoreProc = document.querySelector('.header .score .proc');

function updateScore()
{
	scoreGood.innerHTML = correctCount;
	scoreBad.innerHTML = wrongCount;
	let proc = Math.floor(correctCount / (correctCount + wrongCount) * 100);
	if (proc)
	{
		scoreProc.innerHTML = proc + "%";
	}
	phoneHome();
}

async function phoneHome()
{
	let data = {
		name: nameInput.value,
		answers: quizAnswers,
		correct: correctCount,
		wrong: wrongCount,
	}

	fetch("/quiz/score", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	}).then(res =>
	{
		console.log("Post complete! res: " + res);
	});
}

function endQuiz()
{
	startScreen.classList.add('hidden');
	questionScreen.classList.add('hidden');
	finishScreen.classList.remove('hidden');

	document.querySelector('.finish-screen .good').innerHTML = correctCount + " odpowiedzi dobrze";
	document.querySelector('.finish-screen .bad').innerHTML = wrongCount + " odpowiedzi źle";
	document.querySelector('.finish-screen .proc').innerHTML = Math.floor(correctCount / (correctCount + wrongCount) * 100) + "%";
}
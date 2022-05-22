async function fetchQuestions()
{
	let response = await fetch("/quiz/questions");
	let data = await response.json();
	return data;
}
async function fetchAnswers()
{
	let response = await fetch("/quiz/scores");
	let data = await response.json();
	return data;
}

let questions = fetchQuestions();
let answers;

async function getAnswers()
{
	answers = await fetchAnswers();
	displayAnswers();

	setTimeout(getAnswers, 5000);
}

questions.then((data) =>
{
	questions = data;
	getAnswers();
});



function displayAnswers()
{
	let answerListHtml = "";
	let answerList = document.querySelector('.scores');

	Object.values(answers).forEach((answer) =>
	{
		let answerProc = Math.floor(answer.correct / (answer.correct + answer.wrong) * 100);
		if (!answerProc) answerProc = 0;

		answerListHtml += `<div class="score">
				<div class="name">
					<div class="top">
						${answer.name}
					</div>
					<div class="bottom">
						<p>
							<span class="good"> ${answer.correct} </span>
							/
							<span class="bad"> ${answer.wrong} </span>
							-
							<span class="proc"> ${answerProc}% </span>
						</p>
					</div>
				</div>
				<div class="questions">`
		for (let i = 0; i < questions.length; i++)
		{
			if (answer.answers[i] || answer.answers[i] == 0)
			{
				if (answer.answers[i].toString().toLowerCase() == questions[i].correct.toString().toLowerCase())
				{
					answerListHtml += `<div class="question good" onclick="displayInfo(${i})">
						<i class="fa-solid fa-check"></i>
					</div>`;
				} else
				{
					answerListHtml += `<div class="question bad" onclick="displayInfo(${i})">
						<i class="fa-solid fa-xmark"></i>
					</div>`
				}
			}
			else
			{
				answerListHtml += `<div class="question unknown" onclick="displayInfo(${i})">
						<i class="fa-solid fa-hourglass"></i>
					</div>`;
			}
		}

		answerListHtml += `</div>
			</div>`
	});

	answerList.innerHTML = answerListHtml;
}

let blur = document.querySelector('.blur');
let questionInfo = document.querySelector('.question-info');
blur.addEventListener('click', () => { displayInfo(-1) });

let questionTitle = document.querySelector('.question-title');
let questionAnswers = document.querySelector('.question-answers');

function displayInfo(index)
{
	if (index == -1)
	{
		blur.style.display = "none";
		questionInfo.style.display = "none";
	}
	else 
	{
		blur.style.display = "block";
		questionInfo.style.display = "block";

		questionTitle.innerHTML = questions[index].title;
		let questionAnswersHtml = "";
		Object.values(answers).forEach((answer) =>
		{
			console.log(answer.answers[index]);
			if (answer.answers[index] || answer.answers[index] == 0)
			{
				let correct = answer.answers[index].toString().toLowerCase() == questions[index].correct.toString().toLowerCase();

				if (questions[index].type == "abcd")
				{
					questionAnswersHtml += `
					<tr class="question-answer ${correct ? "good" : "bad"}"> 
						<td class="answer-name">
							${answer.name}
						</td> 
						
						<td class="answer-content">
							${questions[index].answers[answer.answers[index]]}
						</td>
					</tr> `
				} else
				{
					questionAnswersHtml += `
					<tr class="question-answer ${correct ? "good" : "bad"}">
						<td class="answer-name">
							${answer.name}
						</td> 
						
						<td class="answer-content">
							${answer.answers[index]}
						</td>
					</tr> `
				}
			} else
			{
				questionAnswersHtml += `
					<tr class="question-answer unknown">
						<td class="answer-name">
							${answer.name}
						</td>
					
						<td class="answer-content">
							[brak odpowiedzi]
						</td>
					</tr> `
			}
		});
		questionAnswers.innerHTML = questionAnswersHtml;
	}
}
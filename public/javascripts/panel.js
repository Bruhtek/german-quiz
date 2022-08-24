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



function displayAnswers() {
	let answerListHtml = "";
	let answerList = document.querySelector(".scores");

	Object.values(answers).forEach((answer) => {
		let answerProc = Math.floor(
			(answer.correct / (answer.correct + answer.wrong)) * 100
		);
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
							-
							<span class="grade"> ${getGrade(answerProc)} </span>
						</p>
					</div>
				</div>
				<div class="questions">`;
		for (let i = 0; i < questions.length; i++) {
			if (answer.answers[i] || answer.answers[i] == 0) {
				if (
					answer.answers[i].toString().toLowerCase() ==
					questions[i].correct.toString().toLowerCase()
				) {
					answerListHtml += `<div class="question good" onclick="displayInfo('${answer.name}')">
						<i class="fa-solid fa-check"></i>
					</div>`;
				} else {
					answerListHtml += `<div class="question bad" onclick="displayInfo('${answer.name}')">
						<i class="fa-solid fa-xmark"></i>
					</div>`;
				}
			} else {
				answerListHtml += `<div class="question unknown" onclick="displayInfo('${answer.name}')">
						<i class="fa-solid fa-hourglass"></i>
					</div>`;
			}
		}

		answerListHtml += `</div>
			</div>`;
	});

	answerList.innerHTML = answerListHtml;
}

let blur = document.querySelector(".blur");
let questionInfo = document.querySelector(".question-info");
blur.addEventListener("click", () => {
	displayInfo(-1);
});

let questionTitle = document.querySelector(".question-title");
let questionAnswers = document.querySelector(".question-answers");

function getGrade(percentage) {
	let grades = {
		6: 100,
		5: 90,
		"4+": 85,
		4: 70,
		"3+": 65,
		3: 50,
		2: 40,
		1: 0,
	};

	maxGrade = 0;
	for (let grade in grades) {
		if (percentage >= grades[grade]) {
			console.log(grade, grades[grade]);
			if (maxGrade <= grade) maxGrade = grade;
		}
	}
	return maxGrade;
}

function displayInfo(name) {
	if (name == -1) {
		blur.style.display = "none";
		questionInfo.style.display = "none";
	} else {
		blur.style.display = "block";
		questionInfo.style.display = "block";

		answer = answers[name];
		console.log(answer);

		questionTitle.innerHTML = name;
		let questionAnswersHtml = `
		<tr class="question-answer unknown">
			<th class="answer-name">
				Pytanie
			</th>
			<th class="answer-name">
				Poprawna odpowiedź
			</th>
			<th class="answer-content">
				Odpowiedź ucznia
			</th>
		</tr>`;
		let i = 0;
		Object.values(questions).forEach((question) => {
			if (answer.answers[i] || answer.answers[i] == 0) {
				let correct =
					answer.answers[i].toString().toLowerCase() ==
					question.correct.toString().toLowerCase();

				if (question.type == "abcd") {
					questionAnswersHtml += `
					<tr class="question-answer ${correct ? "good" : "bad"}"> 
						<td class="answer-name">
							${question["title"]}
						</td>
						<td class="answer-name">
							${
								question["type"] == "abcd"
									? question["answers"][question["correct"]]
									: question["correct"]
							}
						</td>
						<td class="answer-content">
							${question.answers[answer.answers[i]]}
						</td>
					</tr> `;
				} else {
					questionAnswersHtml += `
					<tr class="question-answer ${correct ? "good" : "bad"}">
						<td class="answer-name">
							${question["title"]}
						</td>
						<td class="answer-name">
							${
								question["type"] == "abcd"
									? question["answers"][question["correct"]]
									: question["correct"]
							}
						</td>
						<td class="answer-content">
							${answer.answers[i]}
						</td>
					</tr> `;
				}
			} else {
				questionAnswersHtml += `
					<tr class="question-answer unknown">
						<td class="answer-name">
							${question["title"]}
						</td>
						<td class="answer-name">
							${
								question["type"] == "abcd"
									? question["answers"][question["correct"]]
									: question["correct"]
							}
						</td>
						<td class="answer-content">
							[brak odpowiedzi]
						</td>
					</tr> `;
			}
			i++;
		});
		questionAnswers.innerHTML = questionAnswersHtml;
	}
}
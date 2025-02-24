"use strict";
const params = {
    "root": "#rootQuestions",
    "start": "#buttonStart",
    "done": "#buttonDone",
    "question": ".question",
    "result": "result",
    "resultMessage": "Выполнено за ",
}
let time;
let endTime;
let doneTime;
let result;
let allQuestions;
let rightAnswersArray = rightAnswers(questions);
const pointsPerQuestion = Math.round((100 / questions.length) * 100) / 100;
let pointsForTest = 0;
const start = document.querySelector(params.start);
start.addEventListener('click', function (e) {
    time = new Date().getTime();
    allQuestions = document.querySelectorAll(params.question);
    var i = 0;
    allQuestions.forEach(function (question) {
        const form = document.createElement('form');
        let j = 0;
        questions[i].forEach(function (element) {
            const p = document.createElement('p');
            p.className = "answer";
            const input = document.createElement('input');
            const label = document.createElement('label');
            const inputId = 'answer_' + i + '_' + j;
            input.id = inputId;
            label.htmlFor = inputId;
            label.innerHTML = element.question;
            input.type = "radio";
            input.name = "question_" + i;
            input.className = "answer";
            input.setAttribute("data-answer", element.question);
            j++;
            p.append(input);
            p.append(label);
            form.append(p);
        });
        i++;
        question.append(form);
    });
    const rootElement = document.querySelector(params.root);
    if (rootElement.style.display === "none") {
        rootElement.style.display = "block";
        start.setAttribute("disabled", "disabled");
    }
    result = document.createElement('div');
    result.id = params.result;
    document.body.append(result);

}, false);
const done = document.querySelector(params.done);
done.addEventListener('click', function (e) {
    endTime = new Date().getTime();
    doneTime = new Date(endTime - time);
    const resultTimeHtml = document.createTextNode(params.resultMessage + doneTime.getMinutes() + ' мин:' + doneTime.getSeconds() + ' сек');
    const resultTime = document.createElement('div');
    resultTime.appendChild(resultTimeHtml);
    result.append(resultTime);
    done.setAttribute("disabled", "disabled");
    const answers = document.querySelectorAll('.answer');
    answers.forEach(function (answer) {
        if (answer.checked) {
            let answerCheck = checkAnswer(answer);
            const questionNum = parseInt(answer.name.split('_').pop()) + 1;
            if (answerCheck === true) {
                pointsForTest += pointsPerQuestion;
                result.innerHTML += 'Вопрос ' + questionNum + ': "' + answer.getAttribute('data-answer') + '" <span class="yes">правильно!</span><br>';
            } else {
                result.innerHTML += 'Вопрос ' + questionNum + ': "' + answer.getAttribute('data-answer') + '" <span class="not">ошибка!</span><br>';
            }
        }
    });
    result.innerHTML += 'Общая оценка: ' + Math.ceil(pointsForTest) + ' баллов.<br>';
});


function rightAnswers(questions) {
    return questions.map(function (question) {
        return question.filter(function (answer) {
            return answer.answer;
        });
    });
}

function checkAnswer(answer) {
    const answerValue = answer.getAttribute("data-answer");
    let rightAswers = rightAnswersArray.map(function (rightAnswer) {
        if (rightAnswer[0].question === answerValue) return true;
    }).filter(function (rightAnswer) {
        return rightAnswer;
    });
    if (rightAswers.length === 1 && rightAswers[0] === true) return true;
}


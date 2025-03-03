"use strict";

(function () {
    const params = {
        messages: {
            resultTimeMessage: "Выполнено за ",
            resultSuccessMessage: "Результаты позволяют приступить к следующему заданию!",
            resultUnsuccessMessage: "Рекомендуется пройти тест повторно",
        },
        ids: {
            root: "#rootQuestions",
            start: "#buttonStart",
            done: "#buttonDone",
            question: ".question",
            result: "result",
            answerFormClass: "answersForQuestion",
            answerItemTag: "p",
            answerItemClass: "answersItem",
            answerRadioTagName: "answer",
            answerRadioTagClass: "answerRadio",
            resultTag: "div",
            resultId: "result",
        },
        successPoints: 60,
        startTestTime: undefined,
        endTestTime: undefined,
    }
    const store = {
        rightAnswers: answers.map(function (answer, index) {
            return answer.filter(function (item) {
                return item.value === 1;
            }).pop().name;
        }),
        userAnswers: [],
        pointsForTest: 0,
        pointsPerQuestion: Math.round((100 / answers.length) * 100) / 100
    };
    const start = document.querySelector(params.ids.start);
    start.addEventListener('click', function (e) {
        params.startTestTime = new Date().getTime();
        const rootElement = document.querySelector(params.ids.root);
        if (rootElement.style.display === "none") {
            rootElement.style.display = "block";
            start.setAttribute("disabled", "disabled");
        }
        store.allQuestions = document.querySelectorAll(params.ids.question);
        store.allQuestions.forEach(function (question, i) {
            const form = document.createElement('form');
            form.className = params.ids.answerFormClass;
            answers[i].forEach(function (answer, j) {
                const answerItem = document.createElement(params.ids.answerItemTag);
                answerItem.className = params.ids.answerItemClass;
                const input = document.createElement('input');
                const label = document.createElement('label');
                const id = 'answer_' + i + '_' + j;
                input.id = id;
                label.htmlFor = id;
                label.innerHTML = answer.name;
                input.setAttribute('data-answer', answer.name);
                input.type = "radio";
                input.name = params.ids.answerRadioTagName + "_" + i;
                input.className = params.ids.answerRadioTagClass;
                answerItem.append(input);
                answerItem.append(label);
                form.append(answerItem);
            });
            question.append(form);
        });
        store.result = document.createElement(params.ids.resultTag);
        store.result.id = params.ids.resultId;
        document.body.append(store.result);

    });
    store.done = document.querySelector(params.ids.done);
    store.done.addEventListener('click', function (e) {
        params.endTestTime = new Date().getTime();
        store.doneTime = new Date(params.endTestTime - params.startTestTime);
        const resultTimeHtml = document.createTextNode(params.messages.resultTimeMessage + store.doneTime.getMinutes() + ' мин:' + store.doneTime.getSeconds() + ' сек');
        const resultTime = document.createElement('div');
        resultTime.appendChild(resultTimeHtml);
        store.result.append(resultTime);
        store.done.setAttribute("disabled", "disabled");

        const answers = document.querySelectorAll('.' + params.ids.answerRadioTagClass);
        answers.forEach(function (answer) {
            if (answer.checked) {
                let index = answer.name.split('_').pop();
                store.userAnswers.push({index: index, answer: answer.getAttribute('data-answer')});
            }
        });
        store.userAnswers.forEach(function (answer) {
            const key = answer.index;
            const  value = answer.answer;
            console.log(answer,key, value);

            let numQuestion = parseInt(key) + 1;
            if (value === store.rightAnswers[key]) {
                store.pointsForTest += store.pointsPerQuestion;
                store.result.innerHTML += 'Вопрос ' + numQuestion + ': "' + value + '" <span class="yes">правильно!</span><br>';
            } else {
                store.result.innerHTML += 'Вопрос ' + numQuestion + ': "' + value + '" <span class="not">ошибка!</span> Правильный, это ' + store.rightAnswers[key] + '<br>';
            }
        });
        store.result.innerHTML += 'Общая оценка: ' + Math.ceil(store.pointsForTest) + ' баллов.<br>';
        if (Math.ceil(store.pointsForTest) > params.successPoints) {
            store.result.innerHTML += '<span class="yes">' + params.messages.resultSuccessMessage + '</span>';
        } else {
            store.result.innerHTML += '<span class="not">' + params.messages.resultUnsuccessMessage + '</span>';
        }
        window.scrollTo(0, document.body.scrollHeight);
    });
}());
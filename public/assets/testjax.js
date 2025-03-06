"use strict";

(function () {
    const params = {
        messages: {
            resultTimeMessage: "Выполнено за ",
            resultSuccessMessage: "Вы прекрасно готовы к следующему уроку!",
            resultMidlMessage: "У Вас есть некоторые пробелы. Обязательно обратите внимание на свои ошибки!",
            resultUnsuccessMessage: "Вам нужно срочно подтянуть свои знания хотя бы до уровня ЕГЭ!",
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
        countdown: {
            minutes: 5,
            seconds: 0,
        },
        successPoints: 80,
        midlPoints: 59,
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
            const form = document.createElement('div');
            form.className = params.ids.answerFormClass;
            answers[i].forEach(function (answer, j) {
                const answerItem = document.createElement(params.ids.answerItemTag);
                answerItem.className = params.ids.answerItemClass;
                const id = 'answer_' + i + '_' + j;
                const input = radioInput({
                    id: id,
                    name: params.ids.answerRadioTagName + '_' + i,
                    className: params.ids.answerRadioTagClass,
                    dataAnswer: answer.name,
                })
                const label = Label({forId: id, innerHtml: answer.name});
                answerItem.append(input);
                answerItem.append(label);
                form.append(answerItem);
            });
            question.append(form);
        });
        store.result = document.createElement(params.ids.resultTag);
        store.result.id = params.ids.resultId;
        const Timer = CountdownTimer(
            {
                id: 'countdownTimer',
                minutes: params.countdown.minutes,
                seconds: params.countdown.seconds,
            }
        );

        document.body.append(store.result);
        document.body.append(Timer);

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
            const value = answer.answer;
            console.log(answer, key, value);

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
        } else if (Math.ceil(store.pointsForTest) > params.midlPoints) {
            store.result.innerHTML += '<span class="midl">' + params.messages.resultMidlMessage + '</span>';
        } else {
            store.result.innerHTML += '<span class="not">' + params.messages.resultUnsuccessMessage + '</span>';
        }
        window.scrollTo(0, document.body.scrollHeight);
        document.getElementById('countdownTimer').remove();
    });

    function radioInput({id, name, className, dataAnswer}) {
        const input = document.createElement('input');
        input.id = id;
        input.type = "radio";
        input.name = name;
        input.className = className;
        input.setAttribute('data-answer', dataAnswer);
        return input;
    }

    function Label({forId, innerHtml}) {
        const label = document.createElement('label');
        label.htmlFor = forId;
        label.innerHTML = innerHtml;
        return label;
    }

    function CountdownTimer({id, minutes, seconds}) {
        const nowTime = new Date();
        const endTime = new Date(
            nowTime.setTime(
                nowTime.getTime() + minutes * 60 * 1000 + seconds * 1000));
        console.log(id, minutes, seconds);
        let difference = endTime.getTime() - (new Date()).getTime();
        console.log(difference)
        const min = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const sec = Math.floor((difference % (1000 * 60)) / 1000);
        const display = document.createElement('div');
        display.id = id;
        const minutesNode = document.createElement('span');
        minutesNode.id = id + "Minutes";
        minutesNode.innerHTML = ("0" + min).substr(-2);
        const separator = document.createElement('span');
        separator.id = id + "Separator";
        const secondsNode = document.createElement('span');
        secondsNode.id = id + "Seconds";
        secondsNode.innerHTML = ("0" + sec).substr(-2);
        display.append(minutesNode);
        display.append(separator);
        display.append(secondsNode);
        const intervalId = setInterval(() => {
            const now = new Date();
            const countedTime = endTime.getTime() - now.getTime();
            const min = ('0' + Math.floor((countedTime % (1000 * 60 * 60)) / (1000 * 60))).substr(-2);
            const sec = ('0' + Math.floor((countedTime % (1000 * 60)) / 1000)).substr(-2);
            if (countedTime <= 0) {
                clearInterval(intervalId);
                store.done.click();
                minutesNode.innerHTML = '00';
                secondsNode.innerHTML = '00';
            } else {
                minutesNode.innerHTML = min;
                secondsNode.innerHTML = sec;
            }
        }, 1000);
        return display;
    }
}());
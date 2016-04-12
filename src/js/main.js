'use strict';
import questions from './questions';

console.log(questions);
class Machine {
    constructor() {
        this.question_html = $('#question-para');
        this.answer_html = $('#answer-para');
        this.question_n = questions.length;
        this.state = 0;
    }

    refresh_question() {
        const rd = Math.floor(Math.random() * this.question_n);
        this.question = questions[rd];
        this.question_html.text(this.question.question);
    }

    next() {
        if (!this.state) {
            this.state = 1;
        } else {
            this.state = 0;
            refresh_question();
        }
    }

    init() {
        this.refresh_question();
        $('body').click( () => this.next() )
    }
}

const machine = new Machine();
machine.init();

'use strict';
import questions from './questions';

console.log(questions);
class Machine {
    constructor() {
        this.question_html = $('#question-para');
        this.answer_html = $('#answer-para');
        this.question_n = questions.length;
        this.state = 0;
        this.permutation = [];
        for (let i=0; i<this.question_n; i++) {
            this.permutation.push(i);
        }
    }

    refresh_question() {
        let id = this.permutation[this.current_cursor];
        this.current_cursor += 1;
        this.question = questions[id];
        this.question_html.text(this.question.question);
        this.answer_html.text('');
    }

    show_answer() {
        this.answer_html.text(this.question.answer);
    }

    next() {
        if (!this.state) {
            this.state = 1;
            this.show_answer();
        } else {
            this.state = 0;
            this.refresh_question();
        }
    }

    shuffle() {
        for (let i=this.question_n-1; i>=1; i--) {
            let rd = Math.floor(Math.random() * (i+1));
            let temp = this.permutation[rd];
            this.permutation[rd] = this.permutation[i];
            this.permutation[i] = temp;
        }
        this.current_cursor = 0;
    }

    init() {
        this.shuffle();
        this.refresh_question();
        $('body').click( () => this.next() )
    }
}

const machine = new Machine();
machine.init();

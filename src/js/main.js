'use strict';
import questions from './questions';

function random_shuffle(arr) {
    let n = arr.length;

    for (let i=n-1; i>=1; i--) {
        let rd = Math.floor(Math.random() * (i+1));
        let temp = arr[rd];
        arr[rd] = arr[i];
        arr[i] = temp;
    }
}

class Machine {
    constructor() {
        this.question_html = $('#question-para');
        this.answer_html = $('#answer-para');
        this.submit_html = $('#submit-grid');
        this.feedback_html = $('#feedback-grid');
        this.question_n = questions.length;
        this.permutation = [];
        this.currentQID = null;
        this.wrong_questions = [];
        this.state = 0;
        for (let i=0; i<this.question_n; i++) {
            this.permutation.push(i);
        }
    }

    refresh_question() {
        this.state = 0;
        this.submit_html.show();
        this.feedback_html.hide();

        if (this.current_cursor >= this.question_n) {
            if (this.wrong_questions.length == 0) {
                this.question_html.text('End');
                this.answer_html.text('');
                return 0;
            } else {
                this.permutation = this.wrong_questions;
                this.wrong_questions = [];
                random_shuffle(this.permutation);
                this.question_n = this.permutation.length;
                this.current_cursor = 0;
            }
        }

        this.currentQID = this.permutation[this.current_cursor];
        this.current_cursor += 1;
        this.question = questions[this.currentQID];
        this.question_html.text(this.question.question);
        this.answer_html.text('');
    }

    show_answer() {
        this.state = 1;
        this.feedback_html.show();
        this.submit_html.hide();
        this.answer_html.text(this.question.answer);
    }

    submit() {
        this.state = 1;
        this.show_answer();
    }

    feedback(flag) {
        this.state = 0;
        if (!flag) this.wrong_questions.push(this.currentQID);
        console.log(this.wrong_questions);
        this.refresh_question();
    }

    shuffle() {
        this.current_cursor = 0;
        random_shuffle(this.permutation);
    }

    init() {
        this.shuffle();
        this.refresh_question();
        $('#send-button').click( () => this.submit() );
        $('#correct-button').click( () => this.feedback(true) );
        $('#wrong-button').click( () => this.feedback(false) );
    }
}

const machine = new Machine();
machine.init();

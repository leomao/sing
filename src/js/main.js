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
        this.progress_bar = $('#progress-bar');
        this.text = {
            progress: $('#progress-text'),
            correct: $('#correct-text'),
            wrong: $('#wrong-text'),
        };
        this.modal = {
            main: $('#modal'),
            text: $('#modal-text'),
            button: $('#modal-button'),
        };

        this.question_n = questions.length;
        this.permutation = [];
        this.currentQID = null;
        this.wrong_questions = [];
        this.current_cursor = 0;
        this.correct_n = 0;
        this.state = 0;
        for (let i=0; i<this.question_n; i++) {
            this.permutation.push(i);
        }

        this.change_status();
    }

    refresh_question() {
        this.state = 0;
        this.submit_html.show();
        this.feedback_html.hide();

        if (this.current_cursor >= this.question_n) {
            if (this.wrong_questions.length == 0) {
                this.question_html.text('End');
                this.answer_html.text('');
                this.show_modal(0, this.question_n);
                return 0;
            } else {
                let [w, n] = [this.wrong_questions.length, this.question_n];
                this.review_wrong_question();
                this.show_modal(w, n);
            }
        }

        this.currentQID = this.permutation[this.current_cursor];
        this.current_cursor += 1;
        this.question = questions[this.currentQID];
        this.question_html.text(this.question.question);
        this.answer_html.text('');
        this.progress_bar.progress('increment');
        this.change_status();
    }

    show_modal (wn, qn) {
        if (wn == 0) {
            this.modal.text.text('You have correctly answered all the question!');
            this.modal.button.addClass('disabled');
        } else {
            this.modal.text.text(`You have answered all the question and scored ${qn-wn} / ${qn}.
Continue to review the ${wn} incorrect question`);
        }
        this.modal.main.modal('show');
    }

    review_wrong_question() {
        this.permutation = this.wrong_questions;
        this.wrong_questions = [];
        random_shuffle(this.permutation);
        this.question_n = this.permutation.length;
        this.current_cursor = 0;
        this.correct_n = 0;
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

    change_status(correct) {
        this.text.progress.text(`${this.current_cursor} / ${this.question_n}`);
        console.log(this.current_cursor);
        this.text.correct.text(`${this.correct_n}`);
        this.text.wrong.text(`${this.current_cursor - this.correct_n - 1}`);
    }

    feedback(flag) {
        this.state = 0;
        if (!flag) this.wrong_questions.push(this.currentQID);
        else this.correct_n += 1;
        this.refresh_question();
    }

    shuffle() {
        this.current_cursor = 0;
        random_shuffle(this.permutation);
    }

    init() {
        this.progress_bar.progress({value: 0, total: this.question_n});
        this.shuffle();
        this.refresh_question();
        $('#send-button').click( () => this.submit() );
        $('#correct-button').click( () => this.feedback(true) );
        $('#wrong-button').click( () => this.feedback(false) );
    }
}

const machine = new Machine();
machine.init();

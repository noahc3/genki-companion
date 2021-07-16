import React from 'react';
import './index.css';

export default class AdjectiveTypeGame extends React.Component {
    constructor(props) {
        super(props);

        const word = this.props.word;
        let question;
        let answer;
        let solution;
        if (word.type === "na-adjective") {
            question = word.hiragana.match(/.*(?=\s\(な\))/giu)[0];
            answer = question + "（な）";
            solution = 'な';
        } else {
            question = word.hiragana.match(/.*(?=い$)/giu)[0];
            answer = question + "（い）";
            solution = 'い';
        }

        this.state = {
            question: question,
            answer: answer,
            solution: solution,
            answered: false,
            correct: false
        }
    }

    answerHandler(answer) {
        const solution = this.state.solution;
        let correct = false;

        if (answer === solution) {
            correct = true;
        }

        const newState = Object.assign({}, this.state);
        newState.correct = correct;
        newState.answered = true;
        this.setState(newState);
    }

    handleEnter(event) {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            const answered = this.state.answered;
            const correct = this.state.correct;
            if (answered) {
                event.preventDefault();
                this.props.nextHandler(correct);
            }
        }
    }

    componentDidMount(){
        const enterHandler = (event) => this.handleEnter(event);
        this.setState({enterHandler: enterHandler});
        document.addEventListener("keydown", enterHandler, false);
    }

    componentWillUnmount(){
        const enterHandler = this.state.enterHandler;
        document.removeEventListener("keydown", enterHandler, false);
    }

    render() {
        const question = this.state.question;
        const answer = this.state.answer;
        const solution = this.state.solution;
        const answered = this.state.answered;
        const correct = this.state.correct;
        let resultColor = "";
        let resultAnswer = "";

        if (!answered) {
            return (
                <div>
                    <h3>What type of adjective is this? (な/い)</h3>
                    <div>
                        <h2>{question}<span class="red">（　）</span></h2>
                    </div>
                    <div class="center-text">
                        <button class="btn bg-gray" onClick={() => this.answerHandler("な")}>な</button>
                        <button class="btn bg-gray" onClick={() => this.answerHandler("い")}>い</button>
                    </div>
                </div>
            );
        } else {
            if (correct) {
                resultColor = "green";
                resultAnswer = "Correct! This is a " + solution + " adjective!";
            } else {
                resultColor = "red";
                resultAnswer = "Incorrect. This is a " + solution + " adjective!";
            }

            return (
                <div class="centered-fit-width">
                    <h3>What type of adjective is this? (な/い)</h3>
                    <div>
                        <h2><span class={resultColor}>{answer}</span></h2>
                        <h3>{resultAnswer}</h3>
                        <button class="wide-btn bg-green" onClick={() => this.props.nextHandler(correct)}>Next</button>
                    </div>
                </div>
            );
        }
    }
}
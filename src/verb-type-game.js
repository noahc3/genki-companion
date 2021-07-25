import React from 'react';
import './index.css';

export default class VerbTypeGame extends React.Component {
    constructor(props) {
        super(props);

        const word = this.props.word;
        const question = word.hiragana;
        let solution;

        if (word.type === "u-verb") solution = "u";
        else if (word.type === "ru-verb") solution = "る";
        else solution = "irr."

        this.state = {
            question: question,
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
        const solution = this.state.solution;
        const answered = this.state.answered;
        const correct = this.state.correct;
        let resultColor = "";
        let resultAnswer = "";

        if (!answered) {
            return (
                <div>
                    <h3>What type of verb is this? (u/る/irregular)</h3>
                    <div>
                        <h2>{question}</h2>
                    </div>
                    <div class="center-text">
                        <button class="btn bg-gray" onClick={() => this.answerHandler("u")}>u</button>
                        <button class="btn bg-gray" onClick={() => this.answerHandler("る")}>る</button>
                        <button class="btn bg-gray" onClick={() => this.answerHandler("irr.")}>irr.</button>
                    </div>
                </div>
            );
        } else {
            if (correct) {
                resultColor = "green";
                resultAnswer = "Correct! This is a " + solution + " verb!";
            } else {
                resultColor = "red";
                resultAnswer = "Incorrect. This is a " + solution + " verb!";
            }

            return (
                <div class="centered-fit-width">
                    <h3>What type of verb is this? (u/る/irregular)</h3>
                    <div>
                        <h2><span class={resultColor}>{question}</span></h2>
                        <h3>{resultAnswer}</h3>
                        <button class="wide-btn bg-green" onClick={() => this.props.nextHandler(correct)}>Next</button>
                    </div>
                </div>
            );
        }
    }
}
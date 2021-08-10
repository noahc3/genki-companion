import React from 'react';
import './index.css';
import * as conjugate from './conjugation-utils';
import * as utils from './utils';
import * as wanakana from 'wanakana';

export default class VerbConjPastGame extends React.Component {
    constructor(props) {
        super(props);
        const word = this.props.word;
        const question = word.hiragana;
        const type = utils.getRandomInt(2);
        const kanaAnswer = (type === 0) ? 
            conjugate.verbLongPastPositive(word) : 
            conjugate.verbLongPastNegative(word);
        const romajiAnswer = wanakana.toRomaji(kanaAnswer);

        this.state = {
            question: question,
            type: (type === 0) ? "affirmative" : "negative",
            kanaAnswer: kanaAnswer,
            romajiAnswer: romajiAnswer,
            userAnswer: "",
            answered: false,
            correct: false,
            enterHandler: {}
        }
    }

    answerHandler(event) {
        event.preventDefault();

        const kanaAnswer = this.state.kanaAnswer;
        const romajiAnswer = this.state.romajiAnswer;
        const userAnswer = this.state.userAnswer.toLowerCase().replace(/[.~[\]\s']+/giu, "");
        let correct = false;

        if (userAnswer === kanaAnswer || userAnswer === romajiAnswer) {
            correct = true;
        }

        this.setState({answered: true, correct: correct});
    }

    typeHandler(event) {
        this.setState({ userAnswer: event.target.value });
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
        const type = this.state.type;
        const kanaAnswer = this.state.kanaAnswer;
        const romajiAnswer = this.state.romajiAnswer;
        const userAnswer = this.state.userAnswer;
        const answered = this.state.answered;
        const correct = this.state.correct;
        let resultColor = "";
        let resultAnswer = "";

        if (!answered) {
            return (
                <div>
                    <h3>Conjugate this <span class="question-highlight">verb</span> with the <span class="question-highlight">long form past {type}</span> ending.</h3>
                    <div>
                        <h2>{question}</h2>
                    </div>
                    <h4>Answer with Romaji or Hiragana/Katakana (where appropriate)</h4>
                    <form onSubmit={(event) => this.answerHandler(event)}>
                        <input autoFocus type="text" value={userAnswer} onChange={(event) => this.typeHandler(event)} />
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            );
        } else {
            if (correct) {
                resultColor = "green";
                resultAnswer = "Correct!";
                resultAnswer = (
                    <div>
                        <div>{kanaAnswer} / {romajiAnswer}</div>
                        <h3>{resultAnswer}</h3>
                    </div>
                );
            } else {
                resultColor = "red";
                resultAnswer = "Incorrect. The correct answer is " + kanaAnswer + " (" + romajiAnswer + ")";
                resultAnswer = (
                    <div>
                        <h3>{resultAnswer}</h3>
                        <button type="button" onClick={() => {this.setState({correct: true})}}>Override: I was correct</button>
                    </div>
                );
            }

            return (
                <div class="centered-fit-width">
                    <h3>Conjugate this <span class="question-highlight">verb</span> with the <span class="question-highlight">long form past {type}</span> ending.</h3>
                    <div>
                        <h2>{question}</h2>
                    </div>
                    <div>
                        <h2><span class={resultColor}>{userAnswer}</span></h2>
                        {resultAnswer}
                        <button class="wide-btn bg-green" onClick={() => this.props.nextHandler(correct)}>Next</button>
                    </div>
                </div>
            );
        }
    }
}
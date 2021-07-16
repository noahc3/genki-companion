import React from 'react';
import './index.css';
import * as wanakana from 'wanakana';

const U_CONVERSION_TABLE = {
    "う": "って",
    "く": "いて",
    "ぐ": "いで",
    "す": "して",
    "つ": "って",
    "ぬ": "んで",
    "ぶ": "んで",
    "む": "んで",
    "る": "って"
}

export default class VerbConjTeGame extends React.Component {
    constructor(props) {
        super(props);
        const word = this.props.word;
        const question = word.hiragana;
        const kanaAnswer = this.conjugateKana(word);
        const romajiAnswer = wanakana.toRomaji(kanaAnswer);

        this.state = {
            question: question,
            kanaAnswer: kanaAnswer,
            romajiAnswer: romajiAnswer,
            userAnswer: "",
            answered: false,
            correct: false,
            enterHandler: {}
        }
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    conjugateKana(word) {
        let result = word.hiragana;
        if (word.type == "ru-verb") {
            result = result.replace(/る$/giu, "て");
        } else if (word.type == "u-verb") {
            if (word.hiragana == "いく") {
                result = "いって";
            } else {
                result = result.replace(/.$/giu, U_CONVERSION_TABLE[result[result.length - 1]])
            }
        } else if (word.type == "irregular-verb") {
            result = result.replace(/する$/giu, "して");
            result = result.replace(/くる$/giu, "きて");
        }

        return result;
    }

    answerHandler(event) {
        event.preventDefault();

        const kanaAnswer = this.state.kanaAnswer;
        const romajiAnswer = this.state.romajiAnswer;
        const userAnswer = this.state.userAnswer.toLowerCase().replace(/[\.~\[\]\s']+/giu, "");
        let correct = false;

        if (userAnswer == kanaAnswer || userAnswer == romajiAnswer) {
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
                    <h3>Conjugate this <span class="question-highlight">verb</span> with the <span class="question-highlight">te-form</span> ending.</h3>
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
                        <a href="#" onClick={() => {this.setState({correct: true})}}>Override: I was correct.</a>
                    </div>
                );
            }

            return (
                <div class="centered-fit-width">
                    <h3>Conjugate this <span class="question-highlight">verb</span> with the <span class="question-highlight">te-form</span> ending.</h3>
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
import React from 'react';
import './index.css';

export default class KanjiWordToEngGame extends React.Component {
    constructor(props) {
        super(props);
        const word = this.props.word;
        const question = word.kanji;
        const answer = word.english;

        this.state = {
            question: question,
            answer: answer,
            userAnswer: "",
            answered: false,
            correct: false,
            enterHandler: {}
        }
    }

    answerHandler(event) {
        event.preventDefault();

        const answer = this.state.answer.toLowerCase().replace(/[.~[\s?'’]+/giu, "");
        const userAnswer = this.state.userAnswer.toLowerCase().replace(/[.~[\]\s?'’]+/giu, "");
        const answers = answer.split(';');
        let correct = false;
        let reasonableAnswers = [];
        reasonableAnswers.push(answer);
        answers.forEach(ans => {
            reasonableAnswers = reasonableAnswers.concat(this.determineReasonableAnswers(ans));
            reasonableAnswers = reasonableAnswers.concat(this.determineReasonableAnswers(ans.replace('-', ' ')));
            reasonableAnswers = reasonableAnswers.concat(this.determineReasonableAnswers(ans.replace('-', '')));
        });

        if (reasonableAnswers.includes(userAnswer)) {
            correct = true;
        }

        this.setState({answered: true, correct: correct});
    }

    typeHandler(event) {
        this.setState({ userAnswer: event.target.value });
    }

    determineReasonableAnswers(str) {
        const reasonableAnswers = [];

        reasonableAnswers.push(str);

        str = str.replace(/\s*[＋+].*/giu, "");
        reasonableAnswers.push(str);

        reasonableAnswers.push(str);
        reasonableAnswers.push(str.replace(" ", ""));

        reasonableAnswers.push(str.replace(/\s*\([^)]*\)\s*/giu, ""))

        str = str.replace("(", "");
        str = str.replace(")", "");
        reasonableAnswers.push(str);
        reasonableAnswers.push(str.replace(" ", ""));

        return reasonableAnswers;
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
        const userAnswer = this.state.userAnswer;
        const answered = this.state.answered;
        const correct = this.state.correct;
        let resultColor = "";
        let resultAnswer = "";

        if (!answered) {
            return (
                <div>
                    <h3>What is the English definition of this word containing Kanji?</h3>
                    <div>
                        <h2>{question}</h2>
                    </div>
                    <h4>Answer in English, punctuation and capitalization is ignored.</h4>
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
                        <div>{answer}</div>
                        <h3>{resultAnswer}</h3>
                    </div>
                );
            } else {
                resultColor = "red";
                resultAnswer = "Incorrect. The correct answer is '" + answer + "'.";
                resultAnswer = (
                    <div>
                        <h3>{resultAnswer}</h3>
                        <button type="button" onClick={() => {this.setState({correct: true})}}>Override: I was correct</button>
                    </div>
                );
            }

            return (
                <div class="centered-fit-width">
                    <h3>What is the English definition of this word containing Kanji?</h3>
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
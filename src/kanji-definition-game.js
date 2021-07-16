import React from 'react';
import './index.css';

export default class KanjiDefinitionGame extends React.Component {
    constructor(props) {
        super(props);
        const word = this.props.word;
        const question = word.kanji;
        const definitions = word.english;

        this.state = {
            question: question,
            definitions: definitions,
            userAnswer: "",
            answered: false,
            correct: false,
            enterHandler: {}
        }
    }

    answerHandler(event) {
        event.preventDefault();

        const definitions = this.state.definitions.toLowerCase().replace(/[.~[\s?']+/giu, "");
        const userAnswer = this.state.userAnswer.toLowerCase().replace(/[.~[\s?']+/giu, "");
        const reasonableAnswers = definitions.split(';');
        let correct = false;

        if (reasonableAnswers.includes(userAnswer)) {
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
        const definitions = this.state.definitions.split(';');
        const userAnswer = this.state.userAnswer;
        const answered = this.state.answered;
        const correct = this.state.correct;
        let resultColor = "";
        let resultAnswer = "";
        let answerCombos = [];

        for (let i = 0; i < definitions.length; i++) {
            answerCombos.push(definitions[i]);
        }

        answerCombos = answerCombos.map(answer => {
            return (
                <span class="readings-answer">{answer}</span>
            );
        });

        if (!answered) {
            return (
                <div>
                    <h3>Give any one <span class="question-highlight">English definition</span> for the following Kanji.</h3>
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
                        {answerCombos}
                        <h3>{resultAnswer}</h3>
                    </div>
                );
            } else {
                resultColor = "red";
                resultAnswer = "Incorrect.";
                resultAnswer = (
                    <div>
                        {answerCombos}
                        <h3>{resultAnswer}</h3>
                        <button type="button" onClick={() => {this.setState({correct: true})}}>Override: I was correct</button>
                    </div>
                );
            }

            return (
                <div class="centered-fit-width">
                    <h3>Give any one <span class="question-highlight">English definition</span> for the following Kanji.</h3>
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
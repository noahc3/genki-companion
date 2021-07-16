import React from 'react';
import './index.css';

export default class KanjiReadingGame extends React.Component {
    constructor(props) {
        super(props);
        const word = this.props.word;
        const question = word.kanji;
        const kanaReadings = word.hiragana;
        const romajiReadings = word.romaji;

        this.state = {
            question: question,
            kanaReadings: kanaReadings,
            romajiReadings: romajiReadings,
            userAnswer: "",
            answered: false,
            correct: false,
            enterHandler: {}
        }
    }

    answerHandler(event) {
        event.preventDefault();

        const kanaReadings = this.state.kanaReadings;
        const romajiReadings = this.state.romajiReadings;
        const userAnswer = this.state.userAnswer.toLowerCase().replace(" ", "");
        const reasonableAnswers = kanaReadings.split(';').concat(romajiReadings.toLowerCase().split(';'));
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
        const kanaReadings = this.state.kanaReadings.split(';');
        const romajiReadings = this.state.romajiReadings.split(';');
        const userAnswer = this.state.userAnswer;
        const answered = this.state.answered;
        const correct = this.state.correct;
        let resultColor = "";
        let resultAnswer = "";
        let answerCombos = [];

        for (let i = 0; i < kanaReadings.length; i++) {
            answerCombos.push(kanaReadings[i] + " / " + romajiReadings[i]);
        }

        answerCombos = answerCombos.map(answer => {
            return (
                <span class="readings-answer">{answer}</span>
            );
        });

        if (!answered) {
            return (
                <div>
                    <h3>Give any one <span class="question-highlight">reading</span> for the following Kanji.</h3>
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
                        <a href="#" onClick={() => {this.setState({correct: true})}}>Override: I was correct.</a>
                    </div>
                );
            }

            return (
                <div class="centered-fit-width">
                    <h3>Give any one <span class="question-highlight">reading</span> for the following Kanji.</h3>
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
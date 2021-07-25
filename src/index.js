import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as utils from './utils';
import EngToJapGame from './etoj-game';
import JapToEngGame from './jtoe-game';
import AdjectiveTypeGame from './adjective-type-game';
import AdjConjPresentGame from './adjective-conj-present-game';
import AdjContPastGame from './adjective-conj-past-game';
import AdjConjTeGame from './adjective-conj-te-game';
import VerbTypeGame from './verb-type-game';
import VerbConjPresentGame from './verb-conj-present-game';
import VerbConjPastGame from './verb-conj-past-game';
import VerbConjTeGame from './verb-conj-te-game';
import KanjiReadingGame from './kanji-reading-game';
import KanjiDefinitionGame from './kanji-definition-game';
import KanjiWordToEngGame from './kwtoe-game';
import KanjiWordToJapGame from './kwtoj-game';
import OptionsComponent from './options-component';

const EDITION = 3;

class MainMenu extends React.Component {

    render() {
        const optionsHandler = this.props.optionsHandler;
        const startHandler = this.props.startHandler;
        const lessons = this.props.lessons;
        const grammar = this.props.grammar;
        const games = this.props.games;

        return (
            <div class="main-menu">
                <div class="center-text">
                    <h1>GENKI Companion</h1>
                    <h2>Study GENKI vocabulary and conjugation alongside your classes.</h2>
                </div>
                <br/>
                <div class="options">
                    <OptionsComponent 
                        title="Select Lessons"
                        identifier="lessons" 
                        options = {lessons}
                        type="checkbox"
                        callback={optionsHandler} />

                    <OptionsComponent 
                        title="Select Games" 
                        identifier="games"
                        options = {games}
                        type="checkbox"
                        callback={optionsHandler} />
                </div>
                <div class="center-text">
                    <button class="wide-btn bg-green" onClick={startHandler}>Start</button>
                </div>
            </div>
        );
    }
}

class ResultsMenu extends React.Component {

    render() {
        const resetHandler = this.props.resetHandler;
        const correct = this.props.correct;
        const total = this.props.total;
        const results = this.props.results;
        const resultsList = Object.keys(results).map((key) => {
            const localCorrect = results[key].correct;
            const localTotal = results[key].total;
            const localName = results[key].name;
            return (
                <div key={localName} class="result-item">
                    {localName}: {localCorrect}/{localTotal} ({Math.round(localCorrect*1000/localTotal)/10}%)
                </div>
            );
        });
        return (
            <div class="center-text">
                <h1>Results</h1>
                <h2>Score: {correct}/{total} ({Math.round(correct*1000/total)/10}%)</h2>
                <div class="result-container">
                    {resultsList}
                </div>
                <button class="wide-btn bg-green" onClick={resetHandler}>Return to Menu</button>
            </div>
        );
    }
}

class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "loading",
            lessons: {
                "G": {name: "Greetings", value: false},
                "L1": {name: "Lesson 1", value: false},
                "L2": {name: "Lesson 2", value: false},
                "L3": {name: "Lesson 3", value: false},
                "L4": {name: "Lesson 4", value: false},
                "L5": {name: "Lesson 5", value: false},
                "L6": {name: "Lesson 6", value: false},
                "L7": {name: "Lesson 7", value: false},
                "L8": {name: "Lesson 8", value: false},
                "L9": {name: "Lesson 9", value: false},
            },
            games: {
                "jtoe": {name: "Define Japanese in English", value: false, validWordTypes: ["adverb", "expression", "i-adjective", "irregular-verb", "na-adjective", "noun", "particle", "prefix", "ru-verb", "suffix", "u-verb"]},
                "etoj": {name: "Define English in Japanese", value: false, validWordTypes: ["adverb", "expression", "i-adjective", "irregular-verb", "na-adjective", "noun", "particle", "prefix", "ru-verb", "suffix", "u-verb"]},
                "kanji-reading": {name: "Kanji Readings", value: false, validWordTypes: ["kanji"]},
                "kanji-definition": {name: "Kanji Definitions", value: false, validWordTypes: ["kanji"]},
                "kwtoe": {name: "Kanji Word English Definitions", value: false, validWordTypes: ["kanji-word"]},
                "kwtoj": {name: "Kanji Word Readings", value: false, validWordTypes: ["kanji-word"]},
                "adj-types": {name: "Adjective Types", value: false, validWordTypes: ["i-adjective", "na-adjective"]},
                "adj-pres-conj": {name: "Present Tense Adjective Conjugation", value: false, validWordTypes: ["i-adjective", "na-adjective"]},
                "adj-past-conj": {name: "Past Tense Adjective Conjugation", value: false, validWordTypes: ["i-adjective", "na-adjective"]},
                "adj-te-conj": {name: "Te-form Adjective Conjugation", value: false, validWordTypes: ["i-adjective", "na-adjective"]},
                "verb-types": {name: "Verb Types", value: false, validWordTypes: ["irregular-verb", "ru-verb", "u-verb"]},
                "verb-pres-conj": {name: "Present Tense Verb Conjugation", value: false, validWordTypes: ["irregular-verb", "ru-verb", "u-verb"]},
                "verb-past-conj": {name: "Past Tense Verb Conjugation", value: false, validWordTypes: ["irregular-verb", "ru-verb", "u-verb"]},
                "verb-te-conj": {name: "Te-form Verb Conjugation", value: false, validWordTypes: ["irregular-verb", "ru-verb", "u-verb"]}
            },
            words: {},
            wordPool: {},
            gamePool: {},
            activeWord: {},
            currentGame: 0,
            totalGames: 0,
            correctGames: 0,
            results: {}
        };
        this.loadWords();
    }

    loadWords() {
        fetch(
            "words.json", 
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        ).then((response) => {
            return response.json();
        }).then((json) => {
            const parsedWords = {};

            json.forEach(element => {
                utils.populate(parsedWords, [element.edition, element.lesson, element.type, element.romaji], element);
            });

            const newState = Object.assign({}, this.state);
            newState.words = parsedWords;
            newState.display = "menu";
            this.setState(newState);
        });
    };

    buildWordPool(gamePool) {
        const games = this.state.games;
        const words = this.state.words;
        const lessons = this.state.lessons;
        let validWordTypes = [];
        const wordPool = {};

        Object.keys(lessons).forEach(lesson => {
            if (lessons[lesson].value) {
                Object.keys(words[EDITION][lesson]).forEach(type => {
                    Object.values(words[EDITION][lesson][type]).forEach(word => {
                        utils.populate(wordPool, [word.type, word.romaji], word);
                    });
                });
            }
            
        });

        //get list of all word types that can be used for games in the game pool.
        gamePool.forEach(game => {
            validWordTypes = validWordTypes.concat(games[game].validWordTypes);
        });

        //remove duplicates.
        validWordTypes.filter((type, index) => {
            return (validWordTypes.indexOf(type) === index);
        })

        //remove word types that cannot be used in the game pool
        Object.keys(wordPool).forEach(type => {
            if (!validWordTypes.includes(type)) {
                delete wordPool[type];
            }
        });

        return wordPool;
    }

    buildGamePool() {
        const games = this.state.games;
        const gamePool = [];

        Object.keys(games).forEach(game => {
            if (games[game].value) {
                gamePool.push(game);
            } 
        });
        
        return gamePool;
    }

    optionsHandler(event) {
        const newState = Object.assign({}, this.state);
        newState[event.target.name][event.target.value].value = event.target.checked;
        this.setState(newState);
    }

    startHandler() {
        const gamePool = this.buildGamePool();
        const wordPool = this.buildWordPool(gamePool);

        if (Object.keys(gamePool).length === 0) {
            alert("You haven't selected any games!");
            return;
        } else if (Object.keys(wordPool).length === 0) {
            alert("You haven't selected any lessons, or the lessons you selected do not have the types of words needed for the games you selected.");
            return;
        }

        let numGames = 0;

        console.log("Word pool: ", wordPool); //DEBUG
        console.log("Game pool: ", gamePool); //DEBUG

        

        Object.keys(wordPool).forEach(category => {
            numGames += Object.keys(wordPool[category]).length;
        });
        
        console.log(numGames);
        
        const newState = Object.assign({}, this.state);
        newState.wordPool = wordPool;
        newState.gamePool = gamePool;
        newState.currentGame = 1;
        newState.totalGames = numGames;
        newState.correctGames = 0;
        newState.results = {};
        this.setState(newState, () => this.selectGame());
    }

    nextHandler(correct) {
        const activeWordRomaji = this.state.activeWord.romaji;
        const activeWordType = this.state.activeWord.type;
        const currentGame = this.state.display;
        const games = this.state.games;

        const newState = Object.assign({}, this.state);
        delete newState.wordPool[activeWordType][activeWordRomaji];
        if (Object.keys(newState.wordPool[activeWordType]).length === 0) {
            delete newState.wordPool[activeWordType];
        }
        newState.currentGame++;
        
        if (!newState.results[currentGame]) {
            newState.results[currentGame] = {
                name: games[currentGame].name,
                correct: 0,
                total: 0
            }
        }

        newState.results[currentGame].total++;
        if (correct) {
            newState.correctGames++;
            newState.results[currentGame].correct++;
        }

        this.setState(newState, () => {
            const currentGame = this.state.currentGame;
            const totalGames = this.state.totalGames;
            if (currentGame <= totalGames) {
                this.selectGame();
            } else {
                const newState = Object.assign({}, this.state);
                newState.display = "results";
                this.setState(newState);
            }
        });
    }

    resetHandler() {
        const newState = Object.assign({}, this.state);
        newState.display = "menu";
        this.setState(newState);
    }

    selectGame() {
        const wordPool = this.state.wordPool;
        const gamePool = this.state.gamePool;
        const wordType = Object.keys(wordPool)[utils.getRandomInt(Object.keys(wordPool).length)];
        const wordKey = Object.keys(wordPool[wordType])[utils.getRandomInt(Object.keys(wordPool[wordType]).length)];
        const word = wordPool[wordType][wordKey];
        const selectedGame = this.findValidGame(gamePool, word);

        console.log("Selected word: ", word); //DEBUG
        console.log("Selected game: ", selectedGame); //DEBUG
        
        const newState = Object.assign({}, this.state);
        newState.activeWord = word;
        newState.display = selectedGame;
        this.setState(newState);

    }

    findValidGame(gamePool, word) {
        const games = this.state.games;
        const validGames = [];
        let selectedGame;

        gamePool.forEach(game => {
            if (games[game].validWordTypes.includes(word.type)) {
                validGames.push(game);
            }
        });

        selectedGame = validGames[utils.getRandomInt(validGames.length)];

        return selectedGame;
    }

    render() {
        const display = this.state.display;
        const word = this.state.activeWord;
        const currentGame = this.state.currentGame;
        const totalGames = this.state.totalGames;
        let game;

        if (display === "menu") {
            return (
                <div>
                    <div id="main-view">
                        <MainMenu 
                        optionsHandler={(event) => this.optionsHandler(event)} 
                        startHandler={(event) => this.startHandler(event)}
                        lessons={this.state.lessons} 
                        games={this.state.games} />
                    </div>
                </div>
            );
        } else if (display === "loading") {
            return (
                <div>
                    <div id="main-view" class="center-text">
                        <h1>Loading, please wait...</h1>
                    </div>
                </div>
            );
        } else if (display === "results") {
                return (
                    <div>
                        <div id="main-view">
                            <ResultsMenu
                                correct={this.state.correctGames}
                                total={this.state.totalGames}
                                results={this.state.results}
                                resetHandler={() => this.resetHandler()}
                            />
                        </div>
                    </div>
                );
        } else {
            if (display === "adj-types") game = <AdjectiveTypeGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            else if (display === "etoj") game = <EngToJapGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            else if (display === "jtoe") game = <JapToEngGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            else if (display === "adj-pres-conj") game = <AdjConjPresentGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            else if (display === "adj-past-conj") game = <AdjContPastGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            else if (display === "adj-te-conj") game = <AdjConjTeGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            else if (display === "verb-types") game = <VerbTypeGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            else if (display === "verb-pres-conj") game = <VerbConjPresentGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            else if (display === "verb-past-conj") game = <VerbConjPastGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            else if (display === "verb-te-conj") game = <VerbConjTeGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            else if (display === "kanji-reading") game = <KanjiReadingGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            else if (display === "kanji-definition") game = <KanjiDefinitionGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            else if (display === "kwtoe") game = <KanjiWordToEngGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            else if (display === "kwtoj") game = <KanjiWordToJapGame key={word.english+word.romaji} word={word} nextHandler={(correct) => this.nextHandler(correct)}/>;
            
            return (
                <div>
                    <div id="main-view" class="center-text">
                        <div>{currentGame}/{totalGames}</div>
                        {game}
                    </div>
                </div>
            );
        }
    }
    
}

ReactDOM.render(
    <div>
        <MainView />
        <div class="copyright center-text">
            <p>
            Copyright © 2021 Noah Curoe. All Rights Reserved <br/>
            The GENKI name is Copyright © The Japan Times Publishing, Ltd. 
            This site is in no way affiliated with 
            The Japan Times Publishing, Ltd. or any of its partners.
            </p>
        </div>
    </div>,
    document.getElementById('root')
);
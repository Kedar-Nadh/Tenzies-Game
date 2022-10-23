import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import { useStopwatch } from 'react-timer-hook';
import './index.css';


export default function App() {

    const bestRolls = JSON.parse(localStorage.getItem("bestrolls")) ? JSON.parse(localStorage.getItem("bestrolls")) : 1000
    const bestTime = JSON.parse(localStorage.getItem("besttime")) ? JSON.parse(localStorage.getItem("besttime")) : {minutes : 59, seconds : 59}
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const {
        seconds,
        minutes,
        start,
        pause,
        reset,
    } = useStopwatch({ autoStart: true });
        
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])
        
    if(tenzies) {
        
        let time = {minutes, seconds}
        if (time.minutes < bestTime.minutes){
            localStorage.setItem("besttime", JSON.stringify(time))
        } else if (time.minutes === bestTime.minutes && time.seconds < bestTime.seconds) {
            localStorage.setItem("besttime", JSON.stringify(time))
        }
        if(rolls < bestRolls){
            localStorage.setItem("bestrolls", JSON.stringify(rolls))
        }
    }

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    React.useEffect(() => {
        if(tenzies){
            pause();    
        }
    },[tenzies])
    
    function rollDice() {
        if(!tenzies) {
            setRolls(rolls + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setRolls(0)
            setTenzies(false)
            setDice(allNewDice())
            reset()
            start()
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <p className="best">Best Rolls: {bestRolls} & Best Time: {bestTime.minutes}m{bestTime.seconds}</p> 
            <div className="rolls-and-time">
                <p>Rolls: {rolls}</p>
                <p>Time: {minutes < 10 ? "0"+minutes : minutes}:{seconds < 10 ? "0"+seconds : seconds }</p>          
            </div>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}
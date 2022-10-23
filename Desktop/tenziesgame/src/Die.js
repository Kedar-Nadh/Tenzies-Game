import React from "react"
import './index.css';


export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            <img className="die-image" src={require(`./dices/${props.value}.png`)} alt="dice-img" />
        </div>
    )
}
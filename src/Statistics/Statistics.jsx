import React, { Component } from 'react'
import "./Statisticss.css"
import * as utilities from '../Utilities/Utilities.jsx';


class Statistics extends Component{
    constructor(props) {
        super(props);
        let startTime = new Date().getTime();
        this.state = {

            timer:0,
        }

        this.props.gameState.currentPlayer.startTurnTimer = this.props.gameStartTime;

    }

    getGameDuration(){
        let currentTime = new Date().getTime();
        this.setState({timer:( currentTime - this.props.gameStartTime)})

    }

    componentDidMount() {

        this.interval= setInterval(() => this.getGameDuration(), 10);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render(){
        return (
            
            <table className="StatsBar">
                <tbody>
                <tr>
            <td className="statusBarTd">Game Duration: {utilities.miliSecondsToTimeString(this.state.timer)}</td>
            <td className="statusBarTd">Number Of Turns: {this.props.gameState.currentPlayer.numOfTurns}</td>
            <td className="statusBarTd">Avg action time: {utilities.miliSecondsToTimeString(this.props.gameState.currentPlayer.avgActionTime)}</td>
            <td className="statusBarTd">Number of tiles from cash: {this.props.gameState.currentPlayer.numOfTilesFromCash}</td>
            <td className="statusBarTd">Player score: {this.props.gameState.score}</td>
            </tr>
            </tbody>
            </table>
            
        );
    }
}
export default Statistics;



 

import React, { Component } from "react";
import Tile from '../Tiles/Tile.jsx';
import Board from '../Board/Board.jsx';
import Player from '../Player/Player.jsx'
import Statistics from '../Statistics/Statistics.jsx'
import './Game.css'
import Cash from "../TilesCash/TilesCash.jsx";



export default class Game extends Component{
    constructor(props){
        super(props);
        var  cash=[];
        for(var i=0; i <7;i++){
            for(var j=i; j<7;j++){
                cash.push({First: i, Second: j});
            }
        }
        var chosen={First:null , Second:null};
        var scoreInitializer=0;
        let playerDeck = [];
        for(var i=0; i < 6;i++){
            var RandomNumber = Math.floor(Math.random() * cash.length);
            playerDeck.push(cash[RandomNumber]);
            scoreInitializer+=cash[RandomNumber].First+cash[RandomNumber].Second;
            cash = cash.filter(item => (item.First !== cash[RandomNumber].First || item.Second !== cash[RandomNumber].Second));
        }
        var prevChosen={First:null , Second:null};
        var validCells=[];
        //var validCells=[];
        let tableSize=9;
        var boardMatrix= new Array(9);
        for (var i = 0; i < boardMatrix.length; i++) {
            boardMatrix[i] = new Array(9).fill(null);
        }
        let gameStartTimeInitializer = new Date().getTime();

        this.state={
            players: [
                { id: '1',numOfTurns:0 ,totalTime:0,startTurnTimer:0,endTurnTimer:0,avgActionTime:0,numOfTilesFromCash:0},
                { id: '2',numOfTurns:0 ,totalTime:0,startTurnTimer:0,endTurnTimer:0,avgActionTime:0,numOfTilesFromCash:0},//ToDelete
            ],
            currentPlayer:{id:'1',numOfTurns:0,totalTime:0,startTurnTimer:0,endTurnTimer:0,numOfTilesFromCash:0},
            numberOfPlayers:1,
            boardSize: 9,
            gameCash: cash,
            playerDeck: playerDeck,
            validCells: validCells,
            chosenTile: chosen,
            prevChosen: prevChosen,
            boardMatrix:boardMatrix,
            firstTurn:true,
            numOfTurns:0,
            numOfTilesTaken:0,
            score:scoreInitializer,
            isGameOver: false,
            amIwinner: false,
            gameOverMessage: null,
            history: [],
            undoOrPrev:"undo",
            nextState: [],
            historySize: 0,
            gameStartTime:gameStartTimeInitializer,
        }

        this.state.currentPlayer = this.state.players[0];
        
        this.bringTileFromCash=this.bringTileFromCash.bind(this);
        this.putTileOnBoard=this.putTileOnBoard.bind(this);
        this.markTileFromPlayerDeck=this.markTileFromPlayerDeck.bind(this);
        this.handleOnClickTile=this.handleOnClickTile.bind(this);
        this.handleOnClickTable=this.handleOnClickTable.bind(this);
        this.calculateLeagalMoves=this.calculateLeagalMoves.bind(this);
        this.checkIfNeihboursAreValidCells=this.checkIfNeihboursAreValidCells.bind(this);
        this.chosePositionToTile=this.chosePositionToTile.bind(this);
        this.reSizeMatrix=this.reSizeMatrix.bind(this);
        this.AmIWinner=this.AmIWinner.bind(this);
        this.deepCoy=this.deepCoy.bind(this);
        this.goPrev=this.goPrev.bind(this);
        this.goNext=this.goNext.bind(this);
        this.updateStatistics=this.updateStatistics.bind(this);
        this.startNewGame=this.startNewGame.bind(this);
    }
    bringTileFromCash(){
        this.state.validCells=[]

        if(this.state.gameCash.length>0){
            let pastScore=this.deepCoy(this.state.score);
            let pastBoard=this.deepCoy(this.state.boardMatrix);
            let pastPlayerDeck=this.deepCoy(this.state.playerDeck);
            let pastboardSize=this.deepCoy(this.state.boardSize);
            let pastTurn=this.deepCoy(this.state.numOfTurns);
            let pastCash=this.deepCoy(this.state.gameCash);
            let pastHistorySize=this.deepCoy(this.state.historySize);
            let newHistory=this.deepCoy(this.state.history);
            newHistory.push({score: pastScore,boardMatrix: pastBoard,playerDeck: pastPlayerDeck, numOfTurns:pastTurn, boardSize:pastboardSize,gameCash:pastCash, historySize:pastHistorySize});
            var RandomNumber = Math.floor(Math.random() * this.state.gameCash.length);
            let newPlayerDeck = this.state.playerDeck;
            var newScore=this.state.score;
            newPlayerDeck.push(this.state.gameCash[RandomNumber]);
            newScore=newScore+this.state.gameCash[RandomNumber].First+this.state.gameCash[RandomNumber].Second;
            let newCash = this.state.gameCash;
            var newNumOfTilesTaken=this.state.numOfTilesTaken + 1;
            newCash = newCash.filter(item => (item.First !== this.state.gameCash[RandomNumber].First || item.Second !== this.state.gameCash[RandomNumber].Second) );
            var newHistorySize=this.state.historySize+1;
            this.setState({playerDeck: newPlayerDeck, gameCash: newCash,score:newScore, numOfTilesTaken:newNumOfTilesTaken,history:newHistory,historySize:newHistorySize});
            this.state.currentPlayer.numOfTilesFromCash++;
            this.updateStatistics();
        }
    }
    putTileOnBoard(First,Second){
        let newPlayerDeck=this.state.playerDeck;
        newPlayerDeck=newPlayerDeck.filter(value=> value.First !==First || value.Second !==Second);
        this.setState({playerDeck:newPlayerDeck, score:newScore});
    }
    markTileFromPlayerDeck(First,Second){ //changes the chosen tile and marks in deck
        let prevChosenTile=this.state.chosenTile;
        let newChosenTile;
        newChosenTile={
            First: First,
            Second: Second,
        }
        this.setState({chosenTile: newChosenTile, prevChosen:prevChosenTile});
        return newChosenTile;
    }
    calculateLeagalMoves(chosen){
        var newValidCells=[];
        if(this.state.numOfTurns==0){
            newValidCells.push('cell4-4');
        }
        else{
            var theBoard=this.state.boardMatrix;
            for(var i= 0 ; i < this.state.boardSize ; i++){
                for(var j= 0; j < this.state.boardSize ; j++){
                    if(theBoard[i][j]!=null && theBoard[i][j]!=undefined ){
                        var tmpValid=this.checkIfNeihboursAreValidCells(theBoard[i][j],i,j,chosen);
                        for(var k=0; k<tmpValid.length; k++){
                            newValidCells.push(tmpValid[k]);
                        }      
                    }
                }
            }
        }
        this.setState({validCells: newValidCells })
    }

    checkIfNeihboursAreValidCells(boardCell,i,j,chosen){
        var chosen=chosen;
        var newValidCells=[]
        var position;
        if(boardCell.First == boardCell.Second && (chosen.First==boardCell.First || chosen.Second==boardCell.First)){
            if(!this.state.boardMatrix[i-1][j]){
                newValidCells.push(`cell${i-1}-${j}`)
            }
            if(!this.state.boardMatrix[i+1][j]){
                newValidCells.push(`cell${i+1}-${j}`)
            }
            if(!this.state.boardMatrix[i][j-1]){
                newValidCells.push(`cell${i}-${j-1}`)
            }
            if(!this.state.boardMatrix[i][j+1]){
                newValidCells.push(`cell${i}-${j+1}`)
            }
        }
        if(boardCell.First != boardCell.Second){
            position=boardCell.position;
            if(position=="FirstLeft"){
                if(this.checkIfTileContainsNumber(boardCell.First,chosen)){
                    newValidCells.push(`cell${i}-${j-1}`)
                }
                if(this.checkIfTileContainsNumber(boardCell.Second,chosen)){
                    newValidCells.push(`cell${i}-${j+1}`)
                }
            }
            if(position=="FirstRight"){
                if(this.checkIfTileContainsNumber(boardCell.First,chosen)){
                    newValidCells.push(`cell${i}-${j+1}`)
                }
                if(this.checkIfTileContainsNumber(boardCell.Second,chosen)){
                    newValidCells.push(`cell${i}-${j-1}`)
                }
            }
            if(position=="FirstUp"){
                if(this.checkIfTileContainsNumber(boardCell.First,chosen)){
                    newValidCells.push(`cell${i-1}-${j}`)
                }
                if(this.checkIfTileContainsNumber(boardCell.Second,chosen)){
                    newValidCells.push(`cell${i+1}-${j}`)
                }
            }
            if(position=="FirstDown"){
                if(this.checkIfTileContainsNumber(boardCell.First,chosen)){
                    newValidCells.push(`cell${i+1}-${j}`)
                }
                if(this.checkIfTileContainsNumber(boardCell.Second,chosen)){
                    newValidCells.push(`cell${i-1}-${j}`)
                }
            }
        }
        return newValidCells;
    }
    checkIfTileContainsNumber(num,Tile){
        if(num==Tile.First || num==Tile.Second){
            return true;
        }
    }
    

    handleOnClickTile(First,Second){
        let chosen=this.markTileFromPlayerDeck(First,Second);
        this.calculateLeagalMoves(chosen);

    }
    handleOnClickTable(cell){
        this.state.validCells=[]
        let pastScore=this.deepCoy(this.state.score);
        let pastBoard=this.deepCoy(this.state.boardMatrix);
        let pastPlayerDeck=this.deepCoy(this.state.playerDeck);
        let pastboardSize=this.deepCoy(this.state.boardSize);
        let pastTurn=this.deepCoy(this.state.numOfTurns);
        let pastCash=this.deepCoy(this.state.gameCash);
        let newHistory=this.deepCoy(this.state.history);
        let pastHistorySize=this.deepCoy(this.state.historySize);
        newHistory.push({score: pastScore,boardMatrix: pastBoard,playerDeck: pastPlayerDeck, numOfTurns:pastTurn, boardSize:pastboardSize, gameCash:pastCash, historySize:pastHistorySize});
        let newMatrix=this.state.boardMatrix;
        let row=this.bringFirstIdxOfCellId(cell);
        let col=this.bringSecondIdxOfCellId(cell);
        let i=parseInt(row);
        let j=parseInt(col);
        if(i==0 || i==newMatrix.length-2 || j==0 || j==newMatrix.length-2){
            newMatrix=this.reSizeMatrix(newMatrix);
            i++;
            j++;
        }
        var position;
        if(this.state.numOfTurns==0){
            position="FirstLeft";
        }
        else{
            position=this.chosePositionToTile(newMatrix,i,j);
        }
        let newNumOfTurns=this.state.numOfTurns+1;
        newMatrix[i][j]={First: this.state.chosenTile.First, Second:this.state.chosenTile.Second, position:position };
        let newScore=this.state.score-this.state.chosenTile.First-this.state.chosenTile.Second;
        let newValidCells=[];
        let newPlayerDeck=this.state.playerDeck;
        newPlayerDeck=newPlayerDeck.filter(value=>value.First!==this.state.chosenTile.First || value.Second!==this.state.chosenTile.Second)
        this.updateStatistics();

        this.AmIWinner(newPlayerDeck);
        var newHistorySize=this.state.historySize+1;
        this.setState({boardMatrix: newMatrix, playerDeck:newPlayerDeck, validCells:newValidCells,firstTurn:false, numOfTurns:newNumOfTurns, score:newScore, boardSize:newMatrix.length,history:newHistory, historySize:newHistorySize });
        this.render();
    }

    updateStatistics()
    {
        this.state.currentPlayer.totalTime += new Date().getTime() - this.state.currentPlayer.startTurnTimer;//gain another po
        let newCurrentPlayer = this.state.players[(((this.state.currentPlayer.id-1)+1)%this.state.numberOfPlayers)]; //fits one or more players
        newCurrentPlayer.numOfTurns++;
        newCurrentPlayer.avgActionTime = (newCurrentPlayer.totalTime/newCurrentPlayer.numOfTurns);
        newCurrentPlayer.startTurnTimer = new Date().getTime();
        this.setState({currentPlayer: newCurrentPlayer});
    }

    AmIWinner(newPlayerDeck){
        if(newPlayerDeck.length==0){
            this.setState({isGameOver:true, amIwinner:true, gameOverMessage:"you won!!", undoOrPrev:"prev"})
            
        }
    }
    reSizeMatrix(Matrix){
        var newMatrix= new Array(Matrix.length+2);
        for (var i = 0; i < Matrix.length+2; i++) {
            newMatrix[i] = new Array(Matrix.length+2).fill(null);
        }
        for(var i=0; i < Matrix.length; i++){
            for(var j=0; j < Matrix.length; j++){
                newMatrix[i+1][j+1]=Matrix[i][j];
            }
        }
        return newMatrix;
    }
    bringFirstIdxOfCellId(cellId){
        var i=0;
        while(cellId.charAt(i)!='-'){
            i++;
        }
        var number=cellId.substring(4,i);
        return number;
    }
    bringSecondIdxOfCellId(cellId){
        var i=0;
        while(cellId.charAt(i)!='-'){
            i++;
        }
        var number=cellId.substring(i+1,cellId.length);
        return number;
    }
    chosePositionToTile(Matrix, i, j){
        var chosen=this.state.chosenTile;
        var position;
        if(Matrix[i-1][j]!==null){
            if((Matrix[i-1][j].position=="FirstLeft" || Matrix[i-1][j].position=="FirstRight") && Matrix[i-1][j].First==Matrix[i-1][j].Second ){
                if(chosen.First==Matrix[i-1][j].First){
                    position="FirstUp";
                }
                if(chosen.Second==Matrix[i-1][j].First){
                    position="FirstDown";
                }
            }
            else if(Matrix[i-1][j].position=="FirstUp"){
                if(chosen.First==Matrix[i-1][j].Second){
                    position="FirstUp";
                }
                if(chosen.Second==Matrix[i-1][j].Second){
                    position="FirstDown";
                }
                if(chosen.Second==Matrix[i-1][j].Second && chosen.First==Matrix[i-1][j].Second){
                    position="FirstLeft";
                }
            }
            else if(Matrix[i-1][j].position=="FirstDown"){
                if(chosen.First==Matrix[i-1][j].First){
                    position="FirstUp";
                }
                if(chosen.Second==Matrix[i-1][j].First){
                    position="FirstDown";
                }
                if(chosen.Second==Matrix[i-1][j].First && chosen.First==Matrix[i-1][j].First){
                    position="FirstLeft";
                }
            }
            else{

            }
        }
        if(Matrix[i][j-1]!==null){
            if((Matrix[i][j-1].position=="FirstUp" || Matrix[i][j-1].position=="FirstDown") && Matrix[i][j-1].First==Matrix[i][j-1].Second ){
                if(chosen.First==Matrix[i][j-1].First){
                    position="FirstLeft";
                }
                if(chosen.Second==Matrix[i][j-1].First){
                    position="FirstRight";
                }
            }
            else if(Matrix[i][j-1].position=="FirstLeft"){
                if(chosen.First==Matrix[i][j-1].Second){
                    position="FirstLeft";
                }
                if(chosen.Second==Matrix[i][j-1].Second){
                    position="FirstRight";
                }
                if(chosen.Second==Matrix[i][j-1].Second && chosen.First==Matrix[i][j-1].Second){
                    position="FirstUp";
                }
                
            }
            else if(Matrix[i][j-1].position=="FirstRight"){
                if(chosen.First==Matrix[i][j-1].First){
                    position="FirstLeft";
                }
                if(chosen.Second==Matrix[i][j-1].First){
                    position="FirstRight";
                }
                if(chosen.Second==Matrix[i][j-1].First && chosen.First==Matrix[i][j-1].First){
                    position="FirstUp";
                }
            }
            else{
                
            }
        }
        if(Matrix[i][j+1]!=null){
            if((Matrix[i][j+1].position=="FirstUp" || Matrix[i][j+1].position=="FirstDown") && Matrix[i][j+1].First==Matrix[i][j+1].Second ){
                if(chosen.First==Matrix[i][j+1].First){
                    position="FirstRight";
                }
                if(chosen.Second==Matrix[i][j+1].First){
                    position="FirstLeft";
                }
            }
            else if(Matrix[i][j+1].position=="FirstLeft"){
                if(chosen.First==Matrix[i][j+1].First){
                    position="FirstRight";
                }
                if(chosen.Second==Matrix[i][j+1].First){
                    position="FirstLeft";
                }
                if(chosen.Second==Matrix[i][j+1].First && chosen.First==Matrix[i][j+1].First){
                    position="FirstUp";
                }
            }
            else if(Matrix[i][j+1].position=="FirstRight"){
                if(chosen.First==Matrix[i][j+1].Second){
                    position="FirstRight";
                }
                if(chosen.Second==Matrix[i][j+1].Second){
                    position="FirstLeft";
                }
                if(chosen.Second==Matrix[i][j+1].Second && chosen.First==Matrix[i][j+1].Second){
                    position="FirstUp";
                }
            }
            else{
                
            }
        }  
        if(position===undefined){
            if((Matrix[i+1][j].position=="FirstLeft" || Matrix[i+1][j].position=="FirstRight") && Matrix[i+1][j].First==Matrix[i+1][j].Second ){
                if(chosen.First==Matrix[i+1][j].First){
                    position="FirstDown";
                }
                if(chosen.Second==Matrix[i+1][j].First){
                    position="FirstUp";
                }
            }
            else if(Matrix[i+1][j].position=="FirstUp"){
                if(chosen.First==Matrix[i+1][j].First){
                    position="FirstDown";
                }
                if(chosen.Second==Matrix[i+1][j].First){
                    position="FirstUp";
                }
                if(chosen.Second==Matrix[i+1][j].First && chosen.First==Matrix[i+1][j].First){
                    position="FirstLeft";
                }
            }
            else if(Matrix[i+1][j].position=="FirstDown"){
                if(chosen.First==Matrix[i+1][j].Second){
                    position="FirstDown";
                }
                if(chosen.Second==Matrix[i+1][j].Second){
                    position="FirstUp";
                }
                if(chosen.Second==Matrix[i+1][j].Second && chosen.First==Matrix[i+1][j].Second){
                    position="FirstLeft";
                }
            }
            else{
                
            }
        }
        return position;
    }
    goPrev(){
        if(!this.state.isGameOver){
            if(this.state.historySize>0){
                var history=this.deepCoy(this.state.history[this.state.history.length-1]);
                var newHistory=this.state.history;
                newHistory.length=newHistory.length-1;
                var newHistorySize=this.state.historySize-1;
                this.setState({gameCash:history.gameCash,boardMatrix: history.boardMatrix, score: history.score, playerDeck:history.playerDeck, numOfTurns:history.numOfTurns, history:newHistory, chosenTile:null, boardSize:history.boardSize, historySize:newHistorySize});
            }
        }
        else{
            if(this.state.historySize>0){
                var history=this.deepCoy(this.state.history[this.state.historySize-1]);
                var newHistorySize=this.state.historySize-1
                this.setState({gameCash:history.gameCash,boardMatrix: history.boardMatrix, score: history.score, playerDeck:history.playerDeck, numOfTurns:history.numOfTurns, chosenTile:null, boardSize:history.boardSize, historySize:newHistorySize});
            }
        }
    }
    goNext(){
        if(this.state.historySize<this.state.history.length){
            var history=this.deepCoy(this.state.history[this.state.historySize+1]);
            var newHistorySize=this.state.historySize+1;
            this.setState({gameCash:history.gameCash,boardMatrix: history.boardMatrix, score: history.score, playerDeck:history.playerDeck, numOfTurns:history.numOfTurns, chosenTile:null, boardSize:history.boardSize, historySize:newHistorySize});
        }

    }
    startNewGame(){

        let newGameStartTime = new Date().getTime();
        let currentPlayerInitializer ={id:'1',numOfTurns:0,totalTime:0,startTurnTimer:0,endTurnTimer:0,numOfTilesFromCash:0,avgActionTime:0};

        //need to clear History

        let  cash=[] ;
        for(var i=0; i <7;i++){
            for(var j=i; j<7;j++){
                cash.push({First: i, Second: j});
            }
        }
        var scoreInitializer=0;

        let playerDeck = [];

        for(var i=0; i < 6;i++){
            var RandomNumber = Math.floor(Math.random() * cash.length);
            playerDeck.push(cash[RandomNumber]);
            scoreInitializer+=cash[RandomNumber].First+cash[RandomNumber].Second;
            cash = cash.filter(item => ((item.First !== cash[RandomNumber].First )|| (item.Second !== cash[RandomNumber].Second)));
        }
        var boardMatrix= new Array(9);
        for (var i = 0; i < boardMatrix.length; i++) {
            boardMatrix[i] = new Array(9).fill(null);
        }

        let newIsGameOver = false;
        this.setState({numOfTurns:0,isGameOver:newIsGameOver,score:scoreInitializer,firstTurn:true,boardSize:9,boardMatrix:boardMatrix,gameStartTime:newGameStartTime,currentPlayer:currentPlayerInitializer,gameCash:cash,playerDeck:playerDeck, history:[], historySize:0,undoOrPrev:"undo"});
    }

    deepCoy(obj){
        return JSON.parse(JSON.stringify(obj));
    }
    render(){
        return(
            <div>
                    <div className="center">
                        <div className="scroll">
                            <Board matrixBoard={this.state.boardMatrix} size={this.state.boardSize} validCells={this.state.validCells} func={this.handleOnClickTable} tileToPut={this.state.chosenTile}></Board> 
                        </div>
                        <h1 className="winnerPresenting"  hidden={!this.state.isGameOver}>{this.state.gameOverMessage}</h1>
                        <img src={require('./gameover.png')} height="57px" hidden={!this.state.isGameOver} ></img>
                        <Player playerDeck = {this.state.playerDeck} func={this.handleOnClickTile} prevChosen={this.state.prevChosen} isDisable={this.state.isGameOver}></Player>
                        <Statistics gameState={this.state} gamescore={this.state.score} gameStartTime={this.state.gameStartTime} cashNumber={this.state.numOfTilesTaken} turn={this.state.numOfTurns}  ></Statistics>
                    </div>
                <div className="left">
                    <Cash bringTile={this.bringTileFromCash} isDisable={this.state.isGameOver}></Cash>
                    <button className="prevState" onClick={this.goPrev}>{this.state.undoOrPrev}</button>
                    <button hidden={!this.state.isGameOver} className="nextState" onClick={this.goNext}>next</button>
                </div>
                <button className="restart" onClick={this.startNewGame}>restart</button>  
            </div>
        );

    }
}

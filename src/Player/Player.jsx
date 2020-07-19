import React, { Component } from "react";
import Tile from "../Tiles/Tile.jsx";
import '../Tiles/tileCss.css';
class Player extends Component{
    constructor(props){
        super(props);
        let initDeck=[null];
        this.state={
            myDeck: initDeck,
            i:0,

        }
    }
    render()
    {
        let myTiles=this.props.playerDeck.map(value=> <Tile key={value.First*10+value.Second} 
            First={value.First}
             Second={value.Second}
              foo1={this.props.func}
              isDisable={this.props.isDisable}
              className="noMargin"></Tile>);
        return (
        <div>{myTiles}</div>
        );
    }    
}
export default Player 
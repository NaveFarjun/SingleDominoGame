import React, { Component } from "react";
import './TileCash.css'

class Cash extends Component{
    constructor(props){
        super(props);
        this.handleClick=this.handleClick.bind(this);
    }

    handleClick(){
        this.props.bringTile()
    }
    

    render(){
        return(                                                                      
            <button className="button" onClick={this.handleClick}  disabled={this.props.isDisable}>Give Me Tile!</button>
        )
    }
}

export default Cash;
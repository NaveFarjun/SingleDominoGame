import React, { Component } from "react";
import './tileCss.css';

class  Tile extends Component{
    constructor(props){
        super(props);
        //this.handleClick=this.handleClick.bind(this);
        this.state={
            isWithMargin: false,
        }
        this.handleClick=this.handleClick.bind(this);
    }
    handleClick(){
        if(!this.props.isDisable){
            this.setState({isWithMargin: true});
            this.props.foo1(this.props.First,this.props.Second);
        }
    }
    render(){
         var class_name=this.props.position;
    return(
        <img className={class_name} src={require('./domino tiles/'+this.props.First+this.props.Second+'.png')} width="65px" height="57px" onClick={this.handleClick}></img>
    );
    }
}
export default Tile;

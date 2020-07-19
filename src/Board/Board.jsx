import React, { Component } from 'react'
import './boardCss.css'
import Tile from '../Tiles/Tile.jsx'

 class Table extends Component {
  constructor(props){
    super(props);
  }
  
  render(){
    let rows = [];
    for (var i = 0; i < this.props.size; i++){
      let rowID = `row${i}`
      let cell = [];
      for (var idx = 0; idx < this.props.size; idx++){
        let cellID = `cell${i}-${idx}`
        if(this.props.matrixBoard[i][idx]==null){
          if(this.props.validCells.includes(`cell${i}-${idx}`)){
            cell.push(<td className="valid" key={cellID} id={cellID} onClick={this.props.func.bind(this,cellID)}></td>)
          }
          else{
            cell.push(<td key={cellID} id={cellID} ><img src={require("./white.png")}  width="60px" height="40px"></img></td>)
          }
        }
        else{
          var first=this.props.matrixBoard[i][idx].First;
          var second=this.props.matrixBoard[i][idx].Second;
          cell.push(<td key={cellID} id={cellID}><Tile position={this.props.matrixBoard[i][idx].position} First={first} Second={second}></Tile></td>);
        }
      }
      rows.push(<tr key={i} id={rowID}>{cell}</tr>)
    }
    return(
      <div className="container">
        <div className="row">
          <div className="col s12 board">
            <table id="simple-board">
               <tbody>
                 {rows}
               </tbody>
             </table>
          </div>
        </div>
      </div>
    )
  }
}
export default Table 
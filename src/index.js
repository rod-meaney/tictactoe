import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
  function Square(props) {
      return (
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button>
      );
    }
  
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
         value={this.props.squares[i]}
         onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      let result = '';
      let count = 0;
      for (let i = 0; i < 3; i++) {
        result = result + (<div className="board-row"></div>);
        for (let j = 0; j < 3; j++) {
          result = result + this.renderSquare(count);
          count++;
        }
      }
      //the above is quite wrong!
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [{squares: Array(9).fill(null), turn:null}],
        xIsNext: true,
        stepNumber: 0,
      }
    }

    handleClick(i){
      const history =  this.state.history.slice(0, this.state.stepNumber + 1);
      const current  = history[history.length -1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        //if there is a winner already OR the square already has a value - do nothing
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{squares: squares, turn: i}]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      })
    }

    jumpTo(step){
     this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      }); 
    }

    render() {
      const history = this.state.history;
      const current  = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move ('+row_val(history[move].turn)+' '+col_val(history[move].turn)+')#' + move :
          'Go to start';
        return (
          <li key={move}>
            <button 
              style={ move === this.state.stepNumber ? {fontWeight:'bold'} : {fontWeight:'normal'}}
              onClick={() => this.jumpTo(move)}>{desc}
            </button>
          </li>
        );
      });

      let status;
      if (winner){
        status = "Winner: " + winner;
      } else {
        status = 'Next player: '+(this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function row_val(i){
    if (i<3) return 1;
    if (i<6) return 2;
    if (i<9) return 3;
  }

  function col_val(i){
    switch (i) {
      case 0:
      case 3:
      case 6: 
        return 1;
      case 1:
      case 4:
      case 7: 
        return 2;
      case 2:
      case 5:
      case 8: 
        return 3;
      default: break;
    }
  } 
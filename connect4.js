/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;//x axis
const HEIGHT = 6;//y axis

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

let filledCells = 0;

let gameIsRunning = true;


/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {

    for (let y = 0; y < HEIGHT; y++) {
        board.push([]);
      for(let x = 0; x < WIDTH; x++){
        board[y].push(null);
        }
      }
      return board;
    }

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
 
  let htmlBoard = document.querySelector("#board");

  // create the top row 
  var top = document.createElement("tr");
  //add id
  top.setAttribute("id", "column-top");
  //add event listener, event fired on click
  top.addEventListener("click", handleClick);
  //add cells depending on the width constant, adding id with index (x coordinate)
  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create and add table rows and fill it with cells depending on width
  //add id with cell coordinates
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  
  for(let y = HEIGHT - 1; y > -1; y--){
    let cell = document.getElementById(`${y}-${x}`);
    if(cell.children.length===0){
      return y;
    } 
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let piece = document.createElement("div");
  piece.setAttribute("class", `p${currPlayer} piece`);
  let cell = document.getElementById(`${y}-${x}`);
  cell.appendChild(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  gameIsRunning = false;
  setTimeout(() => {

    alert(msg);
  }, 0)
}

/** handleClick: handle click of column top to play piece 
 * There are several pieces to write/fix here:

this never updates the board variable with the player #. Fix.
add a check for “is the entire board filled” [hint: the JS every method on arrays would be especially nice here!]
add code to switch currPlayer between 1 and 2. This would be a great place for a ternary function.
*/

function handleClick(evt) {
  if(gameIsRunning == false)
    return;
  // get x from ID of clicked cell
  var x = +evt.target.id;
 

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }


  // place piece in board and add to HTML table
  placeInTable(y, x);

  // add line to update in-memory board 
  
  board[y][x] = currPlayer;
  
 
  // check for TIE
  // check if all cells in board are filled; if so call, call endGame

  filledCells = filledCells + 1;
    
    if(filledCells === WIDTH * HEIGHT) {
      return endGame(`Game ended in a tie!`);
    }
  
  // check for win
    if (checkForWin()) {
      return endGame(`Player ${currPlayer} won!`);
    }
  
  // switch players
    if(currPlayer===1) {
      currPlayer = 2;
    } else {
      currPlayer = 1;
    }
  };

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer


    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (var y = 0; y < HEIGHT; y++) {//loop through all the rows
    for (var x = 0; x < WIDTH; x++) {//loop though all the cells in a row
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];//create an array with four next cells horizontally //cheking all the cells everytime?
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];//create an array with four next cells vertically//checking all the the cells everytime?
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];//create an array with four next cells moving one cell up, one to the right
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];//create an array with four next cells moving one cell up, one to the left

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {//pass created arrays to _win function that checks if all four cells in any of them have the same current player
        return true;
      }
    }
  }
}

makeBoard();

makeHtmlBoard();

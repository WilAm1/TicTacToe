const GameBoard = (function() {
    let _gameTiles = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const getBoard = () => _gameTiles;
    const changeTile = (n, mark) => {
        _gameTiles.splice(n, 1, mark);
        console.log(_gameTiles);
    };
    const _winningCombinations = [
        [1, 5, 9],
        [1, 2, 3],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [4, 5, 6],
        [7, 8, 9]
    ];
    const _checkGameOver = () => {

    };
    return { getBoard, changeTile }

})();

const gameControl = (function() {
    const _makeDiv = (tile, arrNum) => {
        const div = document.createElement('div');
        div.classList.add('tile');
        div.setAttribute('data-array-number', arrNum);
        div.textContent = tile;
        return div
    }

    const gameBoardDOM = document.querySelector('.game-board');
    const renderBoard = (board) => {
        for (let i = 0; i < board.length; i++) {
            const tileDiv = _makeDiv(board[i], i);
            gameBoardDOM.appendChild(tileDiv);
        }
    }


    return { renderBoard }
})();


// Player Factory function
const Player = function(name, symbol, bool) {
    let _score = 0;
    let _isMyTurn = bool;
    let _markedTiles = [];
    const marker = symbol;
    const changeMyTurn = () => {
        _isMyTurn = (_isMyTurn) ? false : true;
    };
    const addMarkTile = (n) => _markedTiles.push(n);
    const getMarkedTiles = () => _markedTiles;
    const getMyTurn = () => _isMyTurn;
    const getScore = () => _score;
    const getName = () => name;

    return { marker, getName, getScore, getMarkedTiles, addMarkTile, changeMyTurn, getMyTurn }
};

const player1 = Player('wil', '❌', true);
const player2 = Player('Bot', '⭕', false);




const whichPlayerTurn = (p1, p2) => (p1 && !(p2)) ? 1 : 0;

const changePlayerTurns = () => {
    player1.changeMyTurn();
    player2.changeMyTurn();
}


gameControl.renderBoard(GameBoard.getBoard());

const gameBoardTiles = Array.from(document.querySelectorAll('div.tile'));
gameBoardTiles.forEach(tile => {
    tile.addEventListener('click', (e) => {
        const p1Turn = player1.getMyTurn(),
            p2Turn = player2.getMyTurn();
        const mark = (whichPlayerTurn(p1Turn, p2Turn)) ? player1.marker : player2.marker;
        e.target.textContent = mark;
        // disables click event on the css
        e.target.classList.add('clicked');
        console.log(e.target);
        changePlayerTurns();
        const tileNum = e.target.getAttribute('data-array-number');
        GameBoard.changeTile(tileNum, mark);

    });
});
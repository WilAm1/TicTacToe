const GameBoard = (function() {
    let _gameTiles = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const getBoard = () => _gameTiles;
    const changeLetter = () => {

    };
    return { getBoard, }


})();

const gameControl = (function() {
    const _makeDiv = (tile) => {
        const div = document.createElement('div');
        div.classList.add('tile');
        div.textContent = tile;
        return div
    }

    const gameBoardDOM = document.querySelector('.game-board');
    const renderBoard = (board) => {
        board.forEach(tile => {
            const tileDiv = _makeDiv(tile);
            gameBoardDOM.appendChild(tileDiv);
        });
    }


    return { renderBoard }
})();


// Player Factory function
const Player = function(name, symbol, bool) {
    let _score = 0;
    const marker = symbol;
    let _isMyTurn = bool;
    const changeMyTurn = () => {
        _isMyTurn = (_isMyTurn) ? false : true
    };
    const getMyTurn = () => _isMyTurn
    const getScore = () => _score;
    const getName = () => name;

    return { marker, getName, getScore, changeMyTurn, getMyTurn }
};

const player1 = Player('wil', '❌', true);
const player2 = Player('Bot', '⭕', false);



gameControl.renderBoard(GameBoard.getBoard());
const gameBoardTiles = document.querySelectorAll('.tile');

const whichPlayerTurn = (p1, p2) => (!!p1) ? 1 : 0;
const changePlayerTurns = () => {
    player1.changeMyTurn();
    player2.changeMyTurn();
}

gameBoardTiles.forEach(tile => {
    tile.addEventListener('click', (e) => {
        const mark = (whichPlayerTurn(player1.getMyTurn(), player2.getMyTurn())) ? player1.marker : player2.marker;
        e.target.textContent = mark;
        changePlayerTurns();

    });
})
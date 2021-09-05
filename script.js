const GameBoard = (function() {
    let _gameTiles = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const getBoard = () => _gameTiles;

    return { getBoard, }


})();

const displayController = (function() {

    const _makeDiv = (tile) => {
        const div = document.createElement('div');
        div.classList.add('tile');
        div.textContent = tile;
        return div
    }
    const gameBoardDOM = document.querySelector('.game-board');
    console.log(gameBoardDOM);
    const renderBoard = (board) => {
        board.forEach(tile => {
            const tileDiv = _makeDiv(tile);
            gameBoardDOM.appendChild(tileDiv);
        });

    }


    return { renderBoard }
})();
console.log(displayController);
displayController.renderBoard(GameBoard.getBoard());















// Player Factory function
const Player = function(name) {
    const getName = () => name

    return { getName }
};
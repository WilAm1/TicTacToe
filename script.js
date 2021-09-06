const GameBoard = (function() {
    let _gameTiles = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    const getBoard = () => _gameTiles;
    const changeTile = (n, mark) => {
        _gameTiles.splice(n, 1, mark);
        // console.log(_gameTiles);
    };
    const _winningCombinations = [
        [1, 5, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 5, 7],
        [3, 6, 9],
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];
    const _checkCombination = (combi, pArr) => {
        return combi.every((value) => pArr.includes(value))
    };
    const checkIfDraw = () => !_gameTiles.includes(' ');
    const checkWin = (arr) => {
        const sortedArr = arr.sort();
        // console.log(sortedArr);
        // Loops to all possible winning combination
        for (let i = 0; i < _winningCombinations.length; i++) {
            if (_checkCombination(_winningCombinations[i], sortedArr)) return true
        }
        return false
    };
    return { getBoard, changeTile, checkWin, checkIfDraw }

})();

const gameControl = (function() {
    let isGameOver = false;
    const _makeDiv = (tile, arrNum) => {
        const div = document.createElement('div');
        div.classList.add('tile');
        div.setAttribute('data-array-number', arrNum);
        div.setAttribute('data-board-number', arrNum + 1);
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
    const stopGame = (player) => {
        const winningDiv = document.createElement('div');
        const winningText = document.createElement('p');
        console.log(player.getWin());
        if (!player.getWin()) {
            winningText.textContent = 'It\'s A draw.'
        } else {
            winningText.textContent = `${player.getName()} wins!`;

        }
        winningDiv.appendChild(winningText);
        const announcementDiv = document.querySelector('.announcement');
        announcementDiv.appendChild(winningDiv);

    }

    return { renderBoard, isGameOver, stopGame }
})();


// Player Factory function
const Player = function(name, symbol, bool) {
    let _score = 0;
    let _isMyTurn = bool;
    let _markedTiles = [];
    let _wins = false;
    const marker = symbol;
    // public methods
    const changeMyTurn = () => {
        _isMyTurn = (_isMyTurn) ? false : true;
    };
    const addMarkTile = (n) => _markedTiles.push(n);
    const changeWin = () => {
        _wins = true;
    }
    const getWin = () => _wins
    const getMarkedTiles = () => _markedTiles;
    const getMyTurn = () => _isMyTurn;
    const getScore = () => _score;
    const getName = () => name;

    return {
        marker,
        getName,
        getScore,
        getMarkedTiles,
        addMarkTile,
        getWin,
        changeWin,
        changeMyTurn,
        getMyTurn
    }
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
const toggleBoardClick = () => {
    gameBoardTiles.forEach(tile => {
        tile.classList.toggle('disabled');
    });
};


gameBoardTiles.forEach(tile => {
    tile.addEventListener('click', (e) => {
        const tileArrNum = e.target.getAttribute('data-array-number');
        const tileBoardNum = e.target.getAttribute('data-board-number');
        if (tile.classList.contains('disabled')) return
            // disables click event on the css
        const p1Turn = player1.getMyTurn(),
            p2Turn = player2.getMyTurn();
        let mark = '';
        const playerTurn = (whichPlayerTurn(p1Turn, p2Turn)) ? player1 : player2;
        mark = playerTurn.marker;
        GameBoard.changeTile(tileArrNum, mark);
        playerTurn.addMarkTile(Number(tileBoardNum));
        changePlayerTurns();

        const playerTiles = playerTurn.getMarkedTiles();
        const isPlayerWinning = GameBoard.checkWin(playerTiles);

        console.log(GameBoard.checkIfDraw());

        e.target.classList.add('clicked');
        e.target.textContent = mark;
        if (isPlayerWinning) playerTurn.changeWin(isPlayerWinning);

        if (isPlayerWinning || GameBoard.checkIfDraw()) {
            toggleBoardClick();
            gameControl.stopGame(playerTurn);
        }

    });
});
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
        // Loops to all possible winning combination
        for (let i = 0; i < _winningCombinations.length; i++) {
            if (_checkCombination(_winningCombinations[i], sortedArr)) return true
        }
        return false
    };
    const resetBoard = () => {
        _gameTiles = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    }
    return { getBoard, changeTile, checkWin, checkIfDraw, resetBoard }

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
    const resetPlayer = () => {
        _score = 0;
        _isMyTurn = bool;
        _markedTiles = [];
        _wins = false;
        marker = symbol;
    };

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


const announcementDiv = document.querySelector('.announcement');
const gameControl = (function() {
    let player1 = null;
    let player2 = null;
    let isGameOver = false;
    const _makeDiv = (tile, arrNum) => {
        const div = document.createElement('div');
        div.classList.add('tile');
        div.setAttribute('data-array-number', arrNum);
        div.setAttribute('data-board-number', arrNum + 1);
        div.textContent = tile;
        return div
    }

    const gameBoardDOM = document.querySelector('.game-container');
    const renderBoard = (board) => {
        gameBoardDOM.removeChild(gameBoardDOM.firstChild);
        const gameBoardContainer = document.createElement('div');
        gameBoardContainer.classList.add('game-board');
        for (let i = 0; i < board.length; i++) {
            const tileDiv = _makeDiv(board[i], i);
            gameBoardContainer.appendChild(tileDiv);
        }
        gameBoardDOM.appendChild(gameBoardContainer);
    }
    const stopGame = (player) => {
        const winningDiv = document.createElement('div');
        const winningText = document.createElement('p');
        if (player.getWin()) {
            winningText.textContent = `${player.getName()} wins!`;
        } else {
            winningText.textContent = 'It\'s A draw.'
        }
        winningDiv.appendChild(winningText);
        announcementDiv.appendChild(winningDiv);
        _resetGame();
    }
    const _resetGame = () => {
        player1 = null;
        player2 = null;

    };
    const _initiliazePlayers = () => {
        player1 = Player('wil', '❌', true);
        player2 = Player('Bot', '⭕', false);
    };

    const getPlayers = () => {
        if (player1 === null || player2 === null) {
            _initiliazePlayers()
        }
        return [player1, player2]
    };

    const getDivTiles = () => {
        return Array.from(document.querySelectorAll('div.tile'))
    };

    return { getDivTiles, renderBoard, isGameOver, stopGame, getPlayers, }
})();



// console.log(gameControl.getPlayers())


const whichPlayerTurn = (p1, p2) => (p1 && !(p2)) ? 1 : 0;

const changePlayerTurns = (p1, p2) => {
    p1.changeMyTurn();
    p2.changeMyTurn();
}

gameControl.renderBoard(GameBoard.getBoard());

let gameBoardTiles = gameControl.getDivTiles();
console.log(gameBoardTiles);

const toggleBoardClick = () => {
    gameBoardTiles.forEach(tile => {
        tile.classList.toggle('disabled');
    });
};

const addTileListener = (board) => {
    board.forEach(tile => {
        tile.addEventListener('click', (e) => {

            if (tile.classList.contains('disabled')) return
            const [player1, player2] = gameControl.getPlayers();
            console.log(player1)
            const tileArrNum = e.target.getAttribute('data-array-number');
            const tileBoardNum = e.target.getAttribute('data-board-number');

            const p1Turn = player1.getMyTurn(),
                p2Turn = player2.getMyTurn();

            // chooses which player to use
            const playerTurn = (whichPlayerTurn(p1Turn, p2Turn)) ? player1 : player2;
            // switch to opposite player next turn
            changePlayerTurns(player1, player2);
            let mark = playerTurn.marker;

            GameBoard.changeTile(tileArrNum, mark);
            playerTurn.addMarkTile(Number(tileBoardNum));
            // get player array markss
            const playerTiles = playerTurn.getMarkedTiles();
            const isPlayerWinning = GameBoard.checkWin(playerTiles);
            console.log(GameBoard.checkIfDraw());

            // disables click event on the css
            e.target.classList.add('clicked');
            e.target.textContent = mark;


            if (isPlayerWinning || GameBoard.checkIfDraw()) {
                toggleBoardClick();
                if (isPlayerWinning) playerTurn.changeWin();
                gameControl.stopGame(playerTurn);
            }

        });
    });
}
addTileListener(gameBoardTiles)
    // reset
const resetBtn = document.createElement('button');
resetBtn.classList.add('reset-btn');
resetBtn.textContent = 'Restart';
announcementDiv.appendChild(resetBtn);
resetBtn.addEventListener('click', () => {
    GameBoard.resetBoard();
    gameControl.renderBoard(GameBoard.getBoard());
    toggleBoardClick();
    addTileListener(Array.from(document.querySelectorAll('div.tile')))
});
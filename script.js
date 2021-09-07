const Board = (function() {
    let _gameTiles = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    const getBoard = () => _gameTiles;
    const changeTile = (n, mark) => {
        _gameTiles.splice(n, 1, mark);
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
    let _isMyTurn = bool;
    // array of marked board numbers
    let _markedTiles = [];
    let _win = false;
    const marker = symbol;
    // public methods
    const changeTurn = () => {
        _isMyTurn = (_isMyTurn) ? false : true;
    };
    const addMark = (n) => _markedTiles.push(n);
    const changeToWin = () => {
        _win = true;
    }
    const getWin = () => _win
    const getPlayerTiles = () => _markedTiles;
    const getMyTurn = () => _isMyTurn;
    const getScore = () => _score;
    const getName = () => name;
    return {
        marker,
        getName,
        getScore,
        getPlayerTiles,
        addMark,
        getWin,
        changeToWin,
        changeTurn,
        getMyTurn
    }
};

const announceElement = (element) => {
    const announcementDiv = document.querySelector('.announcement');
    announcementDiv.appendChild(element);
};
const gameControl = (function() {
    let player1 = null;
    let player2 = null;
    const _makeDiv = (arrNum) => {
        const div = document.createElement('div');
        div.classList.add('tile');
        div.setAttribute('data-array-number', arrNum);
        return div
    }

    const renderBoard = (board) => {
        const gameContainer = document.querySelector('.game-container');
        // removes the first child to 
        gameContainer.removeChild(gameContainer.firstChild);
        const gameBoardContainer = document.createElement('div');
        gameBoardContainer.classList.add('game-board');
        for (let i = 0; i < board.length; i++) {
            const tileDiv = _makeDiv(i);
            gameBoardContainer.appendChild(tileDiv);
        }
        gameContainer.appendChild(gameBoardContainer);
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
        announceElement(winningDiv);
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
    const toggleBoardClick = (board) => {
        board.forEach(tile => {
            tile.classList.toggle('disabled');
        });
    };
    const changePlayerTurns = (p1, p2) => {
        p1.changeTurn();
        p2.changeTurn();
    }

    return {
        changePlayerTurns,
        getDivTiles,
        renderBoard,
        stopGame,
        getPlayers,
        toggleBoardClick
    }
})();



const whichPlayerTurn = (p1, p2) => {
    return (p1.getMyTurn() && !(p2.getMyTurn())) ? p1 : p2;
}






const addTileListener = (board) => {
    board.forEach(tile => {
        tile.addEventListener('click', (e) => {

            if (tile.classList.contains('disabled')) return

            const [player1, player2] = gameControl.getPlayers();
            // console.log(player1)

            const tileArrNum = e.target.getAttribute('data-array-number');
            // chooses which player to use
            const playerTurn = (whichPlayerTurn(player1, player2));
            // switch to opposite player next turn
            gameControl.changePlayerTurns(player1, player2);
            let mark = playerTurn.marker;

            Board.changeTile(tileArrNum, mark);
            playerTurn.addMark(Number(tileArrNum) + 1);
            // get player array markss
            const playerTiles = playerTurn.getPlayerTiles();
            const isPlayerWinning = Board.checkWin(playerTiles);

            // disables click event on the css
            e.target.classList.add('clicked');
            e.target.textContent = mark;

            // Check if someone wins or it is a draw
            if (isPlayerWinning || Board.checkIfDraw()) {
                gameControl.toggleBoardClick(board);
                if (isPlayerWinning) playerTurn.changeToWin();
                gameControl.stopGame(playerTurn);
            }

        });
    });
}


gameControl.renderBoard(Board.getBoard());

let gameBoardTiles = gameControl.getDivTiles();
console.log(gameBoardTiles);
addTileListener(gameBoardTiles);

// reset
const resetBtn = document.querySelector('.reset-btn');
announceElement(resetBtn);
resetBtn.addEventListener('click', () => {
    Board.resetBoard();
    const newBoard = Board.getBoard();
    gameControl.renderBoard(newBoard);
    addTileListener(Array.from(document.querySelectorAll('div.tile')))
});
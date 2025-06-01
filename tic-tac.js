        let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';
        let gameActive = true;
        let isAIMode = false;
        let scores = { X: 0, O: 0, draw: 0 };

        const cells = document.querySelectorAll('.cell');
        const gameStatus = document.getElementById('gameStatus');
        const resetBtn = document.getElementById('resetBtn');
        const twoPlayerBtn = document.getElementById('twoPlayerBtn');
        const aiPlayerBtn = document.getElementById('aiPlayerBtn');
        const scoreX = document.getElementById('scoreX');
        const scoreO = document.getElementById('scoreO');
        const scoreDraw = document.getElementById('scoreDraw');

        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6] 
        ];

        
        function initGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameActive = true;
            gameStatus.textContent = isAIMode ? "Your turn (X)" : "Player X's turn";
            
            cells.forEach(cell => {
                cell.textContent = '';
                cell.disabled = false;
                cell.classList.remove('x', 'o', 'winning-cell');
            });
        }

        function handleCellClick(e) {
            const index = parseInt(e.target.dataset.index);
            
            if (board[index] !== '' || !gameActive) {
                return;
            }
            
            makeMove(index, currentPlayer);
            
            if (gameActive && isAIMode && currentPlayer === 'O') {
                setTimeout(makeAIMove, 500);
            }
        }

        function makeMove(index, player) {
            board[index] = player;
            const cell = cells[index];
            cell.textContent = player;
            cell.classList.add(player.toLowerCase());
            cell.disabled = true;
            
            if (checkWinner()) {
                gameActive = false;
                highlightWinningCells();
                updateScore(player);
                gameStatus.textContent = isAIMode && player === 'O' ? 
                    "AI wins!" : `Player ${player} wins!`;
            } else if (board.every(cell => cell !== '')) {
                gameActive = false;
                updateScore('draw');
                gameStatus.textContent = "It's a draw!";
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (isAIMode) {
                    gameStatus.textContent = currentPlayer === 'X' ? 
                        "Your turn (X)" : "AI is thinking...";
                } else {
                    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
                }
            }
        }

        function checkWinner() {
            return winningCombinations.some(combination => {
                const [a, b, c] = combination;
                return board[a] && board[a] === board[b] && board[a] === board[c];
            });
        }

        function highlightWinningCells() {
            winningCombinations.forEach(combination => {
                const [a, b, c] = combination;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    cells[a].classList.add('winning-cell');
                    cells[b].classList.add('winning-cell');
                    cells[c].classList.add('winning-cell');
                }
            });
        }

        function makeAIMove() {
            if (!gameActive || currentPlayer !== 'O') return;
            
            const bestMove = getBestMove();
            makeMove(bestMove, 'O');
        }

        function getBestMove() {
            let bestScore = -Infinity;
            let bestMove = 0;
            
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, 0, false);
                    board[i] = '';
                    
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }
            
            return bestMove;
        }

        function minimax(board, depth, isMaximizing) {
            let result = checkGameResult();
            
            if (result !== null) {
                return result;
            }
            
            if (isMaximizing) {
                let bestScore = -Infinity;
                for (let i = 0; i < 9; i++) {
                    if (board[i] === '') {
                        board[i] = 'O';
                        let score = minimax(board, depth + 1, false);
                        board[i] = '';
                        bestScore = Math.max(score, bestScore);
                    }
                }
                return bestScore;
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < 9; i++) {
                    if (board[i] === '') {
                        board[i] = 'X';
                        let score = minimax(board, depth + 1, true);
                        board[i] = '';
                        bestScore = Math.min(score, bestScore);
                    }
                }
                return bestScore;
            }
        }

        function checkGameResult() {
            for (let combination of winningCombinations) {
                const [a, b, c] = combination;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return board[a] === 'O' ? 1 : -1;
                }
            }
            
            if (board.every(cell => cell !== '')) {
                return 0; 
            }
            
            return null; 
        }

        function updateScore(winner) {
            if (winner === 'draw') {
                scores.draw++;
                scoreDraw.textContent = scores.draw;
            } else {
                scores[winner]++;
                if (winner === 'X') {
                    scoreX.textContent = scores.X;
                } else {
                    scoreO.textContent = scores.O;
                }
            }
        }

        function switchMode(mode) {
            isAIMode = mode === 'ai';
            
            twoPlayerBtn.classList.toggle('active', !isAIMode);
            aiPlayerBtn.classList.toggle('active', isAIMode);
            
            initGame();
        }

        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });

        resetBtn.addEventListener('click', initGame);

        twoPlayerBtn.addEventListener('click', () => {
            switchMode('two-player');
        });

        aiPlayerBtn.addEventListener('click', () => {
            switchMode('ai');
        });

        initGame();
import * as Preact from "https://unpkg.com/preact@latest?module";
import { useState } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';

const X = Symbol();
const O = Symbol();
const EMPTY = Symbol();

const symbolToString = symbol =>
    symbol === X ? "X" :
    symbol === O ? "O" :
    " ";

const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const checkWinCondition = (symbol, board) => winningLines.some(([a, b, c]) => 
    board[a] === symbol &&
    board[b] === symbol &&
    board[c] === symbol  
);

const isFilled = board => board.every(symbol => symbol !== EMPTY);

const h = Preact.h;

const Square = ({ symbol, onClick }) => h("button", {
    className: `square square-${symbolToString(symbol).toLowerCase()}`,
    onClick
}, symbolToString(symbol));

const Board = ({ board, makeMove }) => h("div", { id: "board" }, board.map((symbol, i) => h(Square, {
    symbol, onClick: () => makeMove(i)
})));

const Undo = ({ undoMove }) => h("button", { id: "undo", onClick: undoMove }, "Undo");
const Reset = ({ reset }) => h("button", { id: "reset", onClick: reset }, "Reset");

const Prompt = ({ board, currentPlayer }) => h("h1", { id: "prompt" }, 
    isFilled(board) ? "Draw." :
    checkWinCondition(X, board) ? "X wins." :
    checkWinCondition(O, board) ? "O wins." :
    `It is ${symbolToString(currentPlayer)}'s turn.`
);

const TicTacToe = props => {
    const [board, setBoard] = useState(Array(9).fill(EMPTY));
    const [currentPlayer, setCurrentPlayer] = useState(X);

    const [history, setHistory] = useState([]);

    const reset = () => {
        setBoard(Array(9).fill(EMPTY));
        setCurrentPlayer(X);
        setHistory([]);
    };

    const undoMove = () => {
        const [head, ...tail] = history;

        if (head !== undefined) {
            const nextBoard = board.map((symbol, i) => i === head ? EMPTY : symbol);

            setBoard(nextBoard);
            setHistory(tail);
        }
    };

    const makeMove = squareIndex => {
        if (checkWinCondition(X, board) || checkWinCondition(O, board)) return;
        if (board[squareIndex] === EMPTY) {
            const nextBoard = board.map((symbol, i) => i === squareIndex ? currentPlayer : symbol);
        
            setBoard(nextBoard);
            setCurrentPlayer(currentPlayer === X ? O : X);
            setHistory([squareIndex, ...history]);
        }
    };

    return h("div", { id: "tictactoe" }, [
        h(Board, { board, makeMove }),
        h(Undo, { undoMove }),
        h(Prompt, { board, currentPlayer }),
        h(Reset, { reset })
    ]);
};

Preact.render(
    h(TicTacToe),
    document.body
);
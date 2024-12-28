// src/utils/gamePhase.js

export const getGamePhase = (game) => {
    const moveCount = game.moveNumber();
    const fen = game.fen();
    const pieceCount = fen.split(' ')[0].replace(/[^A-Za-z]/g, '').length;
  
    if (moveCount <= 10 && pieceCount >= 28) return 'OPENING';
    if (pieceCount <= 20 && pieceCount >= 10) return 'MIDDLEGAME';
    return 'ENDGAME';
  };
// src/utils/movePatternAnalyzer.js

export const analyzeMovePatterns = (game, move) => {
    const patterns = [];
    const centerSquares = ['e4', 'd4', 'e5', 'd5'];
  
    // Development moves
    if (['n', 'b'].includes(move.piece) && !move.captured) {
      patterns.push({
        type: 'DEVELOPMENT',
        value: 'Piece development'
      });
    }
  
    // Center control
    if (centerSquares.includes(move.to)) {
      patterns.push({
        type: 'CENTER_CONTROL',
        value: 'Center control'
      });
    }
  
    // Castling
    if (move.san.includes('O-O') || move.san.includes('O-O-O')) {
      patterns.push({
        type: 'KING_SAFETY',
        value: 'King safety improvement'
      });
    }
  
    return patterns;
  };
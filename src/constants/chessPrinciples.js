// src/constants/chessPrinciples.js

export const PRIORITY = {
  CRITICAL: 4,    // Checkmate threats, hanging pieces
  HIGH: 3,        // Center control, development in opening
  MEDIUM: 2,      // Piece coordination, general improvements
  LOW: 1          // Nice-to-have improvements
};

export const OPENING_PRINCIPLES = {
  CHECKMATE_DEFENSE: {
    id: 'CHECKMATE_DEFENSE',
    priority: PRIORITY.CRITICAL,
    check: (move, game) => {
      const inCheck = game.inCheck();
      const wasInCheck = game.undo() && game.inCheck();
      game.move(move);
      return wasInCheck && !inCheck;
    },
    positive: "HULK PROUD! GOOD DEFENSE AGAINST CHECK!",
    negative: "MUST DEFEND AGAINST CHECK FIRST!"
  },
  
  HANGING_PIECE: {
    id: 'HANGING_PIECE',
    priority: PRIORITY.CRITICAL,
    check: (move, game) => {
      const moves = game.moves({ verbose: true });
      return moves.some(m => m.captured && m.flags.includes('c'));
    },
    positive: "HULK SEE FREE PIECE! TAKE IT!",
    negative: "HULK SEE FREE PIECE! TAKE IT FIRST!"
  },

  CENTER_CONTROL: {
    id: 'CENTER_CONTROL',
    priority: PRIORITY.HIGH,
    check: (move) => ['e4', 'd4', 'e5', 'd5'].includes(move.to),
    positive: "YES! CONTROL CENTER! MAKE POSITION STRONG!",
    negative: "TRY CONTROL CENTER SQUARES!"
  },

  PIECE_DEVELOPMENT: {
    id: 'PIECE_DEVELOPMENT',
    priority: PRIORITY.HIGH,
    check: (move, game) => {
      if (!['n', 'b'].includes(move.piece)) return false;
      const moves = game.history({ verbose: true });
      const developedPieces = new Set(moves.filter(m => ['n', 'b'].includes(m.piece)).map(m => m.piece + m.from));
      return developedPieces.size < 4;
    },
    positive: "GOOD DEVELOPMENT! PIECES WANT TO FIGHT!",
    negative: "DEVELOP MORE PIECES! GET THEM IN GAME!"
  },
  
  EARLY_QUEEN: {
    id: 'EARLY_QUEEN',
    priority: PRIORITY.HIGH,
    check: (move, game) => move.piece === 'q' && game.moveNumber() <= 10,
    positive: null,
    negative: "TOO EARLY FOR QUEEN! DEVELOP OTHER PIECES FIRST!"
  },

  CASTLING: {
    id: 'CASTLING',
    priority: PRIORITY.HIGH,
    check: (move) => move.san.includes('O-O') || move.san.includes('O-O-O'),
    positive: "GOOD! KING SAFE NOW! ROOKS CONNECTED!",
    negative: null
  },

  KNIGHT_BEFORE_BISHOP: {
    id: 'KNIGHT_BEFORE_BISHOP',
    priority: PRIORITY.LOW,
    check: (move, game) => {
      if (move.piece === 'b') {
        const moves = game.history({ verbose: true });
        return !moves.some(m => m.piece === 'n');
      }
      return false;
    },
    positive: "KNIGHTS BEFORE BISHOPS! HULK APPROVE!",
    negative: "BISHOP BEFORE KNIGHT? CONSIDER KNIGHT FIRST!"
  }
};

export const MIDDLEGAME_PRINCIPLES = {
  CHECKMATE_THREAT: {
    id: 'CHECKMATE_THREAT',
    priority: PRIORITY.CRITICAL,
    check: (move, game) => {
      return game.inCheck() || game.moves().some(m => m.includes('#'));
    },
    positive: "HULK SEE CHECKMATE THREAT! VERY STRONG!",
    negative: "CAREFUL! KING IN DANGER!"
  },

  HANGING_PIECES: {
    id: 'HANGING_PIECES',
    priority: PRIORITY.CRITICAL,
    check: (move, game) => {
      const moves = game.moves({ verbose: true });
      return moves.some(m => m.captured && m.flags.includes('c'));
    },
    positive: "GOOD CAPTURE! TAKE FREE PIECES!",
    negative: "HULK SEE PIECE CAN BE TAKEN! DEFEND OR CAPTURE!"
  },

  FORK_OPPORTUNITY: {
    id: 'FORK_OPPORTUNITY',
    priority: PRIORITY.HIGH,
    check: (move, game) => {
      // After the move, check if we're attacking multiple pieces
      game.move(move);
      const attackingMoves = game.moves({ verbose: true }).filter(m => m.captured);
      game.undo();
      return attackingMoves.length > 1;
    },
    positive: "GOOD FORK! ATTACK MULTIPLE PIECES!",
    negative: null
  },

  ROOK_SEVENTH: {
    id: 'ROOK_SEVENTH',
    priority: PRIORITY.MEDIUM,
    check: (move) => move.piece === 'r' && move.to[1] === '7',
    positive: "STRONG ROOK ON SEVENTH RANK! PRESSURE OPPONENT!",
    negative: null
  },

  PIECE_COORDINATION: {
    id: 'PIECE_COORDINATION',
    priority: PRIORITY.LOW,
    check: (move, game) => {
      // Simple check for pieces supporting each other
      const moves = game.moves({ verbose: true });
      const protectedPieces = moves.filter(m => m.captured && m.flags.includes('c')).length;
      return protectedPieces >= 2;
    },
    positive: "PIECES WORKING TOGETHER WELL!",
    negative: "TRY CONNECT PIECES BETTER!"
  }
};

export const ENDGAME_PRINCIPLES = {
  CHECKMATE_OPPORTUNITY: {
    id: 'CHECKMATE_OPPORTUNITY',
    priority: PRIORITY.CRITICAL,
    check: (move, game) => {
      return game.moves().some(m => m.includes('#'));
    },
    positive: "CHECKMATE POSSIBLE! FINISH THE GAME!",
    negative: null
  },

  KING_ACTIVATION: {
    id: 'KING_ACTIVATION',
    priority: PRIORITY.HIGH,
    check: (move, game) => {
      if (move.piece !== 'k') return false;
      const file = move.to[0];
      const rank = parseInt(move.to[1]);
      return ['d', 'e'].includes(file) && rank >= 4 && rank <= 5;
    },
    positive: "GOOD! KING MUST BE ACTIVE IN ENDGAME!",
    negative: "BRING KING TO CENTER! KING STRONG NOW!"
  },

  PASSED_PAWN: {
    id: 'PASSED_PAWN',
    priority: PRIORITY.MEDIUM,
    check: (move, game) => {
      if (move.piece !== 'p') return false;
      // Simple check for passed pawn - no enemy pawns ahead
      const rank = parseInt(move.to[1]);
      return rank >= 6;
    },
    positive: "PUSH PASSED PAWN! MAKE NEW QUEEN!",
    negative: null
  }
};
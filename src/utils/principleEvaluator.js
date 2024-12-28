// src/utils/principleEvaluator.js

export const checkPrincipleViolations = (game, move, phase) => {
  const violations = [];
  const moveHistory = game.history({ verbose: true });
  const currentMoveNum = moveHistory.length;

  if (phase === 'OPENING') {
    // Early queen moves
    if (move.piece === 'q' && currentMoveNum <= 6) {
      violations.push({
        type: 'EARLY_QUEEN',
        severity: 'HIGH',
        principle: 'Avoid early queen development'
      });
    }

    // Excessive pawn moves
    const pawnMoves = moveHistory.filter(m => m.color === 'w' && m.piece === 'p').length;
    if (move.piece === 'p' && pawnMoves > 2 && currentMoveNum <= 8) {
      violations.push({
        type: 'EXCESSIVE_PAWNS',
        severity: 'MEDIUM',
        principle: 'Develop pieces before pushing pawns'
      });
    }

    // Piece development
    const developedPieces = new Set(
      moveHistory
        .filter(m => m.color === 'w' && ['n', 'b'].includes(m.piece))
        .map(m => m.piece + m.from)
    );
    if (currentMoveNum > 8 && developedPieces.size < 2) {
      violations.push({
        type: 'POOR_DEVELOPMENT',
        severity: 'HIGH',
        principle: 'Develop your pieces'
      });
    }
  }

  return violations;
};
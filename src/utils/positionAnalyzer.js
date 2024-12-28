// src/utils/positionAnalyzer.js

import { 
  OPENING_PRINCIPLES, 
  MIDDLEGAME_PRINCIPLES, 
  ENDGAME_PRINCIPLES 
} from '../constants/chessPrinciples';

export const analyzePosition = (game, move, engineEvaluation = 0) => {
  console.log('Analyzing move:', move);
  console.log('Current phase:', detectGamePhase(game));
  console.log('Engine evaluation:', engineEvaluation);
  
  // Only analyze white's moves
  if (move.color !== 'w') {
    return null;
  }

  const phase = detectGamePhase(game);
  const principles = getPrinciplesForPhase(phase);
  console.log('Applied principles:', principles);
  const position = game.board();

  const analysis = {
    moveType: detectMoveType(move),
    phase,
    patterns: [],
    violations: [],
    strengths: [],
    engineEvaluation,
    commentary: '',
    score: 0
  };

  // Check principles for current phase
  Object.values(principles).forEach(principle => {
    console.log('Checking principle:', principle.id);
    const result = principle.check(move, game, position);
    console.log('Principle check result:', result);
    if (result) {
      if (principle.score > 0) {
        analysis.strengths.push(principle);
        analysis.score += principle.score;
      } else {
        analysis.violations.push(principle);
        analysis.score += principle.score;
      }
    }
  });

  // Generate commentary based on analysis
  analysis.commentary = generateCommentary(analysis, engineEvaluation);

  return analysis;
};

const detectGamePhase = (game) => {
  const moveCount = game.moveNumber();
  const actualMoves = game.history().length;
  const fen = game.fen();
  const pieces = fen.split(' ')[0];
  
  // Count all pieces using case-insensitive matching
  const pieceCount = (pieces.match(/[pnbrqk]/gi) || []).length;
  // Count major pieces (rooks and queens)
  const majorPieces = (pieces.match(/[rq]/gi) || []).length;
  
  console.log('Move number:', moveCount);
  console.log('Actual moves played:', actualMoves);
  console.log('FEN position:', fen);
  console.log('Piece count:', pieceCount);
  console.log('Major pieces:', majorPieces);

  if (moveCount <= 10 && pieceCount >= 28) {
    return 'OPENING';
  } else if (majorPieces <= 2 || pieceCount <= 12) {
    return 'ENDGAME';
  } else {
    return 'MIDDLEGAME';
  }
};

const getPrinciplesForPhase = (phase) => {
  switch (phase) {
    case 'OPENING':
      return OPENING_PRINCIPLES;
    case 'MIDDLEGAME':
      return MIDDLEGAME_PRINCIPLES;
    case 'ENDGAME':
      return ENDGAME_PRINCIPLES;
    default:
      return OPENING_PRINCIPLES;
  }
};

const detectMoveType = (move) => {
  const types = [];
  
  if (['n', 'b'].includes(move.piece)) types.push('MINOR_PIECE');
  if (move.san.includes('O-O') || move.san.includes('O-O-O')) types.push('CASTLING');
  if (move.piece === 'p') types.push('PAWN_MOVE');
  if (move.captured) types.push('CAPTURE');
  if (move.san.includes('+')) types.push('CHECK');
  if (move.san.includes('#')) types.push('CHECKMATE');
  
  return types;
};

const generateCommentary = (analysis, engineEvaluation) => {
  // Start with the most important message
  if (analysis.violations.length > 0) {
    // Return the negative message of the most severe violation
    const worstViolation = analysis.violations.reduce((prev, current) => 
      (current.score < prev.score) ? current : prev
    );
    return worstViolation.negative;
  }

  if (analysis.strengths.length > 0) {
    // Return the positive message of the strongest principle followed
    const bestStrength = analysis.strengths.reduce((prev, current) => 
      (current.score > prev.score) ? current : prev
    );
    return bestStrength.positive;
  }

  // If no specific principles were triggered, give general feedback based on engine evaluation
  if (engineEvaluation !== undefined) {
    if (engineEvaluation >= 1.5) {
      return "HULK VERY HAPPY! STRONG MOVE!";
    } else if (engineEvaluation <= -1.5) {
      return "HULK THINK THERE BETTER MOVES! WANT HINT?";
    }
  }

  return "HULK WATCHING! KEEP THINKING!";
};

export default {
  analyzePosition,
  detectGamePhase,
  detectMoveType
};
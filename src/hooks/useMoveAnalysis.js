// src/hooks/useMoveAnalysis.js

import { useState, useCallback } from 'react';
import { analyzePosition } from '../utils/positionAnalyzer';

export const useMoveAnalysis = (game) => {
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [commentary, setCommentary] = useState(null);

  const analyzeMove = useCallback((move, engineEval = 0) => {
    // Only analyze white's moves
    if (move.color === 'b') {
      return {
        analysis: null,
        commentary: null
      };
    }

    // Get comprehensive position analysis
    const analysis = analyzePosition(game, move, engineEval);
    
    setLastAnalysis(analysis);
    setCommentary(analysis.commentary);

    return {
      analysis,
      commentary: analysis.commentary
    };
  }, [game]);

  return {
    lastAnalysis,
    commentary,
    analyzeMove
  };
};

export default useMoveAnalysis;
import { Chess } from 'chess.js';

export const makeBlackMove = async (game, requestAnalysis) => {
    const legalMoves = game.moves({ verbose: true });
    
    if (legalMoves.length === 0) return false;
    
    const analysis = await requestAnalysis(game.fen());
    const bestMove = analysis?.bestMove;
    
    // 400 ELO simulation:
    // 20% chance for random move
    // 50% chance for suboptimal move
    // 30% chance for best move
    const randomNum = Math.random();
    
    let selectedMove;
    
    if (randomNum < 0.2) {
        // Random move
        selectedMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    } else if (randomNum < 0.7) {
        // Sub-optimal move (avoid best move)
        const subOptimalMoves = legalMoves.filter(move => 
            move.san !== bestMove && 
            !move.san.includes('#')  // Don't miss obvious checkmates
        );
        
        selectedMove = subOptimalMoves.length > 0 
            ? subOptimalMoves[Math.floor(Math.random() * subOptimalMoves.length)]
            : legalMoves[Math.floor(Math.random() * legalMoves.length)];
    } else {
        // Best move
        selectedMove = legalMoves.find(move => move.san === bestMove) || legalMoves[0];
    }
    
    try {
        game.move(selectedMove);
        return true;
    } catch (error) {
        console.error('Error making black move:', error);
        return false;
    }
};

export const simulateThinkingTime = () => {
    // 400 ELO players typically move quickly: 0.5-2 seconds
    return new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
};
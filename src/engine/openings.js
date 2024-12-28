// src/engine/openings.jsx
const openingBook = {
    // Starting position
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': [
        {
            move: 'e2e4',
            name: "King's Pawn Opening",
            evaluation: 0.3
        },
        {
            move: 'd2d4',
            name: "Queen's Pawn Opening",
            evaluation: 0.3
        }
    ],
    // After 1.e4
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3': [
        {
            move: 'e7e5',
            name: 'Open Game',
            evaluation: 0.2
        },
        {
            move: 'c7c5',
            name: 'Sicilian Defense',
            evaluation: 0.1
        }
    ],
    // Add more common positions...
};

// Opening suggestions with explanations
const openingExplanations = {
    "King's Pawn Opening": {
        pros: "Controls center, frees bishop and queen",
        development: "Aim to control center and develop pieces quickly",
        commonLines: ["1.e4 e5", "1.e4 c5", "1.e4 e6"]
    },
    "Queen's Pawn Opening": {
        pros: "Solid control of center, flexible development",
        development: "Build pawn chain and develop pieces systematically",
        commonLines: ["1.d4 d5", "1.d4 Nf6"]
    }
};

export const getOpeningMove = async (fen) => {
    // Clean FEN string to match book format
    const cleanFen = fen.split(' ').slice(0, 4).join(' ');
    
    if (!openingBook[cleanFen]) {
        return null;
    }

    // Get random suggestion weighted by evaluation
    const moves = openingBook[cleanFen];
    const totalEval = moves.reduce((sum, move) => sum + move.evaluation, 0);
    let random = Math.random() * totalEval;
    
    for (const move of moves) {
        random -= move.evaluation;
        if (random <= 0) {
            return {
                bestMove: move.move,
                evaluation: move.evaluation,
                name: move.name,
                explanation: openingExplanations[move.name]
            };
        }
    }
    
    return moves[0]; // Fallback to first move
};
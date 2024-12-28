import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import useChessEngine from '../hooks/useChessEngine';
import { useMoveAnalysis } from '../hooks/useMoveAnalysis';
import EvaluationBar from './EvaluationBar';
import ChatPanel from './ChatPanel';
import { makeBlackMove, simulateThinkingTime } from '../utils/auto-black-moves';

const ChessBoard = ({ config }) => {
    const [game, setGame] = useState(new Chess());
    const [position, setPosition] = useState(game.fen());
    const [currentEvaluation, setCurrentEvaluation] = useState(0);
    const [chatMessages, setChatMessages] = useState([
        { type: 'system', content: 'HULK READY TO TEACH! MAKE FIRST MOVE!' }
    ]);
    const [highlightedSquares, setHighlightedSquares] = useState({});
    const [error, setError] = useState(null);

    const { analyzing, evaluation, requestAnalysis, clearAnalysis, connected } = useChessEngine();
    const { analyzeMove } = useMoveAnalysis(game);

    const villain = config?.villain || {
        image: '/src/assets/characters/villians/thanos.jpeg',
        name: 'Thanos'
    };

    useEffect(() => {
        if (evaluation !== undefined) {
            setCurrentEvaluation(evaluation);
        }
    }, [evaluation]);

    const onDrop = async (sourceSquare, targetSquare) => {
        const moveDetails = { from: sourceSquare, to: targetSquare, promotion: 'q' };
        const move = game.move(moveDetails);
        if (!move) return false;
    
        setPosition(game.fen());
        clearAnalysis();
        setHighlightedSquares({});
    
        try {
            const response = await requestAnalysis(game.fen());
            if (response?.evaluation !== undefined) {
                setCurrentEvaluation(response.evaluation);
            }
    
            if (move.color === 'w') {
                const moveHistory = game.history({ verbose: true });
                const lastMove = moveHistory[moveHistory.length - 1];
                const { commentary } = analyzeMove(lastMove, currentEvaluation);
                if (commentary) {
                    setChatMessages((prev) => [
                        ...prev,
                        { type: 'coach', content: commentary }
                    ]);
                }
    
                await simulateThinkingTime();
                const blackMoved = await makeBlackMove(game, requestAnalysis);
                
                if (blackMoved) {
                    setPosition(game.fen());
                    const blackResponse = await requestAnalysis(game.fen());
                    if (blackResponse?.evaluation !== undefined) {
                        setCurrentEvaluation(blackResponse.evaluation);
                    }
                }
            }
        } catch (err) {
            setError('Error analyzing move. Please try again.');
            console.error(err);
        }
    
        return true;
    };

    const handleHint = async () => {
        try {
            setError(null);
            setHighlightedSquares({});  // Clear previous highlights
            
            // Only provide hints when it's white's turn
            if (game.turn() === 'b') {
                setChatMessages(prev => [...prev, {
                    type: 'coach',
                    content: 'WAIT FOR BLACK TO MOVE! HULK ONLY HELP WITH WHITE MOVES!'
                }]);
                return;
            }

            const response = await requestAnalysis(game.fen());
            
            if (response && response.bestMove) {
                // Convert move to from/to squares (e.g., 'e2e4' to ['e2', 'e4'])
                const from = response.bestMove.slice(0, 2);
                const to = response.bestMove.slice(2, 4);
                
                // Highlight the suggested move
                setHighlightedSquares({
                    [from]: { backgroundColor: 'rgba(0, 255, 0, 0.4)' },
                    [to]: { backgroundColor: 'rgba(0, 255, 0, 0.4)' }
                });

                // Get the move details for better commentary
                const move = game.moves({ verbose: true }).find(m => 
                    m.from === from && m.to === to
                );

                const moveStr = move ? move.san : response.bestMove;
                
                setChatMessages(prev => [...prev, {
                    type: 'coach',
                    content: `HULK SUGGEST ${moveStr}! THIS STRONG MOVE!`
                }]);
            } else {
                setError('No legal moves available.');
            }
        } catch (err) {
            setError('Unable to get hint. Check connection.');
            console.error('Hint error:', err);
        }
    };

    const handleReset = () => {
        const newGame = new Chess();
        setGame(newGame);
        setPosition(newGame.fen());
        clearAnalysis();
        setHighlightedSquares({});
        setChatMessages([
            { type: 'system', content: 'HULK READY FOR NEW GAME! SHOW HULK GOOD MOVES!' }
        ]);
        setError(null);
    };

    return (
        <div className="bg-gray-900 min-h-screen">
            <div className="w-full h-screen flex flex-col px-6 py-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={villain.image}
                            alt={villain.name}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <span className="text-xl text-white font-bold">{villain.name}</span>
                    </div>

                    <div className="flex gap-4">
                        <button
                            className={`px-4 py-2 rounded-lg ${
                                connected ? 'bg-green-500' : 'bg-red-500'
                            } text-white font-semibold`}
                        >
                            {connected ? 'Connected' : 'Disconnected'}
                        </button>
                        <button
                            onClick={handleHint}
                            disabled={!connected || analyzing}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {analyzing ? 'Analyzing...' : 'Get Hint'}
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="flex gap-4 flex-1 h-[calc(100vh-120px)]">
                    <div className="w-[60%] flex flex-col gap-4">
                        <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                            <EvaluationBar evaluation={currentEvaluation} />
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-4 flex items-center justify-center">
                            <Chessboard
                                position={position}
                                onPieceDrop={onDrop}
                                boardOrientation="white"
                                customSquareStyles={highlightedSquares}
                            />
                        </div>
                    </div>

                    <ChatPanel 
                        chatMessages={chatMessages} 
                        error={error} 
                        connected={connected} 
                    />
                </div>
            </div>
        </div>
    );
};

export default ChessBoard;
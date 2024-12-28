import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import useChessEngine from '../hooks/useChessEngine';
import { useMoveAnalysis } from '../hooks/useMoveAnalysis';
import hulkAvatar from '../assets/characters/coaches/hulk_avtaar.png';

const getEvaluationText = (score) => {
    const absScore = Math.abs(score);
    if (absScore < 0.5) return "Equal position";
    if (absScore < 1.5) return "Slight advantage";
    if (absScore < 3.0) return "Clear advantage";
    if (absScore < 5.0) return "Winning position";
    return "Decisive advantage";
};

const EvaluationBar = ({ evaluation = 0 }) => {
    const getPercentage = (score) => {
        // Cap the evaluation between -5 and 5 for display purposes
        const cappedScore = Math.min(Math.max(score, -5), 5);
        // Convert to percentage where 0 is 50% (center)
        return 50 + (cappedScore * 5); // 5% per evaluation point
    };

    const percentage = getPercentage(evaluation);
    const absEvaluation = Math.abs(evaluation);
    const formattedEvaluation = absEvaluation.toFixed(1);

    return (
        <div className="relative h-8 w-full bg-gray-700 rounded overflow-hidden">
            {/* White's advantage bar */}
            <div 
                className="h-full bg-white"
                style={{ 
                    width: `${percentage}%`,
                    transition: 'width 0.3s ease-in-out'
                }}
            />
            
            {/* Score displays */}
            <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-2">
                {/* Black's score (shown on left when black is winning) */}
                <span 
                    className={`text-sm font-medium ${evaluation < 0 ? 'text-white' : 'opacity-0'}`}
                >
                    {evaluation < 0 ? formattedEvaluation : '0.0'}
                </span>
                
                {/* White's score (shown on right when white is winning) */}
                <span 
                    className={`text-sm font-medium ${evaluation > 0 ? 'text-black' : 'opacity-0'}`}
                >
                    {evaluation > 0 ? formattedEvaluation : '0.0'}
                </span>
            </div>
        </div>
    );
};

const ChessBoard = ({ config }) => {
    const [game, setGame] = useState(new Chess());
    const [position, setPosition] = useState(game.fen());
    const [highlightSquare, setHighlightSquare] = useState(null);
    const [error, setError] = useState(null);
    const [currentEvaluation, setCurrentEvaluation] = useState(0);
    const [chatMessages, setChatMessages] = useState([
        { type: 'system', content: 'HULK READY TO TEACH! MAKE FIRST MOVE!' }
    ]);

    const {
        analyzing,
        suggestion,
        evaluation,
        requestAnalysis,
        clearAnalysis,
        connected
    } = useChessEngine();

    const { analyzeMove } = useMoveAnalysis(game);

    // Update evaluation when it changes from the engine
    useEffect(() => {
        if (evaluation !== undefined) {
            setCurrentEvaluation(evaluation);
        }
    }, [evaluation]);

    // Auto-scroll chat messages
    useEffect(() => {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [chatMessages]);

    const onDrop = async (sourceSquare, targetSquare) => {
        const moveDetails = { from: sourceSquare, to: targetSquare, promotion: 'q' };
        const move = game.move(moveDetails);
        if (!move) return false;

        setPosition(game.fen());
        clearAnalysis();

        try {
            // Get evaluation for the current position
            const response = await requestAnalysis(game.fen());
            if (response && response.evaluation !== undefined) {
                setCurrentEvaluation(response.evaluation);
            }

            // Only add Hulk's commentary for white's moves
            if (move.color === 'w') {
                const moveHistory = game.history({ verbose: true });
                const lastMove = moveHistory[moveHistory.length - 1];
                const { commentary } = analyzeMove(lastMove, currentEvaluation);
                if (commentary) {
                    setChatMessages(prev => [...prev, { 
                        type: 'coach', 
                        content: commentary,
                        timestamp: new Date().toLocaleTimeString()
                    }]);
                }
            }

            // If it was black's move, get a new evaluation
            if (move.color === 'b') {
                const blackResponse = await requestAnalysis(game.fen());
                if (blackResponse && blackResponse.evaluation !== undefined) {
                    setCurrentEvaluation(blackResponse.evaluation);
                }
            }

        } catch (err) {
            setError(`Analysis failed: ${err.message}`);
        }

        return true;
    };

    const handleReset = () => {
        const newGame = new Chess();
        setGame(newGame);
        setPosition(newGame.fen());
        clearAnalysis();
        setHighlightSquare(null);
        setError(null);
        setCurrentEvaluation(0);
        setChatMessages([
            { type: 'system', content: 'HULK READY FOR NEW GAME! SHOW HULK GOOD MOVES!' }
        ]);
    };

    return (
        <div className="bg-gray-900 min-h-screen">
            <div className="w-full h-screen flex flex-col px-6 py-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-white">Chess Tutor</h1>
                    <button 
                        onClick={handleReset}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Reset Game
                    </button>
                </div>

                {/* Main Game Area */}
                <div className="flex gap-4 flex-1 h-[calc(100vh-120px)]">
                    {/* Left side - Chessboard and Evaluation */}
                    <div className="w-[60%] flex flex-col gap-4">
                        {/* Evaluation Bar */}
                        <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                            <EvaluationBar evaluation={currentEvaluation} />
                            <div className="text-sm text-gray-400 text-center">
                                {evaluation > 0 ? "White" : evaluation < 0 ? "Black" : "Neither side"} has a {getEvaluationText(currentEvaluation)}
                            </div>
                        </div>
                        
                        {/* Chessboard */}
                        <div className="flex-1 bg-white rounded-lg p-4 flex items-center justify-center">
                            <div className="aspect-square w-full max-h-full">
                                <Chessboard
                                    position={position}
                                    onPieceDrop={onDrop}
                                    boardOrientation="white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Analysis Panel */}
                    <div className="w-[40%] bg-gray-800 rounded-lg p-4 flex flex-col">
                        <h2 className="text-lg font-semibold text-white mb-3">Hulk's Commentary</h2>
                        {error && (
                            <div className="p-2 mb-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        {!connected && (
                            <div className="p-2 mb-3 bg-yellow-900/50 border border-yellow-500 text-yellow-200 rounded-lg text-sm">
                                Connecting to analysis engine...
                            </div>
                        )}
                        <div 
                            id="chat-container" 
                            className="flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] pr-2"
                        >
                            {chatMessages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-3 p-3 rounded-lg text-sm ${
                                        msg.type === 'system'
                                            ? 'bg-blue-900/50 text-blue-200'
                                            : msg.type === 'coach'
                                            ? 'bg-green-900/50 text-green-200'
                                            : msg.type === 'error'
                                            ? 'bg-red-900/50 text-red-200'
                                            : 'bg-gray-700/50 text-gray-200'
                                    }`}
                                >
                                    {msg.type === 'coach' && (
                                        <img
                                            src={hulkAvatar}
                                            alt="Hulk"
                                            className="w-8 h-8 rounded-full object-cover mt-1"
                                        />
                                    )}
                                    <div className="flex-1">
                                        {msg.type === 'coach' && (
                                            <div className="font-semibold mb-1 text-green-300">Hulk</div>
                                        )}
                                        {msg.content}
                                    </div>
                                    {msg.timestamp && (
                                        <div className="text-xs opacity-50">{msg.timestamp}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {analyzing && (
                            <div className="mt-3 text-sm text-gray-400">
                                Analyzing position...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChessBoard;
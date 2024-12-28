// src/components/EvaluationBar.jsx
import React from 'react';

const EvaluationBar = ({ evaluation = 0 }) => {
    const getPercentage = (score) => {
        const cappedScore = Math.min(Math.max(score, -5), 5);
        return 50 + (cappedScore * 5);
    };

    const percentage = getPercentage(evaluation);
    const absEvaluation = Math.abs(evaluation);
    const formattedEvaluation = absEvaluation.toFixed(1);

    return (
        <div className="relative h-8 w-full bg-gray-700 rounded overflow-hidden">
            <div 
                className="h-full bg-white"
                style={{ width: `${percentage}%`, transition: 'width 0.3s ease-in-out' }}
            />
            <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-2">
                <span className={`text-sm font-medium ${evaluation < 0 ? 'text-white' : 'opacity-0'}`}>
                    {evaluation < 0 ? formattedEvaluation : '0.0'}
                </span>
                <span className={`text-sm font-medium ${evaluation > 0 ? 'text-black' : 'opacity-0'}`}>
                    {evaluation > 0 ? formattedEvaluation : '0.0'}
                </span>
            </div>
        </div>
    );
};

export default EvaluationBar;

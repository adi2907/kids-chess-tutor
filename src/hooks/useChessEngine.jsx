import { useState, useEffect, useCallback, useRef } from 'react';

const WEBSOCKET_URL = 'ws://localhost:8000/ws/analysis';

const useChessEngine = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [suggestion, setSuggestion] = useState(null);
    const [evaluation, setEvaluation] = useState(0);
    const wsRef = useRef(null);
    const [wsConnected, setWsConnected] = useState(false);
    const [analysisCache] = useState(new Map());

    useEffect(() => {
        const connectWebSocket = () => {
            console.log('Attempting WebSocket connection...');
            wsRef.current = new WebSocket(WEBSOCKET_URL);
            
            wsRef.current.onopen = () => {
                console.log('WebSocket Connected successfully');
                setWsConnected(true);
            };
            
            wsRef.current.onclose = (event) => {
                console.log('WebSocket Disconnected:', event);
                setWsConnected(false);
                // Attempt to reconnect after 3 seconds
                setTimeout(connectWebSocket, 3000);
            };
            
            wsRef.current.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };
            
            wsRef.current.onmessage = (event) => {
                console.log('Received message from server:', event.data);
                const data = JSON.parse(event.data);
                
                if (data.error) {
                    console.error('Analysis Error:', data.error);
                    setAnalyzing(false);
                    return;
                }
                
                console.log('Processing analysis result:', data);
                setSuggestion(data.bestMove);
                setEvaluation(data.evaluation);
                setAnalyzing(false);
                
                // Cache the results
                const fen = data.fen;
                if (fen) {
                    analysisCache.set(fen, {
                        bestMove: data.bestMove,
                        evaluation: data.evaluation
                    });
                }
            };
        };

        connectWebSocket();
        
        return () => {
            if (wsRef.current) {
                console.log('Cleaning up WebSocket connection');
                wsRef.current.close();
            }
        };
    }, []);

    const requestAnalysis = useCallback(async (fen) => {
        if (!wsConnected) {
            console.error('WebSocket not connected');
            return null;
        }

        console.log('Requesting analysis for position:', fen);
        setAnalyzing(true);
        
        try {
            wsRef.current.send(JSON.stringify({ fen }));
            return new Promise((resolve) => {
                const handler = (event) => {
                    const data = JSON.parse(event.data);
                    wsRef.current.removeEventListener('message', handler);
                    resolve(data);
                };
                wsRef.current.addEventListener('message', handler);
            });
        } catch (error) {
            console.error('Error requesting analysis:', error);
            setAnalyzing(false);
            return null;
        }
    }, [wsConnected]);

    return {
        analyzing,
        suggestion,
        evaluation,
        requestAnalysis,
        clearAnalysis: useCallback(() => {
            setSuggestion(null);
            setEvaluation(0);
        }, []),
        connected: wsConnected
    };
};

export default useChessEngine;
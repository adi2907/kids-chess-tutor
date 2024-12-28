// src/engine/stockfish.js

// We maintain a single instance of the Stockfish worker
let stockfish = null;
let currentResolve = null;
let currentEvaluation = 0;
let stockfishWorker = null;

const initEngine = () => {
    console.log('Starting engine initialization...');

    if (stockfish) {
        console.log('Engine already initialized, reusing instance');
        return Promise.resolve(stockfish); // Return the existing worker
    }

    return new Promise((resolve) => {
        console.log('Creating new Stockfish worker...');
        try {
            stockfish = new Worker('/stockfish.js'); // Path to Stockfish worker
            console.log('Worker created - checking if it exists:', !!stockfish);
            stockfish.postMessage('ping test');
            console.log('🔍 Sent test message to verify worker communication');

            // Worker message handler
            stockfish.onmessage = (e) => {
                const message = e.data;
                console.log('📨 Received from worker:', message);

                // Parse engine responses (e.g., `info`, `bestmove`)
                if (message.startsWith('info')) {
                    const scoreMatch = message.match(/score cp (-?\d+)/);
                    if (scoreMatch) {
                        currentEvaluation = parseInt(scoreMatch[1]) / 100;
                        console.log('Current evaluation:', currentEvaluation);
                    }
                } else if (message.startsWith('bestmove')) {
                    const bestMove = message.split(' ')[1];
                    console.log('Best move found:', bestMove);
                    if (currentResolve) {
                        currentResolve({
                            bestMove,
                            evaluation: currentEvaluation,
                        });
                        currentResolve = null;
                    }
                }
            };

            // Error handling
            stockfish.onerror = (error) => {
                console.error('Stockfish worker error:', error);
                stockfish = null;
            };

            // Initialize UCI mode
            console.log('Initializing UCI mode...');
            stockfish.postMessage('uci');
            stockfish.postMessage('isready');
            stockfish.postMessage('setoption name Threads value 1');
            stockfish.postMessage('setoption name Hash value 16');

            resolve(stockfish); // Resolve with the worker instance
        } catch (error) {
            console.error('Error during engine initialization:', error);
            stockfish = null;
            throw error;
        }
    });
};

export const initialAnalysis = async (fen) => {
    console.log('Starting analysis for position:', fen);

    try {
        // Ensure engine is initialized and get the worker instance
        const engine = await initEngine();
        console.log('Engine initialized successfully');

        // Calculate depth based on the FEN string
        const pieceCount = fen.split(' ')[0].match(/[A-Za-z]/g).length;
        const depth = pieceCount > 20 ? 15 : 18;
        console.log(`Analysis will use depth ${depth} based on ${pieceCount} pieces`);

        // Create a new Promise to handle the analysis result
        return new Promise((resolve) => {
            currentResolve = resolve; // Store the resolve function
            currentEvaluation = 0;

            // Send position and start analysis
            console.log('Sending position to engine');
            engine.postMessage(`position fen ${fen}`);
            console.log(`Starting analysis at depth ${depth}`);
            engine.postMessage(`go depth ${depth}`);
        });
    } catch (error) {
        console.error('Error during analysis:', error);
        throw error;
    }
};


// Cleanup function for component unmount
export const cleanupEngine = () => {
    console.log('Cleaning up Stockfish engine...');
    if (stockfish) {
        stockfish.terminate();
        stockfish = null;
        console.log('Stockfish engine terminated');
    }
};

export async function startAnalysis(fen) {
    console.log("Starting analysis for position:", fen);

    try {
        const engine = await initEngine();
        console.log("Stockfish engine is ready!");

        return new Promise((resolve, reject) => {
            let resolved = false;

            stockfish.onmessage = (e) => {
                const message = e.data;
                console.log("📨 Message from Stockfish:", message);

                // Parse best move
                if (message.startsWith("bestmove")) {
                    const bestMove = message.split(" ")[1];
                    console.log("✅ Best move found:", bestMove);
                    resolved = true;
                    resolve({ bestMove, evaluation: currentEvaluation });
                }

                // Parse evaluation info
                if (message.startsWith("info")) {
                    const scoreMatch = message.match(/score cp (-?\d+)/);
                    if (scoreMatch) {
                        currentEvaluation = parseInt(scoreMatch[1]) / 100;
                        console.log("ℹ️ Evaluation updated:", currentEvaluation);
                    }
                }
            };

            // Send position and analysis command
            console.log("Sending position to engine...");
            engine.postMessage(`position fen ${fen}`);
            console.log("Starting analysis...");
            engine.postMessage("go depth 15");

            // Timeout in case the engine fails to respond
            setTimeout(() => {
                if (!resolved) {
                    reject(new Error("Stockfish analysis timed out"));
                }
            }, 10000); // 10-second timeout
        });
    } catch (error) {
        console.error("Error starting analysis:", error);
        throw error;
    }
}


from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import chess
import chess.engine
import json
import asyncio
import logging

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store engine instance
engine = None

@app.on_event("startup")
async def startup_event():
    global engine
    engine_path = "/opt/homebrew/bin/stockfish"  # Adjust this path as needed
    try:
        logger.info(f"Initializing Stockfish engine at path: {engine_path}")
        engine = chess.engine.SimpleEngine.popen_uci(engine_path)
        # Test the engine with a simple position
        board = chess.Board()
        result = engine.analyse(board, chess.engine.Limit(time=0.1))
        logger.info(f"Engine test result: {result}")
        logger.info("Engine initialized successfully!")
    except Exception as e:
        logger.error(f"Error initializing engine: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    if engine:
        logger.info("Shutting down engine")
        engine.quit()

@app.websocket("/ws/analysis")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebSocket connection established")
    
    try:
        while True:
            # Wait for message from client
            try:
                data = await websocket.receive_text()
                logger.info(f"Received WebSocket data: {data}")
                
                # Parse the received data
                request = json.loads(data)
                fen = request.get('fen')
                
                if not fen:
                    logger.error("No FEN position received")
                    await websocket.send_json({"error": "FEN position required"})
                    continue

                logger.info(f"Analyzing position: {fen}")
                
                # Create board from FEN
                board = chess.Board(fen)
                
                # Get engine analysis
                logger.info("Starting engine analysis")
                result = await asyncio.to_thread(
                    engine.analyse, 
                    board, 
                    chess.engine.Limit(time=1.0)
                )
                
                logger.info(f"Engine analysis complete. Raw result: {result}")
                
                # Extract best move and score
                if 'pv' in result and len(result['pv']) > 0:
                    best_move = str(result['pv'][0])
                    score = result['score'].relative.score() if 'score' in result else 0
                    
                    response = {
                        "bestMove": best_move,
                        "evaluation": score / 100.0 if score is not None else 0
                    }
                    
                    logger.info(f"Sending response: {response}")
                    await websocket.send_json(response)
                else:
                    logger.error("No best move found in analysis result")
                    await websocket.send_json({
                        "error": "No best move found",
                        "raw_result": str(result)
                    })

            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error: {str(e)}")
                await websocket.send_json({"error": "Invalid JSON data"})
            except chess.engine.EngineError as e:
                logger.error(f"Engine error: {str(e)}")
                await websocket.send_json({"error": f"Engine error: {str(e)}"})
            except Exception as e:
                logger.error(f"Error processing request: {str(e)}", exc_info=True)
                await websocket.send_json({"error": f"Analysis error: {str(e)}"})
                
    except WebSocketDisconnect:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}", exc_info=True)

# Add a test endpoint to verify engine functionality
@app.get("/test-engine")
async def test_engine():
    try:
        if not engine:
            return {"error": "Engine not initialized"}
            
        board = chess.Board()
        result = engine.analyse(board, chess.engine.Limit(time=1.0))
        return {
            "status": "success",
            "analysis": str(result),
            "best_move": str(result['pv'][0]) if 'pv' in result else None
        }
    except Exception as e:
        return {"error": str(e)}
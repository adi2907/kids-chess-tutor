import chess
import chess.engine

def test_engine():
    # Path to your Stockfish executable
    engine_path = "/opt/homebrew/bin/stockfish"
    
    try:
        # Initialize the engine
        engine = chess.engine.SimpleEngine.popen_uci(engine_path)
        print("Engine initialized successfully!")
        
        # Create a new board with starting position
        board = chess.Board()
        
        # Get engine analysis
        result = engine.analyse(board, chess.engine.Limit(time=2.0))
        print(f"Best move: {result['pv'][0]}")
        print(f"Score: {result['score']}")
        
        # Clean up
        engine.quit()
        print("Engine closed successfully!")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_engine()
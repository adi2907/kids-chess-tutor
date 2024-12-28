import asyncio
import websockets
import json

async def test_websocket():
    uri = "ws://localhost:8000/ws/analysis"
    async with websockets.connect(uri) as websocket:
        # Starting position
        test_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        
        print(f"Sending FEN: {test_fen}")
        await websocket.send(json.dumps({"fen": test_fen}))
        
        response = await websocket.recv()
        print(f"Received response: {response}")

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(test_websocket())
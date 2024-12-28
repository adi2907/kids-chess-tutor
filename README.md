# Kids Chess Tutor 🦸‍♂️♟️

A fun and interactive chess learning platform where kids can learn chess their favorite comic characters while playing against well known villains! This project combines the educational aspects of chess with beloved  characters to create an engaging learning experience.


## 🎮 Features

- **Character-Based Learning**: Learn chess from the characters with their unique style of teaching
- **Villain Opponents**: Play against famous villians
- **Real-Time Analysis**: Built-in Stockfish integration for move analysis
- **Interactive Commentary**: Receive immediate feedback on your moves 
- **Hint System**: Get move suggestions when you're stuck
- **Opening Principles**: Learn fundamental chess principles with character-themed feedback
- **Beginner-Friendly**: Opponents play at approximately 400 ELO level, perfect for learning

## 🛠️ Tech Stack

- React + Vite for the frontend
- FastAPI for the backend WebSocket server
- Stockfish chess engine for move analysis
- TailwindCSS for styling
- Chess.js for game logic
- React-Chessboard for the chess interface

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- Stockfish chess engine installed on your system

### Installation

1. Clone the repository

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. Update the Stockfish path:
   - Open `backend/main.py`
   - Update the `engine_path` variable with your Stockfish installation path

5. Start the backend server:
   ```bash
   python backend/main.py
   ```

6. Start the frontend development server:
   ```bash
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:5173`

## 🎯 Usage

1. Select your villain opponent from the character selection screen
2. Make your moves as White pieces
3. Receive real-time feedback from the coach about your moves
4. Use the hint button if you need suggestions
5. Learn chess principles through coach's unique teaching style

## 🎓 Educational Features

The tutor focuses on teaching fundamental chess principles:

- Opening principles (piece development, center control)
- Piece coordination
- King safety
- Basic tactics and strategy
- Endgame fundamentals

## 🤝 Contributing

Contributions are welcome! Here are some ways you can contribute:

- Add new characters
- Improve the teaching logic and principles
- Enhance the UI/UX
- Add new features
- Fix bugs
- Improve documentation


## 🎨 Customization

You can easily customize the application by:

- Adding new characters in the `src/assets/characters` directory
- Modifying teaching principles in `src/constants/chessPrinciples.js`
- Adjusting the commentary style in `src/utils/commentary.js`
- Modifying opponent strength in `src/utils/auto-black-moves.js`

## 📄 License

This project is licensed under the MIT License 

## 🙏 Acknowledgments

- Chess.js for the chess logic implementation
- Stockfish team for the chess engine
- React-Chessboard for the board visualization
- Marvel for the character inspiration (Note: This is a fan project and not officially affiliated with Marvel)

## ⚠️ Note

This is a fan project created for educational purposes. All Marvel characters are property of Marvel Entertainment, LLC.

---

Made with ♟️ by Aditya
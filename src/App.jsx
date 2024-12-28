import { useState } from 'react';
import ChessBoard from './components/ChessBoard';
import CharacterSelect from './components/CharacterSelect';

export default function App() {
  const [gameConfig, setGameConfig] = useState(null);

  if (!gameConfig) {
    return <CharacterSelect onSelect={setGameConfig} />;
  }

  return <ChessBoard config={gameConfig} />;
}
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
// Import images
import hulkImage from '../assets/characters/coaches/hulk.jpg';
import thanosImage from '../assets/characters/villians/thanos.jpeg';
import ultronImage from '../assets/characters/villians/ultron.jpeg';
import hulkAvatar from '../assets/characters/coaches/hulk_avtaar.png';

const CharacterSelect = ({ onSelect }) => {
  const [selectedVillain, setSelectedVillain] = useState(null);
  
  const villains = [
    {
      id: 'thanos',
      name: 'Thanos',
      image: thanosImage,
      description: 'The Mad Titan - ELO: 400'
    },
    {
      id: 'ultron',
      name: 'Ultron',
      image: ultronImage, 
      description: 'The Monster - ELO: 400'
    }
  ];

  const handleSelection = (villain) => {
    setSelectedVillain(villain);
    onSelect({
      coach: {
        id: 'hulk',
        name: 'Hulk',
        colors: {
          light: '#ffffff',
          dark: '#90EE90' // Light green
        }
      },
      villain
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <img 
                src={hulkImage}
                alt="Hulk"
                className="rounded-lg w-[150px] h-[150px] object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-green-700">The Hulk</h2>
                <p className="text-gray-600">The Strongest Chess Coach There Is!</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              HULK TEACH CHESS! HULK MAKE YOU STRONG PLAYER! HULK KNOW ALL CHESS PRINCIPLES!
            </p>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Coaching Style:</h3>
              <ul className="text-green-700 space-y-1">
                <li>• Direct and forceful feedback</li>
                <li>• Emphasizes piece power and board control</li>
                <li>• Encourages aggressive but principled play</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Villain Selection */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Choose Your Opponent:</h3>
          <div className="grid grid-cols-2 gap-4">
            {villains.map((villain) => (
              <Card 
                key={villain.id}
                className={`cursor-pointer transition-all ${
                  selectedVillain?.id === villain.id 
                    ? 'ring-2 ring-green-500' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => handleSelection(villain)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={villain.image}
                      alt={villain.name}
                      className="rounded w-[100px] h-[100px] object-cover"
                    />
                    <div>
                      <h4 className="font-semibold  text-gray-600">{villain.name}</h4>
                      <p className="text-sm text-gray-600">{villain.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelect;
import React, { useState, useEffect, useRef } from 'react';
import hulkAvatar from '../assets/characters/coaches/hulk_avtaar.png';

// Dynamically load all Hulk videos
const loadVideos = () => {
    const context = import.meta.glob('/src/assets/videos/hulk/*.mp4', { eager: true });
    return Object.values(context).map((module) => module.default || module);
};

const ChatPanel = ({ chatMessages, error, connected }) => {
    const [currentVideo, setCurrentVideo] = useState(null);
    const videoRef = useRef(null);
    const hulkVideos = useRef(loadVideos());

    useEffect(() => {
        // Play a 1-second clip of a random Hulk video when a coach message is added
        const lastMessage = chatMessages[chatMessages.length - 1];
        if (lastMessage?.type === 'coach') {
            const randomVideo =
                hulkVideos.current[Math.floor(Math.random() * hulkVideos.current.length)];
            setCurrentVideo(randomVideo);
        }
    }, [chatMessages]);

    useEffect(() => {
        // Play the video for 1 second and then pause
        if (currentVideo && videoRef.current) {
            const video = videoRef.current;
            video.currentTime = 0;
            video.play();

            const pauseTimeout = setTimeout(() => {
                video.pause();
            }, 1000); // Pause after 1 second

            return () => clearTimeout(pauseTimeout); // Cleanup timeout
        }
    }, [currentVideo]);

    return (
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

            {/* Video Panel */}
            <div className="relative w-full h-[200px] bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                {currentVideo && (
                    <video
                        ref={videoRef}
                        src={currentVideo}
                        muted
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Chat Messages */}
            <div 
                id="chat-container" 
                className="flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-300px)] pr-2"
            >
                {chatMessages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg text-sm ${
                            msg.type === 'system'
                                ? 'bg-blue-900/50 text-blue-200'
                                : msg.type === 'coach'
                                ? 'bg-green-900/50 text-green-200'
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
                        <div className="flex-1">{msg.content}</div>
                        {msg.timestamp && (
                            <div className="text-xs opacity-50">{msg.timestamp}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatPanel;

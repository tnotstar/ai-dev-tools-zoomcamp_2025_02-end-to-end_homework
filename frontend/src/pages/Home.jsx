import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001';

function Home() {
  const [loading, setLoading] = useState(false);
  const [roomInput, setRoomInput] = useState('');
  const navigate = useNavigate();

  const createRoom = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      navigate(`/room/${data.roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = () => {
    if (roomInput.trim()) {
      navigate(`/room/${roomInput.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Coding Interview Platform
            </h1>
            <p className="text-gray-400">
              Collaborate in real-time with your interview partner
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <button
                onClick={createRoom}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Room...
                  </span>
                ) : (
                  '🚀 Create New Interview Room'
                )}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800 text-gray-400">Or join existing room</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={joinRoom}
                disabled={!roomInput.trim()}
                className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:cursor-not-allowed"
              >
                Join Room
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="text-sm text-gray-400 space-y-2">
              <p className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Real-time collaborative editing
              </p>
              <p className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Code execution in browser
              </p>
              <p className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Syntax highlighting & Monaco editor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

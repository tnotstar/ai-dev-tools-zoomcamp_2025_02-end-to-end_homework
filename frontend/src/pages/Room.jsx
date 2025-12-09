import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import CodeEditor from '../components/CodeEditor';
import Terminal from '../components/Terminal';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState([]);
  const [participantCount, setParticipantCount] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [roomError, setRoomError] = useState(false);

  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    // Initialize Socket.io connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      newSocket.emit('join-room', roomId);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Load initial code when joining
    newSocket.on('load-code', ({ code }) => {
      setCode(code);
    });

    // Receive code updates from other users
    newSocket.on('code-update', ({ code }) => {
      setCode(code);
    });

    // Handle room info
    newSocket.on('room-info', ({ participantCount }) => {
      setParticipantCount(participantCount);
    });

    // Handle user joined
    newSocket.on('user-joined', ({ participantCount }) => {
      setParticipantCount(participantCount);
      setOutput(prev => [...prev, {
        type: 'info',
        content: `👤 A participant joined. Total: ${participantCount}`,
        timestamp: new Date().toISOString()
      }]);
    });

    // Handle user left
    newSocket.on('user-left', ({ participantCount }) => {
      setParticipantCount(participantCount);
      setOutput(prev => [...prev, {
        type: 'info',
        content: `👤 A participant left. Total: ${participantCount}`,
        timestamp: new Date().toISOString()
      }]);
    });

    // Handle room errors
    newSocket.on('room-error', ({ message }) => {
      setRoomError(true);
      alert(`Room Error: ${message}`);
      navigate('/');
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [roomId, navigate]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socket && isConnected) {
      socket.emit('code-change', { roomId, code: newCode });
    }
  };

  const handleRunCode = (executionOutput) => {
    setOutput(executionOutput);
    if (socket && isConnected) {
      socket.emit('code-executed', {
        roomId,
        timestamp: new Date().toISOString()
      });
    }
  };

  const copyRoomLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setOutput(prev => [...prev, {
      type: 'info',
      content: '📋 Room link copied to clipboard!',
      timestamp: new Date().toISOString()
    }]);
  };

  const DEFAULT_CODE = {
    javascript: `// Welcome to the coding interview!
// Start typing your code here...

function hello() {
  console.log("Hello, World!");
}

hello();`,
    python: `# Welcome to the coding interview!
# Start typing your code here...

def hello():
    print("Hello, World!")

hello()`
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    
    // Auto-switch code if it matches a default template or is empty
    const normalize = (str) => str.replace(/\r\n/g, '\n').trim();
    const currentNormalized = normalize(code);
    const jsNormalized = normalize(DEFAULT_CODE.javascript);
    const pythonNormalized = normalize(DEFAULT_CODE.python);
    
    if (currentNormalized === jsNormalized || currentNormalized === pythonNormalized || !currentNormalized) {
      const newCode = DEFAULT_CODE[newLanguage];
      setCode(newCode);
      if (socket && isConnected) {
        socket.emit('code-change', { roomId, code: newCode });
      }
    }
  };

  if (roomError) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-white">
            Coding Interview Room
          </h1>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${isConnected ? 'bg-green-900' : 'bg-red-900'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm text-white">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-white font-medium">{participantCount}</span>
          </div>

          <button
            onClick={copyRoomLink}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <CodeEditor
          code={code}
          onChange={handleCodeChange}
          onRun={handleRunCode}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
        <Terminal output={output} onClear={() => setOutput([])} />
      </div>
    </div>
  );
}

export default Room;

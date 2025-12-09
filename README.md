# 🚀 Online Coding Interview Platform

A real-time collaborative coding platform built with React, Node.js, and Socket.io. Perfect for conducting technical interviews with live code editing and execution.

> This is my second homework from the 2025 cohort of ai-dev-tools-zoomcamp

## ✨ Features

- **Real-time Collaborative Editing**: Multiple users can edit code simultaneously with instant synchronization
- **Monaco Editor Integration**: VS Code-like editing experience with syntax highlighting
- **Safe Client-Side Execution**: Run JavaScript code securely in the browser with sandboxing
- **Session Management**: Unique room IDs for isolated interview sessions
- **Live Console Output**: See execution results, logs, and errors in real-time
- **Participant Tracking**: Monitor who's in the room
- **OpenAPI Documentation**: Complete API documentation via Swagger UI

## 🏗️ Project Structure

```
coding-interview-platform/
├── backend/
│   ├── server.js              # Express server with Socket.io
│   └── openapi.yaml           # API specification
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx    # Monaco editor component
│   │   │   └── Terminal.jsx      # Console output component
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   └── Room.jsx          # Coding session room
│   │   ├── utils/
│   │   │   └── codeExecutor.js   # Safe code execution logic
│   │   ├── App.jsx               # Main app with routing
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Tailwind CSS
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── package.json               # Root package.json
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for modern, responsive styling
- **Monaco Editor** (@monaco-editor/react) for code editing
- **Socket.io Client** for real-time communication
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **Socket.io** for WebSocket connections
- **UUID** for unique room generation
- **Swagger UI** for API documentation
- **CORS** enabled for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Step 1: Clone and Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

Or use the convenience script:

```bash
npm run install-all
```

### Step 2: Start the Application

#### Option A: Run Both Backend and Frontend Together

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## 🚀 Usage

1. **Open the application** at `http://localhost:5173`

2. **Create a new room** by clicking "Create New Interview Room"
   - A unique room ID is generated
   - Share the URL with your interview partner

3. **Join an existing room** by entering the Room ID

4. **Start coding together**
   - Type code in the Monaco editor
   - Changes sync in real-time across all participants
   - Press "Run Code" or `Ctrl+Enter` to execute

5. **View output** in the console terminal below the editor

## 📚 API Documentation

Once the backend is running, access the interactive API documentation at:

**http://localhost:3001/api-docs**

### Available Endpoints

#### `GET /health`
Check server health status

#### `POST /api/rooms`
Create a new coding interview room
- Returns: `{ roomId, url }`

#### `GET /api/rooms/:roomId`
Get room information
- Returns: `{ roomId, participantCount, createdAt }`

### WebSocket Events

#### Client → Server
- `join-room`: Join a specific room
- `code-change`: Broadcast code changes
- `cursor-change`: Share cursor position
- `code-executed`: Notify code execution

#### Server → Client
- `load-code`: Initial code state
- `code-update`: Receive code changes
- `user-joined`: Participant joined notification
- `user-left`: Participant left notification
- `room-info`: Room metadata
- `room-error`: Error messages

## 🔒 Security Features

### Client-Side Code Execution

The platform executes JavaScript code **safely in the browser** using:

1. **Function Constructor Sandbox**: Creates isolated scope without DOM access
2. **Custom Console**: Captures all console outputs (log, error, warn, info)
3. **Error Handling**: Gracefully catches and displays syntax/runtime errors
4. **No Server Risk**: Code never reaches the backend

#### Alternative: Web Worker Execution

For enhanced security, the codebase includes commented Web Worker implementation that provides:
- Complete thread isolation
- No DOM access
- Better performance for heavy computations

### Socket.io Security

- **Broadcast Prevention**: Code changes only sent to other participants (not back to sender)
- **Room Isolation**: Users only receive updates from their room
- **Automatic Cleanup**: Empty rooms deleted after 5 minutes

## 🎨 Features Breakdown

### Real-Time Collaboration
Socket.io handles bidirectional communication between the server and all connected clients. When User A types:
1. `code-change` event sent to server with room ID
2. Server broadcasts to all clients in that room **except sender**
3. Other users receive `code-update` event
4. Monaco editor updates with new code

### Code Execution Flow
1. User clicks "Run Code" or presses Ctrl+Enter
2. `executeCode()` function creates sandboxed environment
3. Custom console captures all outputs
4. Results displayed in Terminal component
5. Execution notification sent via Socket.io (optional)

### Monaco Editor Configuration
- JavaScript syntax highlighting
- IntelliSense and autocomplete
- Dark theme customization
- Keyboard shortcuts
- Auto-formatting

## 🔧 Configuration

### Backend Port
Change in `backend/server.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

### Frontend Dev Server
Change in `frontend/vite.config.js`:
```javascript
server: {
  port: 5173
}
```

### Socket.io CORS
Update allowed origins in `backend/server.js`:
```javascript
cors: {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}
```

## 🧪 Testing the Application

### Automated Testing
Run the automated test suite for both backend and frontend:
```bash
npm test
```

**Backend Tests (Jest + Supertest):**
```bash
npm run test:backend
```

**Frontend Tests (Vitest + React Testing Library):**
```bash
npm run test:frontend
```

**End-to-End Tests (Playwright):**
```bash
npm run test:e2e
```

### Manual Testing

### Test Real-Time Sync
1. Open the application in two different browser windows
2. Create a room in one window
3. Copy the URL and open in the second window
4. Type in one editor and watch it appear in the other

### Test Code Execution
```javascript
// Try this in the editor:
console.log("Hello, World!");

const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Sum:", sum);

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log("Factorial of 5:", factorial(5));
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001 (backend)
npx kill-port 3001

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### Socket.io Connection Issues
- Check that backend is running on port 3001
- Verify CORS settings match frontend URL
- Check browser console for WebSocket errors

### Monaco Editor Not Loading
- Ensure `@monaco-editor/react` is installed
- Check browser console for import errors
- Verify Vite dev server is running

## 🚀 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

The `dist/` folder can be served statically or integrated with the Express backend.

### Environment Variables
Create `.env` file:
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

### Serve Frontend from Backend (Optional)
```javascript
// In server.js
app.use(express.static(path.join(__dirname, '../frontend/dist')));
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

MIT License - feel free to use this project for your interviews!

## 🎯 Future Enhancements

- [ ] Support for Python, Java, and other languages
- [ ] Video/audio calling integration
- [ ] Code execution time limits
- [ ] Session recording and playback
- [ ] User authentication
- [ ] Persistent room storage
- [ ] Code templates library
- [ ] Collaborative debugging tools
- [ ] AI-powered code suggestions

## 📞 Support

For issues or questions, please open a GitHub issue or contact the development team.

---

**Happy Interviewing! 🎉**

---

## Initial prompt

> Context & Persona: Act as a Senior Full Stack Software Architect. We are building an MVP for an "Online Coding Interview Platform". The goal is to create a collaborative environment where an interviewer can share a link with a candidate, and both can write and run code in real-time.

Technical Stack:

Frontend: React (Vite), TailwindCSS for styling, monaco-editor (VS Code editor) for the code panel.

Backend: Node.js with Express.

Real-time Communication: Socket.io (crucial for syncing code changes across users).

Execution: The code must be executed safely in the browser (client-side). For this MVP, support JavaScript execution using a sandboxed approach (e.g., catching console logs from a Web Worker or new Function) to avoid backend security risks.

API Documentation: OpenAPI 3.0 (Swagger).

Functional Requirements:

Session Management: The system must generate unique room IDs (e.g., /room/uuid). Anyone with the link joins that specific coding session.

Collaborative Editing: When User A types, User B sees the changes immediately via Socket.io events.

Syntax Highlighting: The editor must support syntax highlighting (configure Monaco for Javascript/Python).

Code Execution: A "Run" button that captures the code from the editor, executes it safely in the browser context, and displays the output (logs/errors) in a terminal window below the editor.

Deliverables (Response Format): Please provide the complete implementation in a single response following this structure:

Project Structure: A file tree overview.

Backend Implementation:

server.js: Express setup, Socket.io logic for room joining and code broadcasting.

openapi.yaml: The OpenAPI 3.0 specification document describing the HTTP endpoints (e.g., health check, room creation).

Frontend Implementation:

App.jsx: Main routing logic (Room creation vs. Room view).

CodeEditor.jsx: The Monaco editor component integrated with Socket.io client.

Terminal.jsx: Component to display code execution output.

Execution Logic: Explain briefly how the client-side execution is handled safely.

Setup Instructions: npm install commands to get this running locally.

Important Constraint: Ensure all code provided is functional, imports are correct, and the WebSocket logic handles the "broadcast" correctly so loops are avoided (i.e., don't re-broadcast a change back to the sender).

## Prompt for test cases

Context: Continuing with the "Online Coding Interview Platform" project we just implemented. I now need to ensure the reliability of the application by adding automated tests for both the frontend and backend.

Task: Act as a Lead QA Automation Engineer. Please generate the test files and update the documentation following these requirements:

1. Backend Testing (Node/Express):

Stack: Use jest and supertest.

Scope: Create a test file server.test.js.

Test Cases:

GET /health: Verify the server returns a 200 OK status.

POST /room: Verify it returns a unique room ID and a 201 Created status.

Socket.io: (Optional but recommended) Verify that a client can connect to the websocket server.

2. Frontend Testing (React/Vite):

Stack: Use vitest (native for Vite) and @testing-library/react.

Scope: Create a test file App.test.jsx.

Test Cases:

Rendering: Verify that the "Join Room" or "Create Room" buttons render correctly on the landing page.

Editor Component: Verify that the code editor container loads (mocking the heavy monaco-editor if necessary to prevent test crashes).

3. Documentation Update (README.md):

Provide an updated "Testing" section for the README.md.

Include the specific commands to install the testing dependencies (npm install -D ...) and the commands to run the tests (npm test).

Deliverables:

The code for backend/tests/server.test.js (or equivalent path).

The code for frontend/src/App.test.jsx.

The modified package.json scripts needed to run these tests.

The updated text snippet for the README.md.
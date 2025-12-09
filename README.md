# 🚀 Online Coding Interview Platform

A real-time collaborative coding platform built with React, Node.js, and Socket.io. Perfect for conducting technical interviews with live code editing and execution.

> This is my second homework from the 2025 cohort of ai-dev-tools-zoomcamp

## 🌐 Live Demo

**Google Cloud Run:** [https://ai-dev-tools-zoomcamp-2025-02-end-to-end-homework-428800185377.europe-west1.run.app](https://ai-dev-tools-zoomcamp-2025-02-end-to-end-homework-428800185377.europe-west1.run.app)
**Render:** [https://coding-interview-platform-sq8n.onrender.com/](https://coding-interview-platform-sq8n.onrender.com/)

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
- **Pyodide** (WASM) for client-side Python execution
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
- Backend server on `http://localhost:3000`
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

**http://localhost:3000/api-docs**

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

### Python Execution (WebAssembly)

Python code is executed completely **client-side** using [Pyodide](https://pyodide.org/).
- Runs in a WebAssembly environment within the browser
- `sys.stdout` and `sys.stderr` are intercepted to display output in the terminal
- Isolated from the host system
- No backend server execution required

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
const PORT = process.env.PORT || 3000;
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
# Kill process on port 3000 (backend)
npx kill-port 3000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### Socket.io Connection Issues
- Check that backend is running on port 3000
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
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

### Serve Frontend from Backend (Optional)

```javascript
// In server.js
app.use(express.static(path.join(__dirname, '../frontend/dist')));
```

## Running with Docker

To run the entire application (frontend + backend) using Docker:

1.  Make sure you have Docker and Docker Compose installed.
2.  Run the following command in the project root:

    ```bash
    docker-compose up
    ```

3.  The application will be available at:
    -   Frontend: http://localhost:5173
    -   Backend API: http://localhost:3000

The frontend is configured to communicate with the backend via `http://localhost:3000`. Hot-reloading is enabled for local development.

## 🚀 Deploying to Render.com

We have included a `render.yaml` Blueprint file to make deploying to Render.com easy.

1.  **Push your code** to a GitHub/GitLab repository.
2.  **Log in to Render.com** and go to "Blueprints".
3.  **Click "New Blueprint Instance"** and select your repository.
4.  Render will automatically detect the `render.yaml` file and set up both the backend and frontend services.
5.  **Click "Apply"** to deploy.

> **Note**: The frontend service relies on the backend URL. Render's Blueprint automatically routes the backend URL to the frontend via the `VITE_API_URL` environment variable.

## ☁️ Deploying to Google Cloud Run (Unified)

To deploy the application to Google Cloud Run, follow these steps:

### Prerequisites
- Google Cloud SDK (`gcloud` CLI) installed and authenticated
- A Google Cloud Project

### 1. Run the Deployment Script
The `deploy.sh` script now deploys the unified application (frontend + backend in one container):

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

### Clean Up
To avoid unexpected charges:
```bash
gcloud run services delete interview-platform --region us-central1
```

## 🚀 Deploying to Render.com (Unified)

We have updated `render.yaml` to deploy the unified application.

1.  **Push your code** to a GitHub/GitLab repository.
2.  **Log in to Render.com** and go to "Blueprints".
3.  **Click "New Blueprint Instance"** and select your repository.
4.  Render will automatically detect the `render.yaml` file and set up the `coding-interview-platform` service.
5.  **Click "Apply"** to deploy.

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
>
> Technical Stack:
>
> Frontend: React (Vite), TailwindCSS for styling, monaco-editor (VS Code editor) for the code panel.
>
> Backend: Node.js with Express.
>
> Real-time Communication: Socket.io (crucial for syncing code changes across users).
>
> Execution: The code must be executed safely in the browser (client-side). For this MVP, support JavaScript execution using a sandboxed approach (e.g., catching console logs from a Web Worker or new Function) to avoid backend security risks.
>
> API Documentation: OpenAPI 3.0 (Swagger).
>
> Functional Requirements:
>
> Session Management: The system must generate unique room IDs (e.g., /room/uuid). Anyone with the link joins that specific coding session.
>
> Collaborative Editing: When User A types, User B sees the changes immediately via Socket.io events.
>
> Syntax Highlighting: The editor must support syntax highlighting (configure Monaco for Javascript/Python).
>
> Code Execution: A "Run" button that captures the code from the editor, executes it safely in the browser context, and displays the output (logs/errors) in a terminal window below the editor.
>
> Deliverables (Response Format): Please provide the complete implementation in a single response following this structure:
>
> Project Structure: A file tree overview.
>
> Backend Implementation:
>
> server.js: Express setup, Socket.io logic for room joining and code broadcasting.
>
> openapi.yaml: The OpenAPI 3.0 specification document describing the HTTP endpoints (e.g., health check, room creation).
>
> Frontend Implementation:
>
> App.jsx: Main routing logic (Room creation vs. Room view).
>
> CodeEditor.jsx: The Monaco editor component integrated with Socket.io client.
>
> Terminal.jsx: Component to display code execution output.
>
> Execution Logic: Explain briefly how the client-side execution is handled safely.
>
> Setup Instructions: npm install commands to get this running locally.
>
> Important Constraint: Ensure all code provided is functional, imports are correct, and the WebSocket logic handles the "broadcast" correctly so loops are avoided (i.e., don't re-broadcast a change back to the sender).

## Prompt for test cases

> Context: Continuing with the "Online Coding Interview Platform" project we just implemented. I now need to ensure the reliability of the application by adding automated tests for both the frontend and backend.
>
> Task: Act as a Lead QA Automation Engineer. Please generate the test files and update the documentation following these requirements:
>
> 1. Backend Testing (Node/Express):
>
> Stack: Use jest and supertest.
> Scope: Create a test file server.test.js.
>
> Test Cases:
>
> GET /health: Verify the server returns a 200 OK status.
> POST /room: Verify it returns a unique room ID and a 201 Created status.
>
> Socket.io: (Optional but recommended) Verify that a client can connect to the websocket server.
>
> 2. Frontend Testing (React/Vite):
>
> Stack: Use vitest (native for Vite) and @testing-library/react.
>
> Scope: Create a test file App.test.jsx.
>
> Test Cases:
>
> Rendering: Verify that the "Join Room" or "Create Room" buttons render correctly on the landing page.
> Editor Component: Verify that the code editor container loads (mocking the heavy monaco-editor if necessary to prevent test crashes).
>
> 3. Documentation Update (README.md):
>
> Provide an updated "Testing" section for the README.md.
>
> Include the specific commands to install the testing dependencies (npm install -D ...) and the commands to run the tests (npm test).
>
> Deliverables:
>
> The code for backend/tests/server.test.js (or equivalent path).
>
> The code for frontend/src/App.test.jsx.
>
> The modified package.json scripts needed to run these tests.
>
> The updated text snippet for the README.md.


## Prompt for integration tests

> Context: We have successfully implemented unit tests for both the React frontend (Vitest) and Node.js backend  (Jest). Now, we need to implement End-to-End (E2E) Integration Tests to verify the complete system flow.
>
> The Challenge: Since this is a real-time collaboration app, we need to test that two different users in the same "room" can see each other's updates instantly via Socket.io.
>
> Task: Act as a Senior SDET (Software Development Engineer in Test). Please implement E2E tests using Playwright.
>
> Requirements:
>
> Tooling: Use Playwright for the test runner.
>
> Configuration (playwright.config.ts):
>
> Configure the webServer property to ensure both the Frontend (Vite, port 5173) and Backend (Express, port 3000) are started automatically before the tests run.
>
> The Test Scenario (tests/collaboration.spec.ts):
>
> Scenario: "Real-time Code Synchronization".
>
> Step 1: Create two separate browser contexts (representing User A and User B).
>
> Step 2: User A navigates to the app and generates a Room ID.
>
> Step 3: User B navigates to that exact same Room URL.
>
> Step 4: User A types console.log("Hello World") into the Monaco Editor.
>
> Step 5: ASSERT that User B's editor content automatically updates to contain console.log("Hello World").
>
> Dependencies: List the npm install command needed to add Playwright and necessary browsers.
>
> Documentation: Provide the command to run these E2E tests (e.g., npx playwright test).
>
> Deliverables:
>
> playwright.config.ts (with the webServer block correctly configured to start backend and frontend).
> tests/collaboration.spec.ts (handling the multi-user WebSocket logic).
>
> Updates to package.json scripts if necessary.

## Prompt for Dockerization

> Context: We have a fully functioning "Online Coding Interview Platform" with a React (Vite) frontend and a Node.js (Express/Socket.io) backend. We also have unit and E2E tests.
>
> Goal: I want to package the entire application so that anyone (e.g., a grading professor) can run the whole system with a single command: docker-compose up.
>
> Task: Act as a Senior DevOps Engineer. Create the necessary Docker configuration files.
>
> Requirements:
>
> Backend Dockerfile:
>
> Use a lightweight Node.js image (e.g., node:18-alpine).
>
> Expose the correct port (e.g., 3000).
>
> Ensure npm install runs efficiently.
>
> Frontend Dockerfile:
>
> Use a lightweight Node.js image.
>
> Since this is a Vite app, configure it to expose the server to the network (host: '0.0.0.0').
>
> Crucial: We want to run this in "development" mode or "preview" mode so it serves the app on port 5173.
>
> Docker Compose (docker-compose.yml):
>
> Orchestrate both services.
>
> Port Mapping: Map host ports to container ports (e.g., Host 3000 -> Container 3000, Host 5173 -> Container 5173).
>
> Environment Variables: Ensure the Frontend knows how to connect to the Backend WebSocket (e.g., set VITE_API_URL=http://localhost:3000 because the browser runs on the host machine, not inside the frontend container network).
>
> Volumes: (Optional) Add volumes for hot-reloading code changes if I edit files locally.
>
> Ignore Files: Generate a .dockerignore file to prevent copying node_modules into the image (a common mistake that slows down builds).
>
> Documentation: Add a "How to Run with Docker" section for the README.md.
>
> Deliverables:
>
> backend/Dockerfile
>
> frontend/Dockerfile
>
> .dockerignore
>
> docker-compose.yml
>

## Prompt for Python Support (Pyodide)

> Context: We have a working "Online Coding Interview Platform" where users can write and execute JavaScript safely in the browser. The current setup has a CodeEditor component (Monaco) and a Terminal component to show logs.
>
> Task: Act as a Senior Frontend Engineer specializing in WebAssembly. I need to extend the platform to support Python code execution entirely in the browser (client-side) using WebAssembly (WASM).
>
> Requirements:
>
> WASM Library: Integrate Pyodide (or a similar robust WASM solution) to execute Python code.
>
> Note: Do not send code to the backend. Execution must happen locally in the user's browser.
>
> UI Updates:
>
> Add a Language Selector (dropdown) in the frontend (e.g., above the Editor) to switch between "JavaScript" and "Python".
>
> Update the Monaco Editor instance to change syntax highlighting based on the selected language.
>
> Execution Logic:
>
> When "Run" is clicked and Python is selected, load the Pyodide runtime (if not already loaded).
>
> Execute the python code.
>
> Critical: You must redirect Python's stdout (print statements) so they appear in our existing Terminal component, just like the JavaScript logs do.
>
> Handle errors gracefully (e.g., SyntaxError in Python) and display them in the terminal.
>
> Performance: Since WASM libraries are large, ensure Pyodide is loaded asynchronously/lazily (only load it when the user selects Python or first clicks Run) to avoid slowing down the initial page load.
>
> Deliverables:
>
> Updated App.jsx (or where the state resides) to handle language switching.
>
> Updated CodeEditor.jsx to accept a language prop.
>
> The logic to initialize Pyodide and run code (can be a utility file like pyodideUtils.js or inside the component).
>
> Explanation: Briefly explain which library you chose and why, and how you handled the stdout redirection.

## Prompt for Docker Unification for Deployment

> Context: Previously, we dockerized the application using separate containers. However, for a simplified deployment scenario (Question 6 of my homework), I need to package both the Frontend and the Backend into a single Docker image.
>
> Task: Act as a DevOps Engineer. Please create a single Dockerfile that handles the build process for the frontend and sets up the backend to serve it.
>
> Technical Requirements (Multi-Stage Build):
>
> Stage 1 (Build): Use a Node.js base image to install frontend dependencies and run npm run build (Vite) to generate the static files (usually in dist/).
>
> Stage 2 (Production):
>
> Use a lightweight Node.js base image.
>
> Copy the backend code.
>
> Crucial: Copy the built frontend artifacts (dist/ folder) from Stage 1 into the backend's directory.
>
> Server Logic Update:
>
> Provide the specific code snippet I need to add to my Express server.js to serve these static files (e.g., app.use(express.static(...))) and handle the "catch-all" route (*) to support React Router (SPA).
>
> Deliverables:
>
> The content of the unified Dockerfile.
>
> The code snippet to update server.js.
>
> Explicit Question Answer: Please explicitly state which base image you used for the final stage (e.g., node:18-alpine), as I need to answer this for my homework.

import Editor from '@monaco-editor/react';
import { useRef } from 'react';
import { executeCode } from '../utils/codeExecutor';

function CodeEditor({ code, onChange, onRun, language = 'javascript', onLanguageChange }) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure Monaco Editor
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a1a2e',
      },
    });
    monaco.editor.setTheme('custom-dark');

    // Add keyboard shortcut for running code (Ctrl/Cmd + Enter)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });
  };

  const handleRunCode = async () => {
    if (!code) {
      onRun([{
        type: 'error',
        content: 'No code to execute',
        timestamp: new Date().toISOString()
      }]);
      return;
    }

    onRun([{
      type: 'info',
      content: language === 'python' ? '🐍 Initializing Python environment...' : '🚀 Executing code...',
      timestamp: new Date().toISOString()
    }]);

    try {
      const result = await executeCode(code, language);
      onRun(result);
    } catch (error) {
      onRun([{
        type: 'error',
        content: `Execution failed: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-800 border-b border-gray-700">
      {/* Editor Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleRunCode}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md transition flex items-center space-x-2 font-medium"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          <span>Run Code</span>
          <span className="text-xs text-green-200">(Ctrl+Enter)</span>
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;

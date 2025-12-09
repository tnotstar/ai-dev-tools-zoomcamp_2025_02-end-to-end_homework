import { useEffect, useRef } from 'react';

function Terminal({ output, onClear }) {
  const terminalRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new output is added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const getOutputStyle = (type) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-gray-300';
    }
  };

  const getOutputPrefix = (type) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      default:
        return '>';
    }
  };

  return (
    <div className="h-64 bg-gray-900 border-t border-gray-700 flex flex-col">
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-white font-medium">Console Output</span>
          {output.length > 0 && (
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {output.length} {output.length === 1 ? 'line' : 'lines'}
            </span>
          )}
        </div>

        <button
          onClick={onClear}
          className="text-gray-400 hover:text-white transition text-sm flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Clear</span>
        </button>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm"
      >
        {output.length === 0 ? (
          <div className="text-gray-500 flex flex-col items-center justify-center h-full">
            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Console output will appear here</p>
            <p className="text-xs mt-1">Press "Run Code" or Ctrl+Enter to execute</p>
          </div>
        ) : (
          <div className="space-y-1">
            {output.map((line, index) => (
              <div key={index} className={`${getOutputStyle(line.type)} flex items-start space-x-2`}>
                <span className="flex-shrink-0">{getOutputPrefix(line.type)}</span>
                <span className="flex-1 break-all whitespace-pre-wrap">{line.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Terminal;

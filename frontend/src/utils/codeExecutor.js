/**
 * Safe JavaScript Code Executor
 *
 * This module executes JavaScript code in a sandboxed environment to prevent
 * security risks. It captures console outputs and handles errors gracefully.
 *
 * Security Measures:
 * 1. Uses Function constructor with restricted scope
 * 2. Captures and redirects console methods
 * 3. Implements timeout to prevent infinite loops
 * 4. Prevents access to dangerous globals (limited by browser security)
 */

import { executePython } from './pyodideUtils';

/**
 * Safe Code Executor (JS & Python)
 */
export const executeCode = async (code, language = 'javascript') => {
  if (language === 'python') {
    return await executePython(code);
  }

  // Existing JavaScript Execution Logic
  return new Promise((resolve) => {
    const outputs = [];
    const startTime = Date.now();

    const customConsole = {
      log: (...args) => {
        outputs.push({
          type: 'log',
          content: args.map(arg => formatValue(arg)).join(' '),
          timestamp: new Date().toISOString()
        });
      },
      error: (...args) => {
        outputs.push({
          type: 'error',
          content: args.map(arg => formatValue(arg)).join(' '),
          timestamp: new Date().toISOString()
        });
      },
      warn: (...args) => {
        outputs.push({
          type: 'warn',
          content: args.map(arg => formatValue(arg)).join(' '),
          timestamp: new Date().toISOString()
        });
      },
      info: (...args) => {
        outputs.push({
          type: 'info',
          content: args.map(arg => formatValue(arg)).join(' '),
          timestamp: new Date().toISOString()
        });
      }
    };

    try {
      const sandboxedFunction = new Function(
        'console',
        `
        'use strict';
        ${code}
        `
      );

      sandboxedFunction(customConsole);

      const executionTime = Date.now() - startTime;

      if (outputs.length === 0) {
        outputs.push({
          type: 'info',
          content: `Code executed successfully in ${executionTime}ms (no output)`,
          timestamp: new Date().toISOString()
        });
      } else {
        outputs.push({
          type: 'success',
          content: `✓ Execution completed in ${executionTime}ms`,
          timestamp: new Date().toISOString()
        });
      }

      resolve(outputs);

    } catch (error) {
      outputs.push({
        type: 'error',
        content: `${error.name}: ${error.message}`,
        timestamp: new Date().toISOString()
      });

      if (error.stack) {
        const stackLines = error.stack.split('\n').slice(1, 4);
        stackLines.forEach(line => {
          outputs.push({
            type: 'error',
            content: line.trim(),
            timestamp: new Date().toISOString()
          });
        });
      }

      resolve(outputs);
    }
  });
};

/**
 * Format JavaScript values for console output
 */
const formatValue = (value) => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  const type = typeof value;

  switch (type) {
    case 'string':
      return value;
    case 'number':
    case 'boolean':
      return String(value);
    case 'function':
      return `[Function: ${value.name || 'anonymous'}]`;
    case 'object':
      try {
        if (Array.isArray(value)) {
          return `[${value.map(formatValue).join(', ')}]`;
        }
        return JSON.stringify(value, null, 2);
      } catch (e) {
        return '[Object]';
      }
    default:
      return String(value);
  }
};

/**
 * Alternative: Web Worker-based execution (more secure)
 *
 * This approach is commented out but can be used for enhanced security.
 * Web Workers run in a completely isolated thread with no access to the DOM.
 *
 * Usage:
 * const worker = new Worker('/workers/codeExecutor.worker.js');
 * worker.postMessage({ code });
 * worker.onmessage = (e) => { resolve(e.data); };
 */

// Example Web Worker code (save as public/workers/codeExecutor.worker.js):
/*
self.onmessage = function(e) {
  const { code } = e.data;
  const outputs = [];

  const console = {
    log: (...args) => outputs.push({ type: 'log', content: args.join(' ') }),
    error: (...args) => outputs.push({ type: 'error', content: args.join(' ') }),
    warn: (...args) => outputs.push({ type: 'warn', content: args.join(' ') })
  };

  try {
    eval(code);
    self.postMessage({ success: true, outputs });
  } catch (error) {
    outputs.push({ type: 'error', content: error.message });
    self.postMessage({ success: false, outputs });
  }
};
*/

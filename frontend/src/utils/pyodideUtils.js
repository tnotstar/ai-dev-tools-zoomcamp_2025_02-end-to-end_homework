import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.mjs';

let pyodideInstance = null;
let isLoading = false;

export const initializePyodide = async () => {
  if (pyodideInstance) return pyodideInstance;
  if (isLoading) {
    // Wait for existing initialization
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (pyodideInstance) return pyodideInstance;
    }
  }

  try {
    isLoading = true;
    console.log('Loading Pyodide...');
    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
    });
    console.log('Pyodide loaded successfully');
    return pyodideInstance;
  } catch (error) {
    console.error('Failed to load Pyodide:', error);
    throw error;
  } finally {
    isLoading = false;
  }
};

export const executePython = async (code) => {
  try {
    const pyodide = await initializePyodide();
    
    // Reset stdout/stderr capture
    pyodide.runPython(`
      import sys
      import io
      sys.stdout = io.StringIO()
      sys.stderr = io.StringIO()
    `);

    // Execute the code
    await pyodide.runPythonAsync(code);

    // Get stdout/stderr content
    const stdout = pyodide.runPython("sys.stdout.getvalue()");
    const stderr = pyodide.runPython("sys.stderr.getvalue()");

    const outputs = [];

    if (stdout) {
      stdout.trimEnd().split('\n').forEach(line => {
        if (line) {
          outputs.push({
            type: 'log',
            content: line,
            timestamp: new Date().toISOString()
          });
        }
      });
    }

    if (stderr) {
      stderr.trimEnd().split('\n').forEach(line => {
        if (line) {
          outputs.push({
            type: 'error',
            content: line,
            timestamp: new Date().toISOString()
          });
        }
      });
    }

    if (outputs.length === 0) {
      outputs.push({
        type: 'info',
        content: 'Python code executed successfully (no output)',
        timestamp: new Date().toISOString()
      });
    } else {
        outputs.push({
            type: 'success',
            content: '✓ Python execution completed',
            timestamp: new Date().toISOString()
        });
    }

    return outputs;

  } catch (error) {
    return [{
      type: 'error',
      content: `Python Error: ${error.message}`,
      timestamp: new Date().toISOString()
    }];
  }
};

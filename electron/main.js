const { app, BrowserWindow, protocol, session } = require('electron');
const path = require('path');
const fs = require('fs');
const net = require('electron').net;

  // Register file protocol before app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'file', privileges: { standard: true, supportFetchAPI: true, secure: true, corsEnabled: true } }
]);

function createWindow() {
  // Set proper Content Security Policy
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: file: https:;",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob: file:;",
          "worker-src 'self' blob: file:;",
          "style-src 'self' 'unsafe-inline';",
          "img-src 'self' data: blob: file: https:;",
          "media-src 'self' data: blob: file: https:;",
          "connect-src 'self' ws: wss: file: https: blob: data:;"
        ]
      }
    });
  });

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      webgl: true,
      // Enable hardware acceleration
      offscreen: false,
      backgroundThrottling: false,
      // Enable audio
      audioPlayback: true,
      // Enable WebGL
      webglContextAttributes: {
        alpha: true,
        antialias: true,
        depth: true,
        desynchronized: false,
        failIfMajorPerformanceCaveat: false,
        powerPreference: 'high-performance',
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        stencil: true
      }
    }
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5175').catch((err) => {
      console.error('Failed to connect to dev server:', err);
      // Try alternative port
      mainWindow.loadURL('http://localhost:5176').catch(console.error);
    });
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    const indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
    console.log('Loading index from:', indexPath);
    
    if (!fs.existsSync(indexPath)) {
      console.error('Index file not found at:', indexPath);
      app.quit();
      return;
    }

    mainWindow.loadFile(indexPath).catch((err) => {
      console.error('Failed to load index file:', err);
      app.quit();
    });
  }

  // Handle window errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  // Log any console messages from the renderer
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log('Renderer:', message);
  });

  // Register file protocol handler
  protocol.handle('file', async (request) => {
    try {
      const filePath = decodeURIComponent(request.url.slice('file://'.length));
      console.log('Attempting to load file:', filePath);

      // Define possible paths to check
      const pathsToCheck = [
        filePath,
        path.join(app.getAppPath(), 'dist', filePath),
        path.join(app.getAppPath(), 'public', filePath),
        // Add specific paths for models
        path.join(app.getAppPath(), 'dist', 'models', path.basename(filePath)),
        path.join(app.getAppPath(), 'public', 'models', path.basename(filePath))
      ];

      // Try each path
      for (const pathToTry of pathsToCheck) {
        if (fs.existsSync(pathToTry)) {
          console.log('Found file at:', pathToTry);
          const fileStream = fs.createReadStream(pathToTry);
          const mimeType = getMimeType(pathToTry);
          return new Response(fileStream, {
            headers: {
              'Content-Type': mimeType,
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      }

      // If no file is found, return a 404 response
      console.log('File not found:', filePath);
      console.log('Tried paths:', pathsToCheck);
      return new Response('File not found', { status: 404 });
    } catch (error) {
      console.error('Error handling file protocol:', error);
      return new Response('Internal error', { status: 500 });
    }
  });
}

// Helper function to get MIME type
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.glb':
      return 'model/gltf-binary';
    case '.gltf':
      return 'model/gltf+json';
    case '.html':
      return 'text/html';
    case '.js':
      return 'application/javascript';
    case '.css':
      return 'text/css';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml';
    case '.mp3':
      return 'audio/mpeg';
    case '.wav':
      return 'audio/wav';
    default:
      return 'application/octet-stream';
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ResumeWriter } from './resume-writer.js';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(join(__dirname, 'index.html'));

  // Open DevTools in development
  if (process.env.DEBUG === 'true') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers

// Handle file selection for resume
ipcMain.handle('select-resume-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Resume Files', extensions: ['json', 'txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Handle output file selection
ipcMain.handle('select-output-file', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: 'targeted-resume.txt',
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePath) {
    return result.filePath;
  }
  return null;
});

// Handle resume generation
ipcMain.handle('generate-resume', async (event, inputData) => {
  try {
    // Validate inputs
    if (!inputData.jobUrl) {
      throw new Error('Job URL is required');
    }

    if (inputData.resumePath && !existsSync(inputData.resumePath)) {
      throw new Error(`Resume file not found at ${inputData.resumePath}`);
    }

    // Send progress updates
    const sendProgress = (message) => {
      mainWindow.webContents.send('generation-progress', message);
    };

    sendProgress('Starting Resume Writer...');

    const resumeWriter = new ResumeWriter();

    // Generate the resume
    sendProgress('Initializing browser...');
    const result = await resumeWriter.generate(inputData, inputData.outputPath);

    sendProgress('Resume generated successfully!');

    return {
      success: true,
      message: 'Resume generated successfully!',
      outputPath: result.outputPath,
      jobData: result.jobData
    };
  } catch (error) {
    console.error('Error generating resume:', error);
    return {
      success: false,
      message: error.message || 'Failed to generate resume',
      error: error.message
    };
  }
});

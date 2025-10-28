import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  selectResumeFile: () => ipcRenderer.invoke('select-resume-file'),
  selectOutputFile: () => ipcRenderer.invoke('select-output-file'),
  generateResume: (inputData) => ipcRenderer.invoke('generate-resume', inputData),
  onGenerationProgress: (callback) => {
    ipcRenderer.on('generation-progress', (event, message) => callback(message));
  }
});

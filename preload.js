const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Sends the heavy task request to the main process and returns a promise
    runHeavyTask: (iterations) => ipcRenderer.invoke('run-heavy-task', iterations)
});
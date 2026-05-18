
//Zero UI Lag: Because the for loop lives inside worker.js, 
//your main Electron process can immediately handle layout rendering,
//user clicks, and underlying window updates via IPC (1).

const { app, BrowserWindow, ipcMain } = require('electron');
const { Worker } = require('worker_threads');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    mainWindow.loadFile('index.html');
}

// IPC Listener that handles the request without freezing the UI loop
ipcMain.handle('run-heavy-task', async (event, iterations) => {
    return new Promise((resolve, reject) => {
        // Spin up the worker thread and pass data to it safely
        const worker = new Worker(path.join(__dirname, 'worker.js'), {
            workerData: { iterations: iterations }
        });

        // Listen for the calculated result from the worker thread
        worker.on('message', (message) => {
            resolve(message.data); 
        });

        // Handle thread errors safely without crashing the main application loop
        worker.on('error', (error) => {
            reject(error);
        });

        // Clean up when the worker exits its execution lifecycle
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
});

app.whenReady().then(createWindow);

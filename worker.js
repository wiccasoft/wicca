// worker.js
const { parentPort, workerData } = require('worker_threads');

// 1. Receive data from the main process thread
const totalIterations = workerData.iterations; 
let result = 0;

// 2. Perform the heavy, blocking calculation here
for (let i = 0; i < totalIterations; i++) {
    result += Math.sqrt(i) * Math.sin(i); 
}

// 3. Send the final compiled result back to the main thread
parentPort.postMessage({ success: true, data: result });

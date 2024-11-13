const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // preload.js 경로 설정
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    win.loadFile('index.html');

    checkForUpdates();
}

app.whenReady().then(createWindow);

ipcMain.handle('get-version', async () => {
    return app.getVersion();
});

async function checkForUpdates() {
    try {
        const currentVersion = app.getVersion();
        const response = await axios.get(`http://localhost:3000/check-version?version=${currentVersion}`);
        
        console.log(`Current Version: ${currentVersion}`);
        console.log(`Latest Version: ${response.data.latestVersion}`);
    } catch (error) {
        console.error('Failed to check for updates:', error);
    }
}

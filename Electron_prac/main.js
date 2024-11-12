const { app, BrowserWindow, dialog } = require('electron');
const axios = require('axios');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('index.html');

    checkForUpdates();
}

app.whenReady().then(createWindow);

async function checkForUpdates() {
    try {
        const response = await axios.get('http://localhost:3000/latest-version');
        const latestVersion = response.data.version;
        const currentVersion = app.getVersion();

        if (currentVersion !== latestVersion) {
            dialog.showMessageBox({
                type: 'info',
                buttons: ['OK'],
                title: 'Update Available',
                message: `A new version (${latestVersion}) is available. Please update your app.`,
            });
        }
    } catch (error) {
        console.error('Failed to check for updates:', error);
    }
}

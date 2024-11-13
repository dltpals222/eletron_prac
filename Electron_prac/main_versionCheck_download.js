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
        const currentVersion = app.getVersion();
        const response = await axios.get(`http://localhost:3000/check-version?version=${currentVersion}`);
        
        if (!response.data.upToDate) {
            dialog.showMessageBox({
                type: 'info',
                buttons: ['Download', 'Later'],
                title: 'Update Available',
                message: `A new version (${response.data.latestVersion}) is available. Would you like to download it now?`,
            }).then(result => {
                if (result.response === 0) { // 'Download' 버튼 클릭
                    require('electron').shell.openExternal('http://your-download-page.com');
                }
            });
        }
    } catch (error) {
        console.error('Failed to check for updates:', error);
    }
}
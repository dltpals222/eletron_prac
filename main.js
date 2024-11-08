const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // 보안상의 이유로 실제 앱에서는 false로 설정하지 않는 것이 좋습니다.
    },
  });

  win.loadFile('index.html');
}

app.on('ready', createWindow);

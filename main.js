const express = require('express');
const { exec } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch'); // 최신 버전 확인을 위한 패키지
const download = require('download'); // 다운로드 패키지
const unzipper = require('unzipper'); // 압축 해제 패키지

const app = express();
const port = 3000; // 사용할 포트 번호
const electronPath = path.join('C:\\testElectron\\electron', 'node_modules', 'electron'); // Electron 설치 경로

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 기본 경로에 대한 GET 요청 처리
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // index.html 파일 제공
});

// 프로그램 설치 여부 확인
app.get('/check-program', async (req, res) => {
  const isElectron = await isElectronInstalled(); // Electron 설치 여부 확인
  const version = isElectron ? await getProgramVersionWindows() : null; // 설치된 버전 확인
  const latestVersion = await getLatestElectronVersion(); // 최신 Electron 버전 확인
  res.json({ program: 'Electron', isInstalled: isElectron, version, latestVersion });
});

// Electron 설치 확인 및 설치
async function isElectronInstalled() {
  if (fs.existsSync(electronPath)) {
    return true; // Electron이 설치되어 있음
  } else {
    console.log('Electron이 설치되어 있지 않습니다. 설치를 진행합니다.');
    const latestVersion = await getLatestElectronVersion(); // 최신 버전 확인
    const downloadUrl = `https://github.com/electron/electron/releases/download/${latestVersion}/electron-${latestVersion}-win32-x64.zip`; // 최신 Electron 다운로드 URL
    const installerPath = path.join(os.tmpdir(), 'electron.zip');

    await download(downloadUrl, os.tmpdir(), { filename: 'electron.zip' });

    // 압축 해제
    fs.createReadStream(installerPath)
      .pipe(unzipper.Extract({ path: path.join('C:\\testElectron\\electronZip') }))
      .on('close', () => {
        console.log('Electron 설치 완료');
      });

    return false; // 설치 후 false 반환
  }
}

// 설치된 Electron 버전 확인
async function getProgramVersionWindows() {
  return new Promise((resolve) => {
    exec(`cd C:\testElectron\\electron && run-node.bat --version electron`, (error, stdout) => {
      if (error || !stdout) {
        resolve(null); // 버전 정보를 가져오는 데 실패
      } else {
        resolve(stdout.trim()); // 버전 정보 반환
      }
    });
  });
}

// 최신 Electron 버전 확인
async function getLatestElectronVersion() {
  const response = await fetch('https://api.github.com/repos/electron/electron/releases/latest');
  const data = await response.json();
  return data.tag_name; // 최신 버전 반환
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

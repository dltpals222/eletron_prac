const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

// 최신 설치 파일을 제공하기 위해 정적 파일 서빙 경로 설정
app.use(express.static(path.join(__dirname, 'allVer')));

const LATEST_VERSION = '1.0.1'; // 서버에 하드코딩된 최신 버전 정보

// 최신 버전 정보를 제공하는 엔드포인트
app.get('/latest-version', (req, res) => { // 클라이언트 요청에 맞춰 엔드포인트 이름 수정
    res.json({ version: LATEST_VERSION });
});

app.get('/check-version', (req, res) => {
    const clientVersion = req.query.version;

    if (!clientVersion) {
        return res.status(400).json({ error: 'Client version must be provided' });
    }

    // 버전 비교
    if (clientVersion === LATEST_VERSION) {
        res.json({ upToDate: true });
    } else {
        res.json({ upToDate: false, latestVersion: LATEST_VERSION });
    }
});

app.get('/check-program', (req, res) => {
    const programName = 'electron-app'; // 찾고자 하는 프로그램 이름

    // 64비트 레지스트리에서 정보 가져오기
    exec(`powershell -Command "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion"`, (error64, stdout64, stderr64) => {
        if (error64) {
            console.error('Error retrieving program list from 64-bit registry:', stderr64);
            return res.status(500).json({ error: 'Error retrieving program list from 64-bit registry' });
        }

        // 32비트 레지스트리에서 정보 가져오기
        exec(`powershell -Command "Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion"`, (error32, stdout32, stderr32) => {
            if (error32) {
                console.error('Error retrieving program list from 32-bit registry:', stderr32);
                return res.status(500).json({ error: 'Error retrieving program list from 32-bit registry' });
            }

            const lines64 = stdout64.split('\n');
            const lines32 = stdout32.split('\n');
            let programVersion = null;

            // 64비트 정보 처리
            lines64.forEach(line => {
                const [name, version] = line.trim().split(/\s{2,}/);
                if (name && version && name.includes(programName)) {
                    programVersion = version;
                }
            });

            // 32비트 정보 처리
            if (!programVersion) {
                lines32.forEach(line => {
                    const [name, version] = line.trim().split(/\s{2,}/);
                    if (name && version && name.includes(programName)) {
                        programVersion = version;
                    }
                });
            }

            if (programVersion) {
                res.json({ program: programName, version: programVersion });
            } else {
                res.json({ program: programName, version: 'Not Installed' });
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

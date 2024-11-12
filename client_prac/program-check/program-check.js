const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, 'public')));

app.get('/check-program', (req, res) => {
    const programName = 'electron-app'; // 찾고자 하는 프로그램 이름

    // 64비트 레지스트리에서 정보 가져오기
    // exec(`powershell -Command "${psCommand64}"`, (error64, stdout64, stderr64) => {
    exec(`powershell -Command "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion"`, (error64, stdout64, stderr64) => {
        if (error64) {
            return res.status(500).send('Error retrieving program list from 64-bit registry');
        }

        // 32비트 레지스트리에서 정보 가져오기
        exec(`powershell -Command "Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion"`, (error32, stdout32, stderr32) => {
            if (error32) {
                return res.status(500).send('Error retrieving program list from 32-bit registry');
            }

            const lines64 = stdout64.split('\n');
            const lines32 = stdout32.split('\n');
            let programVersion = null;

            console.groupCollapsed('program line');
            console.log('64-bit registry:', lines64);
            console.log('32-bit registry:', lines32);
            console.groupEnd('program line');

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

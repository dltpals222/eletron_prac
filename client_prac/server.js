const express = require('express');
const app = express();
const PORT = 3000;

// 최신 버전 정보를 제공하는 엔드포인트
app.get('/latest-version', (req, res) => {
    // 최신 버전 정보를 JSON 형식으로 반환
    res.json({ version: '1.0.1' });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

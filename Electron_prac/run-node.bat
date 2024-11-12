@echo off
setlocal

set NODEJS_HOME=%~dp0..\nodejs

REM Node.js 실행
"%NODEJS_HOME%\node.exe" -v

REM NPM 실행 (필요할 경우)
"%NODEJS_HOME%\node.exe" "%NODEJS_HOME%\node_modules\npm\bin\npm-cli.js" %*

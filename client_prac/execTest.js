const { exec } = require('child_process')

exec(`powershell -Command "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion"`, (error64, stdout64, stderr64) => {
  if (error64) {
    console.error(`Error 64bit: ${error64}`)
    return
  } else {
    console.log('64bit Software:')
    console.log(stdout64)
  }
})
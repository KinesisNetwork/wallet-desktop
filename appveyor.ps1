Get-ChildItem "C:\Program Files(x86)\Windows Kits\10\bin\";
Get-ChildItem "C:\Program Files(x86)\Windows Kits\10\bin\x86";
Get-ChildItem "C:\Program Files(x86)\Windows Kits\10\bin\x64";
if ("${env:APPVEYOR_PULL_REQUEST_NUMBER}" -eq "") {
  npm run publish -- --dry-run --tag="0.1.${env:APPVEYOR_BUILD_NUMBER}";
  cmd.exe /c "`"${env:SIGNTOOL}`" sign /f ./code-sign.pfx /p %CERTIFICATE_PASSWORD% /fd sha1 /tr http://sha1timestamp.ws.symantec.com/sha1/timestamp /td sha1 /v .\out\make\squirrel.windows\x64\kinesis-wallet-setup.exe";
  cmd.exe /c "`"${env:SIGNTOOL}`" sign /f ./code-sign.pfx /p %CERTIFICATE_PASSWORD% /fd sha256 /tr http://sha256timestamp.ws.symantec.com/sha256/timestamp /td sha256 /as /v .\out\make\squirrel.windows\x64\kinesis-wallet-setup.exe";
  npm run publish -- --from-dry-run;
} else {
  npm test;
}

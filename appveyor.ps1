if ("${env:APPVEYOR_PULL_REQUEST_NUMBER}" -eq "") {
  npm run deploy -- --dry-run --tag="0.1.${env:APPVEYOR_BUILD_NUMBER}";
  Get-ChildItem "C:\projects\wallet-desktop\out\make\squirrel.windows\x86\";
  Get-ChildItem "C:\projects\wallet-desktop\out\make\squirrel.windows\x64\";
  cmd.exe /c "`"${env:SIGNTOOL}`" sign /f ./code-sign.pfx /p %CERTIFICATE_PASSWORD% /fd sha1 /tr http://sha1timestamp.ws.symantec.com/sha1/timestamp /td sha1 /v `"${env:OUTFILE}`"";
  cmd.exe /c "`"${env:SIGNTOOL}`" sign /f ./code-sign.pfx /p %CERTIFICATE_PASSWORD% /fd sha256 /tr http://sha256timestamp.ws.symantec.com/sha256/timestamp /td sha256 /as /v `"${env:OUTFILE}`"";
  npm run deploy -- --from-dry-run --tag="`"0.1.${env:APPVEYOR_BUILD_NUMBER}`"";
} else {
  npm test;
}

$EnvironmentVariables = Get-ChildItem Env:;
if ($EnvironmentVariables -notcontains "APPVEYOR_PULL_REQUEST_NUMBER") {
  npm run publish -- --dry-run --tag="0.1.$env:APPVEYOR_BUILD_NUMBER";
  signtool.exe sign /f ./code-sign.pfx /p "%CERTIFICATE_PASSWORD%" /fd sha1 /tr http://sha1timestamp.ws.symantec.com/sha1/timestamp /td sha1 /v .\out\make\squirrel.windows\x64\kinesis-wallet-setup.exe;
  signtool.exe sign /f ./code-sign.pfx /p "%CERTIFICATE_PASSWORD%" /fd sha256 /tr http://sha256timestamp.ws.symantec.com/sha256/timestamp /td sha256 /as /v .\out\make\squirrel.windows\x64\kinesis-wallet-setup.exe;
  npm run publish -- --from-dry-run;
} else {
  npm test;
}

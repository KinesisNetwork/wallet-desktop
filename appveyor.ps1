if ("${env:APPVEYOR_REPO_TAG}" -eq "True") {
  npm run predeploy:appveyor;
  npm run deploy:electron -- --dry-run --arch=x64;
  cmd.exe /c "`"${env:SIGNTOOL}`" sign /f ./code-sign.pfx /p %CERTIFICATE_PASSWORD% /fd sha1 /tr http://sha1timestamp.ws.symantec.com/sha1/timestamp /td sha1 /v `"${env:OUTFILE}`"";
  cmd.exe /c "`"${env:SIGNTOOL}`" sign /f ./code-sign.pfx /p %CERTIFICATE_PASSWORD% /fd sha256 /tr http://sha256timestamp.ws.symantec.com/sha256/timestamp /td sha256 /as /v `"${env:OUTFILE}`"";
  npm run deploy:electron -- --from-dry-run;
}

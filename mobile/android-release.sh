#!/bin/bash

aws s3 cp --recursive s3://abx-conf/android-app/ .
source ./android-keys.sh
mv android-release-key.keystore android/app/
cd android && ./gradlew assembleRelease

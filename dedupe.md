# Upgrade Yarn
yarn set version berry

# Yarn Dedupe Plugin
* Written by react-spectrum team
* https://github.com/adobe/react-spectrum/blob/main/lib/yarn-plugin-rsp-duplicates.js
* runs after every `yarn install` command
* Ensure an entry within .yarnrc.yml
* Can handle dedupes with `yarn dedupe` (yarn@v4)

# Node Lock Check File
* Prints out duplicates
* https://git.corp.adobe.com/gist/luyau/5033d7b6fb95deb94be24c623e0b1118

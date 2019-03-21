const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const build = () => {
  const { code : extensionCode } = runBabel('extension.js');
  const { code : popupCode } = runBabel('popup.js');
  const { code : contentScriptCode } = runBabel('contentscript.js');

  makeFile(extensionCode, popupCode, contentScriptCode);
};

const makeFile = (extensionCode, popupCode, contentScriptCode) => {
  // 디렉터리 재생성
  // fs.rmdirSync(path.join(__dirname, 'dist'));
  fs.mkdirSync(path.join(__dirname, 'dist'));

  // extension.js 빌드
  fs.writeFileSync(path.join(__dirname, 'dist', 'extension.js'), extensionCode, 'utf8');
  // popup.js 빌드
  fs.writeFileSync(path.join(__dirname, 'dist', 'popup.js'), popupCode, 'utf8');
  // contentscript.js 빌드
  fs.writeFileSync(path.join(__dirname, 'dist', 'contentscript.js'), contentScriptCode, 'utf8');

  // 기타 파일 복사
  fs.copyFileSync(path.join(__dirname, 'manifest.json'), path.join(__dirname, 'dist', 'manifest.json'));
  fs.copyFileSync(path.join(__dirname, 'popup.html'), path.join(__dirname, 'dist', 'popup.html'));
};

const runBabel = (file) => {
  return babel.transformFileSync(file);
};



build();
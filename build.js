const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

// 유틸리티 - 재귀적 디렉터리 제거
const deleteDirRecursive = (targetPath) => {
  if (fs.existsSync(targetPath)) {
    fs.readdirSync(targetPath).forEach((file, index) => {
      const curPath = path.join(targetPath, file);

      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteDirRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });

    fs.rmdirSync(targetPath);
  }
};

const build = () => {
  const { code : extensionCode } = runBabel('extension.js');
  const { code : darkModeCode } = runBabel('darkMode.js');
  const { code : popupCode } = runBabel('popup.js');
  const { code : contentScriptCode } = runBabel('contentscript.js');

  makeFile(extensionCode, darkModeCode, popupCode, contentScriptCode);
};

const makeFile = (extensionCode, darkModeCode, popupCode, contentScriptCode) => {
  // 기존 디렉터리 삭제
  if (fs.existsSync(path.join(__dirname, 'dist'))) {
    deleteDirRecursive(path.join(__dirname, 'dist'));
  }

  // dist 디렉터리 생성
  fs.mkdirSync(path.join(__dirname, 'dist'));

  // extension.js 빌드
  fs.writeFileSync(path.join(__dirname, 'dist', 'extension.js'), extensionCode, 'utf8');
  // darkMode.js 빌드
  fs.writeFileSync(path.join(__dirname, 'dist', 'darkMode.js'), darkModeCode, 'utf8');
  // popup.js 빌드
  fs.writeFileSync(path.join(__dirname, 'dist', 'popup.js'), popupCode, 'utf8');
  // contentscript.js 빌드
  fs.writeFileSync(path.join(__dirname, 'dist', 'contentscript.js'), contentScriptCode, 'utf8');

  // 기타 파일 복사
  fs.copyFileSync(path.join(__dirname, 'assets','icon-128.png'), path.join(__dirname, 'dist', 'icon-128.png'));
  fs.copyFileSync(path.join(__dirname, 'manifest.json'), path.join(__dirname, 'dist', 'manifest.json'));
  fs.copyFileSync(path.join(__dirname, 'popup.html'), path.join(__dirname, 'dist', 'popup.html'));
};

const runBabel = (file) => {
  return babel.transformFileSync(file);
};


build();

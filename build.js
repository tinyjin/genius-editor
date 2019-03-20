const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const build = () => {
  const { code } = runBabel();
  makeFile(code);
};

const makeFile = (code) => {
  // 디렉터리 재생성
  // fs.rmdirSync(path.join(__dirname, 'dist'));
  fs.mkdirSync(path.join(__dirname, 'dist'));

  // extension.js 빌드
  fs.writeFileSync(path.join(__dirname, 'dist', 'extension.js'), code, 'utf8');

  // 기타 파일 복사
  fs.copyFileSync(path.join(__dirname, 'contentscript.js'), path.join(__dirname, 'dist', 'contentscript.js'));
  fs.copyFileSync(path.join(__dirname, 'manifest.json'), path.join(__dirname, 'dist', 'manifest.json'));
  fs.copyFileSync(path.join(__dirname, 'popup.html'), path.join(__dirname, 'dist', 'popup.html'));
  fs.copyFileSync(path.join(__dirname, 'popup.js'), path.join(__dirname, 'dist', 'popup.js'));

};

const runBabel = () => {
  return babel.transformFileSync('extension.js');
};



build();
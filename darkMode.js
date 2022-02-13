const mainFrame = document.querySelector('#mainFrame');
const mainDocument = mainFrame.contentWindow.document;

const setBackgroundColorToDark = (selector) => {
  mainDocument.querySelector(selector).style.background = '#333';
};

const setBackgroundColorToWhite = (selector) => {
  mainDocument.querySelector(selector).style.background = '#white';
};

const setTextColorToWhite = (selector) => {
  mainDocument.querySelectorAll(selector).forEach((element) => {
    element.style.color = 'white';
  });
};

const setBackgroundColorToStrongDark = (selector) => {
  mainDocument.querySelector(selector).style.background = "#232222";
};

// contents line과 같이 다이나믹하게 추가되는 요소에는 아래의 함수 적용
const setContentLineColorToWhite = () => {
  console.log('변경');
  mainDocument.querySelectorAll('.se-components-wrap p.se-text-paragraph > span').forEach((line, i) => {
    line.style.color = 'white';
  });
};

const setDarkMode = () => {
  // 본문
  setBackgroundColorToDark('.se-content-guide');

  // 헤더
  setBackgroundColorToDark('.se-header');

  setBackgroundColorToDark('.se-toolbar.se-document-toolbar');
  setBackgroundColorToDark('.se-toolbar.se-property-toolbar');
  setBackgroundColorToDark('.se-toolbar.se-property-toolbar');
  
  setBackgroundColorToDark('#root > div > div');

  // 배경
  setBackgroundColorToStrongDark('.se-canvas');

  // 저장 버튼
  // setBackgroundColorToStrongDark('.btn_save');
  // setBackgroundColorToStrongDark('.btn_save_count');
  // setTextColorToWhite('.btn_save > span');

  // 커서
  mainDocument.querySelectorAll('.se-caret').forEach((element) => {
    element.style.borderLeft = '1px solid white';
  });

  // 다이나믹 요소에 White 컬러 적용
  mainDocument.addEventListener('DOMSubtreeModified', setContentLineColorToWhite);
};


/* 다크모드 실행 */

setTimeout(() => {
  setDarkMode();
}, 500);


// 헤더 아이템은 느리게 로드되므로 1초후 스타일 적용
setTimeout(() => {
  // 헤더 - 글자색
  setTextColorToWhite('.se-toolbar-label');

  // 헤더 - 링크 버튼
  setBackgroundColorToDark('.se-toolbar-button-link');

  // 헤더 - 줄간격 버튼
  setBackgroundColorToDark('.se-toolbar-button-line-height');
}, 1500);

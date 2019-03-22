chrome.storage.sync.get(['isOn'], function (result) {
  let { isOn } = result;

  // 최초 설치시 자동으로 Genius Editor로 설정
  if (isOn !== true && isOn !== false) {
    isOn = true;
    chrome.storage.sync.set({isOn: isOn}, () => {
      console.log('Value is set to ' + isOn);
    });
  }

  if (isOn) {
    runContentScript();
  }
});

chrome.storage.sync.get(['isDarkMode'], function (result) {
  const { isDarkMode } = result;

  if (isDarkMode) {
    runDarkMode();
  }
});


const runContentScript = () => {
  var s = document.createElement('script');
  s.src = chrome.extension.getURL('extension.js');
  (document.head||document.documentElement).appendChild(s);
  s.onload = function() {
    s.parentNode.removeChild(s);
  };
};

const runDarkMode = () => {
  var s = document.createElement('script');
  s.src = chrome.extension.getURL('darkMode.js');
  (document.head||document.documentElement).appendChild(s);
  s.onload = function() {
    s.parentNode.removeChild(s);
  };
};

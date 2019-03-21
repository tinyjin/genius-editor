chrome.storage.sync.get(['isOn'], function (result) {
  const { isOn } = result;

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

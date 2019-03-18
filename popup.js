chrome.extension.onMessage.addListener((request, sender) => {
  if (request.action === 'extension') {
    eval(request.source);
  }
});

window.onload = () => {
  document.querySelector('.btn').onclick = () => {
    chrome.permissions.request({
      permissions: ['tabs'],
      origins: ['https://blog.naver.com/*/postwrite']
    }, function(granted) {
      // The callback argument will be true if the user granted the permissions.
      if (granted) {
        document.write('granted');

        chrome.tabs.executeScript(null, {
          file: `extension.js`
        }, () => {
          if (chrome.extension.lastError) {
            document.body.innerText = `error ${chrome.extension.lastError.message}`;
          }
        });

      } else {
        document.write('rejected');
      }
    });
  };
};
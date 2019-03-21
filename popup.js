const blogBtn = document.querySelector('.blog-btn');

blogBtn.onclick = () => {
  chrome.tabs.create({ url: 'https://wlsdml1103.blog.me' });
};

const switchInputEditor = document.querySelector('.switch-input-editor');
const switchInputDarkMode = document.querySelector('.switch-input-dark-mode');

window.onload = () => {
  chrome.storage.sync.get(['isOn'], function (result) {
    const { isOn } = result;

    switchInputEditor.checked = isOn || false;
    console.log('Value currently is ' + isOn);
  });

  chrome.storage.sync.get(['isDarkMode'], function (result) {
    const { isDarkMode } = result;

    switchInputDarkMode.checked = isDarkMode || false;
    console.log('Value currently is ' + isDarkMode);
  });
};

switchInputEditor.onclick = function (event) {
  const changeStatus = event.target.checked;

  chrome.storage.sync.set({isOn: changeStatus}, () => {
    console.log('Value is set to ' + changeStatus);
  });
};

switchInputDarkMode.onclick = function (event) {
  const changeStatus = event.target.checked;

  chrome.storage.sync.set({isDarkMode: changeStatus}, () => {
    console.log('Value is set to ' + changeStatus);
  });
};
const blogBtn = document.querySelector('.blog-btn');

blogBtn.onclick = () => {
  chrome.tabs.create({ url: 'https://wlsdml1103.blog.me' });
};

const switchInput = document.querySelector('.switch-input');

window.onload = () => {
  chrome.storage.sync.get(['isOn'], function (result) {
    const { isOn } = result;

    switchInput.checked = isOn || false;
    console('Value currently is ' + isOn);
  });
};

switchInput.onclick = function (event) {
  const changeStatus = event.target.checked;

  chrome.storage.sync.set({isOn: changeStatus}, () => {
    console('Value is set to ' + changeStatus);
  });
};
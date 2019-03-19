const blogBtn = document.querySelector('.blog-btn');
blogBtn.onclick = () => {
  chrome.tabs.create({ url: 'https://wlsdml1103.blog.me' });
};
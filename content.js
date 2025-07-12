(() => {
  const button = document.querySelector('.button');

  if (button && button.innerText === "Acquire if available") {
    button.click();
    const audio = new Audio(chrome.runtime.getURL('changes.ogg'));
    audio.play();
    chrome.runtime.sendMessage({ accepted: true });
  }
})();
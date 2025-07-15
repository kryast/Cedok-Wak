setTimeout(() => {
  const button = document.querySelector('.button');
  if (button && button.innerText.trim() === "Acquire if available") {
    chrome.runtime.sendMessage({ type: "task_found" });

    chrome.storage.local.get("accept", (data) => {
      if (data.accept) {
        button.click();
        chrome.runtime.sendMessage({ type: "task_accepted" });
      }
    });
  }
}, 2000);

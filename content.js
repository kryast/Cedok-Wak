setTimeout(() => {
  const button = document.querySelector('.button');
  console.log("Cedok Wak: Checking for button...");

  if (button && button.innerText.trim() === "Acquire if available") {
    console.log("Cedok Wak: Clicking button!");
    button.click();

    const audio = new Audio(chrome.runtime.getURL('changes.ogg'));
    audio.play();

    chrome.runtime.sendMessage({ accepted: true });
  } else {
    console.log("Cedok Wak: Button not found or not available.");
  }
}, 2000);
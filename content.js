setTimeout(() => {
  const button = document.querySelector('a.button');
  console.log("Cedok Wak: Checking for button...");

  if (button && button.innerText.trim() === "Acquire if available") {
    console.log("Cedok Wak: Task FOUND!");

    // 🔊 Play audio when task found
    const audio = new Audio(chrome.runtime.getURL('changes.ogg'));
    audio.play();

    // 🔔 Notify background task found
    chrome.runtime.sendMessage({ taskFound: true });

    // 🤖 Auto-accept if enabled
    chrome.storage.local.get("mode", (data) => {
      if (data.mode === "accept") {
        console.log("Cedok Wak: Auto Accept mode, clicking...");
        button.click();

        const acceptAudio = new Audio(chrome.runtime.getURL('changes.ogg'));
        acceptAudio.play();

        chrome.runtime.sendMessage({ accepted: true });
      }
    });
  } else {
    console.log("Cedok Wak: Button not found or not available.");
  }
}, 2000);
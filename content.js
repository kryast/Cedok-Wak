setTimeout(() => {
  const button = document.querySelector('a.button');
  console.log("Cedok Wak: Checking for button...");

  if (button && button.innerText.trim() === "Acquire if available") {
    console.log("Cedok Wak: Task FOUND!");

    // Kirim pesan task ditemukan
    chrome.runtime.sendMessage({ taskFound: true });

    // Dapatkan mode dari storage
    chrome.storage.local.get("mode", (data) => {
      if (data.mode === "accept") {
        console.log("Cedok Wak: Auto Accept mode, clicking...");
        button.click();

        chrome.runtime.sendMessage({ accepted: true });
      }
    });
  } else {
    console.log("Cedok Wak: Button not found or not available.");
  }
}, 2000);
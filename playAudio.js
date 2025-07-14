chrome.storage.local.get("playSound", (data) => {
  if (data.playSound) {
    const audio = document.createElement("audio");
    audio.src = chrome.runtime.getURL("changes.ogg");
    audio.autoplay = true;
    audio.style.display = "none";
    document.body.appendChild(audio);
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const intervalSelect = document.getElementById('interval');
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  const soundCheckbox = document.getElementById('soundOnPopup');

  chrome.storage.local.get(["interval", "accept", "enabled", "playSound"], (data) => {
    if (data.interval) intervalSelect.value = data.interval;
    if (data.enabled === false) document.querySelector('input[value="off"]').checked = true;
    if (data.enabled === true && data.accept === false) document.querySelector('input[value="refresh"]').checked = true;
    if (data.enabled === true && data.accept === true) document.querySelector('input[value="accept"]').checked = true;
    soundCheckbox.checked = !!data.playSound;
  });

  intervalSelect.addEventListener('change', () => {
    chrome.storage.local.set({ interval: parseInt(intervalSelect.value) });
  });

  modeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const mode = radio.value;
      chrome.storage.local.set({
        enabled: mode !== "off",
        accept: mode === "accept"
      });
    });
  });

  soundCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ playSound: soundCheckbox.checked });
  });

  chrome.storage.local.get("found", (data) => {
    if (data.found) {
      chrome.storage.local.set({ found: false });
      chrome.storage.local.get("playSound", (res) => {
        if (res.playSound) {
          const audio = new Audio(chrome.runtime.getURL("changes.ogg"));
          audio.play();
        }
      });
    }
  });
});

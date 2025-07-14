document.addEventListener('DOMContentLoaded', () => {
  const intervalSelect = document.getElementById('interval');
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  const soundCheckbox = document.getElementById('soundOnRefresh');

  chrome.storage.local.get(["interval", "mode", "playSound"], (data) => {
    if (data.interval) intervalSelect.value = data.interval;
    if (data.mode) {
      const selectedRadio = document.querySelector(`input[name="mode"][value="${data.mode}"]`);
      if (selectedRadio) selectedRadio.checked = true;
    }
    soundCheckbox.checked = !!data.playSound;
  });

  intervalSelect.addEventListener('change', () => {
    const newInterval = parseInt(intervalSelect.value);
    chrome.storage.local.set({ interval: newInterval });
    chrome.alarms.clear("refreshAlarm", () => {
      chrome.alarms.create("refreshAlarm", {
        periodInMinutes: newInterval / 60000
      });
    });
  });

  modeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      chrome.storage.local.set({ mode: radio.value });
    });
  });

  soundCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ playSound: soundCheckbox.checked });
  });
});

document.getElementById("resume").addEventListener("click", () => {
  chrome.storage.local.get("interval", (data) => {
    chrome.alarms.create("refreshAlarm", {
      periodInMinutes: (data.interval || 60000) / 60000
    });
  });
});

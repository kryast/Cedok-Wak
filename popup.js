document.addEventListener('DOMContentLoaded', () => {
  const intervalSelect = document.getElementById('interval');
  const modeRadios = document.querySelectorAll('input[name="mode"]');

  chrome.storage.local.get(["interval", "mode"], (data) => {
    if (data.interval) intervalSelect.value = data.interval;
    if (data.mode) {
      const selectedRadio = document.querySelector(`input[name="mode"][value="${data.mode}"]`);
      if (selectedRadio) selectedRadio.checked = true;
    }
  });

  intervalSelect.addEventListener('change', () => {
    chrome.storage.local.set({ interval: parseInt(intervalSelect.value) });
    chrome.alarms.clear("refreshAlarm", () => {
      chrome.alarms.create("refreshAlarm", {
        periodInMinutes: parseInt(intervalSelect.value) / 60000
      });
    });
  });

  modeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      chrome.storage.local.set({ mode: radio.value });
    });
  });
});
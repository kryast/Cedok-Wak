chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "mode_off",
    title: "Off",
    type: "radio",
    checked: true,
    contexts: ["action"]
  });
  chrome.contextMenus.create({
    id: "mode_refresh",
    title: "Auto Refresh",
    type: "radio",
    contexts: ["action"]
  });
  chrome.contextMenus.create({
    id: "mode_accept",
    title: "Auto Refresh + Accept",
    type: "radio",
    contexts: ["action"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  const selectedMode = info.menuItemId.replace("mode_", "");
  chrome.storage.local.set({ mode: selectedMode });
});

chrome.alarms.onAlarm.addListener(() => {
  chrome.storage.local.get("mode", (data) => {
    if (data.mode === "off") return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url.includes("/evaluation/rater")) {
        chrome.tabs.reload(tab.id);
        if (data.mode === "accept") {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
          });
        }
      }
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.accepted) {
    chrome.notifications.create("accepted", {
      type: "basic",
      iconUrl: "acceptor-icon128.png",
      title: "The Great Acceptor",
      message: "Task accepted, get to work!"
    });

    setTimeout(() => {
      chrome.notifications.clear("accepted");
    }, 5000);
  }
});

chrome.storage.local.get(["interval"], (data) => {
  chrome.alarms.create("refreshAlarm", {
    periodInMinutes: (data.interval || 60000) / 60000
  });
});
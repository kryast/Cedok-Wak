let enabled = false;
let found = false;
let notify = false;
let accept = false;
let interval = 60000;
let sendemail = false;
let emailaddress = "";

chrome.runtime.onInstalled.addListener(() => {
  // Default badge
  chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
  chrome.action.setBadgeText({ text: "OFF" });

  // Default values
  chrome.storage.local.set({
    enabled: false,
    accept: false,
    interval: 60000,
    reverse: false,
    sendemail: false,
    found: false,
    playSound: false
  });

  // Context menus
  chrome.contextMenus.create({
    id: "mode_off",
    title: "Off",
    type: "radio",
    checked: true,
    contexts: ["action"]
  });
  chrome.contextMenus.create({
    id: "mode_refresh",
    title: "Refresh",
    type: "radio",
    contexts: ["action"]
  });
  chrome.contextMenus.create({
    id: "mode_accept",
    title: "Refresh + Accept",
    type: "radio",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "interval_60000",
    title: "Refresh every 60 seconds",
    type: "radio",
    contexts: ["action"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId.startsWith("mode_")) {
    const mode = info.menuItemId.replace("mode_", "");
    enabled = mode !== "off";
    accept = mode === "accept";
    found = false;

    chrome.action.setBadgeText({ text: enabled ? (accept ? "R+A" : "REF") : "OFF" });
    chrome.storage.local.set({ enabled, accept });

    if (enabled) {
      chrome.alarms.create("refreshAlarm", { periodInMinutes: interval / 60000 });
    } else {
      chrome.alarms.clear("refreshAlarm");
    }
  }
});

chrome.alarms.onAlarm.addListener(() => {
  chrome.storage.local.get(["enabled", "accept", "interval"], (data) => {
    if (!data.enabled) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url.includes("/evaluation/rater")) {
        chrome.tabs.reload(tab.id, () => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
          });
        });
      }
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "task_found") {
    if (!found) {
      found = true;
      chrome.notifications.create("found", {
        type: "basic",
        iconUrl: "acceptor-icon128.png",
        title: "Task Found",
        message: "Task found, go grab it!"
      });

      chrome.storage.local.set({ found: true });
    }
  }

  if (message.type === "task_accepted") {
    chrome.notifications.create("accepted", {
      type: "basic",
      iconUrl: "acceptor-icon128.png",
      title: "Task Accepted",
      message: "Task accepted! Get to work!"
    });

    found = true;
    chrome.alarms.clear("refreshAlarm");
  }
});

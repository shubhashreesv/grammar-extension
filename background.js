chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "checkGrammar",
        title: "Check Grammar",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "checkGrammar") {
        chrome.storage.local.set({ selectedText: info.selectionText }, () => {
            chrome.action.openPopup();
        });
    }
});

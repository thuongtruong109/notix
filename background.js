chrome.runtime.onInstalled.addListener((_reason) => {
    chrome.tabs.create({
        url: 'index.html',
    })
})

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.runtime.setUninstallURL('uninstall.html')
    }
})

// Sync data between tabs
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        // Broadcast storage changes to all popup instances
        chrome.runtime
            .sendMessage({
                type: 'STORAGE_CHANGED',
                changes: changes,
            })
            .catch(() => {
                // Ignore errors if no popup is open
            })
    }
})

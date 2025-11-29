let extensionWindowId = null

chrome.runtime.onInstalled.addListener((_reason) => {
    chrome.tabs.create({
        url: 'docs/index.html',
    })
})

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.runtime.setUninstallURL('uninstall.html')
    }
})

chrome.action.onClicked.addListener(async () => {
    if (extensionWindowId !== null) {
        try {
            const window = await chrome.windows.get(extensionWindowId)
            chrome.windows.update(extensionWindowId, { focused: true })
            return
        } catch (error) {
            extensionWindowId = null
        }
    }

    chrome.windows.create(
        {
            url: 'popup.html',
            type: 'popup',
            width: 497,
            height: 312,
            focused: true,
        },
        (window) => {
            extensionWindowId = window.id
        }
    )
})

chrome.windows.onBoundsChanged.addListener((window) => {
    if (window.id === extensionWindowId) {
        chrome.windows.update(extensionWindowId, { width: 497, height: 312 })
    }
})

chrome.windows.onRemoved.addListener((windowId) => {
    if (windowId === extensionWindowId) {
        extensionWindowId = null
    }
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        chrome.runtime
            .sendMessage({
                type: 'STORAGE_CHANGED',
                changes: changes,
            })
            .catch(() => {})
    }
})

# Real-time Data Sync Feature

## 📋 Introduction

The real-time data sync feature allows you to work with Notix across multiple tabs/windows simultaneously without worrying about data loss or conflicts.

**Note:** This feature can be enabled/disabled in Settings. Default is **ENABLED**.

## ✨ Key Features

### 1. **Note List Synchronization**

-   When you create, delete, or rename a note in one tab, all other tabs will automatically update
-   No manual page reload required

### 2. **Note Content Synchronization**

-   When you save note content in one tab, other tabs with the same note open will automatically update
-   Supports auto-save mode

## 🚫 What is NOT Synchronized

To avoid disrupting user experience, the following elements are **NOT** synchronized:

-   ❌ Tab state (List view / Note view) - Each tab is independent
-   ❌ Settings (auto-save, audio options) - Changes only affect the current tab
-   ❌ UI state (modal open/close, search panel, etc.)
-   ❌ Scroll position, selection, cursor position

This allows you to:

-   View the list in one tab while editing notes in another
-   Configure different settings for each tab if needed
-   Work independently on each tab without interruption

## 🔧 How It Works

### System Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Tab 1     │◄────►│ Chrome Storage   │◄────►│   Tab 2     │
│  (popup.js) │      │   + Background   │      │  (popup.js) │
└─────────────┘      └──────────────────┘      └─────────────┘
       ▲                      ▲                        ▲
       │                      │                        │
       └──────────────────────┴────────────────────────┘
                    Event Listeners
```

### Components

1. **Storage Module** (`modules/scripts/storage.js`)

    - Adds listener functions: `onStorageChanged()` and `onSyncMessage()`
    - Listens for changes from Chrome Storage API

2. **Background Script** (`background.js`)

    - Listens to `chrome.storage.onChanged`
    - Broadcasts notifications to all popup instances
    - Manages communication between tabs

3. **Popup Script** (`popup.js`)

    - Registers listeners on startup
    - Automatically reloads data when receiving change notifications
    - Synchronizes UI state
    - Checks `isAutoSync` setting before performing synchronization

4. **Settings Module** (`modules/scripts/settings.js`)
    - Toggle switch "Auto Sync" to enable/disable the feature
    - Saves settings to Chrome Storage
    - Default: Enabled (autoSync = true)

## ⚙️ Settings

### Enable/Disable Auto Sync

1. Click the **Settings** icon (⚙️) in the extension
2. Find the **"Auto Sync"** toggle switch
3. Enable/Disable as needed:
    - **ENABLED** (default): Automatically sync data between tabs
    - **DISABLED**: No synchronization, each tab operates independently

**Note:** Setting changes apply immediately to all open tabs.

## 🚀 Usage

### Scenario 1: Working on Multiple Tabs

1. Open Notix on Tab 1
2. Open Notix on Tab 2
3. Create a new note on Tab 1
4. ✅ Note automatically appears on Tab 2

### Scenario 2: Simultaneous Editing

1. Open note A on Tab 1
2. Open note A on Tab 2
3. Edit and save on Tab 1
4. ✅ Content automatically updates on Tab 2

### Scenario 3: Rename Note

1. Tab A: Open list view, rename a note
2. Tab B: Currently in note view viewing that note
3. ✅ Note name automatically updates on Tab B immediately

### Scenario 4: Disable Auto Sync

1. Go to Settings, turn off "Auto Sync" toggle
2. Create a new note on Tab 1
3. ❌ Tab 2 does not automatically update (as expected)
4. Turn Auto Sync back on → All tabs will sync again

### Scenario 5: Settings Management

1. Open Notix on multiple tabs
2. Change settings (enable/disable auto-save) on Tab 1
3. ✅ Settings apply immediately to all tabs

## 💡 Benefits

-   ⚡ **Fast**: Instant updates, no reload required
-   🔄 **Consistent**: Data always synchronized across tabs
-   🛡️ **Safe**: No worries about data loss when working with multiple tabs
-   🎯 **Efficient**: Increases work productivity

## ⚙️ Technical Details

### Event Flow

```javascript
// When data changes
User Action (Tab 1)
    ↓
chrome.storage.sync.set()
    ↓
chrome.storage.onChanged event
    ↓
Background Script receives
    ↓
chrome.runtime.sendMessage()
    ↓
All popup instances receive
    ↓
Auto reload data (Tab 2, Tab 3, ...)
```

### APIs Used

-   `chrome.storage.sync.get()` - Read data
-   `chrome.storage.sync.set()` - Write data
-   `chrome.storage.onChanged` - Listen for changes
-   `chrome.runtime.sendMessage()` - Send messages
-   `chrome.runtime.onMessage` - Receive messages

## 📝 Notes

1. **Performance**: Feature is optimized to not affect performance
2. **Compatibility**: Works on all browsers supporting Chrome Extension Manifest V3
3. **Storage Limit**: Still adheres to Chrome Storage API limits (100KB per item, 8KB per key)

## 🐛 Error Handling

The system automatically handles cases such as:

-   Tab closed midway
-   Temporary connection loss
-   Conflicts during simultaneous updates

## 🔮 Future

Planned improvements:

-   [ ] Conflict resolution UI when conflicts occur
-   [ ] Sync history with undo/redo
-   [ ] Cloud sync across multiple devices
-   [ ] Real-time collaborative editing

---

**Version**: 2.2
**Last Updated**: October 27, 2025
**Author**: [@thuongtruong109](https://github.com/thuongtruong109)

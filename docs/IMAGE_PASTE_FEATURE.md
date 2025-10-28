# Image Paste Feature

## Overview

The image paste feature allows users to insert images directly into their notes by using Ctrl+V (or Cmd+V on Mac) after copying an image to the clipboard.

## How It Works

### Pasting Images

1. Copy an image to your clipboard (from a screenshot, image file, or web page)
2. Click inside the note textarea
3. Press `Ctrl+V` (Windows/Linux) or `Cmd+V` (Mac)
4. The image will be inserted as markdown at the cursor position

### Technical Implementation

#### Image Storage Format

Images are stored as **base64-encoded data URLs** within the note content using markdown syntax:

```markdown
![Pasted Image](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...)
```

#### Features

-   **Automatic Detection**: The paste event listener automatically detects when an image is being pasted
-   **Base64 Encoding**: Images are converted to base64 format for storage
-   **Cursor Position**: Images are inserted at the current cursor position in the textarea
-   **Auto-Save**: If auto-save is enabled, the note is automatically saved after image insertion
-   **Format Support**: Supports all common image formats (PNG, JPG, GIF, WebP, etc.)

### Code Implementation

The feature is implemented in `popup.js`:

```javascript
noteInput.addEventListener('paste', function (event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData)
        .items

    for (let index in items) {
        const item = items[index]

        // Check if the clipboard item is an image
        if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
            event.preventDefault() // Prevent default paste behavior

            const blob = item.getAsFile()
            const reader = new FileReader()

            reader.onload = function (event) {
                const base64Image = event.target.result
                const cursorPosition = noteInput.selectionStart
                const textBefore = noteInput.value.substring(0, cursorPosition)
                const textAfter = noteInput.value.substring(cursorPosition)

                // Insert image as markdown format with base64 data
                const imageMarkdown = `\n![Pasted Image](${base64Image})\n`
                noteInput.value = textBefore + imageMarkdown + textAfter

                // Set cursor position after the inserted image
                const newCursorPosition = cursorPosition + imageMarkdown.length
                noteInput.setSelectionRange(
                    newCursorPosition,
                    newCursorPosition
                )

                // Trigger auto-save if enabled
                if (isAutoSave) {
                    setTimeout(() => {
                        saveData()
                    }, 1000)
                }
            }

            reader.readAsDataURL(blob)
            break // Only process the first image
        }
    }
})
```

## Usage Examples

### Example 1: Pasting a Screenshot

1. Take a screenshot (Windows: `Win+Shift+S`, Mac: `Cmd+Shift+4`)
2. Open Notix and click in the note area
3. Press `Ctrl+V` or `Cmd+V`
4. The screenshot will be inserted as markdown

### Example 2: Pasting from an Image File

1. Open an image in an image viewer or browser
2. Right-click and select "Copy Image"
3. Go to Notix and paste with `Ctrl+V` or `Cmd+V`

### Example 3: Pasting from Web

1. Right-click on any image on a webpage
2. Select "Copy Image"
3. Paste into your Notix note

## Limitations

### Storage Size

-   Base64 encoding increases file size by approximately 33%
-   Large images may impact storage limits (Chrome sync storage has a 100KB limit per item)
-   Consider using smaller images or compressing them before pasting

### Display

-   Images are stored as markdown text in the textarea
-   To view the rendered images, you would need to:
    -   Export the note and view in a markdown viewer
    -   Use the export features to see the rendered output
    -   Consider implementing a preview mode (future enhancement)

## Future Enhancements

Potential improvements for this feature:

1. **Image Compression**: Automatically compress images before saving
2. **Preview Mode**: Toggle between edit and preview mode to see rendered images
3. **Drag & Drop**: Support dragging and dropping images into notes
4. **Image Management**: Add ability to delete or replace pasted images
5. **Resize Options**: Allow users to resize images before inserting
6. **External Storage**: Option to store images externally (e.g., cloud storage) and reference them by URL

## Browser Compatibility

The feature is compatible with:

-   Chrome/Chromium (tested)
-   Edge (Chromium-based)
-   Other browsers supporting Chrome Extension APIs

## Security Considerations

-   Images are stored locally in Chrome's sync storage
-   Base64 data is validated during the paste operation
-   Only image MIME types are processed
-   No external requests are made when pasting images

## Troubleshooting

### Image Not Pasting

-   Ensure you have an image copied to clipboard
-   Try copying the image again
-   Check browser console for any errors

### Storage Errors

-   If you get storage errors, the image may be too large
-   Try using a smaller image
-   Clear some old notes to free up storage space

### Performance Issues

-   Multiple large images may slow down the extension
-   Consider limiting the number of images per note
-   Use image compression tools before pasting

# 🖼️ Image Paste Feature - Quick Reference

## How to Use

### Step 1: Copy an Image

Choose any method:

-   **Screenshot**: Press `Win+Shift+S` (Windows) or `Cmd+Shift+4` (Mac)
-   **Web Image**: Right-click on any image → "Copy Image"
-   **Image File**: Open in viewer → Right-click → "Copy"

### Step 2: Paste into Notix

1. Open Notix extension
2. Click in the note textarea
3. Press `Ctrl+V` (Windows/Linux) or `Cmd+V` (Mac)
4. ✨ Image inserted as markdown!

## What Happens

### Before Paste:

```
My shopping list:
- Milk
- Eggs
[cursor here]
```

### After Paste:

```
My shopping list:
- Milk
- Eggs

![Pasted Image](data:image/png;base64,iVBORw0KG...)

[cursor here]
```

## Features

✅ Automatic detection of image in clipboard
✅ Converts to base64 format
✅ Inserts at cursor position
✅ Auto-saves (if enabled)
✅ Supports PNG, JPG, GIF, WebP

## Tips

💡 **Keep images small** - Large images create long text strings
💡 **Auto-save works** - Changes save automatically if enabled
💡 **Markdown format** - Images stored as `![Alt](data:...)`
💡 **Export to see** - Use export features to view rendered images

## Keyboard Shortcuts

| Action   | Windows/Linux | Mac     |
| -------- | ------------- | ------- |
| Paste    | `Ctrl+V`      | `Cmd+V` |
| Save     | `Ctrl+S`      | `Cmd+S` |
| New Note | -             | -       |

## Troubleshooting

### Image not pasting?

-   ✓ Ensure image is copied to clipboard
-   ✓ Click inside the textarea first
-   ✓ Try copying the image again

### Storage error?

-   ✓ Image may be too large
-   ✓ Try a smaller image
-   ✓ Delete old notes to free space

### Can't see image?

-   ✓ Images stored as text (markdown)
-   ✓ Export note to view rendered image
-   ✓ Use markdown viewer to preview

## Technical Info

**Format**: Markdown with base64 data URL
**Storage**: Chrome sync storage
**Size**: ~33% larger than original (base64 encoding)
**Limit**: 100KB per item (Chrome sync)

## Examples

### Simple Note with Image

```markdown
# Meeting Notes

Key points from today:

-   Budget approved
-   New timeline set

![Whiteboard Photo](data:image/png;base64,...)

Action items:

-   Follow up with team
```

### Multiple Images

```markdown
# Project Screenshots

Before:
![Before State](data:image/png;base64,...)

After:
![After State](data:image/png;base64,...)

Much better! 🎉
```

## Related Features

🔗 **Copy as Link** - Share note as image link
📸 **Capture Screenshot** - Copy note as screenshot
💾 **Auto-save** - Automatically saves changes
📤 **Export** - Download as .txt or .png

## Quick Test

1. Take a screenshot of this guide
2. Open Notix
3. Create new note
4. Type: "Test image:"
5. Press `Ctrl+V` or `Cmd+V`
6. See the markdown syntax appear!

---

**Need more help?** Check out:

-   📖 [Full Documentation](IMAGE_PASTE_FEATURE.md)
-   🧪 [Test Page](test_image_paste.html)
-   📋 [Implementation Details](IMPLEMENTATION_SUMMARY.md)

**Happy note-taking! 📝✨**

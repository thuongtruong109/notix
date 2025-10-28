# 🖼️ Auto Image Preview - MS Word Style

## Tổng Quan

Notix giờ đây hỗ trợ **hiển thị ảnh trực tiếp** trong editor như MS Word! Khi bạn paste ảnh bằng Ctrl+V, ảnh sẽ xuất hiện ngay trong note editor mà không cần click preview button.

## ✨ Tính Năng Chính

### 📸 Auto Preview Images

-   **Paste & See**: Paste ảnh → Hiển thị ngay lập tức
-   **WYSIWYG**: What You See Is What You Get - như MS Word
-   **Inline Display**: Ảnh hiển thị ngay trong editor
-   **No Extra Clicks**: Không cần toggle preview mode

### 🎯 How It Works

1. **Copy ảnh** từ bất kỳ đâu (screenshot, file, web)
2. **Click vào editor** Notix
3. **Paste** với `Ctrl+V` hoặc `Cmd+V`
4. **Ảnh hiển thị ngay** tại vị trí cursor! 🎉

### 💡 Key Features

✅ **Instant Preview** - Ảnh hiển thị ngay khi paste
✅ **Rich Text Editor** - Contenteditable thay vì textarea
✅ **Mixed Content** - Văn bản + ảnh trong cùng editor
✅ **Responsive Images** - Tự động scale theo kích thước editor
✅ **Auto-Save** - Tự động lưu bao gồm cả ảnh
✅ **Multiple Images** - Hỗ trợ nhiều ảnh trong một note

## 🚀 Cách Sử Dụng

### Paste Ảnh Đơn Giản

1. **Copy một ảnh**:

    - Screenshot: `Win+Shift+S` (Windows) hoặc `Cmd+Shift+4` (Mac)
    - Từ file: Right-click → Copy
    - Từ web: Right-click trên ảnh → Copy Image

2. **Mở Notix và click vào editor**

3. **Paste**: `Ctrl+V` hoặc `Cmd+V`

4. **Ảnh hiển thị ngay!** ✨

### Ví Dụ Thực Tế

#### Meeting Notes với Screenshots

```
Meeting Notes - Oct 28, 2025

Attendees: Alice, Bob, Charlie

Key Points:
- New design approved
- Budget increased

Whiteboard photo:
[Ảnh whiteboard hiển thị ở đây]

Action items:
- Alice: Update designs
- Bob: Review code
```

#### Design Review

```
Design Mockups Review

Homepage:
[Ảnh homepage hiển thị ở đây]

Feedback:
- Great color scheme ✅
- Need larger buttons
- Add more whitespace

Updated version:
[Ảnh updated hiển thị ở đây]
```

#### Bug Report

```
Bug Report #123

Steps to reproduce:
1. Go to login page
2. Enter credentials
3. Click submit

Error screenshot:
[Ảnh error hiển thị ở đây]

Expected behavior: Should login successfully
Actual behavior: Shows error message
```

## 🎨 Visual Features

### Image Styling

-   **Max Width**: 100% of editor width
-   **Auto Height**: Maintains aspect ratio
-   **Border Radius**: 0.25rem rounded corners
-   **Shadow**: Subtle shadow effect
-   **Hover Effect**: Slight scale on hover

### Editor Experience

-   **Clean Interface**: Minimal distraction
-   **Placeholder Text**: "Type your note here..."
-   **Smooth Scrolling**: Auto-scroll với nhiều ảnh
-   **Cursor Control**: Vị trí cursor được maintain

## 💾 Storage & Save

### How Images Are Stored

-   **Format**: Base64 encoded data URLs
-   **Location**: Chrome sync storage
-   **Size**: ~33% larger than original (due to encoding)
-   **Limit**: Chrome sync storage limits apply

### Auto-Save

```javascript
// Images saved automatically with content
{
    id: "note123",
    title: "My Note",
    content: "<div>Text<br><img src='data:image/png;base64,...'/></div>",
    lastUpdate: 1234567890
}
```

## ⚙️ Technical Changes

### From Textarea to ContentEditable

**Before:**

```html
<textarea id="note"></textarea>
```

**After:**

```html
<div id="note" contenteditable="true"></div>
```

### Why ContentEditable?

-   ✅ Supports inline images
-   ✅ Rich content mixing (text + images)
-   ✅ Better WYSIWYG experience
-   ✅ More control over content

### Helper Functions

```javascript
// Get HTML content (for saving)
getEditorContent() → returns innerHTML

// Get plain text (for export/copy)
getEditorText() → returns innerText

// Set content (for loading)
setEditorContent(html) → sets innerHTML

// Clear editor
clearEditor() → clears all content

// Append text at cursor
appendToEditor(text) → inserts at cursor
```

## 📋 API Changes

### Updated Methods

**Getting Content:**

```javascript
// Old (textarea)
const content = noteInput.value

// New (contenteditable)
const htmlContent = getEditorContent()
const textContent = getEditorText()
```

**Setting Content:**

```javascript
// Old
noteInput.value = 'text'

// New
setEditorContent('<div>html content</div>')
```

**Clearing:**

```javascript
// Old
noteInput.value = ''

// New
clearEditor()
```

**Appending:**

```javascript
// Old
noteInput.value += 'more text'

// New
appendToEditor('more text')
```

## 🔧 Compatibility

### Features Still Working

✅ Auto-save
✅ Export as text
✅ Export as image
✅ Copy text
✅ Markdown preview
✅ Voice to text
✅ Audio reading
✅ Search notes
✅ Sync between tabs

### Export Behavior

-   **Export as Text**: Exports plain text (no HTML)
-   **Export as Image**: Includes visible images
-   **Copy Text**: Copies plain text only

## ⚠️ Important Notes

### Storage Considerations

-   Base64 images increase storage size
-   Large images may exceed Chrome sync limits
-   Consider image compression for large files

### Performance

-   Multiple large images may impact performance
-   Recommended: Keep images under 500KB each
-   Too many images may slow down rendering

### Browser Support

-   ✅ Chrome/Chromium (tested)
-   ✅ Edge (Chromium-based)
-   ✅ Other browsers supporting contenteditable

## 🎯 Best Practices

### 💡 For Better Performance

1. Use compressed images when possible
2. Limit number of images per note
3. Clear old notes with many images
4. Consider external image hosting for very large collections

### 💡 For Better Organization

1. Add descriptive text around images
2. Use headers to separate sections
3. Keep related images grouped
4. Name notes descriptively

### 💡 For Collaboration

1. Export notes to share with images
2. Use markdown preview for formatted view
3. Copy text separately if needed
4. Consider screenshot tools for better quality

## 🐛 Troubleshooting

### Ảnh không hiển thị?

-   ✓ Ensure image is copied to clipboard
-   ✓ Try pasting again
-   ✓ Check image format is supported
-   ✓ Verify clipboard contains image data

### Performance chậm?

-   ✓ Reduce number of images
-   ✓ Use smaller images
-   ✓ Clear browser cache
-   ✓ Restart browser/extension

### Ảnh quá lớn?

-   ✓ Resize before pasting
-   ✓ Use image compression tools
-   ✓ Consider PNG → JPG conversion
-   ✓ Use lower quality screenshots

### Cursor không đúng vị trí?

-   ✓ Click where you want to paste
-   ✓ Ensure cursor is visible
-   ✓ Try clicking after paste
-   ✓ Use arrow keys to adjust

## 🆚 So Sánh với Version Cũ

### Trước (Textarea)

```
❌ Ảnh lưu dạng markdown: ![img](data:...)
❌ Không thấy ảnh trực tiếp
❌ Phải click preview để xem
❌ Không WYSIWYG
```

### Bây Giờ (ContentEditable)

```
✅ Ảnh hiển thị trực tiếp như MS Word
✅ WYSIWYG - Thấy ngay khi paste
✅ Không cần toggle preview
✅ Rich text editor experience
```

## 🎓 Tips & Tricks

### 💡 Quick Image Insert

1. Take screenshot với snipping tool
2. Paste ngay vào Notix
3. Continue typing
4. Auto-save handles the rest

### 💡 Multiple Images

1. Paste first image
2. Press Enter to add space
3. Type description
4. Paste next image
5. Repeat as needed

### 💡 Image Positioning

-   Paste at cursor → Image appears there
-   Press Enter before → Space above image
-   Press Enter after → Space below image
-   Type around images normally

### 💡 Editing After Paste

-   Click before/after image to position cursor
-   Delete image: Select → Press Delete
-   Move image: Cut → Paste at new location
-   Copy image: Right-click → Copy (browser feature)

## 📊 Technical Specs

### Image Processing

```javascript
1. Detect image in clipboard
2. Read as File object
3. Convert to base64 data URL
4. Create <img> element
5. Insert at cursor position
6. Add line breaks for spacing
7. Trigger auto-save
```

### ContentEditable Events

-   `input`: Fired on any content change
-   `paste`: Handles image paste
-   `keydown`: Manages keyboard input
-   `click`: Updates cursor position

### Storage Format

```html
<!-- Stored as HTML -->
<div>
    Regular text content
    <br />
    <img src="data:image/png;base64,iVBORw..." alt="Pasted Image" />
    <br />
    More text after image
</div>
```

## 🚀 Future Enhancements

Potential improvements:

1. **Image Resize**: Drag corners to resize
2. **Image Caption**: Add text below images
3. **Image Gallery**: View all images in note
4. **Image Compression**: Auto-compress on paste
5. **Drag & Drop**: Drag images into editor
6. **Image Alignment**: Left, center, right options
7. **Image Effects**: Filters, borders, etc.
8. **External Hosting**: Upload to cloud storage

## ✅ Migration từ Old Version

Nếu bạn có notes cũ với markdown images:

1. **Automatic**: ContentEditable vẫn hiển thị được HTML
2. **Images**: Base64 images vẫn work
3. **Text**: Plain text vẫn được giữ nguyên
4. **Compatibility**: Không cần migration manual

## 🎉 Ready to Use!

Feature sẵn sàng! Đơn giản:

1. **Reload extension**
2. **Open Notix**
3. **Paste an image**
4. **See it appear instantly!** ✨

---

**Enjoy WYSIWYG editing with Notix! 📝🖼️**

_Like MS Word, but better - in your browser!_

# Markdown Preview Feature

## Overview

Notix now supports automatic markdown rendering with a live preview mode. You can write notes using markdown syntax and toggle between edit and preview modes to see the formatted output.

## Features

### ✨ Supported Markdown Syntax

#### Headers

```markdown
# H1 Header

## H2 Header

### H3 Header

#### H4 Header

##### H5 Header

###### H6 Header
```

#### Text Formatting

```markdown
**Bold text** or **Bold text**
_Italic text_ or _Italic text_
~~Strikethrough~~
```

#### Links

```markdown
[Link text](https://example.com)
```

#### Images

```markdown
![Alt text](image-url)
![Pasted Image](data:image/png;base64,...)
```

#### Lists

```markdown
-   Unordered item 1
-   Unordered item 2

*   Also works with asterisk

-   Or plus sign

1. Ordered item 1
2. Ordered item 2
3. Ordered item 3
```

#### Code

```markdown
Inline `code` with backticks
```

Code block
with multiple lines

```

```

#### Blockquotes

```markdown
> This is a blockquote
> It can span multiple lines
```

#### Horizontal Rules

```markdown
---

or

---
```

## How to Use

### Toggle Preview Mode

1. **Write your note** using markdown syntax
2. **Click the "Preview" button** at the bottom-right of the note panel
3. **View the rendered markdown** with formatted text, images, and styles
4. **Click "Preview" again** to return to edit mode

### Keyboard Shortcuts

-   While in edit mode: Type markdown syntax normally
-   Toggle preview: Click the preview button (no keyboard shortcut yet)

### Auto-Update

The preview updates automatically as you type when in preview mode:

-   Switch to preview mode
-   Make edits (will auto-switch to edit mode)
-   Preview updates automatically when you type

## Examples

### Example 1: Meeting Notes

```markdown
# Team Meeting - Oct 28, 2025

## Attendees

-   John Doe
-   Jane Smith
-   Bob Johnson

## Agenda

1. Project updates
2. Budget review
3. Next steps

## Key Points

**Important**: Deadline moved to next Friday

> Remember to follow up with the client by EOD

[Project Documentation](https://docs.example.com)
```

### Example 2: Code Notes

```markdown
# JavaScript Tips

## Arrow Functions
```

const sum = (a, b) => a + b

````

**Note**: Arrow functions don't have their own `this`

### Example 3: Image Notes
```markdown
# Design Mockups

## Homepage Design
![Homepage](data:image/png;base64,...)

**Feedback**:
- Love the color scheme
- Consider larger buttons
- Add more whitespace
````

## Technical Details

### Markdown Parser

-   Location: `modules/scripts/markdown.js`
-   Converts markdown syntax to HTML
-   Supports XSS protection through HTML escaping
-   Handles code blocks separately to avoid nested parsing

### Preview Container

-   ID: `#markdown_preview`
-   Dynamically rendered HTML content
-   Styled with custom CSS for consistent look
-   Supports responsive images and layouts

### Toggle Button

-   Located at bottom-right of note panel
-   Blue when in edit mode
-   Green when in preview mode
-   Includes icon and "Preview" label

## Styling

The markdown preview includes custom styling for:

-   **Headers**: Different colors and sizes (H1-H6)
-   **Code blocks**: Dark theme with syntax highlighting-friendly colors
-   **Inline code**: Light gray background with red text
-   **Blockquotes**: Blue left border with light background
-   **Links**: Blue color with hover effects
-   **Images**: Responsive sizing with shadow effects
-   **Lists**: Proper indentation and bullet styling
-   **Horizontal rules**: Subtle gray divider

## Integration with Existing Features

### Auto-Save

-   Works seamlessly with auto-save
-   Preview updates trigger auto-save
-   Markdown content saved as plain text

### Image Paste (Ctrl+V)

-   Pasted images rendered in preview mode
-   Base64 images display properly
-   Supports all image formats

### Export Features

-   Export as text: Saves markdown syntax
-   Export as image: Captures preview render
-   Copy text: Copies markdown source

## Performance Considerations

### Optimization

-   Preview only updates when in preview mode
-   Debounced updates prevent excessive rendering
-   Efficient regex-based parsing
-   Minimal DOM manipulation

### Best Practices

-   Use preview mode for reading/reviewing
-   Edit mode for writing/editing
-   Toggle as needed to verify formatting
-   Large documents may take slightly longer to render

## Browser Compatibility

✅ Chrome/Chromium (tested)
✅ Edge (Chromium-based)
✅ Other browsers supporting Chrome Extension APIs

## Troubleshooting

### Preview not updating

-   Ensure you're in preview mode
-   Try toggling preview off and on
-   Check browser console for errors

### Markdown not rendering

-   Verify markdown syntax is correct
-   Some complex nested structures may not render perfectly
-   Try simpler markdown patterns

### Images not showing

-   Check if image URL is valid
-   For base64 images, ensure complete data URL
-   Verify image format is supported

### Toggle button not visible

-   Scroll to bottom-right of note panel
-   Ensure note panel is open
-   Check if button is behind other elements

## Future Enhancements

Potential improvements:

1. **Keyboard shortcut** for toggle (e.g., Ctrl+P)
2. **Split view** - Edit and preview side-by-side
3. **Syntax highlighting** for code blocks
4. **Table support** for markdown tables
5. **Task lists** with checkboxes
6. **Emoji support** :smile:
7. **Export as HTML** with styles
8. **Custom themes** for preview
9. **Markdown toolbar** for quick formatting

## Limitations

-   Preview is read-only (must toggle to edit)
-   No collaborative editing features
-   Limited syntax highlighting in code blocks
-   Some advanced markdown features not supported
-   Nested lists may need proper indentation

## Security

### XSS Protection

-   All user input is escaped before rendering
-   HTML entities converted to safe characters
-   Code blocks processed separately
-   No JavaScript execution in preview

### Safe Practices

-   Don't paste untrusted HTML
-   Be cautious with external images
-   Review links before clicking
-   Keep extension updated

## Tips & Tricks

### 💡 Quick Formatting

1. Write headers with `#` symbols
2. Use `**text**` for quick bold
3. Triple backticks for code blocks
4. `-` or `*` for quick lists

### 💡 Efficient Workflow

1. Write in edit mode
2. Quick preview to verify
3. Continue editing
4. Final preview before saving

### 💡 Organized Notes

-   Use headers for structure
-   Blockquotes for important info
-   Lists for action items
-   Code blocks for snippets

### 💡 Image Management

-   Paste images directly with Ctrl+V
-   Preview to see rendered images
-   Toggle back to see markdown syntax
-   Export to share formatted notes

## Examples in Action

### Shopping List

```markdown
# Shopping List 🛒

## Groceries

-   [ ] Milk
-   [ ] Eggs
-   [x] Bread

## Household

1. Paper towels
2. Dish soap
3. Laundry detergent

**Total Budget**: $50
```

### Project Todo

```markdown
# Project Tasks

## High Priority 🔴

-   **Fix login bug** - Due today
-   **Deploy to production** - Due Friday

## Medium Priority 🟡

-   Refactor user module
-   Update documentation

## Low Priority 🟢

-   Add dark mode
-   Improve animations

> Remember to update changelog!
```

### Code Snippet

````markdown
# React Component

```jsx
function Button({ onClick, children }) {
    return (
        <button onClick={onClick} className="btn">
            {children}
        </button>
    )
}
```
````

**Usage**:

```jsx
<Button onClick={handleClick}>Click me</Button>
```

```

## Support

For issues or questions:
1. Check this documentation
2. Review examples above
3. Test with simple markdown first
4. Check browser console for errors

## Version History

- **v1.0** - Initial markdown preview feature
  - Basic markdown syntax support
  - Toggle button for preview mode
  - Auto-update on edit
  - Custom styling

---

**Enjoy formatting your notes with markdown! 📝✨**
```

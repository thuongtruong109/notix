/**
 * Simple Markdown Parser for Notix
 * Converts markdown syntax to HTML
 */

export const parseMarkdown = (markdown) => {
    if (!markdown) return ''

    let html = markdown

    // Escape HTML to prevent XSS
    const escapeHtml = (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
        }
        return text.replace(/[&<>"']/g, (m) => map[m])
    }

    // Process code blocks first (to avoid processing markdown inside them)
    const codeBlocks = []
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
        const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`
        codeBlocks.push(`<pre><code>${escapeHtml(code.trim())}</code></pre>`)
        return placeholder
    })

    // Process inline code
    const inlineCodes = []
    html = html.replace(/`([^`]+)`/g, (match, code) => {
        const placeholder = `___INLINE_CODE_${inlineCodes.length}___`
        inlineCodes.push(`<code>${escapeHtml(code)}</code>`)
        return placeholder
    })

    // Process images (including base64)
    html = html.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" />'
    )

    // Process links
    html = html.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank">$1</a>'
    )

    // Headers (h1-h6)
    html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
    html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
    html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')

    // Bold (** or __)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>')

    // Italic (* or _)
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>')

    // Strikethrough
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>')

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr />')
    html = html.replace(/^\*\*\*$/gm, '<hr />')

    // Process lists line by line to properly group consecutive items
    const lines = html.split('\n')
    const processedLines = []
    let inUnorderedList = false
    let inOrderedList = false

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const isUnorderedItem = /^\s*[-*+]\s+(.+)$/.test(line)
        const isOrderedItem = /^\s*\d+\.\s+(.+)$/.test(line)

        if (isUnorderedItem) {
            // Start unordered list if not already in one
            if (!inUnorderedList) {
                processedLines.push('<ul>')
                inUnorderedList = true
            }
            // Close ordered list if we were in one
            if (inOrderedList) {
                processedLines.push('</ol>')
                inOrderedList = false
            }
            // Add list item
            const content = line.replace(/^\s*[-*+]\s+(.+)$/, '$1')
            processedLines.push(`<li>${content}</li>`)
        } else if (isOrderedItem) {
            // Start ordered list if not already in one
            if (!inOrderedList) {
                processedLines.push('<ol>')
                inOrderedList = true
            }
            // Close unordered list if we were in one
            if (inUnorderedList) {
                processedLines.push('</ul>')
                inUnorderedList = false
            }
            // Add list item
            const content = line.replace(/^\s*\d+\.\s+(.+)$/, '$1')
            processedLines.push(`<li>${content}</li>`)
        } else {
            // Not a list item - close any open lists
            if (inUnorderedList) {
                processedLines.push('</ul>')
                inUnorderedList = false
            }
            if (inOrderedList) {
                processedLines.push('</ol>')
                inOrderedList = false
            }
            // Keep the line as-is (will be processed for line breaks later)
            processedLines.push(line)
        }
    }

    // Close any remaining open lists
    if (inUnorderedList) {
        processedLines.push('</ul>')
    }
    if (inOrderedList) {
        processedLines.push('</ol>')
    }

    // Join with special marker to preserve structure
    html = processedLines.join('___NEWLINE___')

    // Blockquotes
    html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')

    // Replace the special marker with actual newlines, but avoid breaking list structure
    // First protect list tags from getting line breaks
    html = html.replace(/<ul>___NEWLINE___/g, '<ul>')
    html = html.replace(/___NEWLINE___<\/ul>/g, '</ul>')
    html = html.replace(/<ol>___NEWLINE___/g, '<ol>')
    html = html.replace(/___NEWLINE___<\/ol>/g, '</ol>')
    html = html.replace(/<li>([^<]*)<\/li>___NEWLINE___/g, '<li>$1</li>')
    html = html.replace(/<\/ul>___NEWLINE___/g, '</ul>\n\n')
    html = html.replace(/<\/ol>___NEWLINE___/g, '</ol>\n\n')

    // Now convert remaining markers to newlines
    html = html.replace(/___NEWLINE___/g, '\n')

    // Line breaks (double newline = paragraph break, single newline = line break)
    html = html.replace(/\n\n+/g, '</p><p>')
    html = html.replace(/\n/g, '<br />')

    // Wrap in paragraphs
    html = `<p>${html}</p>`

    // Fix multiple paragraph tags
    html = html.replace(/<p><\/p>/g, '')
    html = html.replace(/<p>(<h[1-6]>)/g, '$1')
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1')
    html = html.replace(/<p>(<ul>)/g, '$1')
    html = html.replace(/(<\/ul>)<\/p>/g, '$1')
    html = html.replace(/<p>(<ol>)/g, '$1')
    html = html.replace(/(<\/ol>)<\/p>/g, '$1')
    html = html.replace(/<p>(<blockquote>)/g, '$1')
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1')
    html = html.replace(/<p>(<hr \/>)/g, '$1')
    html = html.replace(/(<hr \/>)<\/p>/g, '$1')
    html = html.replace(/<p>(<pre>)/g, '$1')
    html = html.replace(/(<\/pre>)<\/p>/g, '$1')

    // Restore code blocks
    codeBlocks.forEach((block, index) => {
        html = html.replace(`___CODE_BLOCK_${index}___`, block)
    })

    // Restore inline codes
    inlineCodes.forEach((code, index) => {
        html = html.replace(`___INLINE_CODE_${index}___`, code)
    })

    return html
}

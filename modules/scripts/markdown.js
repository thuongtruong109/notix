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

    // Unordered lists
    html = html.replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

    // Ordered lists
    html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>')

    // Blockquotes
    html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>')
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

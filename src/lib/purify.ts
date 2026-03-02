/**
 * src/lib/purify.ts
 *
 * Secure server-side HTML/DOM sanitization utility.
 * Recommended by DOMPurify for Node environments to prevent XSS.
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes an incoming raw HTML string into safe HTML structurally.
 * It removes <script>, javascript: protocol, iframes (except trusted sources)
 * and malicious payloads.
 *
 * @param dirtyHtml - Raw HTML string (e.g., from n8n integration or CMS text editor)
 * @returns Clean, safe HTML string
 */
export const sanitizeHtml = (dirtyHtml: string): string => {
    if (!dirtyHtml) return '';
    return DOMPurify.sanitize(dirtyHtml, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b',
            'i', 'strong', 'em', 'strike', 'code', 'hr', 'br',
            'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre',
            'span', 'img', 'figure', 'figcaption'
        ],
        ALLOWED_ATTR: [
            'href', 'name', 'target', 'src', 'alt', 'class', 'id', 'title', 'rel'
        ],
        // Required for <a target="_blank"> payload safety
        ADD_ATTR: ['target']
    });
};
